/* O‘zbek lotin yozuvi uchun matn yordamchilari.
   Bu fayl ham server, ham brauzer, ham seed skriptida ishlatiladi —
   shuning uchun hech qanday alias importlarsiz yozilgan. */

/** o' / g' → o‘ / g‘ (oʻ, gʻ), qolgan tutuq belgilari → ’. `kod` qismlariga tegmaydi. */
export function uzTypography(input: string): string {
  if (!input) return input;
  return input
    .split(/(`[^`\n]*`)/g)
    .map((part) => (part.length > 1 && part.startsWith("`") && part.endsWith("`") ? part : fixPart(part)))
    .join("");
}

function fixPart(s: string): string {
  return s
    .replace(/([OoGg])['ʻ‘’`](?=\p{L})/gu, "$1‘")
    .replace(/(\p{L})['ʼ](?=\p{L})/gu, "$1’");
}

const SKIP_KEYS = new Set([
  "code", "slug", "url", "language", "icon", "accent", "color", "category", "id", "courseSlug",
  "filename", "provider", "poster", "type", "status", "coverUrl", "avatarUrl",
]);

/** Obyekt ichidagi barcha matnlarni normallashtiradi (kod va texnik maydonlardan tashqari) */
export function normalizeDeep<T>(value: T, key?: string): T {
  if (key && SKIP_KEYS.has(key)) return value;
  if (typeof value === "string") return uzTypography(value) as T;
  if (Array.isArray(value)) return value.map((v) => normalizeDeep(v)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = normalizeDeep(v, k);
    return out as T;
  }
  return value;
}

/** Qidiruv uchun: kichik harf, apostroflarsiz, diakritikasiz */
export function searchKey(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[‘’ʻʼ'`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(s: string): string {
  return searchKey(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const LEVEL_NAMES = {
  1: "Mutlaqo boshlang‘ich",
  2: "Asosiy bilimlar",
  3: "O‘rta daraja",
  4: "Ilg‘or daraja",
  5: "Ekspert daraja",
} as const;

export function levelName(level: number): string {
  return LEVEL_NAMES[level as keyof typeof LEVEL_NAMES] ?? `${level}-daraja`;
}

export const LEVELS = [
  { level: 1, name: LEVEL_NAMES[1], short: "Boshlang‘ich", description: "Hech qanday oldingi bilim talab qilinmaydi. Asosiy tushunchalar bilan noldan tanishasiz." },
  { level: 2, name: LEVEL_NAMES[2], short: "Asosiy", description: "Mustahkam poydevor quriladi: asosiy vositalar va ish jarayonlarini o‘zlashtirasiz." },
  { level: 3, name: LEVEL_NAMES[3], short: "O‘rta", description: "Amaliy ko‘nikmalar: haqiqiy loyihalarni mustaqil bajarishni o‘rganasiz." },
  { level: 4, name: LEVEL_NAMES[4], short: "Ilg‘or", description: "Professional ish jarayonlari va murakkab loyihalar bilan ishlaysiz." },
  { level: 5, name: LEVEL_NAMES[5], short: "Ekspert", description: "Ilg‘or texnikalar va sanoat darajasidagi loyihalar." },
] as const;

/** 1 → "1 ta dars"; o‘zbek tilida son bilan ot birlikda qoladi */
export function plural(n: number, word: string): string {
  return `${n.toLocaleString("uz-UZ")} ta ${word}`;
}

export function formatMinutes(min: number): string {
  if (min < 60) return `${min} daqiqa`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} soat ${m} daqiqa` : `${h} soat`;
}

const MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

/** Toshkent vaqti bo‘yicha sana: "12-noyabr, 2026" */
export function formatDate(iso: string, withYear = true): string {
  const d = new Date(new Date(iso).getTime() + 5 * 3600 * 1000);
  const base = `${d.getUTCDate()}-${MONTHS[d.getUTCMonth()]}`;
  return withYear ? `${base}, ${d.getUTCFullYear()}` : base;
}

export function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "hozirgina";
  if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} kun oldin`;
  return formatDate(iso);
}

/** Toshkent vaqt mintaqasi (UTC+5) bo‘yicha kun kaliti: "2026-11-12" */
export function dayKey(date: Date | string): string {
  const d = new Date(new Date(date).getTime() + 5 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}
