import Link from "next/link";
import { StaffReply } from "@/components/admin/misc-admin";
import { store } from "@/lib/server/store";
import { listAllLessonMeta, listCourses } from "@/lib/server/services/content";
import { timeAgo } from "@/lib/text";

export const metadata = { title: "Savol-javoblar" };

export default async function AdminQuestions({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const [questions, replies, lessons, courses] = await Promise.all([
    store().select("questions", { orderBy: [{ field: "createdAt", asc: false }], limit: 200 }),
    store().select("question_replies", { orderBy: [{ field: "createdAt", asc: true }] }),
    listAllLessonMeta(),
    listCourses(true),
  ]);
  const staffAnswered = new Set(replies.filter((r) => r.isStaff).map((r) => r.questionId));
  const showAll = sp.hammasi === "1";
  const list = showAll ? questions : questions.filter((q) => !staffAnswered.has(q.id));
  const lessonById = new Map(lessons.map((l) => [l.id, l]));
  const courseById = new Map(courses.map((c) => [c.id, c]));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Savol-javoblar</h1>
        <nav className="flex gap-1.5 text-[13px]">
          <Link href="/admin/savollar" className={`h-8 rounded-lg px-3 leading-8 ${!showAll ? "bg-fg text-bg" : "border border-border text-fg-muted"}`}>Javobsiz</Link>
          <Link href="/admin/savollar?hammasi=1" className={`h-8 rounded-lg px-3 leading-8 ${showAll ? "bg-fg text-bg" : "border border-border text-fg-muted"}`}>Hammasi</Link>
        </nav>
      </div>
      {list.length === 0 ? <p className="py-12 text-center text-[14px] text-fg-subtle">Javob kutayotgan savollar yo‘q. 🎉</p> : (
        <ul className="space-y-3">
          {list.map((q) => {
            const l = lessonById.get(q.lessonId);
            const c = courseById.get(q.courseId);
            const path = l && c ? `/kurslar/${c.slug}/dars/${l.slug}` : "/";
            return (
              <li key={q.id} className="rounded-2xl border border-border bg-surface p-5">
                <p className="text-[12.5px] text-fg-subtle">
                  <span className="font-medium text-fg">{q.authorName}</span> · {timeAgo(q.createdAt)} · <Link href={path} className="hover:underline">{l?.title ?? "Dars"}</Link>
                </p>
                <p className="mt-2 whitespace-pre-wrap text-[14.5px] leading-relaxed">{q.body}</p>
                {replies.filter((r) => r.questionId === q.id).map((r) => (
                  <p key={r.id} className="mt-2 border-l-2 border-border pl-3 text-[13.5px] text-fg-muted"><span className="font-medium text-fg">{r.authorName}{r.isStaff ? " (ustoz)" : ""}:</span> {r.body}</p>
                ))}
                <StaffReply questionId={q.id} path={path} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
