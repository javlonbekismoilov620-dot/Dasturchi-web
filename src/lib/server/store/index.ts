import "server-only";
import { isSupabaseEnabled } from "@/lib/server/env";
import { localStore } from "./local";
import { supabaseStore } from "./supabase";
import type { Store } from "./types";

/** Faol ma’lumotlar drayveri: Supabase sozlangan bo‘lsa — Supabase, aks holda lokal JSON */
export function store(): Store {
  return isSupabaseEnabled() ? supabaseStore : localStore;
}

export type { Store, Tables, TableName, Filter } from "./types";
