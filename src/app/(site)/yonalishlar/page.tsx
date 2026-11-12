import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/motion";
import { colorVar, tint } from "@/lib/colors";
import { getCourseStatsMap, listCategories, listCourses } from "@/lib/server/services/content";

export const metadata: Metadata = { title: "Yo‘nalishlar", description: "Dasturlash, video montaj, 3D, dizayn, marketing va karyera yo‘nalishlari." };

export default async function CategoriesPage() {
  const [categories, courses, stats] = await Promise.all([listCategories(), listCourses(), getCourseStatsMap()]);
  return (
    <div className="container-page pb-10 pt-12 sm:pt-16">
      <header className="max-w-3xl">
        <p className="eyebrow mb-3">Yo‘nalishlar</p>
        <h1 className="text-balance text-[36px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[52px]">
          O‘zingizga mos <span className="font-display-italic text-fg-muted">yo‘nalishni</span> tanlang
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-fg-muted">Har bir yo‘nalishda kurslar 5 bosqichli tizim bo‘yicha tartiblangan.</p>
      </header>
      <div className="mt-12 space-y-4">
        {categories.map((c, i) => {
          const list = courses.filter((x) => x.categoryId === c.id);
          const lessons = list.reduce((a, x) => a + (stats.get(x.id)?.publishedCount ?? 0), 0);
          return (
            <Reveal key={c.id} delay={i * 0.04}>
              <Link
                href={`/yonalishlar/${c.slug}`}
                className="group grid gap-6 rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-strong sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-8"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl border" style={{ color: colorVar[c.color], background: tint(c.color, 10), borderColor: tint(c.color, 25) }}>
                  <Icon name={c.icon} className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-[22px] font-semibold tracking-[-0.02em]">{c.title}</h2>
                  <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-fg-muted">{c.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.topics.slice(0, 8).map((t) => (
                      <span key={t} className="rounded-md bg-fg/[0.05] px-2 py-0.5 text-[12px] text-fg-muted">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-6 sm:flex-col sm:items-end sm:gap-2">
                  <span className="text-[13px] text-fg-subtle">{list.length} kurs · {lessons} tayyor dars</span>
                  <ArrowUpRight className="h-5 w-5 text-fg-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
