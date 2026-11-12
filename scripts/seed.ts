/* Kontentni (kurslar, modullar, darslar, testlar, yo'nalishlar, yo'llar) bazaga yozadi.
 *
 *   npm run seed            — seed yozuvlarini qo'shadi yoki yangilaydi (admin qo'shgan boshqa yozuvlar saqlanadi)
 *   npm run seed -- --reset — kontent jadvallarini to'liq seed bilan almashtiradi
 *
 * Supabase sozlangan bo'lsa (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY) — Supabase'ga,
 * aks holda lokal .data/db.json fayliga yoziladi. Foydalanuvchi ma'lumotlariga tegilmaydi. */
import { promises as fs } from "node:fs";
import path from "node:path";
import { buildSeedRows } from "../src/lib/seed/build.ts";
import { categories, courses, paths } from "../content/index.ts";

const reset = process.argv.includes("--reset");
const rows = buildSeedRows(courses, categories, paths);
const TABLES = ["categories", "courses", "modules", "lessons", "quizzes", "paths"] as const;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const toSnake = (k: string) => (k === "order" ? "sort_order" : k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`));
const toDb = (row: Record<string, unknown>) => Object.fromEntries(Object.entries(row).map(([k, v]) => [toSnake(k), v]));

async function seedSupabase() {
  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(url!, serviceKey!, { auth: { persistSession: false } });
  if (reset) {
    // Bog'liqlik tartibi bo'yicha teskari o'chirish
    for (const t of [...TABLES].reverse()) {
      const { error } = await sb.from(t).delete().neq("id", "");
      if (error) throw new Error(`${t}: ${error.message}`);
    }
  }
  for (const t of TABLES) {
    const list = (rows[t] as unknown as Record<string, unknown>[]).map(toDb);
    for (let i = 0; i < list.length; i += 200) {
      const { error } = await sb.from(t).upsert(list.slice(i, i + 200), { onConflict: "id" });
      if (error) throw new Error(`${t}: ${error.message}`);
    }
    console.log(`  ✓ ${t}: ${list.length}`);
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
    } else {
      const ids = new Set(seedRows.map((r) => r.id));
      db.tables[t] = [...db.tables[t].filter((r) => !ids.has(r.id)), ...seedRows];
    }
    console.log(`  ✓ ${t}: ${seedRows.length}`);
  }
  db.seededAt = new Date().toISOString();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(`${file}.tmp`, JSON.stringify(db));
  await fs.rename(`${file}.tmp`, file);
  console.log("\nEslatma: ishlab turgan dev serverni qayta ishga tushiring — u ma'lumotlarni xotirada saqlaydi.");
}

console.log(`Kontent seed ${reset ? "(to'liq almashtirish)" : "(qo'shish/yangilash)"} → ${url && serviceKey ? "Supabase" : "lokal .data/db.json"}`);
await (url && serviceKey ? seedSupabase() : seedLocal());
console.log("Tayyor.");
