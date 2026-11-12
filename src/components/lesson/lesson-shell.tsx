"use client";

import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, CircleDashed, FileQuestion, Lock, PanelLeft, PlayCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useLocalFlag } from "@/lib/use-local-flag";
import { ThemeToggle } from "@/components/ui/theme";
import { LogoMark } from "@/components/layout/logo";
import type { TocItem } from "./lesson-content";

export type NavModule = {
  id: string;
  title: string;
  lessons: { id: string; slug: string; title: string; durationMin: number; status: string; completed: boolean; locked: boolean }[];
  quiz: { id: string; title: string; passed: boolean } | null;
};

export function LessonShell({
  courseSlug,
  courseTitle,
  currentLessonId,
  modules,
  finalQuiz,
  percent,
  toc,
  prevHref,
  nextHref,
  children,
}: {
  courseSlug: string;
  courseTitle: string;
  currentLessonId: string;
  modules: NavModule[];
  finalQuiz: { id: string; title: string; passed: boolean } | null;
  percent: number;
  toc: TocItem[];
  prevHref: string | null;
  nextHref: string | null;
  children: ReactNode;
}) {
  const [sidebar, setSidebarFlag] = useLocalFlag("dch-sidebar", true);
  const [drawer, setDrawer] = useState(false);
  const [active, setActive] = useState<string | null>(toc[0]?.id ?? null);
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const reading = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  const toggleSidebar = () => setSidebarFlag(!sidebar);

  // Dars ichidagi o‘qish joyini eslab qolish va tiklash
  useEffect(() => {
    const key = `dch-scroll:${currentLessonId}`;
    try {
      const saved = Number(localStorage.getItem(key));
      if (saved > 200 && !location.hash) requestAnimationFrame(() => window.scrollTo({ top: saved }));
    } catch {
      /* */
    }
    let t: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        try {
          localStorage.setItem(key, String(Math.round(window.scrollY)));
        } catch {
          /* */
        }
      }, 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, [currentLessonId]);

  // Mundarija uchun scrollspy
  useEffect(() => {
    const els = toc.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [toc]);

  // Klaviatura: Alt + ← / → — oldingi/keyingi dars
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (e.key === "ArrowRight" && nextHref) router.push(nextHref);
      if (e.key === "ArrowLeft" && prevHref) router.push(prevHref);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextHref, prevHref, router]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const nav = <CurriculumNav courseSlug={courseSlug} modules={modules} finalQuiz={finalQuiz} currentLessonId={currentLessonId} onNavigate={() => setDrawer(false)} />;

  return (
    <div className="min-h-dvh">
      <header className="glass sticky top-0 z-40 border-b border-border">
        <motion.div className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-accent to-teal" style={{ scaleX: reading }} aria-hidden />
        <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
          <Link href={`/kurslar/${courseSlug}`} className="grid h-9 w-9 place-items-center rounded-lg text-fg-muted hover:bg-fg/5 hover:text-fg" aria-label="Kurs sahifasiga qaytish">
            <ArrowLeft className="h-[18px] w-[18px]" />
          </Link>
          <button onClick={toggleSidebar} className="hidden h-9 w-9 place-items-center rounded-lg text-fg-muted hover:bg-fg/5 hover:text-fg lg:grid" aria-label="Dars ro‘yxatini ko‘rsatish/yashirish" aria-pressed={sidebar}>
            <PanelLeft className="h-[18px] w-[18px]" />
          </button>
          <button onClick={() => setDrawer(true)} className="grid h-9 w-9 place-items-center rounded-lg text-fg-muted hover:bg-fg/5 hover:text-fg lg:hidden" aria-label="Dars ro‘yxatini ochish">
            <PanelLeft className="h-[18px] w-[18px]" />
          </button>
          <Link href="/" className="ml-1 hidden sm:block" aria-label="Bosh sahifa">
            <LogoMark size={24} />
          </Link>
          <p className="min-w-0 flex-1 truncate pl-1 text-[14px] font-medium">{courseTitle}</p>
          <div className="hidden items-center gap-2.5 sm:flex">
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-fg/10" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Kurs progressi">
              <div className="h-full rounded-full bg-gradient-to-r from-accent to-teal transition-[width] duration-700" style={{ width: `${percent}%` }} />
            </div>
            <span className="font-mono text-[12px] tabular-nums text-fg-muted">{percent}%</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex">
        <aside
          className={cn(
            "sticky top-14 hidden h-[calc(100dvh-56px)] shrink-0 overflow-y-auto border-r border-border transition-[width,opacity] duration-300 lg:block",
            sidebar ? "w-[320px] opacity-100" : "w-0 overflow-hidden border-r-0 opacity-0",
          )}
          aria-label="Kurs dasturi"
        >
          <div className="w-[320px]">{nav}</div>
        </aside>

        <AnimatePresence>
          {drawer && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div className="absolute inset-0 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
              <motion.aside
                className="absolute inset-y-0 left-0 w-[86%] max-w-[360px] overflow-y-auto border-r border-border bg-bg"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 380, damping: 38 }}
                aria-label="Kurs dasturi"
              >
                <div className="flex items-center justify-between border-b border-border p-3">
                  <span className="text-[14px] font-medium">Kurs dasturi</span>
                  <button onClick={() => setDrawer(false)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-fg/5" aria-label="Yopish">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {nav}
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        <main id="asosiy" className="min-w-0 flex-1">
          <div className="mx-auto flex max-w-[1100px] gap-10 px-4 pb-28 pt-8 sm:px-8 sm:pt-12">
            <div className="min-w-0 max-w-[760px] flex-1">{children}</div>
            {toc.length > 2 && (
              <nav className="sticky top-24 hidden h-fit w-[200px] shrink-0 xl:block" aria-label="Ushbu darsda">
                <p className="eyebrow mb-3">Ushbu darsda</p>
                <ul className="space-y-0.5 border-l border-border">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        className={cn(
                          "-ml-px block border-l py-1.5 pl-3 text-[13px] transition-colors",
                          active === t.id ? "border-fg font-medium text-fg" : "border-transparent text-fg-subtle hover:text-fg-muted",
                        )}
                      >
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </main>
      </div>

      {/* Mobil pastki navigatsiya */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-border bg-bg/92 px-3 py-2 pb-[calc(8px+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden" aria-label="Darslar bo‘yicha harakat">
        {prevHref ? (
          <Link href={prevHref} className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border-strong text-[14px]">
            <ChevronLeft className="h-4 w-4" /> Oldingi
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {nextHref ? (
          <Link href={nextHref} className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-fg text-[14px] font-medium text-bg">
            Keyingi <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </nav>
    </div>
  );
}

function CurriculumNav({
  courseSlug,
  modules,
  finalQuiz,
  currentLessonId,
  onNavigate,
}: {
  courseSlug: string;
  modules: NavModule[];
  finalQuiz: { id: string; title: string; passed: boolean } | null;
  currentLessonId: string;
  onNavigate: () => void;
}) {
  return (
    <div className="p-3">
      {modules.map((m, mi) => (
        <div key={m.id} className="mb-4">
          <p className="px-2 pb-1.5 pt-2 text-[11.5px] font-medium uppercase tracking-wider text-fg-subtle">
            {mi + 1}. {m.title}
          </p>
          <ul>
            {m.lessons.map((l) => {
              const current = l.id === currentLessonId;
              const icon = l.completed ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              ) : l.status === "planned" ? (
                <CircleDashed className="h-4 w-4 shrink-0 text-fg-subtle" />
              ) : l.locked ? (
                <Lock className="h-4 w-4 shrink-0 text-fg-subtle" />
              ) : (
                <PlayCircle className={cn("h-4 w-4 shrink-0", current ? "text-accent" : "text-fg-subtle")} />
              );
              const body = (
                <>
                  {icon}
                  <span className="min-w-0 flex-1 truncate">{l.title}</span>
                  <span className="shrink-0 font-mono text-[11px] text-fg-subtle">{l.status === "planned" ? "tez orada" : `${l.durationMin}′`}</span>
                </>
              );
              return (
                <li key={l.id}>
                  {l.status === "published" ? (
                    <Link
                      href={`/kurslar/${courseSlug}/dars/${l.slug}`}
                      onClick={onNavigate}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13.5px] transition-colors",
                        current ? "bg-fg/[0.07] font-medium text-fg" : "text-fg-muted hover:bg-fg/[0.04] hover:text-fg",
                      )}
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2.5 px-2 py-2 text-[13.5px] text-fg-subtle">{body}</div>
                  )}
                </li>
              );
            })}
            {m.quiz && (
              <li>
                <Link href={`/kurslar/${courseSlug}/test/${m.quiz.id}`} onClick={onNavigate} className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13.5px] text-fg-muted hover:bg-fg/[0.04] hover:text-fg">
                  {m.quiz.passed ? <CheckCircle2 className="h-4 w-4 text-success" /> : <FileQuestion className="h-4 w-4 text-fg-subtle" />}
                  <span className="truncate">{m.quiz.title}</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      ))}
      {finalQuiz && (
        <Link href={`/kurslar/${courseSlug}/test/${finalQuiz.id}`} onClick={onNavigate} className="mt-2 flex items-center gap-2.5 rounded-xl border border-border px-3 py-3 text-[13.5px] font-medium hover:border-border-strong">
          {finalQuiz.passed ? <CheckCircle2 className="h-4 w-4 text-success" /> : <FileQuestion className="h-4 w-4 text-gold" />}
          {finalQuiz.title}
        </Link>
      )}
    </div>
  );
}
