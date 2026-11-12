import Link from "next/link";
import { Plus } from "lucide-react";
import { QuickCourseControls } from "@/components/admin/course-admin";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { colorVar, tint } from "@/lib/colors";
import { getCourseStatsMap, listCategories, listCourses } from "@/lib/server/services/content";

export const metadata = { title: "Kurslar" };

export default async function AdminCourses({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const [courses, categories, stats] = await Promise.all([listCourses(true), listCategories(), getCourseStatsMap()]);
  const cat = new Map(categories.map((c) => [c.id, c]));
  const filter = sp.holat;
  const list = filter ? courses.filter((c) => c.status === filter) : courses;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Kurslar</h1>
          <p className="mt-1 text-[14px] text-fg-muted">★ — bosh sahifada tavsiya etiladi. Holatni ro‘yxatning o‘zida o‘zgartirish mumkin.</p>
        </div>
        <ButtonLink href="/admin/kurslar/yangi" icon={<Plus className="h-4 w-4" />}>Yangi kurs</ButtonLink>
      </div>
      <nav className="flex gap-1.5 text-[13px]">
        {[
          ["", "Hammasi"],
          ["published", "E’lon qilingan"],
          ["preparing", "Tayyorlanmoqda"],
          ["draft", "Qoralama"],
        ].map(([v, label]) => (
          <Link key={v} href={v ? `/admin/kurslar?holat=${v}` : "/admin/kurslar"} className={`h-8 rounded-lg px-3 leading-8 ${(filter ?? "") === v ? "bg-fg text-bg" : "border border-border text-fg-muted"}`}>{label}</Link>
        ))}
      </nav>
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[760px] text-left text-[14px]">
          <thead className="border-b border-border text-[12px] uppercase tracking-wider text-fg-subtle">
            <tr>
              <th className="px-4 py-3 font-medium">Kurs</th>
              <th className="px-4 py-3 font-medium">Yo‘nalish</th>
              <th className="px-4 py-3 font-medium">Darslar</th>
              <th className="px-4 py-3 font-medium">Talabalar</th>
              <th className="px-4 py-3 font-medium">Holat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((c) => {
              const s = stats.get(c.id);
              return (
                <tr key={c.id} className="hover:bg-fg/[0.02]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/kurslar/${c.id}`} className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: tint(c.accent, 14), color: colorVar[c.accent] }}><Icon name={c.icon} className="h-4 w-4" /></span>
                      <span>
                        <span className="block font-medium hover:underline">{c.title}</span>
                        <span className="block text-[12.5px] text-fg-subtle">{c.level}-daraja · /{c.slug}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-fg-muted">{cat.get(c.categoryId)?.title}</td>
                  <td className="px-4 py-3 tabular-nums text-fg-muted">{s?.publishedCount ?? 0}/{s?.lessonCount ?? 0}</td>
                  <td className="px-4 py-3 tabular-nums text-fg-muted">{s?.enrollments ?? 0}</td>
                  <td className="px-4 py-3"><QuickCourseControls course={c} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
