import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/server/env";
import { supabaseFetch } from "@/lib/supabase-shared";

/** Foydalanuvchi sessiyasi bilan ishlaydigan Supabase klienti (faqat autentifikatsiya uchun) */
export async function supabaseAuthClient() {
  const cookieStore = await cookies();
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    global: { fetch: supabaseFetch(env.supabaseAnonKey) },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(list) {
        try {
          for (const { name, value, options } of list) cookieStore.set(name, value, options);
        } catch {
          // Server komponentida cookie yozib bo‘lmaydi — proxy sessiyani yangilaydi.
        }
      },
    },
  });
}

/** Cookie'ga tegmaydigan, sessiyasiz klient — masalan, joriy parolni tekshirish uchun */
export function statelessAuthClient() {
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    global: { fetch: supabaseFetch(env.supabaseAnonKey) },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
