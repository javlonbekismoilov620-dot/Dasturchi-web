import type { Metadata } from "next";
import { Assessment } from "@/components/dashboard/assessment";
import { getCurrentUser } from "@/lib/server/auth";
import { listCategories, listCourses, listPaths } from "@/lib/server/services/content";

export const metadata: Metadata = { title: "Darajani aniqlash", description: "2 daqiqalik savolnoma orqali darajangizni aniqlang va mos o‘quv yo‘lini oling." };

export default async function AssessmentPage() {
  const [categories, paths, courses, user] = await Promise.all([listCategories(), listPaths(), listCourses(), getCurrentUser()]);
  const bySlug = new Map(courses.map((c) => [c.slug, c]));
  const catSlug = new Map(categories.map((c) => [c.id, c.slug]));
  return (
    <div className="container-page pb-10 pt-12 sm:pt-16">
      <header className="mx-auto mb-12 max-w-2xl text-center">
        <p className="eyebrow mb-3">Darajani aniqlash</p>
        <h1 className="text-balance text-[34px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[48px]">
          Qayerdan <span className="font-display-italic text-fg-muted">boshlash</span> kerak?
        </h1>
        <p className="mt-4 text-[16px] text-fg-muted">To‘rtta qisqa qadam — va sizga mos daraja hamda o‘quv yo‘li tayyor.</p>
      </header>
      <Assessment
        loggedIn={Boolean(user)}
        categories={categories.map((c) => ({ slug: c.slug, title: c.title, icon: c.icon, color: c.color }))}
        paths={paths.map((p) => ({
          slug: p.slug,
          title: p.title,
          subtitle: p.subtitle,
          icon: p.icon,
          color: p.color,
          steps: p.steps.flatMap((s) => {
            const c = bySlug.get(s.courseSlug);
            return c ? [{ slug: c.slug, title: c.title, level: c.level, status: c.status, category: catSlug.get(c.categoryId) ?? "" }] : [];
          }),
        }))}
      />
    </div>
  );
}
