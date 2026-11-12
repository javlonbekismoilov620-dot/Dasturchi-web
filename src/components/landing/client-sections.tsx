"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Box, Clapperboard, Code2, Flame, Minus, Palette, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { LEVELS } from "@/lib/text";
import { ProgressRing } from "@/components/ui/primitives";

/* ── 5 bosqichli o‘quv yo‘li ───────────────────────────────── */
export function LevelRoadmap({ counts }: { counts: Record<number, number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const height = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative overflow-hidden border-y border-border bg-bg-subtle py-24 sm:py-32">
      <div className="girih pointer-events-none absolute inset-0 opacity-[var(--pattern-opacity)] [mask-image:linear-gradient(180deg,transparent,black,transparent)]" aria-hidden />
      <div className="container-page relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-3">O‘quv yo‘li</p>
          <h2 className="text-balance text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[44px]">
            Noldan <span className="font-display-italic text-fg-muted">ekspertgacha</span> — besh aniq bosqich
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-fg-muted">
            Har bir kurs shu besh bosqichdan biriga tegishli. Siz qayerdan boshlashni va keyingi qadam nima ekanini doim bilasiz.
          </p>
        </div>
        <div ref={ref} className="relative pl-10 sm:pl-14">
          <div className="absolute bottom-3 left-[15px] top-3 w-px bg-border-strong sm:left-[23px]" aria-hidden />
          <motion.div
            className="absolute left-[15px] top-3 w-px bg-gradient-to-b from-accent to-teal sm:left-[23px]"
            style={reduce ? { height: "100%" } : { height }}
            aria-hidden
          />
          <ol className="space-y-10">
            {LEVELS.map((l, i) => (
              <motion.li
                key={l.level}
                className="relative"
                initial={reduce ? false : { opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
              >
                <span className="absolute -left-10 top-0 grid h-8 w-8 place-items-center rounded-full border border-border-strong bg-elevated font-mono text-[12px] font-semibold sm:-left-14 sm:h-12 sm:w-12 sm:text-[14px]">
                  {l.level}
                </span>
                <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-[18px] font-semibold tracking-[-0.015em]">{l.name}</h3>
                    <span className="text-[12.5px] text-fg-subtle">{counts[l.level] ?? 0} ta kurs</span>
                  </div>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-fg-muted">{l.description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ── Interaktiv tajriba namoyishi ──────────────────────────── */
const Loading = () => <div className="skeleton h-[420px] w-full rounded-2xl" />;
const CodePlayground = dynamic(() => import("@/components/interactive/code-playground").then((m) => m.CodePlayground), { ssr: false, loading: Loading });
const MeshViewer = dynamic(() => import("@/components/interactive/mesh-viewer").then((m) => m.MeshViewer), { ssr: false, loading: Loading });
const TimelineDemo = dynamic(() => import("@/components/interactive/timeline-demo").then((m) => m.TimelineDemo), { ssr: false, loading: Loading });
const ColorGrading = dynamic(() => import("@/components/interactive/color-grading").then((m) => m.ColorGrading), { ssr: false, loading: Loading });

const DEMOS = [
  { id: "code", label: "Dasturlash", icon: Code2, text: "Kodni brauzerning o‘zida yozing va natijani darhol ko‘ring." },
  { id: "3d", label: "3D", icon: Box, text: "Nuqta, qirra va yuz tushunchalarini Blender uslubidagi ko‘rinishda o‘rganing." },
  { id: "video", label: "Montaj", icon: Clapperboard, text: "Klipni kesing, ko‘chiring va ripple o‘chirishni sinab ko‘ring." },
  { id: "color", label: "Rang", icon: Palette, text: "Rang korreksiyasini waveform skopi yordamida o‘lchab bajaring." },
] as const;

const DEMO_CODE = `<style>
  .karta {
    font-family: system-ui;
    padding: 24px;
    border-radius: 16px;
    background: linear-gradient(135deg, #2f5bff, #0f9f92);
    color: white;
  }
  .karta button {
    margin-top: 12px;
    padding: 10px 16px;
    border: 0;
    border-radius: 10px;
    font-weight: 600;
  }
</style>

<div class="karta">
  <h2>Salom, men Dilnozaman!</h2>
  <p>Bu kartochkani o'zim yaratdim.</p>
  <button onclick="this.textContent = 'Rahmat! 🎉'">Bosing</button>
</div>`;

export function InteractivePreview() {
  const [tab, setTab] = useState<(typeof DEMOS)[number]["id"]>("code");
  const active = DEMOS.find((d) => d.id === tab)!;
  return (
    <section className="container-page py-24 sm:py-32">
      <div className="max-w-2xl">
        <p className="eyebrow mb-3">Interaktiv o‘qish</p>
        <h2 className="text-balance text-[28px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[40px]">
          O‘qish emas — <span className="font-display-italic text-fg-muted">bajarib ko‘rish</span>
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-fg-muted sm:text-[17px]">
          Darslardagi vositalar haqiqiy ishlaydi. Quyida ulardan birini hoziroq sinab ko‘ring.
        </p>
      </div>
      <div className="mt-10 flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1 no-scrollbar sm:inline-flex" role="tablist">
        {DEMOS.map((d) => (
          <button
            key={d.id}
            role="tab"
            aria-selected={tab === d.id}
            onClick={() => setTab(d.id)}
            className={cn("relative flex h-9 shrink-0 items-center gap-2 rounded-lg px-3.5 text-[13.5px] transition-colors", tab === d.id ? "text-bg" : "text-fg-muted hover:text-fg")}
          >
            {tab === d.id && <motion.span layoutId="demo-pill" className="absolute inset-0 rounded-lg bg-fg" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
            <d.icon className="relative h-4 w-4" />
            <span className="relative">{d.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-[14px] text-fg-muted">{active.text}</p>
      <div className="mt-5">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
            {tab === "code" && <CodePlayground language="html" code={DEMO_CODE} compact title="index.html" />}
            {tab === "3d" && <MeshViewer initialShape="sphere" />}
            {tab === "video" && <TimelineDemo />}
            {tab === "color" && <ColorGrading />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ── Kabinet namoyishi (namuna ma’lumotlar bilan) ──────────── */
const SAMPLE_WEEK = [2, 3, 1, 4, 3, 0, 2];
const DAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

export function ProgressShowcase() {
  const reduce = useReducedMotion();
  return (
    <section className="container-page py-24 sm:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="eyebrow mb-3">Shaxsiy kabinet</p>
          <h2 className="text-balance text-[28px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[40px]">
            Har bir qadamingiz <span className="font-display-italic text-fg-muted">ko‘rinib turadi</span>
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-fg-muted sm:text-[17px]">
            Kabinetingizda kurslardagi progress, o‘qish seriyasi, haftalik faollik, yutuqlar va sertifikatlar jamlanadi. Platforma siz to‘xtagan darsni eslab qoladi va keyingi qadamni tavsiya qiladi.
          </p>
          <ul className="mt-6 space-y-2.5 text-[14.5px] text-fg-muted">
            {["Oxirgi ko‘rgan darsdan davom etish", "Haftalik maqsad va kunlik vazifalar", "Qaydlar va xatcho‘plar bitta joyda", "Haqiqiyligini tekshirish mumkin bo‘lgan sertifikatlar"].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rotate-45 bg-accent" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <motion.div
          className="relative"
          initial={reduce ? false : { opacity: 0, y: 30, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformPerspective: 1200 }}
        >
          <div className="absolute -inset-6 -z-10 rounded-[32px] bg-[radial-gradient(circle_at_60%_40%,var(--accent-soft),transparent_70%)] blur-xl" aria-hidden />
          <div className="rounded-2xl border border-border-strong bg-surface p-5 shadow-[var(--shadow-lg)] sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[12px] text-fg-subtle">Xush kelibsiz,</p>
                <p className="text-[18px] font-semibold tracking-tight">Dilnoza</p>
              </div>
              <span className="rounded-md border border-dashed border-border-strong px-2 py-1 text-[11px] text-fg-subtle">Namuna ko‘rinish</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-bg-subtle p-4">
                <p className="text-[12px] text-fg-subtle">Seriya</p>
                <p className="mt-1 flex items-center gap-1.5 text-[24px] font-semibold"><Flame className="h-5 w-5 text-coral" /> 6 kun</p>
              </div>
              <div className="rounded-xl border border-border bg-bg-subtle p-4">
                <p className="text-[12px] text-fg-subtle">Shu hafta</p>
                <p className="mt-1 text-[24px] font-semibold">15 dars</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-subtle p-4">
                <ProgressRing value={68} size={52}>68%</ProgressRing>
                <p className="text-[12px] leading-snug text-fg-muted">HTML va CSS kursi</p>
              </div>
            </div>
            <div className="mt-3 rounded-xl border border-border bg-bg-subtle p-4">
              <p className="mb-3 text-[12px] text-fg-subtle">Haftalik faollik</p>
              <div className="flex h-28 items-end gap-2">
                {SAMPLE_WEEK.map((v, i) => (
                  <div key={i} className="flex h-full flex-1 flex-col items-center gap-1.5">
                    <div className="flex w-full flex-1 items-end">
                      <motion.div
                        className="w-full rounded-md bg-gradient-to-t from-accent to-teal"
                        initial={reduce ? false : { height: 0 }}
                        whileInView={{ height: `${Math.max(4, (v / 4) * 100)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.3 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                        style={{ opacity: v ? 1 : 0.25 }}
                      />
                    </div>
                    <span className="text-[10.5px] text-fg-subtle">{DAYS[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Ko‘p beriladigan savollar ─────────────────────────────── */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container-page py-24 sm:py-32" id="savollar">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow mb-3">Savollar</p>
          <h2 className="text-balance text-[28px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[40px]">Ko‘p beriladigan savollar</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-fg-muted">Javob topa olmadingizmi? Har bir dars ostidagi savol-javob bo‘limida so‘rashingiz mumkin.</p>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q}>
                <h3>
                  <button
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] font-medium tracking-[-0.01em]"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {it.q}
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-fg-muted">
                      {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-12 text-[15px] leading-relaxed text-fg-muted">{it.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
