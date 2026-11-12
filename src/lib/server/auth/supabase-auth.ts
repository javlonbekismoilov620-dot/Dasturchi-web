import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/server/env";

/** Foydalanuvchi sessiyasi bilan ishlaydigan Supabase klienti (faqat autentifikatsiya uchun) */
export async function supabaseAuthClient() {
  const cookieStore = await cookies();
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
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
