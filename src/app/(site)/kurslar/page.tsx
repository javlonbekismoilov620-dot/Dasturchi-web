import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BookOpen, SearchX } from "lucide-react";
import { CourseCard } from "@/components/course/course-card";
import { CatalogFilters } from "@/components/course/catalog-filters";
import { EmptyState } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/server/auth";
import { buildSearchIndex, getCourseStatsMap, listCategories, listCourses } from "@/lib/server/services/content";
import { getCourseProgress, listEnrollments } from "@/lib/server/services/learning";
import { rankSearch } from "@/lib/search";
import { searchKey } from "@/lib/text";

export const metadata: Metadata = {
  title: "Kurslar",
  description: "Dasturlash, dizayn, 3D, video montaj va marketing bo‘yicha o‘zbek tilidagi kurslar katalogi.",
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function CatalogPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const q = get("q").slice(0, 100);
  const [categories, courses, stats, user, index] = await Promise.all([
    listCategories(),
    listCourses(),
    getCourseStatsMap(),
    getCurrentUser(),
    buildSearchIndex(),
  ]);
  const catBySlug = new Map(categories.map((c) => [c.slug, c]));
  const catById = new Map(categories.map((c) => [c.id, c]));

  let list = courses;
  const cat = catBySlug.get(get("yonalish"));
  if (cat) list = list.filter((c) => c.categoryId === cat.id);
  const level = Number(get("daraja"));
  if (level >= 1 && level <= 5) list = list.filter((c) => c.level === level);
  if (get("holat") === "tayyor") list = list.filter((c) => c.status === "published");
  if (get("holat") === "tayyorlanmoqda") list = list.filter((c) => c.status === "preparing");
  if (get("dastur")) list = list.filter((c) => c.software.includes(get("dastur")));

  let lessonHits: ReturnType<typeof rankSearch> = [];
  if (q) {
    const terms = searchKey(q).split(" ").filter(Boolean);
    list = list.filter((c) => {
      const hay = searchKey([c.title, c.subtitle, c.description, ...c.tags, ...c.software, ...c.skills, catById.get(c.categoryId)?.title ?? ""].join(" "));
      return terms.every((t) => hay.includes(t));
    });
    lessonHits = rankSearch(index.filter((i) => i.type === "lesson"), q, 8);
  }

  const sort = get("saralash");
  if (sort === "mashhur") list = [...list].sort((a, b) => (stats.get(b.id)?.enrollments ?? 0) - (stats.get(a.id)?.enrollments ?? 0));
  else if (sort === "yangi") list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.order - a.order);
  else if (sort === "daraja") list = [...list].sort((a, b) => a.level - b.level);
  else list = [...list].sort((a, b) => Number(b.status === "published") - Number(a.status === "published") || a.order - b.order);

  // Talabaning progressi
  const progress = new Map<string, number>();
  if (user) {
    const enrolled = await listEnrollments(user.id);
    await Promise.all(
      enrolled.map(async (e) => {
        const c = courses.find((x) => x.id === e.courseId);
        if (c) progress.set(c.id, (await getCourseProgress(user.id, c)).percent);
      }),
    );
  }

  const softwareCounts = new Map<string, number>();
  for (const c of courses) for (const s of c.software) softwareCounts.set(s, (softwareCounts.get(s) ?? 0) + 1);
  const software = [...softwareCounts.entries()]
    .filter(([s]) => !["Brauzer", "Telefon kamerasi"].includes(s))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14)
    .map(([s, n]) => ({ value: s, label: s, count: n }));

  return (
    <div className="container-page pb-10 pt-12 sm:pt-16">
      <header className="max-w-3xl">
        <p className="eyebrow mb-3">Katalog</p>
        <h1 className="text-balance text-[36px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[52px]">
          Barcha <span className="font-display-italic text-fg-muted">kurslar</span>
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-fg-muted sm:text-[17px]">
          Yo‘nalish, daraja yoki dastur bo‘yicha saralang. “Tayyorlanmoqda” belgili kurslarning dasturi e’lon qilingan, darslari esa bosqichma-bosqich qo‘shilmoqda.
        </p>
      </header>

      <div className="mt-10">
        <Suspense fallback={<div className="skeleton h-40" />}>
          <CatalogFilters
            categories={categories.map((c) => ({ value: c.slug, label: c.title }))}
            software={software}
            total={list.length}
          />
        </Suspense>
      </div>

      {list.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              stats={stats.get(c.id)}
              category={catById.get(c.categoryId)}
              progress={progress.has(c.id) ? progress.get(c.id) : null}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          className="mt-8"
          icon={<SearchX className="h-5 w-5" />}
          title="Mos kurs topilmadi"
          description="Boshqa kalit so‘z bilan qidirib ko‘ring yoki filtrlarni tozalang."
          action={<ButtonLink href="/kurslar" variant="secondary" size="sm">Barcha kurslarni ko‘rish</ButtonLink>}
        />
      )}

      {lessonHits.length > 0 && (
        <section className="mt-16">
          <h2 className="text-[20px] font-semibold tracking-tight">Darslar ichida topildi</h2>
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {lessonHits.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-fg/[0.03]">
                  <BookOpen className="h-4 w-4 shrink-0 text-fg-subtle" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px] font-medium">{l.title}</span>
                    <span className="block truncate text-[12.5px] text-fg-subtle">{l.subtitle}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
