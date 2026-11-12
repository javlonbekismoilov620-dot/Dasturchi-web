import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseForm, CurriculumManager, STATUS_LABEL } from "@/components/admin/course-admin";
import { cn } from "@/lib/cn";
import { getCourseById, getCurriculum, listCategories } from "@/lib/server/services/content";

export default async function EditCoursePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { id } = await params;
  const sp = await searchParams;
  const course = await getCourseById(id);
  if (!course) notFound();
  const [categories, curriculum] = await Promise.all([listCategories(), getCurriculum(id, true)]);
  const tab = sp.tab === "dastur" ? "dastur" : "malumot";
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/kurslar" className="text-[13px] text-fg-subtle hover:text-fg">← Kurslar</Link>
        <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em]">{course.title}</h1>
        <p className="text-[13.5px] text-fg-muted">{STATUS_LABEL[course.status]} · {curriculum.modules.length} modul · {curriculum.lessons.length} dars</p>
      </div>
      <nav className="flex gap-1 border-b border-border">
        {[
          ["malumot", "Ma’lumot"],
          ["dastur", "Dastur: modullar, darslar, testlar"],
        ].map(([v, label]) => (
          <Link key={v} href={`/admin/kurslar/${id}${v === "dastur" ? "?tab=dastur" : ""}`} className={cn("-mb-px border-b-2 px-3 py-2.5 text-[14px]", tab === v ? "border-fg text-fg" : "border-transparent text-fg-muted hover:text-fg")}>{label}</Link>
        ))}
      </nav>
      {tab === "malumot" ? (
        <CourseForm course={course} categories={categories} />
      ) : (
        <CurriculumManager
          courseId={id}
          finalQuiz={curriculum.finalQuiz ? { id: curriculum.finalQuiz.id, title: curriculum.finalQuiz.title, questionCount: curriculum.finalQuiz.questionCount } : null}
          modules={curriculum.modules.map((m) => ({
            id: m.id,
            title: m.title,
            description: m.description,
            quiz: m.quiz ? { id: m.quiz.id, title: m.quiz.title, questionCount: m.quiz.questionCount } : null,
            lessons: m.lessons.map((l) => ({ id: l.id, title: l.title, status: l.status, durationMin: l.durationMin, isPreview: l.isPreview })),
          }))}
        />
      )}
    </div>
  );
}
