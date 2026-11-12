import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonEditor } from "@/components/admin/lesson-editor";
import { store } from "@/lib/server/store";
import { getCourseById, getLessonById } from "@/lib/server/services/content";

export default async function EditLessonPage({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
  const { id, lessonId } = await params;
  const [course, lesson] = await Promise.all([getCourseById(id), getLessonById(lessonId)]);
  if (!course || !lesson || lesson.courseId !== id) notFound();
  const modules = await store().select("modules", { where: { courseId: id }, orderBy: [{ field: "order" }] });
  return (
    <div className="space-y-6">
      <div>
        <Link href={`/admin/kurslar/${id}?tab=dastur`} className="text-[13px] text-fg-subtle hover:text-fg">← {course.title}</Link>
        <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em]">{lesson.title}</h1>
      </div>
      <LessonEditor lesson={lesson} modules={modules} courseSlug={course.slug} />
    </div>
  );
}
