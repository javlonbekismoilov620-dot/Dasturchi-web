import Link from "next/link";
import { Bookmark, BookOpen, NotebookPen } from "lucide-react";
import { CourseCard } from "@/components/course/course-card";
import { EmptyState } from "@/components/ui/primitives";
import { requireUser } from "@/lib/server/auth";
import { getCourseStatsMap, listAllLessonMeta, listCourses } from "@/lib/server/services/content";
import { listBookmarks, listNotes, listSavedCourses } from "@/lib/server/services/learning";
import { timeAgo } from "@/lib/text";

export default async function SavedPage() {
  const user = await requireUser("/kabinet/saqlanganlar");
  const [saved, bookmarks, notes, courses, lessons, stats] = await Promise.all([
    listSavedCourses(user.id),
    listBookmarks(user.id),
    listNotes(user.id),
    listCourses(true),
    listAllLessonMeta(),
    getCourseStatsMap(),
  ]);
  const courseById = new Map(courses.map((c) => [c.id, c]));
  const lessonById = new Map(lessons.map((l) => [l.id, l]));
  const lessonHref = (lessonId: string) => {
    const l = lessonById.get(lessonId);
    const c = l && courseById.get(l.courseId);
    return l && c ? `/kurslar/${c.slug}/dars/${l.slug}` : "#";
  };
  return (
    <div className="space-y-14">
      <section>
        <h1 className="mb-6 text-[30px] font-semibold tracking-[-0.03em]">Saqlangan kurslar</h1>
        {saved.length === 0 ? (
          <EmptyState icon={<Bookmark className="h-5 w-5" />} title="Saqlangan kurslar yo‘q" description="Kurs sahifasidagi “Saqlash” tugmasi orqali qiziqarli kurslarni shu yerga qo‘shing." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((s) => {
              const c = courseById.get(s.courseId);
              return c ? <CourseCard key={s.id} course={c} stats={stats.get(c.id)} /> : null;
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-5 text-[20px] font-semibold tracking-tight">Xatcho‘pdagi darslar</h2>
        {bookmarks.length === 0 ? (
          <p className="text-[14px] text-fg-muted">Dars sahifasidagi “Xatcho‘p” tugmasi bilan muhim darslarni saqlang.</p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {bookmarks.map((b) => {
              const l = lessonById.get(b.lessonId);
              const c = courseById.get(b.courseId);
              if (!l || !c) return null;
              return (
                <li key={b.id}>
                  <Link href={lessonHref(b.lessonId)} className="flex items-center gap-3 px-5 py-4 hover:bg-fg/[0.03]">
                    <BookOpen className="h-4 w-4 shrink-0 text-fg-subtle" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium">{l.title}</span>
                      <span className="block truncate text-[12.5px] text-fg-subtle">{c.title}</span>
                    </span>
                    <span className="text-[12px] text-fg-subtle">{timeAgo(b.createdAt)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-5 text-[20px] font-semibold tracking-tight">Qaydlarim</h2>
        {notes.length === 0 ? (
          <p className="text-[14px] text-fg-muted">Darslarda yozgan qaydlaringiz shu yerda jamlanadi.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {notes.map((n) => {
              const l = lessonById.get(n.lessonId);
              return (
                <Link key={n.id} href={lessonHref(n.lessonId)} className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-strong">
                  <p className="flex items-center gap-2 text-[13px] text-fg-subtle"><NotebookPen className="h-3.5 w-3.5" /> {l?.title ?? "Dars"} · {timeAgo(n.updatedAt)}</p>
                  <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-[14.5px] leading-relaxed">{n.body}</p>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
