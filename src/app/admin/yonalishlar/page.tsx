import { CategoryManager } from "@/components/admin/misc-admin";
import { listCategories, listCourses } from "@/lib/server/services/content";

export const metadata = { title: "Yo‘nalishlar" };

export default async function AdminCategories() {
  const [categories, courses] = await Promise.all([listCategories(), listCourses(true)]);
  const counts: Record<string, number> = {};
  for (const c of courses) counts[c.categoryId] = (counts[c.categoryId] ?? 0) + 1;
  return (
    <div className="space-y-6">
      <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Yo‘nalishlar</h1>
      <CategoryManager categories={categories} counts={counts} />
    </div>
  );
}
