/* Kontentni (kurslar, modullar, darslar, testlar, yo'nalishlar, yo'llar) bazaga yozadi.
 *
 *   npm run seed              — faqat YO'Q yozuvlarni qo'shadi. Mavjud qatorlar (admin tahrirlari ham)
 *                               o'zgarmaydi va hech narsa o'chirilmaydi. Har doim xavfsiz.
 *   npm run seed -- --update  — seed'dagi id'li qatorlarni seed matni bilan QAYTA YOZADI (admin shu
 *                               qatorlarga kiritgan tahrirlar yo'qoladi). Hech narsa o'chirilmaydi.
 *   npm run seed -- --reset   — faqat lokal rejim: kontent jadvallarini to'liq seed bilan almashtiradi.
 *                               Supabase'da rad etiladi (ma'lumot o'chirilmasligi uchun).
 *
 * Supabase sozlangan bo'lsa (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY yoki
 * SUPABASE_SERVICE_ROLE_KEY) — Supabase'ga, aks holda lokal .data/db.json fayliga yoziladi.
 * Foydalanuvchi ma'lumotlariga (profil, progress, sertifikat) hech qachon tegilmaydi. */
import { promises as fs } from "node:fs";
import path from "node:path";
import { buildSeedRows } from "../src/lib/seed/build.ts";
import { secretSupabaseKey, supabaseFetch } from "../src/lib/supabase-shared.ts";
import { categories, courses, paths } from "../content/index.ts";

const reset = process.argv.includes("--reset");
const update = process.argv.includes("--update");
const rows = buildSeedRows(courses, categories, paths);
const TABLES = ["categories", "courses", "modules", "lessons", "quizzes", "paths"] as const;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = secretSupabaseKey();
const useSupabase = Boolean(url && serviceKey);

const toSnake = (k: string) => (k === "order" ? "sort_order" : k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`));
const toDb = (row: Record<string, unknown>) => Object.fromEntries(Object.entries(row).map(([k, v]) => [toSnake(k), v]));

async function seedSupabase() {
  if (reset) {
    throw new Error("--reset Supabase'da ishlatilmaydi: u mavjud ma'lumotlarni o'chiradi. Yo'q yozuvlarni qo'shish uchun flag'siz ishga tushiring.");
  }
  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(url!, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: supabaseFetch(serviceKey) },
  });
  for (const t of TABLES) {
    const list = (rows[t] as unknown as Record<string, unknown>[]).map(toDb);
    // Qaysi id'lar allaqachon bor — hisobot uchun (va insert-only rejimda ularga tegmaslik uchun)
    const existing = new Set<string>();
    for (let i = 0; i < list.length; i += 200) {
      const ids = list.slice(i, i + 200).map((r) => String(r.id));
      const { data, error } = await sb.from(t).select("id").in("id", ids);
      if (error) throw new Error(`${t}: ${error.message}`);
      for (const r of data ?? []) existing.add(String(r.id));
    }
    const target = update ? list : list.filter((r) => !existing.has(String(r.id)));
    let written = 0;
    const skipped: string[] = [];
    for (let i = 0; i < target.length; i += 200) {
      const batch = target.slice(i, i + 200);
      const q = update
        ? sb.from(t).upsert(batch, { onConflict: "id" })
        : sb.from(t).upsert(batch, { onConflict: "id", ignoreDuplicates: true });
      const { error } = await q;
      if (!error) {
        written += batch.length;
        continue;
      }
      // Masalan, admin xuddi shu slug bilan boshqa kurs yaratgan — qatorma-qator urinib, to'qnashuvlarni o'tkazib yuboramiz
      for (const row of batch) {
        const single = update
          ? await sb.from(t).upsert(row, { onConflict: "id" })
          : await sb.from(t).upsert(row, { onConflict: "id", ignoreDuplicates: true });
        if (single.error) skipped.push(`${row.id} (${single.error.message})`);
        else written++;
      }
    }
    const kept = update ? 0 : existing.size;
    console.log(`  ✓ ${t}: ${update ? "yangilandi" : "qo'shildi"} ${written}, mavjud (tegilmadi) ${kept}${skipped.length ? `, o'tkazib yuborildi ${skipped.length}` : ""}`);
    for (const s of skipped.slice(0, 5)) console.log(`      – ${s}`);
  }
}

async function seedLocal() {
  const dir = process.env.DATA_DIR || path.join(process.cwd(), ".data");
  const file = path.join(dir, "db.json");
  let db: { version: 1; seededAt: string; tables: Record<string, { id: string }[]> };
  try {
    db = JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    db = { version: 1, seededAt: "", tables: {} };
  }
  for (const t of TABLES) {
    const seedRows = rows[t] as unknown as { id: string }[];
    if (reset || !db.tables[t]) {
      db.tables[t] = seedRows;
      console.log(`  ✓ ${t}: ${seedRows.length}`);
    } else if (update) {
      const ids = new Set(seedRows.map((r) => r.id));
      db.tables[t] = [...db.tables[t].filter((r) => !ids.has(r.id)), ...seedRows];
      console.log(`  ✓ ${t}: yangilandi ${seedRows.length}`);
    } else {
      const have = new Set(db.tables[t].map((r) => r.id));
      const missing = seedRows.filter((r) => !have.has(r.id));
      db.tables[t] = [...db.tables[t], ...missing];
      console.log(`  ✓ ${t}: qo'shildi ${missing.length}, mavjud (tegilmadi) ${seedRows.length - missing.length}`);
    }
  }
  db.seededAt = new Date().toISOString();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(`${file}.tmp`, JSON.stringify(db));
  await fs.rename(`${file}.tmp`, file);
  console.log("\nEslatma: ishlab turgan dev serverni qayta ishga tushiring — u ma'lumotlarni xotirada saqlaydi.");
}

const mode = reset ? "to'liq almashtirish" : update ? "seed qatorlarini yangilash" : "faqat yo'q yozuvlarni qo'shish";
console.log(`Kontent seed (${mode}) → ${useSupabase ? "Supabase" : "lokal .data/db.json"}`);
await (useSupabase ? seedSupabase() : seedLocal());
console.log("Tayyor.");
