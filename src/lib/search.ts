import { searchKey } from "@/lib/text";

export type SearchItemType = "course" | "lesson" | "category" | "path" | "software" | "skill";

export interface SearchItem {
  type: SearchItemType;
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
  level?: number;
  categorySlug?: string;
  status?: string;
}

export const SEARCH_TYPE_LABEL: Record<SearchItemType, string> = {
  course: "Kurslar",
  lesson: "Darslar",
  category: "Yo‘nalishlar",
  path: "O‘quv yo‘llari",
  software: "Dasturlar",
  skill: "Ko‘nikmalar",
};

/** Har bir so‘z mos kelishi kerak; sarlavhadagi moslik ustun turadi */
export function rankSearch(items: SearchItem[], query: string, limit = 40): SearchItem[] {
  const q = searchKey(query);
  if (!q) return [];
  const terms = q.split(" ").filter(Boolean);
  const scored: { item: SearchItem; score: number }[] = [];
  for (const item of items) {
    const title = searchKey(item.title);
    let score = 0;
    let ok = true;
    for (const t of terms) {
      if (title.startsWith(t)) score += 12;
      else if (title.includes(` ${t}`)) score += 9;
      else if (title.includes(t)) score += 6;
      else if (item.keywords.includes(t)) score += 2;
      else {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    const typeBoost = { course: 5, category: 4, path: 4, software: 3, lesson: 1, skill: 0 }[item.type];
    scored.push({ item, score: score + typeBoost });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.item);
}
