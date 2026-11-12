import Link from "next/link";
import { ArrowUpRight, BadgeCheck, BookText, Compass, Gauge, Languages, MonitorSmartphone, MousePointerClick, ScrollText } from "lucide-react";
import type { Category, Course } from "@/lib/types";
import { colorVar, tint } from "@/lib/colors";
import { Icon } from "@/components/ui/icon";
import { Reveal, SpotlightCard, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";

/* ── Dasturlar lentasi ─────────────────────────────────────── */
export function ToolsMarquee({ tools }: { tools: string[] }) {
  const row = [...tools, ...tools];
  return (
    <section className="relative border-y border-border py-6" aria-label="O‘rganiladigan dasturlar va texnologiyalar">
      <p className="container-page eyebrow mb-4 text-center">Kurslarda o‘rganiladigan dasturlar va texnologiyalar</p>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <ul className="flex w-max animate-[var(--animate-marquee)] gap-10 group-hover:[animation-play-state:paused]">
          {row.map((t, i) => (
            <li key={`${t}-${i}`} className="flex items-center gap-10 whitespace-nowrap text-[20px] font-medium tracking-[-0.02em] text-fg-subtle sm:text-[24px]" aria-hidden={i >= tools.length}>
              {t}
              <span className="h-1.5 w-1.5 rotate-45 bg-fg/20" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Yo‘nalishlar ──────────────────────────────────────────── */
export function CategoriesSection({ categories, counts }: { categories: Category[]; counts: Record<string, { courses: number; lessons: number }> }) {
  return (
    <section className="container-page py-24 sm:py-32" id="yonalishlar">
      <Reveal>
        <SectionHeading
          eyebrow="Yo‘nalishlar"
          title={
            <>
              Bir platformada — <span className="font-display-italic text-fg-muted">butun raqamli kasblar olami</span>
            </>
          }
          description="Har bir yo‘nalish mutlaqo boshlang‘ich darajadan boshlanadi va bosqichma-bosqich ekspert darajasigacha olib boradi."
          action={
            <ButtonLink href="/yonalishlar" variant="secondary" size="sm">
              Barcha yo‘nalishlar
            </ButtonLink>
          }
        />
      </Reveal>
      <Stagger className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <StaggerItem key={c.id}>
            <SpotlightCard color={colorVar[c.color]} className="h-full rounded-2xl">
              <Link
                href={`/yonalishlar/${c.slug}`}
                className="group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-2xl border border-border bg-surface/80 p-6 transition-colors duration-300 hover:border-border-strong"
              >
                <CategoryMotif color={c.color} index={i} />
                <div
                  className="relative grid h-11 w-11 place-items-center rounded-xl border"
                  style={{ color: colorVar[c.color], background: tint(c.color, 10), borderColor: tint(c.color, 25) }}
                >
                  <Icon name={c.icon} className="h-5 w-5" />
                </div>
                <h3 className="relative mt-auto pt-10 text-[20px] font-semibold tracking-[-0.02em]">{c.title}</h3>
                <p className="relative mt-2 line-clamp-2 text-[14px] leading-relaxed text-fg-muted">{c.description}</p>
                <div className="relative mt-5 flex items-center justify-between text-[12.5px] text-fg-subtle">
                  <span>
                    {counts[c.id]?.courses ?? 0} ta kurs · {counts[c.id]?.lessons ?? 0} ta tayyor dars
                  </span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                </div>
              </Link>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

function CategoryMotif({ color, index }: { color: Category["color"]; index: number }) {
  const c = colorVar[color];
  return (
    <svg className="pointer-events-none absolute -right-6 -top-6 h-48 w-48 opacity-50 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-12 group-hover:scale-110" viewBox="0 0 200 200" aria-hidden>
      <g fill="none" stroke={c} strokeOpacity="0.35">
        {index % 3 === 0 && [0, 1, 2, 3].map((k) => <rect key={k} x={50 - k * 12} y={50 - k * 12} width={100 + k * 24} height={100 + k * 24} rx={14} transform={`rotate(${k * 11} 100 100)`} />)}
        {index % 3 === 1 && [0, 1, 2, 3, 4].map((k) => <circle key={k} cx="120" cy="80" r={20 + k * 18} />)}
        {index % 3 === 2 && (
          <g>
            <path d="M100 20 L120 80 L180 100 L120 120 L100 180 L80 120 L20 100 L80 80 Z" />
            <path d="M43 43 L100 68 L157 43 L132 100 L157 157 L100 132 L43 157 L68 100 Z" />
          </g>
        )}
      </g>
    </svg>
  );
}

/* ── Nega aynan Dasturchi ──────────────────────────────────── */
const FEATURES = [
  { icon: Languages, title: "Tabiiy o‘zbek tilida", text: "Har bir tushuncha sodda o‘zbek tilida tushuntiriladi, inglizcha atamalar esa qavs ichida beriladi — sohada ishlaganda ularni bilishingiz kerak bo‘ladi." },
  { icon: Gauge, title: "5 bosqichli tizim", text: "Kurslar mutlaqo boshlang‘ich darajadan ekspert darajasigacha tartiblangan. Siz doim qaysi bosqichda ekaningizni bilasiz." },
  { icon: BookText, title: "Har bir dars — to‘liq tuzilma", text: "Tushuncha, nega muhimligi, qanday ishlashi, qadamlar, misollar, keng tarqalgan xatolar, maslahatlar, mashq va xulosa." },
  { icon: MousePointerClick, title: "Interaktiv mashg‘ulotlar", text: "Kod muharriri, 3D ko‘rinish, montaj taymlayni va rang korreksiyasi kabi vositalarda bilimni darhol sinab ko‘rasiz." },
  { icon: BadgeCheck, title: "Testlar va sertifikat", text: "Har bir modul testi bilimni mustahkamlaydi. Kursni to‘liq yakunlaganingizda tekshiriladigan sertifikat olasiz." },
  { icon: MonitorSmartphone, title: "Istalgan qurilmada", text: "Telefon, planshet yoki kompyuter — progressingiz saqlanadi va qayerda to‘xtaganingizni platforma eslab qoladi." },
];

export function FeaturesSection() {
  return (
    <section className="container-page py-24 sm:py-32">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow="Nega aynan Dasturchi?"
          title={
            <>
              Ta’lim — bu <span className="font-display-italic">tizim</span>, tasodif emas
            </>
          }
          description="Biz tarqoq videolar emas, balki har bir darsi puxta o‘ylangan, bosqichma-bosqich o‘quv yo‘lini taklif qilamiz."
        />
      </Reveal>
      <Stagger className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <StaggerItem key={f.title} className="bg-bg">
            <div className="group h-full bg-surface/40 p-7 transition-colors duration-300 hover:bg-surface">
              <f.icon className="h-5 w-5 text-fg-muted transition-colors group-hover:text-accent" strokeWidth={1.6} />
              <h3 className="mt-6 text-[16px] font-semibold tracking-[-0.01em]">{f.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-fg-muted">{f.text}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ── Amaliy loyihalar ──────────────────────────────────────── */
export function ProjectsSection({ courses }: { courses: Course[] }) {
  const withProjects = courses.filter((c) => c.finalProject);
  if (!withProjects.length) return null;
  return (
    <section className="container-page py-24 sm:py-32">
      <Reveal>
        <SectionHeading
          eyebrow="Loyihalar va amaliyot"
          title={
            <>
              Har bir kurs — <span className="font-display-italic text-fg-muted">portfolioga qo‘shiladigan loyiha</span>
            </>
          }
          description="Nazariya amaliyotsiz tez unutiladi. Shuning uchun har bir dars mashq bilan, har bir kurs esa real loyiha bilan yakunlanadi."
        />
      </Reveal>
      <Stagger className="mt-12 grid gap-4 md:grid-cols-2">
        {withProjects.slice(0, 4).map((c) => (
          <StaggerItem key={c.id}>
            <Link href={`/kurslar/${c.slug}`} className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-strong sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: tint(c.accent, 12), color: colorVar[c.accent] }}>
                  <ScrollText className="h-4 w-4" />
                </span>
                <span className="text-[13px] text-fg-subtle">{c.title}</span>
              </div>
              <h3 className="mt-6 text-[22px] font-semibold tracking-[-0.02em]">{c.finalProject!.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-fg-muted">{c.finalProject!.description}</p>
              <ul className="mt-6 space-y-2 border-t border-border pt-5">
                {c.finalProject!.deliverables.slice(0, 4).map((d) => (
                  <li key={d} className="flex gap-2.5 text-[13.5px] text-fg-muted">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: colorVar[c.accent] }} />
                    {d}
                  </li>
                ))}
              </ul>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ── Yakuniy chaqiriq ──────────────────────────────────────── */
export function FinalCta() {
  return (
    <section className="container-page py-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-[28px] border border-border-strong bg-surface px-6 py-16 text-center sm:px-12 sm:py-24">
          <div className="girih pointer-events-none absolute inset-0 opacity-[var(--pattern-opacity)] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
          <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_30%,transparent),transparent_70%)] blur-2xl" aria-hidden />
          <Compass className="relative mx-auto h-8 w-8 text-fg-subtle" strokeWidth={1.4} />
          <h2 className="relative mx-auto mt-6 max-w-2xl text-balance text-[32px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[52px]">
            Birinchi darsingiz <span className="font-display-italic">bugun</span> boshlanishi mumkin
          </h2>
          <p className="relative mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-fg-muted">
            Ro‘yxatdan o‘ting, qisqa savolnoma orqali darajangizni aniqlang va sizga mos o‘quv yo‘lini oling.
          </p>
          <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/royxatdan-otish" size="lg">
              Ta’limni boshlash
            </ButtonLink>
            <ButtonLink href="/baholash" size="lg" variant="secondary">
              Darajamni aniqlash
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
