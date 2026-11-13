/* Supabase klientlari (server, proxy, seed skripti) uchun umumiy yordamchilar.
   Bu faylda maxfiy qiymat yo‘q: faqat o‘zgaruvchi nomlari va fetch o‘rami. */

/** Ommaviy (publishable/anon) kalit — yangi nom birinchi, eski nom moslik uchun */
export function publicSupabaseKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
}

/** Maxfiy (secret/service-role) kalit — faqat serverda o‘qiladi */
export function secretSupabaseKey(): string {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

const isNewFormatKey = (key: string) => key.startsWith("sb_publishable_") || key.startsWith("sb_secret_");

/**
 * Yangi formatdagi kalitlar (sb_publishable_…, sb_secret_…) JWT emas — Supabase ularni
 * faqat `apikey` sarlavhasida qabul qiladi. supabase-js esa kalitni `Authorization: Bearer`
 * sifatida ham qo‘shadi. Agar Authorization aynan shu kalitning o‘zi bo‘lsa, uni olib
 * tashlaymiz; foydalanuvchi sessiyasi (JWT) tokenlari o‘zgarishsiz qoladi.
 * Eski JWT kalitlar (eyJ…) uchun oddiy fetch qaytariladi.
 */
export function supabaseFetch(key: string): typeof fetch {
  if (!isNewFormatKey(key)) return fetch;
  const bearer = `Bearer ${key}`;
  return (input, init) => {
    const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
    if (headers.get("authorization") === bearer) headers.delete("authorization");
    return fetch(input, { ...init, headers });
  };
}
