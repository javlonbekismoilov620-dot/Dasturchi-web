import "server-only";
import { publicSupabaseKey, secretSupabaseKey } from "@/lib/supabase-shared";

/* Muhit o‘zgaruvchilari. Maxfiy kalitlar faqat serverda o‘qiladi. */

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  // Publishable (yangi) yoki anon (eski) kalit — ommaviy
  supabaseAnonKey: publicSupabaseKey(),
  // Secret (yangi) yoki service_role (eski) kalit — MAXFIY, faqat server
  supabaseServiceKey: secretSupabaseKey(),
  googleAuthEnabled: process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true",
  adminEmails: (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  aiModel: process.env.AI_MODEL || "claude-opus-5-5",
  dataDir: process.env.DATA_DIR ?? "",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, ""),
  mediaMaxUploadMb: Number(process.env.MEDIA_MAX_UPLOAD_MB) || 0,
  isProd: process.env.NODE_ENV === "production",
};

/** Supabase faqat URL, ommaviy va maxfiy kalitlar berilganda yoqiladi */
export function isSupabaseEnabled(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey && env.supabaseServiceKey);
}

export function isAiEnabled(): boolean {
  return Boolean(env.anthropicApiKey);
}

export function isAdminEmail(email: string): boolean {
  return env.adminEmails.includes(email.trim().toLowerCase());
}

/** Bitta fayl uchun yuklash chegarasi (MB). Supabase Free tarifida global chegara 50 MB. */
export function maxUploadMb(): number {
  if (env.mediaMaxUploadMb > 0) return Math.min(env.mediaMaxUploadMb, 200);
  return isSupabaseEnabled() ? 50 : 200;
}
