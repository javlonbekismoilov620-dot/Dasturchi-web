/* Dasturchi — Supabase rejimidagi autentifikatsiya, ADMIN_EMAILS va Storage xavfsizlik testi.
 *
 *   ADMIN_EMAILS=admin@dasturchi.test,admin2@dasturchi.test,owner-unverified@dasturchi.test \
 *   BASE_URL=http://localhost:3000 npm run test:security
 *
 * Talablar: Supabase rejimida ishlab turgan server (yuqoridagi ADMIN_EMAILS bilan),
 * NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY va SUPABASE_SECRET_KEY
 * (yoki SUPABASE_SERVICE_ROLE_KEY) va `playwright`.
 * Faqat @dasturchi.test test hisoblari yaratiladi va oxirida o'chiriladi (haqiqiy xat yuborilmaydi).
 *
 * SKIP_SESSION_TESTS=1 — foydalanuvchi sessiyasini (JWT) talab qiladigan qadamlar o'tkazib yuboriladi
 * va "o'tkazib yuborildi" deb hisobotda alohida ko'rsatiladi. Bu faqat secret kalit tarmoq proksisi
 * orqali HAR BIR so'rovga qo'shiladigan muhitlar uchun (u yerda Supabase foydalanuvchi tokenini
 * service-role bilan almashtiradi). Oddiy deploy'da bu bayroqsiz ishga tushiring. */
import { createRequire } from "node:module";
import { supabaseAdminFromEnv } from "./lib/supabase-admin.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const SKIP_SESSIONS = process.env.SKIP_SESSION_TESTS === "1";
const sb = supabaseAdminFromEnv();
if (!sb) {
  console.error("NEXT_PUBLIC_SUPABASE_URL va SUPABASE_SECRET_KEY (yoki SUPABASE_SERVICE_ROLE_KEY) kerak.");
  process.exit(1);
}

const ADMIN = "admin@dasturchi.test"; // ADMIN_EMAILS da, pochtasini tasdiqlaydi
const ADMIN2 = "admin2@dasturchi.test"; // ADMIN_EMAILS da (panel orqali pasaytirib bo'lmasligi tekshiriladi)
const ATTACK = "owner-unverified@dasturchi.test"; // ADMIN_EMAILS da, lekin pochta tasdiqlanmagan (begona odam)
const STUDENT = "sec-student@dasturchi.test";
const PW = "Xavfsiz12345";
const PW2 = "YangiParol678";
const ALL = [ADMIN, ADMIN2, ATTACK, STUDENT];

const results = [];
async function step(name, fn, { session = false } = {}) {
  if (session && SKIP_SESSIONS) {
    results.push({ name, ok: null });
    console.log("  –", name, "(o'tkazib yuborildi: sessiya testlari o'chirilgan)");
    return;
  }
  try {
    await fn();
    results.push({ name, ok: true });
    console.log("  ✓", name);
  } catch (e) {
    results.push({ name, ok: false });
    console.log("  ✗", name, "—", String(e.message).split("\n")[0]);
  }
}
const expect = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

async function login(page, email, password, next) {
  await page.goto(`${BASE}/kirish${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click('button[type="submit"]');
}
/** Kirishdan keyin server qayta yo'naltirgan manzil (sahifa render bo'lishini kutmasdan) */
async function loginLanding(page, email, password, next) {
  const landed = page.waitForResponse((r) => r.request().method() === "POST" && r.url().startsWith(BASE), { timeout: 20000 });
  await login(page, email, password, next);
  await landed;
  await page.waitForLoadState("domcontentloaded");
}
/** Sessiya haqiqatan ishlayotganini sahifa mazmunidan tekshiradi (URL yetarli emas: redirect oqim ichida keladi) */
async function expectDashboard(page) {
  await page.goto(`${BASE}/kabinet`);
  await page.getByText("Yakunlangan darslar").waitFor({ timeout: 15000 });
}

console.log(`\nSupabase xavfsizlik testi → ${BASE} (${sb.url})${SKIP_SESSIONS ? " · sessiya testlari o'chirilgan" : ""}\n`);
for (const e of ALL) await sb.deleteIfExists(e); // oldingi ishga tushirishdan qolganlar

const browser = await chromium.launch();
const newCtx = async () => {
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => {
    try {
      sessionStorage.setItem("dch-intro", "1");
    } catch {}
  });
  return ctx;
};

console.log("ADMIN_EMAILS: pochtaga egalik isbotlanmaguncha admin yo'q");
await step("Begona odam admin pochtasi bilan ro'yxatdan o'tadi (tasdiqlanmagan) → profil 'student'", async () => {
  await sb.generateSignupLink(ATTACK, PW, "Begona");
  const p = await sb.profileByEmail(ATTACK);
  expect(p, "trigger profil yaratmadi");
  expect(p.role === "student", `rol: ${p.role}`);
});
await step("Tasdiqlanmagan hisob bilan kirib bo'lmaydi", async () => {
  const ctx = await newCtx();
  const page = await ctx.newPage();
  await login(page, ATTACK, PW);
  await page.getByText("Elektron pochta hali tasdiqlanmagan").waitFor({ timeout: 15000 });
  expect(page.url().includes("/kirish"), `URL: ${page.url()}`);
  await ctx.close();
});
await step("Kirish urinishidan keyin ham bazada rol 'student'", async () => {
  expect((await sb.profileByEmail(ATTACK)).role === "student", "rol o'zgardi");
});

console.log("\nEmail tasdiqlash (/auth/confirm, token_hash)");
let adminTokenHash;
await step("Egasi tasdiqlash havolasini bosadi → pochta tasdiqlanadi, ichki sahifaga qaytadi", async () => {
  const link = await sb.generateSignupLink(ADMIN, PW, "Bosh admin");
  adminTokenHash = link.hashed_token ?? link.properties?.hashed_token;
  expect(adminTokenHash, "hashed_token yo'q");
  expect((await sb.profileByEmail(ADMIN)).role === "student", "tasdiqlashdan oldin admin bo'lib qoldi");
  const ctx = await newCtx();
  const page = await ctx.newPage();
  const res = page.waitForResponse((r) => r.url().includes("/auth/confirm"), { timeout: 20000 });
  await page.goto(`${BASE}/auth/confirm?token_hash=${encodeURIComponent(adminTokenHash)}&type=signup&next=/kabinet`).catch(() => {});
  const r = await res;
  expect(r.status() === 307 && (r.headers().location || "").endsWith("/kabinet"), `javob: ${r.status()} → ${r.headers().location}`);
  const u = await sb.findUser(ADMIN);
  expect(u?.email_confirmed_at, "pochta tasdiqlanmadi");
  await ctx.close();
});
await step("Tasdiqlash havolasi bir martalik", async () => {
  const ctx = await newCtx();
  const page = await ctx.newPage();
  await page.goto(`${BASE}/auth/confirm?token_hash=${encodeURIComponent(adminTokenHash)}&type=signup&next=/kabinet`);
  expect(page.url().includes("/kirish?xato=callback"), `URL: ${page.url()}`);
  await ctx.close();
});
await step("Soxta token rad etiladi", async () => {
  const ctx = await newCtx();
  const page = await ctx.newPage();
  await page.goto(`${BASE}/auth/confirm?token_hash=${"a".repeat(56)}&type=signup&next=/admin`);
  expect(page.url().includes("/kirish?xato=callback"), `URL: ${page.url()}`);
  await ctx.close();
});

console.log("\nADMIN_EMAILS: tasdiqlangan egasi kirganda admin bo'ladi");
await step("Tasdiqlangan ADMIN_EMAILS egasi kiradi → bazada 'admin'", async () => {
  const ctx = await newCtx();
  const page = await ctx.newPage();
  await loginLanding(page, ADMIN, PW);
  expect((await sb.profileByEmail(ADMIN)).role === "admin", `rol: ${(await sb.profileByEmail(ADMIN)).role}`);
  await ctx.close();
});
await step("Ikkinchi ADMIN_EMAILS (admin API orqali tasdiqlangan) → 'admin'", async () => {
  await sb.createConfirmedUser(ADMIN2, PW, "Ikkinchi admin");
  const ctx = await newCtx();
  const page = await ctx.newPage();
  await loginLanding(page, ADMIN2, PW);
  expect((await sb.profileByEmail(ADMIN2)).role === "admin", "admin bo'lmadi");
  await ctx.close();
});
await step("Oddiy tasdiqlangan foydalanuvchi kiradi → 'student' bo'lib qoladi", async () => {
  await sb.createConfirmedUser(STUDENT, PW, "Xavfsizlik Talaba");
  const ctx = await newCtx();
  const page = await ctx.newPage();
  await loginLanding(page, STUDENT, PW);
  expect((await sb.profileByEmail(STUDENT)).role === "student", "rol o'zgardi");
  await ctx.close();
});

console.log("\nOchiq redirect himoyasi");
await step("Kirishdan keyin next=//evil, /\\evil, /%09/evil, https://evil → ichki sahifa", async () => {
  for (const evil of ["//evil.example", "/\\evil.example", "/\t/evil.example", "https://evil.example"]) {
    const ctx = await newCtx();
    const page = await ctx.newPage();
    const posted = page.waitForResponse((r) => r.request().method() === "POST", { timeout: 20000 });
    await login(page, STUDENT, PW, evil);
    const r = await posted;
    const loc = r.headers()["x-action-redirect"] || r.headers().location || "";
    expect(loc && !/evil/.test(loc) && loc.startsWith("/"), `redirect: ${loc || "(yo'q)"} for ${JSON.stringify(evil)}`);
    await ctx.close();
  }
});
await step("/auth/callback va /auth/confirm: next=https://evil → ichki sahifa", async () => {
  const ctx = await newCtx();
  const page = await ctx.newPage();
  for (const path of ["/auth/callback?next=", `/auth/confirm?type=signup&token_hash=${"b".repeat(56)}&next=`]) {
    await page.goto(`${BASE}${path}${encodeURIComponent("https://evil.example")}`);
    expect(new URL(page.url()).origin === new URL(BASE).origin, `URL: ${page.url()}`);
  }
  await ctx.close();
});

console.log("\nStorage (media bucket, server tomonidagi service kalit bilan — ilova bilan bir xil yo'l)");
const { createClient } = await import("@supabase/supabase-js");
const { supabaseFetch } = await import("../src/lib/supabase-shared.ts").catch(() => ({ supabaseFetch: null }));
const svcKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const svc = createClient(sb.url, svcKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  ...(supabaseFetch ? { global: { fetch: supabaseFetch(svcKey) } } : {}),
});
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
const objName = `sec-test-${Date.now()}.png`;
let publicUrl = "";
await step("Ruxsat etilgan turdagi fayl yuklanadi (upsert: false)", async () => {
  const { error } = await svc.storage.from("media").upload(objName, PNG, { contentType: "image/png", upsert: false });
  expect(!error, error?.message);
  publicUrl = svc.storage.from("media").getPublicUrl(objName).data.publicUrl;
});
await step("Mavjud faylni ustidan yozib bo'lmaydi (upsert: false)", async () => {
  const { error } = await svc.storage.from("media").upload(objName, PNG, { contentType: "image/png", upsert: false });
  expect(error, "ustidan yozildi");
});
await step("Ommaviy URL ishlaydi (200, image/png)", async () => {
  const r = await fetch(publicUrl);
  expect(r.status === 200, `status ${r.status}`);
  expect((r.headers.get("content-type") || "").startsWith("image/png"), `type ${r.headers.get("content-type")}`);
});
await step("Ruxsat etilmagan tur (text/html) bucket tomonidan rad etiladi", async () => {
  const { error } = await svc.storage.from("media").upload(`sec-test-${Date.now()}.html`, Buffer.from("<script>alert(1)</script>"), { contentType: "text/html" });
  expect(error, "HTML fayl qabul qilindi");
});
await step("Bucket chegaralari: public, 50 MB, MIME ro'yxati", async () => {
  const { data, error } = await svc.storage.getBucket("media");
  expect(!error, error?.message);
  expect(data.public === true && data.file_size_limit === 52428800 && (data.allowed_mime_types || []).includes("image/png") && !(data.allowed_mime_types || []).includes("text/html"), JSON.stringify({ p: data.public, l: data.file_size_limit }));
});
await step("Fayl o'chiriladi (API orqali endi topilmaydi)", async () => {
  const { error } = await svc.storage.from("media").remove([objName]);
  expect(!error, error?.message);
  const dl = await svc.storage.from("media").download(objName);
  expect(dl.error, "fayl hali mavjud");
  // Ommaviy URL CDN keshidan max-age (3600 s) davomida berilishi mumkin — Free tarifda kesh tozalash yo'q
  const r = await fetch(publicUrl);
  console.log(`      i ommaviy URL o'chirilgandan keyin: ${r.status} (cf-cache-status: ${r.headers.get("cf-cache-status")}) — CDN keshi, 1 soatgacha`);
});

console.log("\nSertifikatni ommaviy tekshirish (server, service kalit)");
await step("Kod bo'yicha tekshiruv sahifasi egasining ismini ko'rsatadi; bekor qilingani 'haqiqiy emas'", async () => {
  const student = await sb.profileByEmail(STUDENT);
  const code = `SEC-${Date.now().toString(36).toUpperCase()}`;
  const { error } = await svc.from("certificates").insert({ code, user_id: student.id, course_id: "web-asoslari", user_name: "Xavfsizlik Talaba", course_title: "Test kursi" });
  expect(!error, error?.message);
  const ctx = await newCtx();
  const page = await ctx.newPage();
  await page.goto(`${BASE}/sertifikat/${code}`);
  await page.getByText("Sertifikat haqiqiy").waitFor({ timeout: 15000 });
  await page.getByText("Xavfsizlik Talaba").first().waitFor({ timeout: 5000 });
  await svc.from("certificates").update({ revoked: true }).eq("code", code);
  await page.reload();
  expect(!(await page.getByText("Sertifikat haqiqiy").count()), "bekor qilingan sertifikat haqiqiy ko'rsatildi");
  await ctx.close();
});

console.log("\nSessiya talab qiladigan oqimlar");
const adminCtx = await newCtx();
const ap = await adminCtx.newPage();
ap.on("dialog", (d) => d.accept());
await step("Admin panelga kiradi", async () => {
  await loginLanding(ap, ADMIN, PW);
  await ap.goto(`${BASE}/admin`);
  await ap.getByRole("heading", { name: "Umumiy ko‘rinish" }).waitFor({ timeout: 15000 });
}, { session: true });
await step("Talaba admin panelga kira olmaydi", async () => {
  const ctx = await newCtx();
  const page = await ctx.newPage();
  await loginLanding(page, STUDENT, PW);
  await expectDashboard(page);
  await page.goto(`${BASE}/admin`);
  expect(page.url().includes("/kabinet?xato=admin"), `URL: ${page.url()}`);
  await ctx.close();
}, { session: true });
await step("ADMIN_EMAILS adminini panel orqali pasaytirib bo'lmaydi", async () => {
  const id = (await sb.profileByEmail(ADMIN2)).id;
  await ap.goto(`${BASE}/admin/talabalar/${id}`);
  await ap.getByLabel("Foydalanuvchi roli").selectOption("student");
  await ap.getByText("ADMIN_EMAILS orqali admin").waitFor({ timeout: 15000 });
  expect((await sb.profileByEmail(ADMIN2)).role === "admin", "rol pasaytirildi");
}, { session: true });
await step("Oddiy foydalanuvchini admin qilish va qaytarish", async () => {
  const id = (await sb.profileByEmail(STUDENT)).id;
  await ap.goto(`${BASE}/admin/talabalar/${id}`);
  await ap.getByLabel("Foydalanuvchi roli").selectOption("admin");
  await ap.getByText("Rol yangilandi").first().waitFor({ timeout: 15000 });
  expect((await sb.profileByEmail(STUDENT)).role === "admin", "admin bo'lmadi");
  await ap.reload();
  await ap.getByLabel("Foydalanuvchi roli").selectOption("student");
  await ap.getByText("Rol yangilandi").first().waitFor({ timeout: 15000 });
  expect((await sb.profileByEmail(STUDENT)).role === "student", "student bo'lmadi");
}, { session: true });
await step("Admin UI orqali media yuklash va o'chirish", async () => {
  const name = `sec-ui-${Date.now()}.png`;
  await ap.goto(`${BASE}/admin/media`);
  await ap.setInputFiles('input[type="file"]', { name, mimeType: "image/png", buffer: PNG });
  await ap.getByText("Fayl yuklandi").first().waitFor({ timeout: 20000 });
  await ap.reload();
  const row = ap.locator("li", { hasText: name });
  const url = (await row.locator("span.font-mono").innerText()).split(" · ")[0].trim();
  expect((await fetch(url)).status === 200, "URL ishlamadi");
  await row.getByRole("button", { name: "O‘chirish" }).click();
  await ap.getByText("Fayl o‘chirildi").first().waitFor({ timeout: 15000 });
  expect((await fetch(url)).status >= 400, "fayl o'chmadi");
}, { session: true });
await step("Parol: noto'g'ri joriy parol rad etiladi, to'g'risi bilan almashadi, boshqa sessiya yopiladi", async () => {
  const c1 = await newCtx();
  const p1 = await c1.newPage();
  const c2 = await newCtx();
  const p2 = await c2.newPage();
  await loginLanding(p1, STUDENT, PW);
  await loginLanding(p2, STUDENT, PW);
  await expectDashboard(p2);
  await p1.goto(`${BASE}/kabinet/profil`);
  await p1.fill("#current", "notogri-parol-1");
  await p1.fill("#next", PW2);
  await p1.fill("#confirm", PW2);
  await p1.getByRole("button", { name: "Parolni yangilash" }).click();
  await p1.getByText("Joriy parol noto‘g‘ri.").waitFor({ timeout: 15000 });
  await p1.fill("#current", PW);
  await p1.fill("#next", PW2);
  await p1.fill("#confirm", PW2);
  await p1.getByRole("button", { name: "Parolni yangilash" }).click();
  await p1.getByText("Parol yangilandi").waitFor({ timeout: 15000 });
  await expectDashboard(p1);
  await p2.goto(`${BASE}/kabinet`);
  await p2.waitForURL(/\/kirish/, { timeout: 15000 });
  await c1.close();
  await c2.close();
}, { session: true });
await adminCtx.close();
await browser.close();

console.log("\nTozalash");
for (const e of ALL) {
  const removed = await sb.deleteIfExists(e).catch((err) => (console.log("  !", e, err.message), false));
  console.log(`  ${removed ? "✓ o'chirildi" : "· yo'q"} ${e}`);
}

const failed = results.filter((r) => r.ok === false);
const skipped = results.filter((r) => r.ok === null);
const passed = results.filter((r) => r.ok === true);
console.log(`\n${passed.length}/${results.length - skipped.length} qadam muvaffaqiyatli${skipped.length ? `, ${skipped.length} ta o'tkazib yuborildi (tekshirilmadi)` : ""}`);
process.exit(failed.length ? 1 : 0);
