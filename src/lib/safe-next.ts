/**
 * Kirishdan keyingi yo‘naltirish manzilini tekshiradi (ochiq redirect zaifligiga qarshi).
 * Faqat ichki yo‘l qabul qilinadi: "/" bilan boshlanadi, "//" emas, teskari chiziq va
 * boshqaruv belgilari yo‘q (brauzerlar "/\evil.com" va "/\t/evil.com" ni "//evil.com" deb o‘qiydi).
 */
export function safeNext(next: unknown, fallback = "/kabinet"): string {
  const n = typeof next === "string" ? next : "";
  if (!n.startsWith("/") || n.startsWith("//") || n.length > 512) return fallback;
  if (/[\\\u0000-\u001f\u007f]/.test(n)) return fallback;
  return n;
}
