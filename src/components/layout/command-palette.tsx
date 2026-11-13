"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, BookOpen, Box, CornerDownLeft, GraduationCap, Layers, Map as MapIcon, Search, Sparkles, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { rankSearch, SEARCH_TYPE_LABEL, type SearchItem, type SearchItemType } from "@/lib/search";
import { Kbd } from "@/components/ui/primitives";
import { SEARCH_EVENT } from "./search-bus";

const TYPE_ICON: Record<SearchItemType, typeof BookOpen> = {
  course: GraduationCap,
  lesson: BookOpen,
  category: Layers,
  path: MapIcon,
  software: Box,
  skill: Wrench,
};

const SUGGESTIONS = ["HTML", "Python", "Blender", "DaVinci Resolve", "Figma", "JavaScript", "Flexbox", "Rang korreksiyasi"];

let indexCache: SearchItem[] | null = null;

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[] | null>(indexCache);
  const [error, setError] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);
  const changeQuery = (v: string) => {
    setQuery(v);
    setActive(0);
  };

  const load = useCallback(async () => {
    if (indexCache) return;
    try {
      const res = await fetch("/api/search");
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { items: SearchItem[] };
      indexCache = data.items;
      setItems(data.items);
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      void load();
    };
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else setOpen(true);
        void load();
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener(SEARCH_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(SEARCH_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, [load, open, close]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => inputRef.current?.focus());
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);


  const results = useMemo(() => (items && query ? rankSearch(items, query, 30) : []), [items, query]);

  const groups = useMemo(() => {
    const order: SearchItemType[] = ["course", "category", "path", "software", "lesson", "skill"];
    const map = new Map<SearchItemType, SearchItem[]>();
    for (const r of results) {
      if (!map.has(r.type)) map.set(r.type, []);
      map.get(r.type)!.push(r);
    }
    return order.filter((t) => map.has(t)).map((t) => ({ type: t, items: map.get(t)! }));
  }, [results]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [router, close],
  );
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flat[active]) go(flat[active].href);
      else if (query.trim()) go(`/kurslar?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (typeof document === "undefined") return null;

  let idx = -1;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[85] flex items-start justify-center px-3 pt-[8vh] sm:pt-[12vh]" onKeyDown={onKeyDown}>
          <motion.div
            className="absolute inset-0 bg-black/45 backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Qidiruv"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.14 } }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="relative flex max-h-[76dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border-strong bg-elevated shadow-[var(--shadow-lg)]"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-[18px] w-[18px] shrink-0 text-fg-subtle" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => changeQuery(e.target.value)}
                placeholder="Kurs, dars, dastur yoki ko‘nikmani qidiring…"
                className="h-14 w-full bg-transparent text-[16px] outline-none placeholder:text-fg-subtle"
                role="combobox"
                aria-expanded={flat.length > 0}
                aria-controls="cmdk-list"
                aria-activedescendant={flat[active] ? `cmdk-${active}` : undefined}
                autoComplete="off"
                spellCheck={false}
              />
              <Kbd>Esc</Kbd>
            </div>

            <div ref={listRef} id="cmdk-list" role="listbox" className="overflow-y-auto overscroll-contain p-2">
              {error && <p className="px-3 py-8 text-center text-[14px] text-danger">Qidiruv indeksini yuklab bo‘lmadi. Internet aloqasini tekshirib, qayta urinib ko‘ring.</p>}
              {!error && !items && (
                <div className="space-y-2 p-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="skeleton h-11" />
                  ))}
                </div>
              )}
              {!error && items && !query && (
                <div className="p-2">
                  <p className="eyebrow mb-3 px-1">Mashhur so‘rovlar</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => changeQuery(s)}
                        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => go("/baholash")}
                    className="mt-4 flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-3 text-left transition-colors hover:border-border-strong"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-soft text-accent">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[14px] font-medium">Nimadan boshlashni bilmayapsizmi?</span>
                      <span className="block text-[12.5px] text-fg-subtle">2 daqiqalik savolnoma sizga mos yo‘lni tavsiya qiladi</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-fg-subtle" />
                  </button>
                </div>
              )}
              {!error && items && query && flat.length === 0 && (
                <div className="px-3 py-10 text-center">
                  <p className="text-[14px] font-medium">“{query}” bo‘yicha hech narsa topilmadi</p>
                  <p className="mt-1 text-[13px] text-fg-subtle">Boshqa so‘z bilan urinib ko‘ring yoki barcha kurslarni ko‘ring.</p>
                </div>
              )}
              {groups.map((g) => (
                <div key={g.type} className="mb-1">
                  <p className="eyebrow px-3 pb-1.5 pt-3">{SEARCH_TYPE_LABEL[g.type]}</p>
                  {g.items.map((it) => {
                    idx++;
                    const i = idx;
                    const IconC = TYPE_ICON[it.type];
                    return (
                      <button
                        key={`${it.type}-${it.href}-${it.title}`}
                        id={`cmdk-${i}`}
                        data-idx={i}
                        role="option"
                        aria-selected={active === i}
                        onMouseMove={() => setActive(i)}
                        onClick={() => go(it.href)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                          active === i ? "bg-fg/[0.06]" : "",
                        )}
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border bg-surface text-fg-muted">
                          <IconC className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] font-medium">{it.title}</span>
                          <span className="block truncate text-[12.5px] text-fg-subtle">{it.subtitle}</span>
                        </span>
                        {active === i && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-fg-subtle" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="hidden items-center gap-4 border-t border-border px-4 py-2.5 text-[12px] text-fg-subtle sm:flex">
              <span className="flex items-center gap-1.5"><Kbd>↑</Kbd><Kbd>↓</Kbd> tanlash</span>
              <span className="flex items-center gap-1.5"><Kbd>↵</Kbd> ochish</span>
              <span className="ml-auto">Qidiruv indeksi: {items?.length ?? "…"} ta yozuv</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
