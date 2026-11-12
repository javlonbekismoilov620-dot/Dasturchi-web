"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/button";

const HeroScene = dynamic(() => import("./hero-scene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center">
      <div className="h-1/2 w-1/2 rounded-full bg-[radial-gradient(circle,var(--accent-soft),transparent_70%)] blur-2xl" />
    </div>
  ),
});

const EASE = [0.16, 1, 0.3, 1] as const;

type Stat = { value: number; label: string };

export function Hero({ stats }: { stats: Stat[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  const lines: { words: { t: string; accent?: boolean }[] }[] = [
    { words: [{ t: "Bilimni" }, { t: "o‘zlashtiring." }] },
    { words: [{ t: "Mahorat", accent: true }, { t: "yarating." }] },
    { words: [{ t: "Kelajagingizni" }, { t: "quring." }] },
  ];
  let wi = 0;

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Fon qatlamlari */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="girih absolute inset-0 opacity-[var(--pattern-opacity)] [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]" />
        <div className="absolute -top-40 right-[-10%] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_65%)] blur-2xl" />
        <div className="absolute left-[-15%] top-[30%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--teal)_12%,transparent),transparent_65%)] blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="container-page relative flex min-h-[calc(100dvh-64px)] flex-col justify-center pb-12 pt-10 lg:pb-20 lg:pt-6">
        <div className="relative z-10 max-w-[980px]">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/70 py-1 pl-1 pr-3 text-[12.5px] text-fg-muted backdrop-blur">
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[11.5px] font-medium text-accent">
                <Sparkles className="h-3 w-3" /> O‘zbek tilida
              </span>
              Noldan professional darajagacha
            </span>
          </motion.div>

          <h1 className="mt-7 text-[42px] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-[64px] lg:text-[80px] xl:text-[92px]">
            {lines.map((line, li) => (
              <span key={li} className="block overflow-hidden pb-[0.08em]">
                {line.words.map((w) => {
                  const i = wi++;
                  return (
                    <motion.span
                      key={w.t}
                      className={
                        w.accent
                          ? "font-display-italic mr-[0.22em] inline-block bg-gradient-to-r from-accent via-[color-mix(in_oklab,var(--accent)_50%,var(--teal))] to-teal bg-clip-text pr-[0.06em] text-transparent"
                          : "mr-[0.22em] inline-block"
                      }
                      initial={reduce ? false : { y: "105%", opacity: 0, filter: "blur(8px)" }}
                      animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 1, ease: EASE, delay: 0.25 + i * 0.08 }}
                    >
                      {w.t}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-7 max-w-[34rem] text-pretty text-[17px] leading-relaxed text-fg-muted sm:text-[19px]"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.85 }}
          >
            IT, dizayn, 3D, video montaj va zamonaviy texnologiyalarni mutlaqo noldan professional darajagacha o‘rganing.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1 }}
          >
            <ButtonLink href="/royxatdan-otish" size="lg" className="group">
              Ta’limni boshlash
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="/kurslar" size="lg" variant="secondary">
              Kurslarni ko‘rish
            </ButtonLink>
          </motion.div>

          <motion.dl
            className="mt-12 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6 sm:grid-cols-4"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-[26px] font-semibold tabular-nums tracking-[-0.03em]">{s.value}</dd>
                <dd className="mt-0.5 text-[12.5px] leading-snug text-fg-subtle">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          className="relative -mx-4 order-first -mb-10 h-[300px] sm:h-[420px] lg:absolute lg:inset-y-0 lg:right-[-4%] lg:order-none lg:my-auto lg:mb-0 lg:mx-0 lg:h-[760px] lg:w-[54%] xl:right-[-7%]"
          style={reduce ? undefined : { y: sceneY, opacity: sceneOpacity }}
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
        >
          <HeroScene className="h-full w-full" />
        </motion.div>
      </div>
    </section>
  );
}
