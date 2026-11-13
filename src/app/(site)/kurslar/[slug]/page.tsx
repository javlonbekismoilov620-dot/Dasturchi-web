import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  Clock,
  FileQuestion,
  Layers,
  Lock,
  MousePointerClick,
  PlayCircle,
  Target,
  Users,
} from "lucide-react";
import { CourseCover } from "@/components/course/course-cover";
import { SaveCourseButton, ShareButton } from "@/components/course/course-actions";
import { RichText } from "@/components/lesson/rich-text";
import { Badge, LevelMeter, ProgressBar, StatusBadge } from "@/components/ui/primitives";
import { buttonClass, ButtonLink } from "@/components/ui/button";
import { startCourseAction } from "@/app/actions/learning";
import { getCurrentUser } from "@/lib/server/auth";
import { getCourseBySlug, getCourseStatsMap, getCurriculum, listCategories } from "@/lib/server/services/content";
import { getCourseProgress, isCourseSaved } from "@/lib/server/services/learning";
import { colorVar, tint } from "@/lib/colors";
import { formatMinutes, levelName } from "@/lib/text";
import { cn } from "@/lib/cn";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Kurs topilmadi" };
  return { title: course.title, description: course.subtitle + ". " + course.description.slice(0, 140) };
}

export default async function CoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  const user = await getCurrentUser();
  const course = await getCourseBySlug(slug, user?.role === "admin");
  if (!course) notFound();

  const [curriculum, categories, statsMap] = await Promise.all([getCurriculum(course.id), listCategories(), getCourseStatsMap()]);
  const category = categories.find((c) => c.id === course.categoryId);
  const stats = statsMap.get(course.id);
  const progress = user ? await getCourseProgress(user.id, course) : null;
  const saved = user ? await isCourseSaved(user.id, course.id) : false;
  const totalMinutes = curriculum.publishedLessons.reduce((a, l) => a + l.durationMin, 0);
  const firstPreview = curriculum.publishedLessons.find((l) => l.isPreview);
  const hasLessons = curriculum.publishedLessons.length > 0;
  const startLabel = progress?.isComplete ? "Kursni qayta ko‘rish" : progress?.completedLessons ? "O‘qishni davom ettirish" : "Kursni boshlash";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    inLanguage: "uz",
    provider: { "@type": "Organization", name: "Dasturchi" },
    educationalLevel: levelName(course.level),
    isAccessibleForFree: true,
  };

  return (
    <div className="pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* Kurs sarlavhasi */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: `radial-gradient(80% 60% at 85% 0%, ${tint(course.accent, 16)}, transparent 70%)` }} aria-hidden />
        <div className="girih pointer-events-none absolute inset-0 -z-10 opacity-[var(--pattern-opacity)] [mask-image:radial-gradient(ellipse_at_80%_0%,black,transparent_60%)]" aria-hidden />
        <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <div>
            <nav className="mb-6 flex items-center gap-2 text-[13px] text-fg-subtle" aria-label="Yo‘l">
              <Link href="/kurslar" className="hover:text-fg">Kurslar</Link>
              <span>/</span>
              {category && (
                <Link href={`/yonalishlar/${category.slug}`} className="hover:text-fg">
                  {category.title}
                </Link>
              )}
            </nav>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={course.status} />
              {category && <Badge color={category.color}>{category.title}</Badge>}
              <LevelMeter level={course.level} className="ml-1" />
            </div>
            <h1 className="mt-5 text-balance text-[34px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[52px]">{course.title}</h1>
            <p className="mt-4 text-pretty text-[17px] leading-relaxed text-fg-muted sm:text-[19px]">{course.subtitle}</p>

            <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Layers, label: "Modullar", value: `${curriculum.modules.length}` },
                { icon: BookOpen, label: "Darslar", value: course.status === "preparing" ? `${stats?.publishedCount ?? 0}/${stats?.lessonCount ?? 0}` : `${stats?.publishedCount ?? 0}` },
                { icon: Clock, label: "Davomiyligi", value: course.status === "published" ? `~${course.estimatedHours} soat` : totalMinutes ? formatMinutes(totalMinutes) : "—" },
                { icon: FileQuestion, label: "Testlar", value: `${stats?.quizCount ?? 0}` },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-surface/70 px-4 py-3 backdrop-blur">
                  <dt className="flex items-center gap-1.5 text-[12px] text-fg-subtle">
                    <s.icon className="h-3.5 w-3.5" /> {s.label}
                  </dt>
                  <dd className="mt-1 text-[18px] font-semibold tabular-nums tracking-tight">{s.value}</dd>
                </div>
              ))}
            </dl>

            {course.status === "preparing" && (
              <div className="mt-6 rounded-xl border border-[color-mix(in_oklab,var(--gold)_35%,transparent)] bg-[color-mix(in_oklab,var(--gold)_8%,transparent)] p-4 text-[14px] leading-relaxed">
                <strong className="font-semibold">Kurs tayyorlanmoqda.</strong> O‘quv dasturi to‘liq e’lon qilingan, ammo darslar hali yozilmoqda.
                {stats?.publishedCount ? ` Hozircha ${stats.publishedCount} ta dars tayyor.` : " Hozircha tayyor darslar yo‘q."} Kursni saqlab qo‘ysangiz, kabinetingizda kuzatib borasiz.
              </div>
            )}
          </div>

          <div className="lg:pl-6">
            <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-[var(--shadow-lg)]">
              <CourseCover slug={course.slug} accent={course.accent} icon={course.icon} coverUrl={course.coverUrl} size="lg" className="aspect-[16/10]" title={course.title} />
              <div className="space-y-4 p-5">
                {progress?.enrolled && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-fg-muted">Sizning progressingiz</span>
                      <span className="font-medium tabular-nums">
                        {progress.completedLessons}/{progress.totalLessons} · {progress.percent}%
                      </span>
                    </div>
                    <ProgressBar value={progress.percent} color={course.accent} />
                  </div>
                )}
                {progress?.certificate && (
                  <Link href={`/sertifikat/${progress.certificate.code}`} className="flex items-center gap-2 rounded-xl border border-border bg-bg-subtle p-3 text-[13.5px] hover:border-border-strong">
                    <Award className="h-4 w-4 text-gold" /> Sertifikatingiz tayyor — ko‘rish
                  </Link>
                )}
                <div className="flex gap-2">
                  {hasLessons ? (
                    <form action={startCourseAction.bind(null, course.id)} className="flex-1">
                      <button className={buttonClass("primary", "lg", "w-full")}>
                        <PlayCircle className="h-4 w-4" /> {user ? startLabel : "Boshlash uchun kirish"}
                      </button>
                    </form>
                  ) : (
                    <span className={cn(buttonClass("secondary", "lg", "flex-1"), "pointer-events-none opacity-70")}>Darslar tayyorlanmoqda</span>
                  )}
                  <SaveCourseButton courseId={course.id} initial={saved} loggedIn={Boolean(user)} className="w-auto" />
                  <ShareButton title={course.title} />
                </div>
                {firstPreview && !progress?.enrolled && (
                  <ButtonLink href={`/kurslar/${course.slug}/dars/${firstPreview.slug}`} variant="ghost" size="sm" className="w-full">
                    Bepul namuna darsni ko‘rish
                  </ButtonLink>
                )}
                <ul className="space-y-2 border-t border-border pt-4 text-[13.5px] text-fg-muted">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> To‘liq o‘zbek tilida</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Amaliy mashqlar va testlar</li>
                  {(stats?.interactiveCount ?? 0) > 0 && (
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> {stats!.interactiveCount} ta interaktiv dars</li>
                  )}
                  {course.status === "published" && curriculum.finalQuiz && (
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Yakunlaganda tekshiriladigan sertifikat</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-14 py-14 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-14">
          <section>
            <h2 className="text-[24px] font-semibold tracking-[-0.02em]">Kurs haqida</h2>
            <RichText text={course.description} className="mt-4 text-fg-muted" />
          </section>

          <section>
            <h2 className="text-[24px] font-semibold tracking-[-0.02em]">Nimalarni o‘rganasiz</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {course.objectives.map((o) => (
                <li key={o} className="flex gap-3 rounded-xl border border-border bg-surface p-4 text-[14.5px] leading-relaxed">
                  <Target className="mt-0.5 h-4 w-4 shrink-0" style={{ color: colorVar[course.accent] }} />
                  {o}
                </li>
              ))}
            </ul>
          </section>

          <section id="dastur">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-[24px] font-semibold tracking-[-0.02em]">Kurs dasturi</h2>
              <p className="text-[13.5px] text-fg-muted">
                {curriculum.modules.length} modul · {curriculum.lessons.length} dars
                {totalMinutes ? ` · ${formatMinutes(totalMinutes)}` : ""}
              </p>
            </div>
            <div className="mt-5 space-y-3">
              {curriculum.modules.map((m, mi) => {
                const done = m.lessons.filter((l) => progress?.completedIds.has(l.id)).length;
                return (
                  <details key={m.id} className="group overflow-hidden rounded-2xl border border-border bg-surface" open={mi === 0}>
                    <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border font-mono text-[13px] text-fg-muted">
                        {String(mi + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[16px] font-semibold tracking-[-0.01em]">{m.title}</span>
                        <span className="mt-0.5 block text-[13px] text-fg-subtle">
                          {m.lessons.length} dars{m.minutes ? ` · ${formatMinutes(m.minutes)}` : ""}
                          {m.quiz ? " · test" : ""}
                          {progress?.enrolled && m.lessons.length ? ` · ${done}/${m.lessons.length} bajarildi` : ""}
                        </span>
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-fg-subtle transition-transform duration-300 group-open:rotate-180" />
                    </summary>
                    <div className="border-t border-border">
                      {m.description && <p className="px-5 pt-4 text-[14px] text-fg-muted">{m.description}</p>}
                      <ul className="p-2">
                        {m.lessons.map((l) => {
                          const completed = progress?.completedIds.has(l.id);
                          const accessible = l.status === "published" && (l.isPreview || Boolean(user));
                          const inner = (
                            <>
                              {completed ? (
                                <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-success" />
                              ) : l.status === "planned" ? (
                                <CircleDashed className="h-[18px] w-[18px] shrink-0 text-fg-subtle" />
                              ) : accessible ? (
                                <PlayCircle className="h-[18px] w-[18px] shrink-0 text-fg-muted" />
                              ) : (
                                <Lock className="h-[18px] w-[18px] shrink-0 text-fg-subtle" />
                              )}
                              <span className="min-w-0 flex-1">
                                <span className={cn("block text-[14.5px]", l.status === "planned" && "text-fg-muted")}>{l.title}</span>
                                <span className="block truncate text-[12.5px] text-fg-subtle">{l.summary}</span>
                              </span>
                              <span className="flex shrink-0 items-center gap-2">
                                {l.interactive.length > 0 && <MousePointerClick className="h-3.5 w-3.5 text-fg-subtle" aria-label="Interaktiv" />}
                                {l.isPreview && l.status === "published" && <Badge color="teal">Namuna</Badge>}
                                {l.status === "planned" ? (
                                  <span className="text-[12px] text-fg-subtle">Tayyorlanmoqda</span>
                                ) : (
                                  <span className="font-mono text-[12px] text-fg-subtle">{l.durationMin} daq</span>
                                )}
                              </span>
                            </>
                          );
                          return (
                            <li key={l.id}>
                              {l.status === "published" ? (
                                <Link href={`/kurslar/${course.slug}/dars/${l.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-fg/[0.04]">
                                  {inner}
                                </Link>
                              ) : (
                                <div className="flex items-center gap-3 px-3 py-3">{inner}</div>
                              )}
                            </li>
                          );
                        })}
                        {m.quiz && (
                          <li>
                            <Link href={`/kurslar/${course.slug}/test/${m.quiz.id}`} className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-fg/[0.04]">
                              {progress?.passedQuizIds.has(m.quiz.id) ? (
                                <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-success" />
                              ) : (
                                <FileQuestion className="h-[18px] w-[18px] shrink-0" style={{ color: colorVar[course.accent] }} />
                              )}
                              <span className="flex-1 text-[14.5px] font-medium">{m.quiz.title}</span>
                              <span className="text-[12px] text-fg-subtle">{m.quiz.questionCount} savol</span>
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  </details>
                );
              })}
              {curriculum.finalQuiz && (
                <Link href={`/kurslar/${course.slug}/test/${curriculum.finalQuiz.id}`} className="flex items-center gap-4 rounded-2xl border border-border-strong bg-surface p-5 transition-colors hover:bg-elevated">
                  <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: tint(course.accent, 14), color: colorVar[course.accent] }}>
                    <Award className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[16px] font-semibold">{curriculum.finalQuiz.title}</span>
                    <span className="block text-[13px] text-fg-subtle">
                      {curriculum.finalQuiz.questionCount} savol · o‘tish bali {curriculum.finalQuiz.passingScore}%
                    </span>
                  </span>
                  {progress?.finalPassed && progress.finalQuizId && <CheckCircle2 className="h-5 w-5 text-success" />}
                </Link>
              )}
            </div>
          </section>

          {course.finalProject && (
            <section>
              <h2 className="text-[24px] font-semibold tracking-[-0.02em]">Yakuniy loyiha</h2>
              <div className="mt-5 rounded-2xl border border-border bg-surface p-6">
                <h3 className="text-[19px] font-semibold">{course.finalProject.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{course.finalProject.description}</p>
                <ul className="mt-5 space-y-2">
                  {course.finalProject.deliverables.map((d) => (
                    <li key={d} className="flex gap-2.5 text-[14.5px]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div>
            <h3 className="eyebrow mb-3">Egallanadigan ko‘nikmalar</h3>
            <div className="flex flex-wrap gap-1.5">
              {course.skills.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="eyebrow mb-3">Dasturlar</h3>
            <div className="flex flex-wrap gap-1.5">
              {course.software.map((s) => (
                <Link key={s} href={`/kurslar?dastur=${encodeURIComponent(s)}`} className="rounded-md border border-border px-2 py-1 text-[12.5px] text-fg-muted hover:border-border-strong hover:text-fg">
                  {s}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="eyebrow mb-3">Talablar</h3>
            <ul className="space-y-2 text-[14px] text-fg-muted">
              {course.requirements.map((r) => (
                <li key={r} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-fg-subtle" />{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="eyebrow mb-3 flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Kimlar uchun</h3>
            <ul className="space-y-2 text-[14px] text-fg-muted">
              {course.audience.map((r) => (
                <li key={r} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-fg-subtle" />{r}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="eyebrow mb-3">Muallif</h3>
            <p className="text-[15px] font-semibold">{course.instructor.name}</p>
            <p className="text-[13px] text-fg-subtle">{course.instructor.role}</p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-fg-muted">{course.instructor.bio}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
