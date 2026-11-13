import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/server/env";
import { supabaseFetch } from "@/lib/supabase-shared";
import type { Filter, SelectOptions, Store, TableName, Tables } from "./types";

/* ──────────────────────────────────────────────────────────────
   Supabase (PostgreSQL) drayveri.
   Server tomonida service-role kaliti bilan ishlaydi: ruxsatlar
   ilova xizmatlari qatlamida tekshiriladi, RLS esa brauzerdan
   to‘g‘ridan-to‘g‘ri kirishga qarshi qo‘shimcha himoya vazifasini
   bajaradi (supabase/migrations ga qarang).
   Ustun nomlari snake_case, ichki JSON maydonlar camelCase.
   ────────────────────────────────────────────────────────────── */

let client: SupabaseClient | null = null;

export function serviceClient(): SupabaseClient {
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { fetch: supabaseFetch(env.supabaseServiceKey) },
    });
  }
  return client;
}

/* Lokal-faqat jadvallar Supabase rejimida ishlatilmaydi */
const UNSUPPORTED: TableName[] = ["sessions", "credentials"];

const toSnake = (k: string) => k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
const toCamel = (k: string) => k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

function rowToDb(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    // "order" Postgresda zaxiralangan so‘z — ustun "sort_order" deb nomlangan
    out[k === "order" ? "sort_order" : toSnake(k)] = v;
  }
  return out;
}

function rowFromDb<T>(row: Record<string, unknown>): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) out[k === "sort_order" ? "order" : toCamel(k)] = v;
  return out as T;
}

function col(field: string): string {
  return field === "order" ? "sort_order" : toSnake(field);
}

function guard(table: TableName) {
  if (UNSUPPORTED.includes(table)) {
    throw new Error(`"${table}" jadvali faqat lokal rejimda mavjud`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyFilter(query: any, where?: Filter<unknown>) {
  if (!where) return query;
  for (const [key, cond] of Object.entries(where as Record<string, unknown>)) {
    if (cond === undefined) continue;
    if (cond === null) query = query.is(col(key), null);
    else if (typeof cond === "object" && cond && "in" in cond) query = query.in(col(key), (cond as { in: unknown[] }).in);
    else query = query.eq(col(key), cond);
  }
  return query;
}

function fail(table: string, error: { message: string } | null): never {
  throw new Error(`[supabase:${table}] ${error?.message ?? "noma’lum xato"}`);
}

export const supabaseStore: Store = {
  kind: "supabase",

  async select(table, opts?: SelectOptions<Tables[typeof table]>) {
    guard(table);
    const columns = opts?.columns?.length ? opts.columns.map((c) => col(String(c))).join(",") : "*";
    let q = serviceClient().from(table).select(columns);
    q = applyFilter(q, opts?.where as Filter<unknown>);
    for (const o of opts?.orderBy ?? []) q = q.order(col(String(o.field)), { ascending: o.asc ?? true });
    if (opts?.limit) q = q.limit(opts.limit);
    const { data, error } = await q;
    if (error) fail(table, error);
    return ((data ?? []) as unknown as Record<string, unknown>[]).map((r) => rowFromDb<Tables[typeof table]>(r));
  },

  async first(table, where) {
    guard(table);
    let q = serviceClient().from(table).select("*");
    q = applyFilter(q, where as Filter<unknown>);
    const { data, error } = await q.limit(1).maybeSingle();
    if (error) fail(table, error);
    return data ? rowFromDb<Tables[typeof table]>(data) : null;
  },

  async getById(table, id) {
    return this.first(table, { id } as Filter<Tables[typeof table]>);
  },

  async insert(table, row) {
    guard(table);
    const { data, error } = await serviceClient()
      .from(table)
      .insert(rowToDb(row as unknown as Record<string, unknown>))
      .select("*")
      .single();
    if (error) fail(table, error);
    return rowFromDb<Tables[typeof table]>(data);
  },

  async update(table, id, patch) {
    guard(table);
    const { id: _ignored, ...rest } = patch as Record<string, unknown>;
    void _ignored;
    const { data, error } = await serviceClient()
      .from(table)
      .update(rowToDb(rest))
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) fail(table, error);
    return data ? rowFromDb<Tables[typeof table]>(data) : null;
  },

  async upsert(table, row) {
    guard(table);
    const { data, error } = await serviceClient()
      .from(table)
      .upsert(rowToDb(row as unknown as Record<string, unknown>), { onConflict: "id" })
      .select("*")
      .single();
    if (error) fail(table, error);
    return rowFromDb<Tables[typeof table]>(data);
  },

  async remove(table, where) {
    guard(table);
    let q = serviceClient().from(table).delete({ count: "exact" });
    q = applyFilter(q, where as Filter<unknown>);
    const { count, error } = await q;
    if (error) fail(table, error);
    return count ?? 0;
  },

  async count(table, where) {
    guard(table);
    let q = serviceClient().from(table).select("id", { count: "exact", head: true });
    q = applyFilter(q, where as Filter<unknown>);
    const { count, error } = await q;
    if (error) fail(table, error);
    return count ?? 0;
  },
};
