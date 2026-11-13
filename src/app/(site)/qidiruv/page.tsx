import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Box, GraduationCap, Layers, Map as MapIcon, Search, Wrench } from "lucide-react";
import { buildSearchIndex } from "@/lib/server/services/content";
import { rankSearch, SEARCH_TYPE_LABEL, type SearchItemType } from "@/lib/search";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Qidiruv" };

const ICON: Record<SearchItemType, typeof BookOpen> = { course: GraduationCap, lesson: BookOpen, category: Layers, path: MapIcon, software: Box, skill: Wrench };
const TYPES: SearchItemType[] = ["course", "lesson", "category", "path", "software", "skill"];

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").slice(0, 100);
  const type = TYPES.includes(sp.tur as SearchItemType) ? (sp.tur as SearchItemType) : null;
  const index = await buildSearchIndex();
  const all = q ? rankSearch(index, q, 200) : [];
  const results = type ? all.filter((r) => r.type === type) : all;
  const counts = Object.fromEntries(TYPES.map((t) => [t, all.filter((r) => r.type === t).length]));
  const link = (t: SearchItemType | null) => `/qidiruv?q=${encodeURIComponent(q)}${t ? `&tur=${t}` : ""}`;

  return (
    <div className="container-page max-w-4xl pb-10 pt-12 sm:pt-16">
      <h1 className="text-[34px] font-semibold tracking-[-0.035em] sm:text-[44px]">Qidiruv</h1>
      <form action="/qidiruv" className="relative mt-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fg-subtle" />
        <input name="q" defaultValue={q} autoFocus placeholder="Kurs, dars, dastur yoki ko‘nikma…" className="h-14 w-full rounded-2xl border border-border-strong bg-surface pl-12 pr-4 text-[16px] outline-none focus:border-accent focus:ring-4 focus:ring-accent/15" type="search" aria-label="Qidiruv so‘zi" />
      </form>
      {q && (
        <>
          <nav className="mt-6 flex flex-wrap gap-1.5" aria-label="Natija turlari">
            <Link href={link(null)} className={cn("h-8 rounded-lg px-3 text-[13px] leading-8", !type ? "bg-fg text-bg" : "border border-border text-fg-muted")}>Hammasi ({all.length})</Link>
            {TYPES.filter((t) => counts[t]).map((t) => (
              <Link key={t} href={link(t)} className={cn("h-8 rounded-lg px-3 text-[13px] leading-8", type === t ? "bg-fg text-bg" : "border border-border text-fg-muted")}>
                {SEARCH_TYPE_LABEL[t]} ({counts[t]})
              </Link>
            ))}
          </nav>
          {results.length === 0 ? (
            <p className="mt-12 text-center text-[15px] text-fg-muted">“{q}” bo‘yicha hech narsa topilmadi.</p>
          ) : (
            <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
              {results.map((r) => {
                const I = ICON[r.type];
                return (
                  <li key={`${r.type}-${r.href}-${r.title}`}>
                    <Link href={r.href} className="flex items-center gap-4 px-5 py-4 hover:bg-fg/[0.03]">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-fg-muted"><I className="h-4 w-4" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-medium">{r.title}</span>
                        <span className="block truncate text-[13px] text-fg-subtle">{r.subtitle}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
