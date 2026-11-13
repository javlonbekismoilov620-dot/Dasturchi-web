import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { History } from "lucide-react";
import { QuizRunner } from "@/components/lesson/quiz-runner";
import { QuizShell } from "@/components/lesson/quiz-shell";
import { requireUser } from "@/lib/server/auth";
import { getCourseBySlug, getCurriculum, getQuiz } from "@/lib/server/services/content";
import { listQuizAttempts } from "@/lib/server/services/learning";
import { formatDate } from "@/lib/text";

type Params = Promise<{ slug: string; quizId: string }>;

export const metadata: Metadata = { title: "Test", robots: { index: false } };

export default async function QuizPage({ params }: { params: Params }) {
  const { slug, quizId } = await params;
  const user = await requireUser(`/kurslar/${slug}/test/${quizId}`);
  const course = await getCourseBySlug(slug, user.role === "admin");
  if (!course) notFound();
  const quiz = await getQuiz(quizId);
  if (!quiz || quiz.courseId !== course.id) notFound();
  const [attempts, curriculum] = await Promise.all([listQuizAttempts(user.id, quiz.id), getCurriculum(course.id)]);
  const best = attempts.reduce((m, a) => Math.max(m, a.score), 0);

  // Testdan keyingi qadam: keyingi modulning birinchi darsi yoki yakuniy imtihon
  let nextHref: string | null = null;
  if (quiz.moduleId) {
    const mi = curriculum.modules.findIndex((m) => m.id === quiz.moduleId);
    const nextModule = curriculum.modules.slice(mi + 1).find((m) => m.lessons.some((l) => l.status === "published"));
    const first = nextModule?.lessons.find((l) => l.status === "published");
    nextHref = first ? `/kurslar/${course.slug}/dars/${first.slug}` : curriculum.finalQuiz ? `/kurslar/${course.slug}/test/${curriculum.finalQuiz.id}` : null;
  }

  return (
    <QuizShell courseSlug={course.slug} courseTitle={course.title}>
        <p className="eyebrow">{quiz.moduleId ? "Modul testi" : "Yakuniy imtihon"}</p>
        <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.03em] sm:text-[36px]">{quiz.title}</h1>
        <p className="mt-2 text-[15.5px] text-fg-muted">{quiz.description}</p>
        {attempts.length > 0 && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-[13px] text-fg-muted">
            <History className="h-3.5 w-3.5" /> {attempts.length} ta urinish · eng yaxshi natija {best}% · oxirgisi {formatDate(attempts[0].createdAt)}
          </p>
        )}
        <div className="mt-10">
          <QuizRunner
            quizId={quiz.id}
            questions={quiz.questions.map((q) => ({ id: q.id, prompt: q.prompt, options: q.options }))}
            passingScore={quiz.passingScore}
            courseHref={`/kurslar/${course.slug}`}
            nextHref={nextHref}
          />
        </div>
    </QuizShell>
  );
}
