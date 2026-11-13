import type { ColorKey } from "@/lib/types";

/** Rang kaliti → CSS o‘zgaruvchisi (mavzuga qarab avtomatik o‘zgaradi) */
export const colorVar: Record<ColorKey, string> = {
  azure: "var(--accent)",
  teal: "var(--teal)",
  gold: "var(--gold)",
  coral: "var(--coral)",
  violet: "var(--violet)",
  rose: "var(--rose)",
  lime: "var(--lime)",
};

export function tint(color: ColorKey, pct: number): string {
  return `color-mix(in oklab, ${colorVar[color]} ${pct}%, transparent)`;
}

export const COLOR_KEYS: ColorKey[] = ["azure", "teal", "gold", "coral", "violet", "rose", "lime"];
