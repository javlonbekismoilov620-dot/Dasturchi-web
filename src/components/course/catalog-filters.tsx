"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/cn";
import { LEVELS } from "@/lib/text";

type Option = { value: string; label: string; count?: number };

export function CatalogFilters({
  categories,
  software,
  total,
}: {
  categories: Option[];
  software: Option[];
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [open, setOpen] = useState(false);

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    start(() => router.replace(`${pathname}${next.toString() ? `?${next}` : ""}`, { scroll: false }));
  };

  // Qidiruv maydoni — debounce
  useEffect(() => {
    const current = params.get("q") ?? "";
    if (q === current) return;
    const t = setTimeout(() => update({ q: q.trim() || null }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const active = (k: string) => params.get(k);
  const activeCount = ["yonalish", "daraja", "holat", "dastur"].filter((k) => params.get(k)).length;

  const chip = (k: string, value: string, label: string) => {
    const on = active(k) === value;
    return (
      <button
        key={`${k}-${value}`}
        onClick={() => update({ [k]: on ? null : value })}
        aria-pressed={on}
        className={cn(
          "h-8 shrink-0 rounded-lg border px-3 text-[13px] transition-colors",
          on ? "border-transparent bg-fg text-bg" : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
        )}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <label className="relative flex-1">
          <span className="sr-only">Kurslarni qidirish</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Kurs, dastur yoki ko‘nikma nomi…"
            className="h-12 w-full rounded-xl border border-border-strong bg-surface pl-10 pr-10 text-[15px] outline-none transition-[border-color,box-shadow] focus:border-accent focus:ring-4 focus:ring-accent/15"
            type="search"
          />
          {pending && <span className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-fg-subtle border-t-transparent" />}
        </label>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-12 items-center gap-2 rounded-xl border border-border-strong bg-surface px-4 text-[14px] lg:hidden"
          aria-expanded={open}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtr{activeCount ? ` (${activeCount})` : ""}
        </button>
      </div>

      <div className={cn("space-y-3", !open && "hidden lg:block")}>
        <Row label="Yo‘nalish">{categories.map((c) => chip("yonalish", c.value, c.label))}</Row>
        <Row label="Daraja">{LEVELS.map((l) => chip("daraja", String(l.level), `${l.level} · ${l.short}`))}</Row>
        <Row label="Holat">
          {chip("holat", "tayyor", "To‘liq tayyor")}
          {chip("holat", "tayyorlanmoqda", "Tayyorlanmoqda")}
        </Row>
        <Row label="Dastur">{software.map((s) => chip("dastur", s.value, s.label))}</Row>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <p className="text-[13.5px] text-fg-muted" aria-live="polite">
          {total} ta kurs topildi
          {activeCount > 0 && (
            <button onClick={() => update({ yonalish: null, daraja: null, holat: null, dastur: null })} className="ml-3 inline-flex items-center gap-1 text-fg hover:underline">
              <X className="h-3.5 w-3.5" /> Filtrlarni tozalash
            </button>
          )}
        </p>
        <label className="flex items-center gap-2 text-[13px] text-fg-muted">
          Saralash:
          <select
            value={params.get("saralash") ?? "tavsiya"}
            onChange={(e) => update({ saralash: e.target.value === "tavsiya" ? null : e.target.value })}
            className="h-8 rounded-lg border border-border bg-surface px-2 text-[13px] text-fg"
          >
            <option value="tavsiya">Tavsiya etilgan</option>
            <option value="mashhur">Eng mashhur</option>
            <option value="yangi">Yangi qo‘shilgan</option>
            <option value="daraja">Daraja bo‘yicha</option>
          </select>
        </label>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <span className="w-24 shrink-0 text-[12.5px] text-fg-subtle">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}
