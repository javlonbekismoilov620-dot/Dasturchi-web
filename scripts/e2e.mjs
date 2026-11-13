/* Dasturchi — asosiy oqimlar uchun tutun (smoke) testi.
 *
 *   BASE_URL=http://localhost:3000 ADMIN_EMAIL=admin@misol.uz npm run test:e2e
 *
 * Talablar: ishlab turgan server va o'rnatilgan `playwright` paketi.
 * ADMIN_EMAIL berilsa (va u ADMIN_EMAILS ro'yxatida bo'lsa), admin oqimlari ham tekshiriladi.
 * ADMIN2_EMAIL (u ham ADMIN_EMAILS da) berilsa — ADMIN_EMAILS adminini panel orqali pasaytirib
 * bo'lmasligi tekshiriladi (lokal rejim: ro'yxatdan o'tganda admin bo'ladi).
 * E2E_SKIP_ACCOUNTS=1 — faqat ommaviy sahifalar (hisob yaratmasdan; masalan, Supabase rejimida
 * pochta tasdiqlash yoqilganda). Supabase'dagi hisob oqimlari: scripts/test-supabase-security.mjs */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("playwright topilmadi. O'rnating: npm i -D playwright && npx playwright install chromium");
  process.exit(1);
}

const BASE = process.env.BASE_URL || "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const ADMIN2_EMAIL = process.env.ADMIN2_EMAIL || "";
const SKIP_ACCOUNTS = process.env.E2E_SKIP_ACCOUNTS === "1";
const results = [];
const consoleErrors = [];

async function step(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log("  ✓", name);
  } catch (e) {
    results.push({ name, ok: false, error: e.message.split("\n")[0] });
    console.log("  ✗", name, "—", e.message.split("\n")[0]);
  }
}

async function register(page, name, email, password) {
  await page.goto(`${BASE}/royxatdan-otish`);
  await page.fill("#name", name);
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.check('input[name="terms"]');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(baholash|kabinet)/, { timeout: 20000 });
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
await ctx.addInitScript(() => {
  try {
    sessionStorage.setItem("dch-intro", "1");
  } catch {}
});
const page = await ctx.newPage();
page.on("dialog", (d) => d.accept());
page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error" && !/status of 404/.test(m.text())) consoleErrors.push(m.text().slice(0, 200));
});

console.log(`\nDasturchi e2e → ${BASE}\n`);

console.log("Ommaviy sahifalar");
for (const path of ["/", "/kurslar", "/kurslar?q=flexbox", "/yonalishlar", "/yonalishlar/3d", "/yollar", "/yollar/frontend-dasturchi", "/kurslar/web-asoslari", "/kurslar/web-asoslari/dars/veb-qanday-ishlaydi", "/qidiruv?q=python", "/baholash", "/sertifikat", "/sitemap.xml", "/robots.txt"]) {
  await step(`GET ${path}`, async () => {
    const r = await page.goto(BASE + path);
    if (!r || r.status() >= 400) throw new Error(`status ${r?.status()}`);
  });
}
await step("404 sahifa", async () => {
  const r = await page.goto(`${BASE}/mavjud-bolmagan-sahifa`);
  if (r?.status() !== 404) throw new Error(`status ${r?.status()}`);
});
await step("Yopiq dars kirishni so'raydi", async () => {
  await page.goto(`${BASE}/kurslar/web-asoslari/dars/semantik-html`);
  await page.getByText("Darsni ko‘rish uchun tizimga kiring").waitFor({ timeout: 8000 });
});
await step("Buyruqlar palitrasi (Ctrl+K)", async () => {
  await page.goto(BASE + "/");
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox").fill("blender");
  await page.getByRole("option").first().waitFor({ timeout: 8000 });
  await page.keyboard.press("Escape");
});

if (!SKIP_ACCOUNTS) {
console.log("\nTalaba oqimi");
const email = `talaba${Date.now()}@test.uz`;
await step("Ro'yxatdan o'tish", () => register(page, "E2E Talaba", email, "parol12345"));
await step("Kursni boshlash", async () => {
  await page.goto(`${BASE}/kurslar/web-asoslari`);
  await page.getByRole("button", { name: /Kursni boshlash|davom ettirish/ }).click();
  await page.waitForURL(/\/dars\//, { timeout: 15000 });
});
const lessons = ["veb-qanday-ishlaydi", "birinchi-html-sahifa", "matn-havola-rasm", "semantik-html", "html-formalar", "css-bilan-tanishuv", "box-model", "flexbox", "responsive-dizayn"];
await step("Barcha 9 darsni yakunlash", async () => {
  for (const slug of lessons) {
    await page.goto(`${BASE}/kurslar/web-asoslari/dars/${slug}`);
    await page.getByRole("button", { name: "Darsni yakunladim" }).click();
    await page.getByRole("button", { name: "Dars yakunlangan" }).waitFor({ timeout: 10000 });
  }
});
await step("Yakuniy imtihon va sertifikat", async () => {
  await page.goto(`${BASE}/kurslar/web-asoslari/test/quiz_web-asoslari_final`);
  const answers = [1, 1, 2, 0, 1, 0, 1, 1];
  for (let i = 0; i < answers.length; i++) {
    await page.locator("fieldset label").nth(answers[i]).click();
    if (i < answers.length - 1) await page.getByRole("button", { name: "Keyingi" }).click();
  }
  await page.getByRole("button", { name: "Natijani ko‘rish" }).click();
  await page.getByText("Test muvaffaqiyatli topshirildi!").waitFor({ timeout: 10000 });
  await page.getByRole("link", { name: "Sertifikatni ko‘rish" }).click();
  await page.getByText("Sertifikat haqiqiy").waitFor({ timeout: 10000 });
});
await step("Sertifikat kod orqali tekshiriladi", async () => {
  const code = page.url().split("/").pop();
  const anon = await browser.newContext();
  const p2 = await anon.newPage();
  await p2.goto(`${BASE}/sertifikat`);
  await p2.fill("#code", code);
  await p2.getByRole("button", { name: "Tekshirish" }).click();
  await p2.getByText("E2E Talaba").first().waitFor({ timeout: 10000 });
  await anon.close();
});
await step("Kabinet ko'rsatkichlari", async () => {
  await page.goto(`${BASE}/kabinet`);
  await page.getByText("Yakunlangan darslar").waitFor({ timeout: 10000 });
  await page.goto(`${BASE}/kabinet/sertifikatlar`);
  await page.getByText("Veb-sahifa yaratish: HTML va CSS").first().waitFor({ timeout: 8000 });
});
await step("Talaba admin panelga kira olmaydi", async () => {
  await page.goto(`${BASE}/admin`);
  if (page.url().includes("/admin")) throw new Error("admin ochildi");
});
await step("Parol: noto'g'ri joriy parol rad etiladi, to'g'risi bilan almashadi", async () => {
  await page.goto(`${BASE}/kabinet/profil`);
  await page.fill("#current", "notogri-parol-1");
  await page.fill("#next", "yangiParol789");
  await page.fill("#confirm", "yangiParol789");
  await page.getByRole("button", { name: "Parolni yangilash" }).click();
  await page.getByText("Joriy parol noto‘g‘ri.").waitFor({ timeout: 10000 });
  await page.fill("#current", "parol12345");
  await page.fill("#next", "yangiParol789");
  await page.fill("#confirm", "yangiParol789");
  await page.getByRole("button", { name: "Parolni yangilash" }).click();
  await page.getByText("Parol yangilandi").waitFor({ timeout: 10000 });
});
}

if (ADMIN_EMAIL && !SKIP_ACCOUNTS) {
  console.log("\nAdmin oqimi");
  const actx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const ap = await actx.newPage();
  ap.on("dialog", (d) => d.accept());
  await step("Admin sifatida kirish", async () => {
    await ap.goto(`${BASE}/kirish`);
    await ap.fill("#email", ADMIN_EMAIL);
    await ap.fill("#password", process.env.ADMIN_PASSWORD || "admin12345");
    await ap.click('button[type="submit"]');
    await ap.waitForURL(/\/kabinet/, { timeout: 15000 }).catch(async () => {
      await register(ap, "E2E Admin", ADMIN_EMAIL, process.env.ADMIN_PASSWORD || "admin12345");
    });
    await ap.goto(`${BASE}/admin`);
    await ap.getByRole("heading", { name: "Umumiy ko‘rinish" }).waitFor({ timeout: 10000 });
  });
  await step("Kurs yaratish, modul va dars qo'shish", async () => {
    await ap.goto(`${BASE}/admin/kurslar/yangi`);
    await ap.fill("#title", `E2E kurs ${Date.now()}`);
    await ap.getByRole("button", { name: "Kursni yaratish" }).click();
    await ap.waitForURL(/\/admin\/kurslar\/crs_/, { timeout: 15000 });
    await ap.goto(ap.url().split("?")[0] + "?tab=dastur");
    await ap.getByLabel("Yangi modul nomi").fill("Kirish");
    await ap.getByRole("button", { name: "Modul", exact: true }).click();
    await ap.getByLabel("Yangi dars nomi").waitFor({ timeout: 10000 });
    await ap.getByLabel("Yangi dars nomi").fill("Birinchi dars");
    await ap.getByRole("button", { name: "Dars", exact: true }).click();
    await ap.getByRole("link", { name: "Birinchi dars" }).waitFor({ timeout: 10000 });
  });
  await step("Kursni o'chirish", async () => {
    await ap.goto(ap.url().split("?")[0]);
    await ap.getByRole("button", { name: /Kursni o‘chirish/ }).click();
    await ap.waitForURL(/\/admin\/kurslar$/, { timeout: 15000 });
  });
  await step("Admin o'zini admin huquqidan mahrum qila olmaydi", async () => {
    await ap.goto(`${BASE}/admin/talabalar?q=${encodeURIComponent(ADMIN_EMAIL)}`);
    await ap.locator('a[href^="/admin/talabalar/"]').first().click();
    await ap.getByLabel("Foydalanuvchi roli").selectOption("student");
    await ap.getByText("O‘zingizni admin huquqidan mahrum qila olmaysiz").waitFor({ timeout: 10000 });
  });
  if (ADMIN2_EMAIL) {
    await step("ADMIN_EMAILS adminini panel orqali pasaytirib bo'lmaydi", async () => {
      const c2 = await browser.newContext();
      const p2 = await c2.newPage();
      await register(p2, "E2E Admin Ikki", ADMIN2_EMAIL, "admin12345").catch(async () => {
        await p2.goto(`${BASE}/kirish`);
        await p2.fill("#email", ADMIN2_EMAIL);
        await p2.fill("#password", "admin12345");
        await p2.click('button[type="submit"]');
        await p2.waitForURL(/\/kabinet/, { timeout: 15000 });
      });
      await c2.close();
      await ap.goto(`${BASE}/admin/talabalar?q=${encodeURIComponent(ADMIN2_EMAIL)}`);
      await ap.locator('a[href^="/admin/talabalar/"]').first().click();
      await ap.getByLabel("Foydalanuvchi roli").selectOption("student");
      await ap.getByText("ADMIN_EMAILS orqali admin").waitFor({ timeout: 10000 });
      await ap.reload();
      const v = await ap.getByLabel("Foydalanuvchi roli").inputValue();
      if (v !== "admin") throw new Error(`rol: ${v}`);
    });
  }
  await actx.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} qadam muvaffaqiyatli`);
if (consoleErrors.length) console.log("Konsol xatolari:", consoleErrors.slice(0, 10));
process.exit(failed.length ? 1 : 0);
