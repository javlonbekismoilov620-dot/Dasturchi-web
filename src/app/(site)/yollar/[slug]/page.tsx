import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Circle, CircleDot, Flag, Target } from "lucide-react";
import { CourseCover } from "@/components/course/course-cover";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/motion";
import { LevelMeter, ProgressBar, StatusBadge } from "@/components/ui/primitives";
import { colorVar, tint } from "@/lib/colors";
import { cn } from "@/lib/cn";
import { getCurrentUser } from "@/lib/server/auth";
import { getCourseStatsMap, getPathBySlug, listCourses } from "@/lib/server/services/content";
import { getCourseProgress } from "@/lib/server/services/learning";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await getPathBySlug((await params).slug);
  return p ? { title: p.title, description: p.description } : { title: "Yo‘l topilmadi" };
}

export default async function PathPage({ params }: { params: Params }) {
  const { slug } = await params;
  const path = await getPathBySlug(slug);
  if (!path) notFound();
  const [courses, stats, user] = await Promise.all([listCourses(), getCourseStatsMap(), getCurrentUser()]);
  const steps = path.steps
    .map((s) => ({ ...s, course: courses.find((c) => c.slug === s.courseSlug) }))
    .filter((s): s is typeof s & { course: NonNullable<typeof s.course> } => Boolean(s.course));
  const progress = new Map<string, number>();
  if (user) for (const s of steps) progress.set(s.course.id, (await getCourseProgress(user.id, s.course)).percent);
  const currentIdx = steps.findIndex((s) => (progress.get(s.course.id) ?? 0) < 100 && s.course.status === "published");
  const overall = steps.length ? Math.round(steps.reduce((a, s) => a + (progress.get(s.course.id) ?? 0), 0) / steps.length) : 0;

  return (
    <div className="pb-10">
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: `radial-gradient(70% 70% at 80% 0%, ${tint(path.color, 16)}, transparent 70%)` }} aria-hidden />
        <div className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <nav className="mb-6 text-[13px] text-fg-subtle">
              <Link href="/yollar" className="hover:text-fg">O‘quv yo‘llari</Link> / <span className="text-fg-muted">{path.title}</span>
            </nav>
            <span className="grid h-14 w-14 place-items-center rounded-2xl border" style={{ color: colorVar[path.color], background: tint(path.color, 10), borderColor: tint(path.color, 25) }}>
              <Icon name={path.icon} className="h-6 w-6" />
            </span>
            <h1 className="mt-6 text-balance text-[36px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[54px]">{path.title}</h1>
            <p className="mt-3 text-[18px] text-fg-muted">{path.subtitle}</p>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-fg-muted">{path.description}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="eyebrow mb-4 flex items-center gap-1.5"><Target className="h-3.5 w-3.5" /> Yo‘l oxirida siz</h2>
            <ul className="space-y-3">
              {path.outcomes.map((o) => (
                <li key={o} className="flex gap-2.5 text-[14.5px] leading-relaxed">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: colorVar[path.color] }} />
                  {o}
                </li>
              ))}
            </ul>
            {user && (
              <div className="mt-6 space-y-2 border-t border-border pt-5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-fg-muted">Umumiy progress</span>
                  <span className="font-medium tabular-nums">{overall}%</span>
                </div>
                <ProgressBar value={overall} color={path.color} />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container-page py-14">
        <h2 className="mb-10 text-[24px] font-semibold tracking-[-0.02em]">Yo‘l xaritasi</h2>
        <ol className="relative">
          <span className="absolute bottom-8 left-[19px] top-8 w-px bg-gradient-to-b from-border-strong via-border-strong to-transparent sm:left-[27px]" aria-hidden />
          {steps.map((s, i) => {
            const pct = progress.get(s.course.id) ?? 0;
            const done = pct >= 100;
            const current = i === currentIdx;
            const st = stats.get(s.course.id);
            return (
              <Reveal key={s.course.id} delay={0.03 * i}>
                <li className="relative grid grid-cols-[40px_1fr] gap-4 pb-8 sm:grid-cols-[56px_1fr] sm:gap-6">
                  <span
                    className={cn(
                      "relative z-10 grid h-10 w-10 place-items-center rounded-full border bg-elevated sm:h-14 sm:w-14",
                      current ? "border-transparent shadow-[0_0_0_4px_var(--accent-soft)]" : "border-border-strong",
                    )}
                    style={current ? { background: colorVar[path.color], color: "white" } : undefined}
                  >
                    {done ? <CheckCircle2 className="h-5 w-5 text-success" /> : current ? <CircleDot className="h-5 w-5" /> : <Circle className="h-4 w-4 text-fg-subtle" />}
                  </span>
                  <Link href={`/kurslar/${s.course.slug}`} className={cn("group grid overflow-hidden rounded-2xl border bg-surface transition-colors hover:border-border-strong sm:grid-cols-[200px_1fr]", current ? "border-border-strong" : "border-border")}>
                    <CourseCover slug={s.course.slug} accent={s.course.accent} icon={s.course.icon} coverUrl={s.course.coverUrl} size="sm" className="hidden h-full min-h-[140px] sm:block" />
                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[12px] text-fg-subtle">{String(i + 1).padStart(2, "0")}-bosqich</span>
                        <StatusBadge status={s.course.status} />
                        {current && <span className="text-[12px] font-medium" style={{ color: colorVar[path.color] }}>← Siz shu yerdasiz</span>}
                      </div>
                      <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.015em]">{s.course.title}</h3>
                      <p className="mt-1 text-[14px] text-fg-muted">{s.note}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-[12.5px] text-fg-subtle">
                        <LevelMeter level={s.course.level} />
                        <span>{st?.publishedCount ?? 0} dars tayyor</span>
                      </div>
                      {user && pct > 0 && <ProgressBar value={pct} color={s.course.accent} className="mt-4" />}
                    </div>
                  </Link>
                </li>
              </Reveal>
            );
          })}
          <li className="relative grid grid-cols-[40px_1fr] items-center gap-4 sm:grid-cols-[56px_1fr] sm:gap-6">
            <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-border-strong bg-elevated sm:h-14 sm:w-14">
              <Flag className="h-4 w-4 text-gold" />
            </span>
            <p className="text-[15px] font-medium">Maqsad: {path.title}</p>
          </li>
        </ol>
      </div>
    </div>
  );
}
