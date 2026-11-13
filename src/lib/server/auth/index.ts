import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { env, isAdminEmail, isSupabaseEnabled } from "@/lib/server/env";
import { store } from "@/lib/server/store";
import type { User } from "@/lib/types";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { hashPassword, verifyPassword } from "./password";
import { statelessAuthClient, supabaseAuthClient } from "./supabase-auth";

const SESSION_COOKIE = "dch_session";
const SESSION_DAYS = 30;

export type AuthResult = { ok: true; user: User } | { ok: false; error: string; needsConfirmation?: boolean };

function sha256(s: string) {
  return createHash("sha256").update(s).digest("hex");
}

/** Yangi profil HAR DOIM talaba sifatida yaratiladi — admin huquqi faqat syncRole orqali */
function newProfile(id: string, email: string, name: string): User {
  return {
    id,
    email: email.toLowerCase(),
    name: (name.trim() || email.split("@")[0]).slice(0, 80),
    role: "student",
    bio: "",
    goal: "",
    weeklyGoal: 5,
    level: null,
    interests: [],
    onboarded: false,
    createdAt: new Date().toISOString(),
  };
}

/* ── ADMIN_EMAILS ─────────────────────────────────────────────
   Ro‘yxatdagi pochta egasi admin bo‘ladi, lekin faqat pochtaga egalik
   isbotlangan bo‘lsa. Aks holda begona odam admin pochtasi bilan birinchi
   bo‘lib ro‘yxatdan o‘tib, admin huquqini egallab olishi mumkin edi.
   Supabase rejimi: email_confirmed_at bo‘lishi shart. Parol bilan ro‘yxatdan
   o‘tganlar uchun qo‘shimcha ravishda loyihada "Confirm email" yoqilganligi
   (mailer_autoconfirm = false) tekshiriladi — avtomatik tasdiqlashda
   email_confirmed_at hech narsani isbotlamaydi. Tekshiruv muvaffaqiyatsiz
   bo‘lsa — huquq berilmaydi (fail closed).
   Lokal rejim: pochta tasdiqlanmaydi; admin hisobini birinchi bo‘lib o‘zingiz
   yarating (README → "Admin huquqi"). */

let autoconfirmCache: { value: boolean | null; at: number } | null = null;

/** Supabase loyihasi pochtani avtomatik tasdiqlaydimi? (ommaviy /auth/v1/settings; 5 daqiqa kesh) */
async function projectAutoconfirmsEmail(): Promise<boolean | null> {
  if (autoconfirmCache && Date.now() - autoconfirmCache.at < 5 * 60_000) return autoconfirmCache.value;
  let value: boolean | null = null;
  try {
    const res = await fetch(`${env.supabaseUrl}/auth/v1/settings`, {
      headers: { apikey: env.supabaseAnonKey },
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (res.ok) {
      const body = (await res.json()) as { mailer_autoconfirm?: unknown };
      if (typeof body.mailer_autoconfirm === "boolean") value = body.mailer_autoconfirm;
    }
  } catch {
    value = null;
  }
  autoconfirmCache = { value, at: Date.now() };
  return value;
}

/** Supabase foydalanuvchisi ADMIN_EMAILS orqali admin bo‘la oladimi */
export async function supabaseAdminEligible(sbUser: Pick<SupabaseUser, "email" | "email_confirmed_at" | "app_metadata">): Promise<boolean> {
  if (!sbUser.email || !isAdminEmail(sbUser.email) || !sbUser.email_confirmed_at) return false;
  const meta = sbUser.app_metadata ?? {};
  const providers: string[] = Array.isArray(meta.providers) ? meta.providers : meta.provider ? [String(meta.provider)] : [];
  // Faqat OAuth (masalan, Google) — pochta provayder tomonidan tasdiqlangan
  if (providers.length > 0 && !providers.includes("email")) return true;
  return (await projectAutoconfirmsEmail()) === false;
}

/** ADMIN_EMAILS ro‘yxatidagi (tasdiqlangan) foydalanuvchini admin darajasiga ko‘taradi */
async function syncRole(user: User, eligible: boolean): Promise<User> {
  if (user.role !== "admin" && eligible) {
    return (await store().update("profiles", user.id, { role: "admin" })) ?? user;
  }
  return user;
}

/** ADMIN_EMAILS orqali berilgan huquqni panel orqali olib bo‘lmaydi (keyingi kirishda qayta beriladi) */
export function isBootstrapAdmin(email: string): boolean {
  return isAdminEmail(email);
}

/* ── Lokal sessiyalar ─────────────────────────────────────── */

async function createLocalSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  await store().insert("sessions", {
    id: randomUUID(),
    userId,
    tokenHash: sha256(token),
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_DAYS * 86400_000).toISOString(),
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProd,
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

async function localUserId(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token || token.length > 200) return null;
  const session = await store().first("sessions", { tokenHash: sha256(token) });
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    await store().remove("sessions", { id: session.id });
    return null;
  }
  return session.userId;
}

/* ── Ommaviy API ──────────────────────────────────────────── */

/** Joriy foydalanuvchi (so‘rov davomida keshlanadi) */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  try {
    let userId: string | null = null;
    if (isSupabaseEnabled()) {
      const sb = await supabaseAuthClient();
      const { data } = await sb.auth.getUser();
      if (!data.user) return null;
      userId = data.user.id;
      const eligible = await supabaseAdminEligible(data.user);
      const existing = await store().getById("profiles", userId);
      if (existing) return await syncRole(existing, eligible);
      // Trigger profil yaratmagan bo‘lsa (masalan, migratsiyadan oldingi foydalanuvchi)
      const meta = data.user.user_metadata as { full_name?: string; name?: string };
      const created = await store().insert(
        "profiles",
        newProfile(userId, data.user.email ?? "", meta.full_name ?? meta.name ?? ""),
      );
      return await syncRole(created, eligible);
    }
    userId = await localUserId();
    if (!userId) return null;
    const profile = await store().getById("profiles", userId);
    return profile ? await syncRole(profile, isAdminEmail(profile.email)) : null;
  } catch (err) {
    // Next.js ichki signallari (dinamik render, redirect) qayta uzatiladi
    unstable_rethrow(err);
    console.error("[auth] getCurrentUser:", err);
    return null;
  }
});

export async function requireUser(next?: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(`/kirish${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser("/admin");
  if (user.role !== "admin") redirect("/kabinet?xato=admin");
  return user;
}

export async function signUp(name: string, email: string, password: string): Promise<AuthResult> {
  const normalized = email.trim().toLowerCase();
  if (isSupabaseEnabled()) {
    const sb = await supabaseAuthClient();
    const { data, error } = await sb.auth.signUp({
      email: normalized,
      password,
      options: { data: { full_name: name }, emailRedirectTo: `${env.siteUrl}/auth/callback` },
    });
    if (error) return { ok: false, error: translateSupabaseError(error.message) };
    if (!data.user) return { ok: false, error: "Ro‘yxatdan o‘tishda xatolik yuz berdi." };
    const profile =
      (await store().getById("profiles", data.user.id)) ??
      (await store().insert("profiles", newProfile(data.user.id, normalized, name)));
    if (!data.session) {
      return { ok: false, needsConfirmation: true, error: "Elektron pochtangizga tasdiqlash havolasi yuborildi. Havolani bosib, so‘ng tizimga kiring." };
    }
    return { ok: true, user: await syncRole(profile, await supabaseAdminEligible(data.user)) };
  }

  const exists = await store().first("profiles", { email: normalized });
  if (exists) return { ok: false, error: "Bu elektron pochta bilan allaqachon ro‘yxatdan o‘tilgan." };
  const id = randomUUID();
  const profile = await store().insert("profiles", newProfile(id, normalized, name));
  await store().insert("credentials", {
    id: randomUUID(),
    userId: id,
    passwordHash: await hashPassword(password),
    updatedAt: new Date().toISOString(),
  });
  await createLocalSession(id);
  return { ok: true, user: await syncRole(profile, isAdminEmail(normalized)) };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const normalized = email.trim().toLowerCase();
  const invalid = { ok: false as const, error: "Elektron pochta yoki parol noto‘g‘ri." };
  if (isSupabaseEnabled()) {
    const sb = await supabaseAuthClient();
    const { data, error } = await sb.auth.signInWithPassword({ email: normalized, password });
    if (error || !data.user) return { ok: false, error: error ? translateSupabaseError(error.message) : invalid.error };
    const profile =
      (await store().getById("profiles", data.user.id)) ??
      (await store().insert("profiles", newProfile(data.user.id, normalized, "")));
    return { ok: true, user: await syncRole(profile, await supabaseAdminEligible(data.user)) };
  }

  const profile = await store().first("profiles", { email: normalized });
  if (!profile) {
    await hashPassword(password); // vaqt bo‘yicha farqni yashirish
    return invalid;
  }
  const cred = await store().first("credentials", { userId: profile.id });
  if (!cred || !(await verifyPassword(password, cred.passwordHash))) return invalid;
  await createLocalSession(profile.id);
  return { ok: true, user: await syncRole(profile, isAdminEmail(profile.email)) };
}

export async function signOut(): Promise<void> {
  if (isSupabaseEnabled()) {
    const sb = await supabaseAuthClient();
    await sb.auth.signOut();
    return;
  }
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await store().remove("sessions", { tokenHash: sha256(token) });
  jar.delete(SESSION_COOKIE);
}

export async function changePassword(userId: string, current: string, next: string): Promise<{ ok: boolean; error?: string }> {
  if (isSupabaseEnabled()) {
    const sb = await supabaseAuthClient();
    const { data } = await sb.auth.getUser();
    if (!data.user?.email || data.user.id !== userId) return { ok: false, error: "Sessiya topilmadi. Qayta kiring." };
    const providers = (data.user.app_metadata?.providers as string[] | undefined) ?? [];
    if (providers.length > 0 && !providers.includes("email")) {
      return { ok: false, error: "Siz Google orqali kirgansiz — bu hisobda parol yo‘q, kirish Google hisobingiz orqali boshqariladi." };
    }
    // Joriy parolni alohida, cookie'siz klientda tekshiramiz (o‘g‘irlangan sessiya parolni almashtira olmasin)
    const verifier = statelessAuthClient();
    const check = await verifier.auth.signInWithPassword({ email: data.user.email, password: current });
    if (check.error) return { ok: false, error: "Joriy parol noto‘g‘ri." };
    await verifier.auth.signOut({ scope: "local" }); // tekshiruv sessiyasini bekor qilish
    const { error } = await sb.auth.updateUser({ password: next });
    if (error) return { ok: false, error: translateSupabaseError(error.message) };
    // Boshqa qurilmalardagi sessiyalarni bekor qilish (joriy sessiya qoladi)
    await sb.auth.signOut({ scope: "others" });
    return { ok: true };
  }
  const cred = await store().first("credentials", { userId });
  if (!cred || !(await verifyPassword(current, cred.passwordHash))) {
    return { ok: false, error: "Joriy parol noto‘g‘ri." };
  }
  await store().update("credentials", cred.id, { passwordHash: await hashPassword(next), updatedAt: new Date().toISOString() });
  // Boshqa qurilmalardagi sessiyalarni bekor qilish
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const sessions = await store().select("sessions", { where: { userId } });
  for (const s of sessions) if (!token || s.tokenHash !== sha256(token)) await store().remove("sessions", { id: s.id });
  return { ok: true };
}

export function authMode() {
  return {
    provider: isSupabaseEnabled() ? ("supabase" as const) : ("local" as const),
    google: isSupabaseEnabled() && env.googleAuthEnabled,
  };
}

function translateSupabaseError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Elektron pochta yoki parol noto‘g‘ri.";
  if (m.includes("already registered")) return "Bu elektron pochta bilan allaqachon ro‘yxatdan o‘tilgan.";
  if (m.includes("email not confirmed")) return "Elektron pochta hali tasdiqlanmagan. Pochtangizni tekshiring.";
  if (m.includes("same password") || m.includes("different from the old")) return "Yangi parol eskisidan farq qilishi kerak.";
  if (m.includes("password")) return "Parol talablarga javob bermaydi (kamida 8 ta belgi, harf va raqam).";
  if (m.includes("rate limit") || m.includes("too many")) return "Juda ko‘p urinish. Birozdan so‘ng qayta urinib ko‘ring.";
  if (m.includes("not authorized") || m.includes("error sending")) return "Tasdiqlash xatini yuborib bo‘lmadi: pochta xizmati hali sozlanmagan. Administrator bilan bog‘laning.";
  if (m.includes("invalid") && m.includes("email")) return "Elektron pochta manzili qabul qilinmadi.";
  if (m.includes("signups not allowed") || m.includes("signup is disabled")) return "Ro‘yxatdan o‘tish vaqtincha yopiq.";
  return "Autentifikatsiya xizmatida xatolik yuz berdi. Qayta urinib ko‘ring.";
}
