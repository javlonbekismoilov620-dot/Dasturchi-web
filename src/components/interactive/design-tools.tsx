"use client";

import { Check, X } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { Slider } from "./mesh-viewer";

/* ── Tipografiya o‘yingohi ─────────────────────────────────── */
const RATIOS = [
  { v: 1.125, name: "Katta sekunda" },
  { v: 1.2, name: "Kichik tersiya" },
  { v: 1.25, name: "Katta tersiya" },
  { v: 1.333, name: "Toza kvarta" },
  { v: 1.5, name: "Toza kvinta" },
  { v: 1.618, name: "Oltin nisbat" },
];
const FONTS = [
  { id: "sans", label: "Sans-serif", css: "var(--font-sans)" },
  { id: "serif", label: "Serif", css: "var(--font-display)" },
  { id: "mono", label: "Monospace", css: "var(--font-mono)" },
];

export function TypographyPlayground() {
  const [base, setBase] = useState(16);
  const [ratio, setRatio] = useState(1.25);
  const [lh, setLh] = useState(1.6);
  const [tracking, setTracking] = useState(-0.02);
  const [font, setFont] = useState("sans");
  const [weight, setWeight] = useState(600);
  const scale = useMemo(
    () => [
      { tag: "H1", size: base * ratio ** 4 },
      { tag: "H2", size: base * ratio ** 3 },
      { tag: "H3", size: base * ratio ** 2 },
      { tag: "H4", size: base * ratio },
      { tag: "Matn", size: base },
      { tag: "Izoh", size: base / ratio },
    ],
    [base, ratio],
  );
  const family = FONTS.find((f) => f.id === font)!.css;
  return (
    <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface">
      <div className="grid lg:grid-cols-[1fr_280px]">
        <div className="space-y-4 overflow-hidden p-5 sm:p-7" style={{ fontFamily: family }}>
          <p style={{ fontSize: scale[0].size, lineHeight: 1.1, letterSpacing: `${tracking}em`, fontWeight: weight }}>Samarqand</p>
          <p style={{ fontSize: scale[2].size, lineHeight: 1.2, letterSpacing: `${tracking / 2}em`, fontWeight: weight }}>Ipak yo‘lining durdonasi</p>
          <p className="max-w-[62ch] text-fg-muted" style={{ fontSize: base, lineHeight: lh }}>
            Yaxshi tipografiya ko‘rinmaydi — u o‘quvchini matn ichiga olib kiradi. Shrift o‘lchamlari tasodifiy emas, balki bitta nisbat asosida quriladi: har bir daraja oldingisidan aniq bir marta katta.
          </p>
          <div className="mt-6 space-y-1.5 border-t border-border pt-4 font-mono text-[12px] text-fg-subtle">
            {scale.map((s) => (
              <div key={s.tag} className="flex justify-between">
                <span>{s.tag}</span>
                <span className="tabular-nums">
                  {s.size.toFixed(1)}px · {(s.size / 16).toFixed(3)}rem
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 border-t border-border p-4 lg:border-l lg:border-t-0">
          <div className="flex gap-1">
            {FONTS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFont(f.id)}
                aria-pressed={font === f.id}
                className={cn("h-8 flex-1 rounded-lg text-[12px]", font === f.id ? "bg-fg text-bg" : "border border-border text-fg-muted")}
              >
                {f.label}
              </button>
            ))}
          </div>
          <Slider label="Asosiy o‘lcham" value={base} min={12} max={22} step={1} onChange={setBase} format={(v) => `${v}px`} />
          <label className="block">
            <span className="mb-1.5 block text-[12.5px] text-fg-muted">Masshtab nisbati</span>
            <select
              value={ratio}
              onChange={(e) => setRatio(Number(e.target.value))}
              className="h-9 w-full rounded-lg border border-border-strong bg-surface px-2 text-[13px]"
            >
              {RATIOS.map((r) => (
                <option key={r.v} value={r.v}>
                  {r.v} — {r.name}
                </option>
              ))}
            </select>
          </label>
          <Slider label="Qator balandligi" value={lh} min={1} max={2.2} step={0.05} onChange={setLh} format={(v) => v.toFixed(2)} />
          <Slider label="Harflar oralig‘i (sarlavha)" value={tracking} min={-0.06} max={0.1} step={0.005} onChange={setTracking} format={(v) => `${v.toFixed(3)}em`} />
          <Slider label="Sarlavha qalinligi" value={weight} min={300} max={800} step={100} onChange={setWeight} format={(v) => `${v}`} />
          <p className="text-[12px] leading-relaxed text-fg-subtle">
            Maslahat: uzun matnlar uchun qator balandligi 1.5–1.7, katta sarlavhalar uchun 1.05–1.2 atrofida bo‘lgani ma’qul.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Kontrast tekshirgich (WCAG 2.2) ───────────────────────── */
function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function luminance([r, g, b]: [number, number, number]) {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
export function contrastRatio(a: string, b: string): number | null {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  if (!ra || !rb) return null;
  const la = luminance(ra);
  const lb = luminance(rb);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function ContrastChecker() {
  const [fg, setFg] = useState("#6b7280");
  const [bg, setBg] = useState("#ffffff");
  const ratio = contrastRatio(fg, bg);
  const checks = ratio
    ? [
        { label: "AA · oddiy matn", need: 4.5 },
        { label: "AA · katta matn (24px+)", need: 3 },
        { label: "AAA · oddiy matn", need: 7 },
        { label: "AA · interfeys elementlari", need: 3 },
      ].map((c) => ({ ...c, ok: ratio >= c.need }))
    : [];
  return (
    <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface">
      <div className="grid md:grid-cols-[1fr_260px]">
        <div className="grid place-items-center p-8 sm:p-12" style={{ background: hexToRgb(bg) ? bg : "#fff", color: hexToRgb(fg) ? fg : "#000" }}>
          <div className="max-w-sm text-center">
            <p className="text-[28px] font-semibold tracking-tight">Kursga yozilish</p>
            <p className="mt-2 text-[15px] leading-relaxed">Bu matn tanlangan ranglarda qanday o‘qilishini ko‘rsatadi. Kontrast yetarli bo‘lmasa, ko‘rish qobiliyati past foydalanuvchilar uni o‘qiy olmaydi.</p>
            <span className="mt-5 inline-block rounded-lg border-2 px-4 py-2 text-[14px] font-medium" style={{ borderColor: "currentColor" }}>
              Tugma namunasi
            </span>
          </div>
        </div>
        <div className="space-y-4 border-t border-border p-4 md:border-l md:border-t-0">
          {(
            [
              ["Matn rangi", fg, setFg],
              ["Fon rangi", bg, setBg],
            ] as const
          ).map(([label, val, set]) => (
            <label key={label} className="block">
              <span className="mb-1.5 block text-[12.5px] text-fg-muted">{label}</span>
              <span className="flex gap-2">
                <input type="color" value={hexToRgb(val) ? (val.length === 4 ? `#${val.slice(1).split("").map((c) => c + c).join("")}` : val) : "#000000"} onChange={(e) => set(e.target.value)} className="h-9 w-12 cursor-pointer rounded-md border border-border bg-transparent" aria-label={`${label} tanlash`} />
                <input value={val} onChange={(e) => set(e.target.value)} className="h-9 w-full rounded-lg border border-border-strong bg-surface px-2.5 font-mono text-[13px] outline-none focus:border-accent" aria-label={`${label} HEX`} />
              </span>
            </label>
          ))}
          <button onClick={() => { setFg(bg); setBg(fg); }} className="text-[12.5px] text-fg-muted hover:text-fg">⇄ Ranglarni almashtirish</button>
          <div className="rounded-xl border border-border p-3">
            <p className="text-[12px] text-fg-subtle">Kontrast nisbati</p>
            <p className="text-[30px] font-semibold tabular-nums tracking-tight">{ratio ? `${ratio.toFixed(2)} : 1` : "—"}</p>
          </div>
          <ul className="space-y-1.5">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center justify-between text-[12.5px]">
                <span className="text-fg-muted">{c.label} (≥ {c.need})</span>
                {c.ok ? <Check className="h-4 w-4 text-success" aria-label="o‘tdi" /> : <X className="h-4 w-4 text-danger" aria-label="o‘tmadi" />}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── Box model laboratoriyasi ──────────────────────────────── */
export function BoxModelLab() {
  const [width, setWidth] = useState(180);
  const [padding, setPadding] = useState(20);
  const [border, setBorder] = useState(4);
  const [margin, setMargin] = useState(16);
  const [borderBox, setBorderBox] = useState(false);
  const total = borderBox ? width : width + padding * 2 + border * 2;
  const content = borderBox ? Math.max(0, width - padding * 2 - border * 2) : width;
  return (
    <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface">
      <div className="grid md:grid-cols-[1fr_260px]">
        <div className="flex flex-col items-center justify-center gap-4 overflow-x-auto bg-bg-subtle p-6">
          <div className="relative border border-dashed border-[color-mix(in_oklab,var(--gold)_60%,transparent)] bg-[color-mix(in_oklab,var(--gold)_14%,transparent)]" style={{ padding: margin }}>
            <span className="absolute left-1.5 top-0.5 text-[10px] font-medium text-gold">margin {margin}</span>
            <div className="relative" style={{ border: `${border}px solid var(--fg)`, padding, background: "color-mix(in oklab, var(--teal) 22%, transparent)", width: total, boxSizing: "border-box", transition: "all .3s cubic-bezier(.16,1,.3,1)" }}>
              <span className="absolute left-1.5 top-0.5 text-[10px] font-medium text-teal">padding {padding}</span>
              <div className="grid h-16 place-items-center bg-accent text-[12px] font-medium text-accent-fg" style={{ width: content, transition: "all .3s cubic-bezier(.16,1,.3,1)" }}>
                {Math.round(content)}px
              </div>
            </div>
          </div>
          <p className="text-center font-mono text-[12.5px] text-fg-muted">
            Umumiy kenglik: {borderBox ? `${width}` : `${width} + ${padding}×2 + ${border}×2`} = <span className="font-semibold text-fg">{total}px</span>
          </p>
        </div>
        <div className="space-y-4 border-t border-border p-4 md:border-l md:border-t-0">
          <div className="grid grid-cols-2 gap-1">
            {[false, true].map((bb) => (
              <button key={String(bb)} onClick={() => setBorderBox(bb)} aria-pressed={borderBox === bb} className={cn("h-8 rounded-lg font-mono text-[11.5px]", borderBox === bb ? "bg-fg text-bg" : "border border-border text-fg-muted")}>
                {bb ? "border-box" : "content-box"}
              </button>
            ))}
          </div>
          <Slider label="width" value={width} min={80} max={260} step={2} onChange={setWidth} format={(v) => `${v}px`} />
          <Slider label="padding" value={padding} min={0} max={40} step={1} onChange={setPadding} format={(v) => `${v}px`} />
          <Slider label="border" value={border} min={0} max={16} step={1} onChange={setBorder} format={(v) => `${v}px`} />
          <Slider label="margin" value={margin} min={0} max={40} step={1} onChange={setMargin} format={(v) => `${v}px`} />
        </div>
      </div>
    </div>
  );
}
