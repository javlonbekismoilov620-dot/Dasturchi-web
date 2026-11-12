import { NewCourseForm } from "@/components/admin/course-admin";
import { listCategories } from "@/lib/server/services/content";

export const metadata = { title: "Yangi kurs" };

export default async function NewCoursePage() {
  const categories = await listCategories();
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Yangi kurs</h1>
      <div className="rounded-2xl border border-border bg-surface p-6"><NewCourseForm categories={categories} /></div>
    </div>
  );
}
