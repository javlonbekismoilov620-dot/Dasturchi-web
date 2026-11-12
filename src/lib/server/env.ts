import "server-only";

/* Muhit o‘zgaruvchilari. Maxfiy kalitlar faqat serverda o‘qiladi. */

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  googleAuthEnabled: process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true",
  authSecret: process.env.AUTH_SECRET ?? "",
  adminEmails: (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  aiModel: process.env.AI_MODEL || "claude-opus-5-5",
  dataDir: process.env.DATA_DIR ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  isProd: process.env.NODE_ENV === "production",
};

/** Supabase faqat URL, anon va service-role kalitlari berilganda yoqiladi */
export function isSupabaseEnabled(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey && env.supabaseServiceKey);
}

export function isAiEnabled(): boolean {
  return Boolean(env.anthropicApiKey);
}

export function isAdminEmail(email: string): boolean {
  return env.adminEmails.includes(email.trim().toLowerCase());
}
