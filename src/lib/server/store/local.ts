import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { env } from "@/lib/server/env";
import { CONTENT_TABLES, matches, type Filter, type SelectOptions, type Store, type TableName, type Tables } from "./types";

/* ──────────────────────────────────────────────────────────────
   Lokal JSON ma’lumotlar bazasi.
   Ishlab chiqish va bitta serverli o‘rnatishlar uchun mo‘ljallangan:
   barcha ma’lumot xotirada, o‘zgarishlar .data/db.json fayliga
   atomar tarzda yoziladi. Ko‘p nusxali (serverless) muhitda Supabase
   drayverini ishlating.
   ────────────────────────────────────────────────────────────── */

type DbFile = {
  version: 1;
  seededAt: string;
  tables: { [K in TableName]: Tables[K][] };
};

const ALL_TABLES: TableName[] = [
  "categories", "courses", "modules", "lessons", "quizzes", "paths", "profiles", "enrollments",
  "lesson_progress", "quiz_attempts", "notes", "bookmarks", "saved_courses", "questions",
  "question_replies", "certificates", "activities", "media", "sessions", "credentials",
];

export function dataDir(): string {
  return env.dataDir || path.join(process.cwd(), ".data");
}

function dbPath(): string {
  return path.join(dataDir(), "db.json");
}

type GlobalState = {
  __dchDb?: Promise<DbFile>;
  __dchWriteTimer?: ReturnType<typeof setTimeout> | null;
  __dchWriteChain?: Promise<void>;
  __dchPersistError?: string | null;
};
const g = globalThis as GlobalState;

function emptyTables(): DbFile["tables"] {
  const t = {} as DbFile["tables"];
  for (const name of ALL_TABLES) (t as Record<string, unknown[]>)[name] = [];
  return t;
}

async function createFreshDb(): Promise<DbFile> {
  const { buildSeedRows } = await import("@/lib/seed/build");
  const content = await import("@content/index");
  const rows = buildSeedRows(content.courses, content.categories, content.paths);
  const tables = emptyTables();
  for (const name of CONTENT_TABLES) (tables as Record<string, unknown[]>)[name] = rows[name];
  return { version: 1, seededAt: new Date().toISOString(), tables };
}

async function loadDb(): Promise<DbFile> {
  try {
    const raw = await fs.readFile(dbPath(), "utf8");
    const parsed = JSON.parse(raw) as DbFile;
    for (const name of ALL_TABLES) {
      if (!Array.isArray(parsed.tables[name])) (parsed.tables as Record<string, unknown[]>)[name] = [];
    }
    return parsed;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("[store] db.json o‘qilmadi:", err);
      throw err;
    }
    const fresh = await createFreshDb();
    await writeNow(fresh);
    return fresh;
  }
}

function getDb(): Promise<DbFile> {
  if (!g.__dchDb) g.__dchDb = loadDb();
  return g.__dchDb;
}

async function writeNow(db: DbFile): Promise<void> {
  try {
    await fs.mkdir(dataDir(), { recursive: true });
    const tmp = `${dbPath()}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(db), "utf8");
    await fs.rename(tmp, dbPath());
    g.__dchPersistError = null;
  } catch (err) {
    // Faqat o‘qish uchun fayl tizimi (masalan, serverless) — ma’lumot xotirada qoladi.
    g.__dchPersistError = (err as Error).message;
    console.error("[store] db.json yozilmadi:", err);
  }
}

function schedulePersist() {
  if (g.__dchWriteTimer) return;
  g.__dchWriteTimer = setTimeout(() => {
    g.__dchWriteTimer = null;
    g.__dchWriteChain = (g.__dchWriteChain ?? Promise.resolve()).then(async () => {
      const db = await getDb();
      await writeNow(db);
    });
  }, 120);
}

export function localPersistError(): string | null {
  return g.__dchPersistError ?? null;
}

function clone<T>(v: T): T {
  return structuredClone(v);
}

function applyOptions<T>(rows: T[], opts?: SelectOptions<T>): T[] {
  let out = opts?.where ? rows.filter((r) => matches(r, opts.where)) : rows.slice();
  if (opts?.orderBy?.length) {
    const order = opts.orderBy;
    out.sort((a, b) => {
      for (const { field, asc = true } of order) {
        const av = a[field] as unknown as string | number;
        const bv = b[field] as unknown as string | number;
        if (av === bv) continue;
        if (av === null || av === undefined) return 1;
        if (bv === null || bv === undefined) return -1;
        return (av < bv ? -1 : 1) * (asc ? 1 : -1);
      }
      return 0;
    });
  }
  if (opts?.limit) out = out.slice(0, opts.limit);
  return out;
}

export const localStore: Store = {
  kind: "local",

  async select(table, opts) {
    const db = await getDb();
    return clone(applyOptions(db.tables[table], opts as SelectOptions<Tables[typeof table]>));
  },

  async first(table, where) {
    const db = await getDb();
    const row = (db.tables[table] as Tables[typeof table][]).find((r) => matches(r, where));
    return row ? clone(row) : null;
  },

  async getById(table, id) {
    const db = await getDb();
    const row = (db.tables[table] as { id: string }[]).find((r) => r.id === id);
    return row ? (clone(row) as Tables[typeof table]) : null;
  },

  async insert(table, row) {
    const db = await getDb();
    const list = db.tables[table] as { id: string }[];
    if (list.some((r) => r.id === (row as { id: string }).id)) {
      throw new Error(`Takroriy id: ${table}/${(row as { id: string }).id}`);
    }
    list.push(clone(row) as { id: string });
    schedulePersist();
    return clone(row);
  },

  async update(table, id, patch) {
    const db = await getDb();
    const list = db.tables[table] as { id: string }[];
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    const next = { ...list[idx], ...clone(patch), id } as { id: string };
    list[idx] = next;
    schedulePersist();
    return clone(next) as Tables[typeof table];
  },

  async upsert(table, row) {
    const db = await getDb();
    const list = db.tables[table] as { id: string }[];
    const idx = list.findIndex((r) => r.id === (row as { id: string }).id);
    if (idx === -1) list.push(clone(row) as { id: string });
    else list[idx] = clone(row) as { id: string };
    schedulePersist();
    return clone(row);
  },

  async remove(table, where) {
    const db = await getDb();
    const list = db.tables[table] as Tables[typeof table][];
    const keep = list.filter((r) => !matches(r, where as Filter<Tables[typeof table]>));
    const removed = list.length - keep.length;
    if (removed) {
      (db.tables as Record<string, unknown[]>)[table] = keep;
      schedulePersist();
    }
    return removed;
  },

  async count(table, where) {
    const db = await getDb();
    const list = db.tables[table] as Tables[typeof table][];
    return where ? list.filter((r) => matches(r, where as Filter<Tables[typeof table]>)).length : list.length;
  },
};
