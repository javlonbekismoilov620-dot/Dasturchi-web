import { GraduationCap } from "lucide-react";
import { CourseCard } from "@/components/course/course-card";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/primitives";
import { requireUser } from "@/lib/server/auth";
import { getCourseStatsMap, listCategories } from "@/lib/server/services/content";
import { getDashboard } from "@/lib/server/services/dashboard";

export default async function MyCoursesPage() {
  const user = await requireUser("/kabinet/kurslarim");
  const [d, stats, categories] = await Promise.all([getDashboard(user), getCourseStatsMap(), listCategories()]);
  const cat = (id: string) => categories.find((c) => c.id === id);
  return (
    <div className="space-y-12">
      <h1 className="text-[30px] font-semibold tracking-[-0.03em]">Kurslarim</h1>
      {d.active.length === 0 ? (
        <EmptyState icon={<GraduationCap className="h-5 w-5" />} title="Hali kursga yozilmagansiz" description="Kursni boshlaganingizda u shu yerda paydo bo‘ladi." action={<ButtonLink href="/kurslar">Kurs tanlash</ButtonLink>} />
      ) : (
        <>
          <section>
            <h2 className="mb-4 text-[18px] font-semibold">Jarayonda ({d.inProgress.length})</h2>
            {d.inProgress.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {d.inProgress.map((a) => (
                  <CourseCard key={a.course.id} course={a.course} stats={stats.get(a.course.id)} category={cat(a.course.categoryId)} progress={a.progress.percent} />
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-fg-muted">Hozircha jarayondagi kurslar yo‘q.</p>
            )}
          </section>
          <section>
            <h2 className="mb-4 text-[18px] font-semibold">Yakunlangan ({d.completed.length})</h2>
            {d.completed.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {d.completed.map((a) => (
                  <CourseCard key={a.course.id} course={a.course} stats={stats.get(a.course.id)} category={cat(a.course.categoryId)} progress={100} />
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-fg-muted">Birinchi kursingizni yakunlaganingizda u shu yerda ko‘rinadi.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
