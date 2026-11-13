import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseCard } from "@/components/course/course-card";
import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/ui/primitives";
import { colorVar, tint } from "@/lib/colors";
import { getCategoryBySlug, getCourseStatsMap, listCategories, listCourses, listPaths } from "@/lib/server/services/content";
import { LEVELS } from "@/lib/text";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const c = await getCategoryBySlug((await params).slug);
  return c ? { title: c.title, description: c.description } : { title: "Yo‘nalish topilmadi" };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const [courses, stats, paths, categories] = await Promise.all([listCourses(), getCourseStatsMap(), listPaths(), listCategories()]);
  const list = courses.filter((c) => c.categoryId === category.id);
  const slugs = new Set(list.map((c) => c.slug));
  const related = paths.filter((p) => p.steps.some((s) => slugs.has(s.courseSlug)));

  return (
    <div className="pb-10">
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: `radial-gradient(70% 70% at 20% 0%, ${tint(category.color, 16)}, transparent 70%)` }} aria-hidden />
        <div className="container-page py-14 sm:py-20">
          <nav className="mb-6 text-[13px] text-fg-subtle">
            <Link href="/yonalishlar" className="hover:text-fg">Yo‘nalishlar</Link> / <span className="text-fg-muted">{category.title}</span>
          </nav>
          <span className="grid h-14 w-14 place-items-center rounded-2xl border" style={{ color: colorVar[category.color], background: tint(category.color, 10), borderColor: tint(category.color, 25) }}>
            <Icon name={category.icon} className="h-6 w-6" />
          </span>
          <h1 className="mt-6 max-w-3xl text-balance text-[36px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[54px]">{category.title}</h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-fg-muted">{category.description}</p>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {category.topics.map((t) => (
              <Link key={t} href={`/kurslar?q=${encodeURIComponent(t)}`} className="rounded-md border border-border bg-surface/70 px-2.5 py-1 text-[12.5px] text-fg-muted hover:border-border-strong hover:text-fg">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page space-y-16 py-14">
        {list.length === 0 && <EmptyState title="Bu yo‘nalishda hali kurslar yo‘q" description="Tez orada yangi kurslar qo‘shiladi." />}
        {LEVELS.map((lvl) => {
          const items = list.filter((c) => c.level === lvl.level);
          if (!items.length) return null;
          return (
            <section key={lvl.level}>
              <div className="mb-6 flex items-baseline gap-4 border-b border-border pb-4">
                <span className="font-mono text-[13px] text-fg-subtle">0{lvl.level}</span>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em]">{lvl.name}</h2>
                <p className="hidden text-[14px] text-fg-muted md:block">{lvl.description}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => (
                  <CourseCard key={c.id} course={c} stats={stats.get(c.id)} category={categories.find((x) => x.id === c.categoryId)} />
                ))}
              </div>
            </section>
          );
        })}
        {related.length > 0 && (
          <section>
            <h2 className="mb-6 text-[22px] font-semibold tracking-[-0.02em]">Shu yo‘nalishdagi o‘quv yo‘llari</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {related.map((p) => (
                <Link key={p.id} href={`/yollar/${p.slug}`} className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-strong">
                  <p className="text-[18px] font-semibold">{p.title}</p>
                  <p className="mt-1 text-[14px] text-fg-muted">{p.subtitle}</p>
                  <p className="mt-4 text-[12.5px] text-fg-subtle">{p.steps.length} bosqich</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
