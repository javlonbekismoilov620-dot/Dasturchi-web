import Link from "next/link";
import { notFound } from "next/navigation";
import { QuizEditor } from "@/components/admin/quiz-editor";
import { store } from "@/lib/server/store";
import { getCourseById, getQuiz } from "@/lib/server/services/content";

export default async function EditQuizPage({ params, searchParams }: { params: Promise<{ id: string; quizId: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { id, quizId } = await params;
  const sp = await searchParams;
  const course = await getCourseById(id);
  if (!course) notFound();
  let quiz;
  if (quizId === "yangi") {
    const moduleId = sp.modul ?? null;
    if (moduleId) {
      const mod = await store().getById("modules", moduleId);
      if (!mod || mod.courseId !== id) notFound();
    }
    quiz = { courseId: id, moduleId, title: moduleId ? "Modul testi" : `Yakuniy imtihon: ${course.title}`, description: "", passingScore: 70, questions: [] };
  } else {
    quiz = await getQuiz(quizId);
    if (!quiz || quiz.courseId !== id) notFound();
  }
  return (
    <div className="space-y-6">
      <div>
        <Link href={`/admin/kurslar/${id}?tab=dastur`} className="text-[13px] text-fg-subtle hover:text-fg">← {course.title}</Link>
        <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em]">{quizId === "yangi" ? "Yangi test" : quiz.title}</h1>
      </div>
      <QuizEditor quiz={quiz} courseId={id} />
    </div>
  );
}
