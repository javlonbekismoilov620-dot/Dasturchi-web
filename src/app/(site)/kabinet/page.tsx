import Link from "next/link";
import { ArrowRight, Award, BookOpenCheck, CheckCircle2, Circle, Compass, Flame, PlayCircle, Sparkles, Target } from "lucide-react";
import { ActivityHeatmap, WeeklyBars } from "@/components/dashboard/charts";
import { CourseCard } from "@/components/course/course-card";
import { CourseCover } from "@/components/course/course-cover";
import { Icon } from "@/components/ui/icon";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, ProgressBar, ProgressRing } from "@/components/ui/primitives";
import { requireUser } from "@/lib/server/auth";
import { getCourseStatsMap } from "@/lib/server/services/content";
import { getDashboard } from "@/lib/server/services/dashboard";
import { colorVar, tint } from "@/lib/colors";
import { cn } from "@/lib/cn";
import { timeAgo } from "@/lib/text";

function greeting() {
  const h = (new Date().getUTCHours() + 5) % 24;
  if (h < 5) return "Xayrli tun";
  if (h < 11) return "Xayrli tong";
  if (h < 18) return "Xayrli kun";
  return "Xayrli kech";
}

const ACTIVITY_LABEL: Record<string, string> = {
  lesson_completed: "Dars yakunlandi",
  quiz_passed: "Testdan o‘tildi",
  course_enrolled: "Kursga yozildingiz",
  course_completed: "Kurs yakunlandi",
  certificate_issued: "Sertifikat olindi",
};

export default async function DashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const user = await requireUser("/kabinet");
  const sp = await searchParams;
  const [d, stats] = await Promise.all([getDashboard(user), getCourseStatsMap()]);
  const weekPct = Math.round((Math.min(d.lessonsThisWeek, user.weeklyGoal) / user.weeklyGoal) * 100);
  const firstName = user.name.split(" ")[0];
  const earned = d.achievements.filter((a) => a.earned).length;

  return (
    <div className="space-y-10">
      {sp.xato === "admin" && (
        <p className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-[14px]">Admin paneliga kirish uchun administrator huquqi kerak.</p>
      )}

      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[15px] text-fg-muted">{greeting()},</p>
            <h1 className="mt-1 text-[34px] font-semibold tracking-[-0.035em] sm:text-[44px]">{firstName}</h1>
            {user.goal && (
              <p className="mt-2 inline-flex items-center gap-2 text-[14px] text-fg-muted">
                <Target className="h-4 w-4" /> Maqsadingiz: {user.goal}
              </p>
            )}
          </div>
          {!user.onboarded && (
            <Link href="/baholash" className="group flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent-soft p-4 transition-colors hover:border-accent/50 md:max-w-sm">
              <Sparkles className="h-5 w-5 shrink-0 text-accent" />
              <span className="text-[14px] leading-snug">
                <span className="font-semibold">Darajangizni aniqlang.</span> 2 daqiqalik savolnoma sizga mos o‘quv yo‘lini tavsiya qiladi.
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </header>

      {/* Davom ettirish */}
      {d.resume ? (
          <Link
            href={`/kurslar/${d.resume.course.slug}/dars/${d.resume.progress.nextLesson!.slug}`}
            className="group relative grid overflow-hidden rounded-3xl border border-border-strong bg-surface transition-shadow hover:shadow-[var(--shadow-lg)] md:grid-cols-[320px_1fr]"
          >
            <CourseCover slug={d.resume.course.slug} accent={d.resume.course.accent} icon={d.resume.course.icon} coverUrl={d.resume.course.coverUrl} className="h-44 md:h-full" />
            <div className="p-6 sm:p-8">
              <p className="eyebrow">O‘qishni davom ettiring</p>
              <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.02em]">{d.resume.progress.nextLesson!.title}</h2>
              <p className="mt-1 text-[14.5px] text-fg-muted">{d.resume.course.title}</p>
              <div className="mt-6 flex items-center gap-4">
                <ProgressBar value={d.resume.progress.percent} color={d.resume.course.accent} className="max-w-xs" />
                <span className="shrink-0 text-[13px] tabular-nums text-fg-muted">
                  {d.resume.progress.completedLessons}/{d.resume.progress.totalLessons} dars
                </span>
              </div>
              <span className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-fg px-5 text-[14px] font-medium text-bg">
                <PlayCircle className="h-4 w-4" /> Davom ettirish
              </span>
            </div>
          </Link>
      ) : (
        d.active.length === 0 && (
          <EmptyState
            icon={<Compass className="h-5 w-5" />}
            title="Hali birorta kursni boshlamadingiz"
            description="Katalogdan kurs tanlang yoki darajangizni aniqlab, tavsiya olingan yo‘ldan boshlang."
            action={
              <div className="flex gap-2">
                <ButtonLink href="/kurslar">Kurslarni ko‘rish</ButtonLink>
                <ButtonLink href="/baholash" variant="secondary">Darajani aniqlash</ButtonLink>
              </div>
            }
          />
        )
      )}

      {/* Ko‘rsatkichlar */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="flex items-center gap-1.5 text-[13px] text-fg-muted"><Flame className="h-4 w-4 text-coral" /> O‘qish seriyasi</p>
          <p className="mt-2 text-[30px] font-semibold tabular-nums tracking-tight">{d.streak.current} <span className="text-[16px] font-normal text-fg-muted">kun</span></p>
          <p className="text-[12.5px] text-fg-subtle">Eng uzun seriya: {d.streak.best} kun{d.streak.activeToday ? " · bugun ✓" : ""}</p>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
          <ProgressRing value={weekPct} size={64} stroke={6} color="teal">{weekPct}%</ProgressRing>
          <div>
            <p className="text-[13px] text-fg-muted">Haftalik maqsad</p>
            <p className="mt-1 text-[20px] font-semibold tabular-nums">{d.lessonsThisWeek} / {user.weeklyGoal} dars</p>
            <Link href="/kabinet/profil" className="text-[12.5px] text-fg-subtle hover:text-fg">Maqsadni o‘zgartirish</Link>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="flex items-center gap-1.5 text-[13px] text-fg-muted"><BookOpenCheck className="h-4 w-4 text-accent" /> Yakunlangan darslar</p>
          <p className="mt-2 text-[30px] font-semibold tabular-nums tracking-tight">{d.lessonsTotal}</p>
          <p className="text-[12.5px] text-fg-subtle">{d.active.length} ta kursda o‘qiyapsiz</p>
        </div>
        <Link href="/kabinet/sertifikatlar" className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-strong">
          <p className="flex items-center gap-1.5 text-[13px] text-fg-muted"><Award className="h-4 w-4 text-gold" /> Sertifikatlar</p>
          <p className="mt-2 text-[30px] font-semibold tabular-nums tracking-tight">{d.certificates.length}</p>
          <p className="text-[12.5px] text-fg-subtle">{d.completed.length} ta kurs yakunlangan</p>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[17px] font-semibold">Haftalik faollik</h2>
            <span className="text-[12.5px] text-fg-subtle">darslar va testlar</span>
          </div>
          <div className="mt-8">
            <WeeklyBars data={d.week} />
          </div>
          <div className="mt-8 border-t border-border pt-6">
            <p className="mb-3 text-[13px] text-fg-muted">Oxirgi 15 hafta</p>
            <ActivityHeatmap data={d.heatmap} />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-[17px] font-semibold">Bugungi vazifalar</h2>
          <ul className="mt-4 space-y-1">
            {d.tasks.map((t) => {
              const inner = (
                <>
                  {t.done ? <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-success" /> : <Circle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-fg-subtle" />}
                  <span className={cn("text-[14px] leading-snug", t.done && "text-fg-muted line-through decoration-fg-subtle/50")}>{t.label}</span>
                </>
              );
              return (
                <li key={t.id}>
                  {t.href && !t.done ? (
                    <Link href={t.href} className="flex items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-fg/[0.04]">{inner}</Link>
                  ) : (
                    <div className="flex items-start gap-3 px-2 py-2.5">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mt-6 border-t border-border pt-5">
            <h3 className="text-[14px] font-semibold">So‘nggi faollik</h3>
            {d.activities.length === 0 ? (
              <p className="mt-2 text-[13.5px] text-fg-subtle">Hali faollik yo‘q.</p>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {d.activities.slice(0, 5).map((a) => (
                  <li key={a.id} className="flex items-start justify-between gap-3 text-[13px]">
                    <span className="min-w-0">
                      <span className="text-fg-muted">{ACTIVITY_LABEL[a.type]}: </span>
                      <span className="truncate">{a.label}</span>
                    </span>
                    <span className="shrink-0 text-fg-subtle">{timeAgo(a.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {d.inProgress.length > 0 && (
        <section>
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-[20px] font-semibold tracking-tight">Faol kurslarim</h2>
            <Link href="/kabinet/kurslarim" className="text-[13.5px] text-fg-muted hover:text-fg">Barchasi →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {d.inProgress.slice(0, 3).map((a) => (
              <CourseCard key={a.course.id} course={a.course} stats={stats.get(a.course.id)} progress={a.progress.percent} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-[20px] font-semibold tracking-tight">Yutuqlar</h2>
          <span className="text-[13px] text-fg-subtle">{earned} / {d.achievements.length}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {d.achievements.map((a) => (
            <div key={a.id} className={cn("rounded-2xl border p-4 transition-colors", a.earned ? "border-border-strong bg-surface" : "border-dashed border-border bg-transparent")}>
              <span className={cn("grid h-10 w-10 place-items-center rounded-xl", a.earned ? "bg-gold/15 text-gold" : "bg-fg/[0.05] text-fg-subtle")}>
                <Icon name={a.icon} className="h-5 w-5" />
              </span>
              <p className={cn("mt-3 text-[14px] font-semibold", !a.earned && "text-fg-muted")}>{a.title}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-fg-subtle">{a.description}</p>
              {!a.earned && <ProgressBar value={(a.progress / a.target) * 100} className="mt-3" color="gold" />}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="mb-5 text-[20px] font-semibold tracking-tight">Siz uchun tavsiyalar</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {d.recommended.map((c) => (
              <CourseCard key={c.id} course={c} stats={stats.get(c.id)} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-[20px] font-semibold tracking-tight">Tavsiya etilgan yo‘llar</h2>
          <div className="space-y-3">
            {d.paths.map((p) => (
              <Link key={p.id} href={`/yollar/${p.slug}`} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-border-strong">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: tint(p.color, 12), color: colorVar[p.color] }}>
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold">{p.title}</span>
                  <span className="block truncate text-[13px] text-fg-muted">{p.subtitle}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-fg-subtle" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
