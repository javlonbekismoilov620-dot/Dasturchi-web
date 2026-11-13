import "server-only";

/* Oddiy xotiradagi tezlik cheklovchi (bitta server nusxasi uchun).
   Ko‘p nusxali muhitda Redis kabi umumiy omborga almashtirish tavsiya etiladi. */

type Bucket = { count: number; resetAt: number };
const g = globalThis as { __dchRate?: Map<string, Bucket> };
const buckets = (g.__dchRate ??= new Map());

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  b.count += 1;
  if (b.count > limit) return { ok: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
  return { ok: true, retryAfterSec: 0 };
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}

if (buckets.size === 0) {
  // Eskirgan yozuvlarni vaqti-vaqti bilan tozalash
  setInterval(() => {
    const now = Date.now();
    for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k);
  }, 60_000).unref?.();
}
