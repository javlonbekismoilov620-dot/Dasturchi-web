"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn, signOut, signUp } from "@/lib/server/auth";
import { supabaseAuthClient } from "@/lib/server/auth/supabase-auth";
import { env, isSupabaseEnabled } from "@/lib/server/env";
import { rateLimit, resetRateLimit } from "@/lib/server/rate-limit";

export type AuthState = { error?: string; info?: string; fields?: Record<string, string> } | null;

function safeNext(next: unknown): string {
  const n = typeof next === "string" ? next : "";
  // Faqat ichki manzillarga yo‘naltirish (ochiq redirect zaifligiga qarshi)
  return n.startsWith("/") && !n.startsWith("//") && !n.startsWith("/\\") ? n : "/kabinet";
}

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}

const loginSchema = z.object({
  email: z.string().trim().email("Elektron pochta manzilini to‘g‘ri kiriting."),
  password: z.string().min(1, "Parolni kiriting."),
});

export async function loginAction(_prev: AuthState, form: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({ email: form.get("email"), password: form.get("password") });
  const email = String(form.get("email") ?? "");
  if (!parsed.success) return { error: parsed.error.issues[0].message, fields: { email } };

  const key = `login:${await clientIp()}:${parsed.data.email.toLowerCase()}`;
  const limit = rateLimit(key, 8, 15 * 60_000);
  if (!limit.ok) {
    return { error: `Juda ko‘p urinish. ${Math.ceil(limit.retryAfterSec / 60)} daqiqadan so‘ng qayta urinib ko‘ring.`, fields: { email } };
  }

  const res = await signIn(parsed.data.email, parsed.data.password);
  if (!res.ok) return { error: res.error, fields: { email } };
  resetRateLimit(key);
  redirect(safeNext(form.get("next")));
}

const registerSchema = z.object({
  name: z.string().trim().min(2, "Ism kamida 2 ta harfdan iborat bo‘lsin.").max(80, "Ism juda uzun."),
  email: z.string().trim().email("Elektron pochta manzilini to‘g‘ri kiriting.").max(200),
  password: z
    .string()
    .min(8, "Parol kamida 8 ta belgidan iborat bo‘lishi kerak.")
    .max(200)
    .refine((p) => /[A-Za-z]/.test(p) && /\d/.test(p), "Parolda kamida bitta harf va bitta raqam bo‘lsin."),
});

export async function registerAction(_prev: AuthState, form: FormData): Promise<AuthState> {
  const raw = { name: form.get("name"), email: form.get("email"), password: form.get("password") };
  const fields = { name: String(raw.name ?? ""), email: String(raw.email ?? "") };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message, fields };
  if (form.get("terms") !== "on") return { error: "Davom etish uchun foydalanish shartlariga rozilik bering.", fields };

  const limit = rateLimit(`register:${await clientIp()}`, 6, 60 * 60_000);
  if (!limit.ok) return { error: "Juda ko‘p ro‘yxatdan o‘tish urinishi. Birozdan so‘ng urinib ko‘ring.", fields };

  const res = await signUp(parsed.data.name, parsed.data.email, parsed.data.password);
  if (!res.ok) {
    if (res.needsConfirmation) return { info: res.error, fields };
    return { error: res.error, fields };
  }
  redirect(safeNext(form.get("next") || "/baholash"));
}

export async function logoutAction() {
  await signOut();
  redirect("/");
}

export async function googleLoginAction(form: FormData) {
  if (!isSupabaseEnabled() || !env.googleAuthEnabled) redirect("/kirish?xato=google");
  const sb = await supabaseAuthClient();
  const h = await headers();
  const origin = env.siteUrl || `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;
  const next = safeNext(form.get("next"));
  const { data, error } = await sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error || !data.url) redirect("/kirish?xato=google");
  redirect(data.url);
}
