"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { saveAssessmentAction } from "@/app/actions/learning";
import { Icon } from "@/components/ui/icon";
import { colorVar, tint } from "@/lib/colors";
import { cn } from "@/lib/cn";
import { levelName } from "@/lib/text";
import type { ColorKey } from "@/lib/types";

type Cat = { slug: string; title: string; icon: string; color: ColorKey };
type PathInfo = { slug: string; title: string; subtitle: string; icon: string; color: ColorKey; steps: { slug: string; title: string; level: number; status: string; category: string }[] };

const EXPERIENCE = [
  { v: 1, label: "Umuman tajribam yo‘q", hint: "Bu sohani noldan boshlayman" },
  { v: 2, label: "Biroz tanishman", hint: "Video darslar ko‘rganman, sinab ko‘rganman" },
  { v: 3, label: "Kichik loyihalar qilganman", hint: "Asosiy vositalarni mustaqil ishlata olaman" },
  { v: 4, label: "Professional darajada ishlayman", hint: "Bu sohada ishlayman yoki buyurtmalar bajaraman" },
];

const GOALS = ["Yangi kasb egallash", "Hozirgi ishimda o‘sish", "Frilans va qo‘shimcha daromad", "O‘z biznesim uchun", "Shunchaki qiziqish"];
const TIME = [
  { v: 3, label: "Haftasiga 1–2 soat" },
  { v: 5, label: "Haftasiga 3–5 soat" },
  { v: 10, label: "Haftasiga 6–10 soat" },
  { v: 15, label: "Haftasiga 10 soatdan ko‘p" },
];

/* Har bir yo‘nalish uchun qisqa bilim tekshiruvi (3 savol) */
const CHECKS: Record<string, { q: string; options: string[]; correct: number }[]> = {
  dasturlash: [
    { q: "HTML nima uchun ishlatiladi?", options: ["Sahifa tuzilmasini belgilash", "Ma’lumotlar bazasini boshqarish", "Rasmni tahrirlash"], correct: 0 },
    { q: "Dasturlashda “o‘zgaruvchi” (variable) nima?", options: ["Kompyuter qismi", "Qiymatni saqlaydigan nomlangan joy", "Xato turi"], correct: 1 },
    { q: "`for` sikli nima qiladi?", options: ["Faylni o‘chiradi", "Kodni bir necha marta takrorlaydi", "Saytni internetga chiqaradi"], correct: 1 },
  ],
  video: [
    { q: "Taymlayn (timeline) nima?", options: ["Kliplar vaqt bo‘yicha joylashadigan montaj maydoni", "Video formati", "Kamera turi"], correct: 0 },
    { q: "25 fps nimani bildiradi?", options: ["Soniyasiga 25 kadr", "25 ta fayl", "25 daqiqa"], correct: 0 },
    { q: "Rang korreksiyasining asosiy vazifasi?", options: ["Ovozni tozalash", "Kadrlar rangini to‘g‘rilash va bir-biriga moslash", "Subtitr qo‘shish"], correct: 1 },
  ],
  "3d": [
    { q: "3D modelning eng kichik qismi qaysi?", options: ["Nuqta (vertex)", "Material", "Kamera"], correct: 0 },
    { q: "Render nima?", options: ["Modelni o‘chirish", "3D sahnani yakuniy rasm yoki videoga aylantirish", "Faylni saqlash"], correct: 1 },
    { q: "Blender'da G tugmasi nima qiladi?", options: ["Obyektni siljitadi", "Rang beradi", "Renderni boshlaydi"], correct: 0 },
  ],
  dizayn: [
    { q: "Vektor grafikaning afzalligi?", options: ["Sifat yo‘qotmasdan kattalashtirish mumkin", "Faqat fotosuratlar uchun", "Har doim kichik hajmli"], correct: 0 },
    { q: "Kontrast nima uchun muhim?", options: ["Matn o‘qilishi uchun", "Fayl hajmi uchun", "Faqat bezak uchun"], correct: 0 },
    { q: "Figma asosan nima uchun ishlatiladi?", options: ["Video montaj", "Interfeys dizayni va prototiplar", "Dasturlash"], correct: 1 },
  ],
  marketing: [
    { q: "Maqsadli auditoriya nima?", options: ["Mahsulot mo‘ljallangan odamlar guruhi", "Reklama narxi", "Sayt dizayni"], correct: 0 },
    { q: "CTR nimani o‘lchaydi?", options: ["Bosishlar nisbatini", "Video uzunligini", "Obunachilar yoshini"], correct: 0 },
    { q: "Kontent rejasi nima uchun kerak?", options: ["Muntazam va maqsadli nashr qilish uchun", "Parolni saqlash uchun", "Kerak emas"], correct: 0 },
  ],
  karyera: [
    { q: "Portfolio nima?", options: ["Ishlaringiz to‘plami", "Bank hisobi", "Dastur nomi"], correct: 0 },
    { q: "AI javobini nima qilish kerak?", options: ["Har doim ko‘r-ko‘rona ishonish", "Muhim faktlarni tekshirish", "Hech qachon ishlatmaslik"], correct: 1 },
    { q: "Frilansda narx belgilashda nima muhim?", options: ["Vaqt, murakkablik va bozor narxi", "Faqat buyurtmachi aytgani", "Tasodifiy son"], correct: 0 },
  ],
};

export function Assessment({ categories, paths, loggedIn }: { categories: Cat[]; paths: PathInfo[]; loggedIn: boolean }) {
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [experience, setExperience] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([-1, -1, -1]);
  const [goal, setGoal] = useState<string>(GOALS[0]);
  const [time, setTime] = useState<number>(5);
  const [saved, setSaved] = useState<boolean | null>(null);
  const [pending, start] = useTransition();

  const primary = interests[0] ?? "dasturlash";
  const checks = CHECKS[primary] ?? CHECKS.dasturlash;
  const score = answers.reduce((a, v, i) => a + (v === checks[i]?.correct ? 1 : 0), 0);

  const level = useMemo(() => {
    let l = experience ?? 1;
    if (score === 3 && l >= 2) l += 1;
    if (score <= 1 && l >= 2) l -= 1;
    return Math.max(1, Math.min(5, l));
  }, [experience, score]);

  const recommendation = useMemo(() => {
    const scored = paths
      .map((p) => ({ p, s: p.steps.filter((x) => interests.includes(x.category)).length * 2 + (interests.includes(p.steps[0]?.category) ? 3 : 0) }))
      .sort((a, b) => b.s - a.s);
    const path = scored[0]?.p ?? paths[0];
    const start =
      path?.steps.find((x) => x.level >= Math.min(level, 3) && x.status === "published") ??
      path?.steps.find((x) => x.status === "published") ??
      path?.steps[0];
    return { path, start, alternatives: scored.slice(1, 3).map((x) => x.p) };
  }, [paths, interests, level]);

  const steps = ["Qiziqishlar", "Tajriba", "Bilim tekshiruvi", "Maqsad", "Natija"];
  const canNext = step === 0 ? interests.length > 0 : step === 1 ? experience !== null : step === 2 ? answers.every((a) => a >= 0) : true;

  const next = () => {
    if (step === 3) {
      start(async () => {
        const res = await saveAssessmentAction({ level, interests, goal, weeklyGoal: time });
        setSaved("saved" in res ? Boolean(res.saved) : false);
        setStep(4);
      });
    } else setStep((s) => s + 1);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <ol className="mb-10 flex items-center gap-2" aria-label="Bosqichlar">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 flex-col gap-2">
            <span className={cn("h-1 rounded-full transition-colors duration-500", i <= step ? "bg-fg" : "bg-fg/10")} />
            <span className={cn("hidden text-[11.5px] sm:block", i === step ? "text-fg" : "text-fg-subtle")}>{s}</span>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
          {step === 0 && (
            <fieldset>
              <legend className="text-[26px] font-semibold tracking-[-0.025em] sm:text-[32px]">Sizni nima qiziqtiradi?</legend>
              <p className="mt-2 text-[15px] text-fg-muted">Bir yoki bir nechta yo‘nalishni tanlang. Birinchi tanlovingiz asosiy hisoblanadi.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {categories.map((c) => {
                  const on = interests.includes(c.slug);
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => setInterests((p) => (on ? p.filter((x) => x !== c.slug) : [...p, c.slug]))}
                      aria-pressed={on}
                      className={cn("flex items-center gap-3 rounded-2xl border p-4 text-left transition-all", on ? "border-transparent shadow-[0_0_0_2px_var(--fg)]" : "border-border hover:border-border-strong")}
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: tint(c.color, 12), color: colorVar[c.color] }}>
                        <Icon name={c.icon} className="h-5 w-5" />
                      </span>
                      <span className="flex-1 text-[15px] font-medium">{c.title}</span>
                      {on && <span className="grid h-6 w-6 place-items-center rounded-full bg-fg text-bg"><Check className="h-3.5 w-3.5" /></span>}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset>
              <legend className="text-[26px] font-semibold tracking-[-0.025em] sm:text-[32px]">Bu sohada tajribangiz qanday?</legend>
              <p className="mt-2 text-[15px] text-fg-muted">Asosiy yo‘nalish: {categories.find((c) => c.slug === primary)?.title}</p>
              <div className="mt-8 space-y-2.5">
                {EXPERIENCE.map((e) => (
                  <button key={e.v} type="button" onClick={() => setExperience(e.v)} aria-pressed={experience === e.v} className={cn("flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all", experience === e.v ? "border-transparent shadow-[0_0_0_2px_var(--fg)]" : "border-border hover:border-border-strong")}>
                    <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border-2", experience === e.v ? "border-fg" : "border-border-strong")}>
                      {experience === e.v && <span className="h-2.5 w-2.5 rounded-full bg-fg" />}
                    </span>
                    <span>
                      <span className="block text-[15px] font-medium">{e.label}</span>
                      <span className="block text-[13.5px] text-fg-muted">{e.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-[26px] font-semibold tracking-[-0.025em] sm:text-[32px]">Qisqa bilim tekshiruvi</h2>
              <p className="mt-2 text-[15px] text-fg-muted">Bilmasangiz, taxmin qiling — bu imtihon emas, faqat darajani aniqlashtirish uchun.</p>
              <div className="mt-8 space-y-6">
                {checks.map((c, qi) => (
                  <fieldset key={qi}>
                    <legend className="mb-3 text-[16px] font-medium">{qi + 1}. {c.q}</legend>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {c.options.map((o, oi) => (
                        <button key={oi} type="button" onClick={() => setAnswers((p) => p.map((v, k) => (k === qi ? oi : v)))} aria-pressed={answers[qi] === oi} className={cn("rounded-xl border px-3 py-3 text-left text-[14px] transition-all", answers[qi] === oi ? "border-transparent bg-fg text-bg" : "border-border hover:border-border-strong")}>
                          {o}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <fieldset>
                <legend className="text-[26px] font-semibold tracking-[-0.025em] sm:text-[32px]">Maqsadingiz nima?</legend>
                <div className="mt-6 flex flex-wrap gap-2">
                  {GOALS.map((g) => (
                    <button key={g} type="button" onClick={() => setGoal(g)} aria-pressed={goal === g} className={cn("h-10 rounded-xl border px-4 text-[14px] transition-all", goal === g ? "border-transparent bg-fg text-bg" : "border-border hover:border-border-strong")}>
                      {g}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-[18px] font-semibold">O‘qishga qancha vaqt ajrata olasiz?</legend>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {TIME.map((t) => (
                    <button key={t.v} type="button" onClick={() => setTime(t.v)} aria-pressed={time === t.v} className={cn("rounded-xl border px-4 py-3 text-left text-[14px] transition-all", time === t.v ? "border-transparent shadow-[0_0_0_2px_var(--fg)]" : "border-border hover:border-border-strong")}>
                      {t.label}
                      <span className="block text-[12.5px] text-fg-subtle">Haftalik maqsad: {t.v} ta dars</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {step === 4 && recommendation.path && (
            <div>
              <Sparkles className="h-8 w-8 text-accent" />
              <h2 className="mt-4 text-[26px] font-semibold tracking-[-0.025em] sm:text-[34px]">Sizning natijangiz</h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-surface p-5">
                  <p className="text-[13px] text-fg-muted">Taxminiy darajangiz</p>
                  <p className="mt-1 text-[22px] font-semibold">{level} · {levelName(level)}</p>
                  <p className="mt-1 text-[13px] text-fg-subtle">Bilim tekshiruvi: {score}/3</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-5">
                  <p className="text-[13px] text-fg-muted">Haftalik maqsad</p>
                  <p className="mt-1 text-[22px] font-semibold">{time} ta dars</p>
                  <p className="mt-1 text-[13px] text-fg-subtle">{goal}</p>
                </div>
              </div>
              <Link href={`/yollar/${recommendation.path.slug}`} className="mt-3 flex items-center gap-4 rounded-2xl border border-border-strong bg-surface p-5 transition-colors hover:bg-elevated">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl" style={{ background: tint(recommendation.path.color, 12), color: colorVar[recommendation.path.color] }}>
                  <Icon name={recommendation.path.icon} className="h-6 w-6" />
                </span>
                <span className="flex-1">
                  <span className="block text-[12.5px] text-fg-subtle">Tavsiya etilgan o‘quv yo‘li</span>
                  <span className="block text-[18px] font-semibold">{recommendation.path.title}</span>
                  <span className="block text-[13.5px] text-fg-muted">{recommendation.path.subtitle}</span>
                </span>
                <ArrowRight className="h-5 w-5 text-fg-subtle" />
              </Link>
              {recommendation.start && (
                <Link href={`/kurslar/${recommendation.start.slug}`} className="mt-3 flex items-center justify-between gap-4 rounded-2xl bg-fg p-5 text-bg">
                  <span>
                    <span className="block text-[12.5px] opacity-70">Boshlash uchun kurs</span>
                    <span className="block text-[17px] font-semibold">{recommendation.start.title}</span>
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              )}
              {recommendation.alternatives.length > 0 && (
                <div className="mt-6">
                  <p className="mb-2 text-[13px] text-fg-muted">Boshqa mos yo‘llar:</p>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.alternatives.map((p) => (
                      <Link key={p.slug} href={`/yollar/${p.slug}`} className="rounded-lg border border-border px-3 py-1.5 text-[13.5px] hover:border-border-strong">{p.title}</Link>
                    ))}
                  </div>
                </div>
              )}
              <p className="mt-8 rounded-xl border border-border p-4 text-[13.5px] text-fg-muted">
                {saved ? (
                  <>Natijalar profilingizga saqlandi. <Link href="/kabinet" className="font-medium text-fg underline underline-offset-4">Kabinetga o‘tish →</Link></>
                ) : loggedIn ? (
                  "Natijani saqlab bo‘lmadi. Keyinroq qayta urinib ko‘ring."
                ) : (
                  <>Natijani saqlash va progressni kuzatish uchun <Link href="/royxatdan-otish?next=/baholash" className="font-medium text-fg underline underline-offset-4">bepul ro‘yxatdan o‘ting</Link>.</>
                )}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {step < 4 && (
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="inline-flex h-11 items-center gap-2 rounded-xl px-4 text-[14px] text-fg-muted hover:text-fg disabled:opacity-0">
            <ArrowLeft className="h-4 w-4" /> Orqaga
          </button>
          <button onClick={next} disabled={!canNext || pending} className="inline-flex h-11 items-center gap-2 rounded-xl bg-fg px-6 text-[14px] font-medium text-bg disabled:opacity-40">
            {step === 3 ? (pending ? "Hisoblanmoqda…" : "Natijani ko‘rish") : "Davom etish"} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
