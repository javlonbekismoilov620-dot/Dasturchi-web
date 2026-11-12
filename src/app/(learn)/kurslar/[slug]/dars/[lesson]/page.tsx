import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, CircleDashed, Clock, Lock, MousePointerClick } from "lucide-react";
import { LessonContentView, lessonToc } from "@/components/lesson/lesson-content";
import { BookmarkButton, CompleteButton } from "@/components/lesson/lesson-actions";
import { LessonPanels } from "@/components/lesson/lesson-panels";
import { LessonShell, type NavModule } from "@/components/lesson/lesson-shell";
import { VideoPlayer } from "@/components/lesson/video-player";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { getCurrentUser } from "@/lib/server/auth";
import { isAiEnabled } from "@/lib/server/env";
import { getCourseBySlug, getCurriculum, getLesson } from "@/lib/server/services/content";
import { getCourseProgress, getLessonProgress, getNote, isBookmarked, listQuestions, touchLesson } from "@/lib/server/services/learning";

type Params = Promise<{ slug: string; lesson: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, lesson: ls } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Dars topilmadi" };
  const lesson = await getLesson(course.id, ls);
  return lesson ? { title: `${lesson.title} — ${course.title}`, description: lesson.summary } : { title: "Dars topilmadi" };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { slug, lesson: lessonSlug } = await params;
  const user = await getCurrentUser();
  const isAdmin = user?.role === "admin";
  const course = await getCourseBySlug(slug, isAdmin);
  if (!course) notFound();
  const lesson = await getLesson(course.id, lessonSlug);
  if (!lesson || (lesson.status === "draft" && !isAdmin)) notFound();

  const curriculum = await getCurriculum(course.id, isAdmin);
  const progress = user ? await getCourseProgress(user.id, course) : null;
  const canView = lesson.status === "published" && (lesson.isPreview || Boolean(user));

  if (user && canView) await touchLesson(user.id, course, lesson.id);

  const published = curriculum.publishedLessons;
  const idx = published.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? published[idx - 1] : null;
  const next = idx >= 0 && idx < published.length - 1 ? published[idx + 1] : null;
  const href = (s: string) => `/kurslar/${course.slug}/dars/${s}`;
  const currentModule = curriculum.modules.find((m) => m.id === lesson.moduleId);
  const moduleQuiz = currentModule?.quiz;
  const isLastInModule = currentModule ? currentModule.lessons.filter((l) => l.status === "published").at(-1)?.id === lesson.id : false;
  const nextHref = isLastInModule && moduleQuiz ? `/kurslar/${course.slug}/test/${moduleQuiz.id}` : next ? href(next.slug) : curriculum.finalQuiz ? `/kurslar/${course.slug}/test/${curriculum.finalQuiz.id}` : null;

  const modules: NavModule[] = curriculum.modules.map((m) => ({
    id: m.id,
    title: m.title,
    quiz: m.quiz ? { id: m.quiz.id, title: m.quiz.title, passed: Boolean(progress?.passedQuizIds.has(m.quiz.id)) } : null,
    lessons: m.lessons.map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      durationMin: l.durationMin,
      status: l.status,
      completed: Boolean(progress?.completedIds.has(l.id)),
      locked: !user && !l.isPreview,
    })),
  }));

  const toc = canView ? lessonToc(lesson) : [];
  const loginHref = `/kirish?next=${encodeURIComponent(href(lesson.slug))}`;

  const [lp, note, bookmarked, questions] = user && canView
    ? await Promise.all([getLessonProgress(user.id, lesson.id), getNote(user.id, lesson.id), isBookmarked(user.id, lesson.id), listQuestions(lesson.id)])
    : [null, null, false, []];

  return (
    <LessonShell
      courseSlug={course.slug}
      courseTitle={course.title}
      currentLessonId={lesson.id}
      modules={modules}
      finalQuiz={curriculum.finalQuiz ? { id: curriculum.finalQuiz.id, title: curriculum.finalQuiz.title, passed: Boolean(progress?.finalPassed && progress.finalQuizId) } : null}
      percent={progress?.percent ?? 0}
      toc={toc}
      prevHref={prev ? href(prev.slug) : null}
      nextHref={nextHref}
    >
      <article>
        <header className="mb-10">
          <p className="eyebrow">{currentModule ? `${curriculum.modules.indexOf(currentModule) + 1}-modul · ${currentModule.title}` : course.title}</p>
          <h1 className="mt-3 text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[44px]">{lesson.title}</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-fg-muted">{lesson.summary}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-[13px] text-fg-subtle">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {lesson.durationMin} daqiqa</span>
            {idx >= 0 && <span>{idx + 1}/{published.length}-dars</span>}
            {lesson.interactive.length > 0 && (
              <span className="inline-flex items-center gap-1.5"><MousePointerClick className="h-3.5 w-3.5" /> Interaktiv</span>
            )}
            {lesson.isPreview && <Badge color="teal">Bepul namuna</Badge>}
            {lesson.status === "draft" && <Badge color="gold">Qoralama (faqat admin ko‘radi)</Badge>}
            {canView && (
              <span className="ml-auto">
                <BookmarkButton lessonId={lesson.id} initial={bookmarked} loggedIn={Boolean(user)} />
              </span>
            )}
          </div>
        </header>

        {lesson.status === "planned" ? (
          <div className="rounded-2xl border border-dashed border-border-strong p-10 text-center">
            <CircleDashed className="mx-auto h-8 w-8 text-fg-subtle" />
            <h2 className="mt-4 text-[20px] font-semibold">Bu dars tayyorlanmoqda</h2>
            <p className="mx-auto mt-2 max-w-md text-[15px] text-fg-muted">Dars mavzusi kurs dasturida e’lon qilingan, lekin uning matni hali yozilmoqda. Tayyor bo‘lishi bilan shu yerda paydo bo‘ladi.</p>
            <ButtonLink href={`/kurslar/${course.slug}`} variant="secondary" className="mt-6">Kurs sahifasiga qaytish</ButtonLink>
          </div>
        ) : !canView ? (
          <div className="relative overflow-hidden rounded-2xl border border-border-strong bg-surface p-10 text-center">
            <div className="girih pointer-events-none absolute inset-0 opacity-[var(--pattern-opacity)]" aria-hidden />
            <Lock className="relative mx-auto h-8 w-8 text-fg-subtle" />
            <h2 className="relative mt-4 text-[22px] font-semibold tracking-tight">Darsni ko‘rish uchun tizimga kiring</h2>
            <p className="relative mx-auto mt-2 max-w-md text-[15px] text-fg-muted">Ro‘yxatdan o‘tish bepul. Hisobingizda progress, qaydlar va test natijalari saqlanadi.</p>
            <div className="relative mt-6 flex flex-col justify-center gap-2 sm:flex-row">
              <ButtonLink href={`/royxatdan-otish?next=${encodeURIComponent(href(lesson.slug))}`} size="lg">Bepul ro‘yxatdan o‘tish</ButtonLink>
              <ButtonLink href={loginHref} size="lg" variant="secondary">Kirish</ButtonLink>
            </div>
          </div>
        ) : (
          <>
            {lesson.video && (
              <div className="mb-12">
                <VideoPlayer video={lesson.video} lessonId={lesson.id} startAt={lp?.videoPosition ?? 0} title={lesson.title} />
              </div>
            )}
            <LessonContentView lesson={lesson} />

            <div className="mt-16 rounded-2xl border border-border-strong bg-surface p-6 sm:p-8">
              <h2 className="text-[20px] font-semibold tracking-tight">Darsni tugatdingizmi?</h2>
              <p className="mt-1.5 text-[15px] text-fg-muted">
                Mashqni bajarib bo‘lgach, darsni yakunlangan deb belgilang — progressingiz saqlanadi.
                {isLastInModule && moduleQuiz ? " Keyingi qadam — modul testi." : ""}
              </p>
              <div className="mt-5">
                <CompleteButton lessonId={lesson.id} initial={Boolean(lp?.completed)} loggedIn={Boolean(user)} nextHref={nextHref} size="lg" />
              </div>
            </div>

            <div className="mt-10">
              <LessonPanels
                lessonId={lesson.id}
                lessonTitle={lesson.title}
                loggedIn={Boolean(user)}
                userId={user?.id ?? null}
                isAdmin={isAdmin}
                initialNote={note?.body ?? ""}
                questions={questions}
                aiEnabled={isAiEnabled()}
                loginHref={loginHref}
              />
            </div>
          </>
        )}

        <nav className="mt-12 hidden grid-cols-2 gap-3 lg:grid" aria-label="Darslar orasida harakat">
          {prev ? (
            <Link href={href(prev.slug)} className="group rounded-2xl border border-border p-5 transition-colors hover:border-border-strong">
              <span className="flex items-center gap-1 text-[12.5px] text-fg-subtle"><ChevronLeft className="h-3.5 w-3.5" /> Oldingi dars</span>
              <span className="mt-1 block truncate text-[15px] font-medium">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {nextHref ? (
            <Link href={nextHref} className="group rounded-2xl border border-border p-5 text-right transition-colors hover:border-border-strong">
              <span className="flex items-center justify-end gap-1 text-[12.5px] text-fg-subtle">
                {isLastInModule && moduleQuiz ? "Modul testi" : next ? "Keyingi dars" : "Yakuniy imtihon"} <ChevronRight className="h-3.5 w-3.5" />
              </span>
              <span className="mt-1 block truncate text-[15px] font-medium">{isLastInModule && moduleQuiz ? moduleQuiz.title : next ? next.title : curriculum.finalQuiz?.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </LessonShell>
  );
}
