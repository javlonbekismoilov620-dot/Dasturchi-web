import Link from "next/link";
import { notFound } from "next/navigation";
import { RoleSelect } from "@/components/admin/misc-admin";
import { Avatar, ProgressBar } from "@/components/ui/primitives";
import { getStudentDetail } from "@/lib/server/services/admin";
import { formatDate, levelName, timeAgo } from "@/lib/text";

export default async function StudentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = await getStudentDetail(id);
  if (!d) notFound();
  const u = d.user;
  return (
    <div className="space-y-6">
      <Link href="/admin/talabalar" className="text-[13px] text-fg-subtle hover:text-fg">← Talabalar</Link>
      <div className="flex flex-wrap items-center gap-4">
        <Avatar name={u.name} size={56} />
        <div className="flex-1">
          <h1 className="text-[26px] font-semibold tracking-tight">{u.name}</h1>
          <p className="text-[14px] text-fg-muted">{u.email} · ro‘yxatdan o‘tgan: {formatDate(u.createdAt)}{u.level ? ` · ${levelName(u.level)}` : ""}</p>
        </div>
        <RoleSelect userId={u.id} role={u.role} />
      </div>
      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-[16px] font-semibold">Kurslar bo‘yicha progress</h2>
        {d.progress.length === 0 ? <p className="mt-3 text-[14px] text-fg-subtle">Kursga yozilmagan.</p> : (
          <ul className="mt-4 space-y-4">
            {d.progress.map((p) => (
              <li key={p.course.id}>
                <div className="mb-1.5 flex justify-between text-[14px]">
                  <span>{p.course.title}</span>
                  <span className="tabular-nums text-fg-muted">{p.progress.completedLessons}/{p.progress.totalLessons} · {p.progress.percent}%{p.progress.isComplete ? " · yakunlangan" : ""}</span>
                </div>
                <ProgressBar value={p.progress.percent} color={p.course.accent} />
              </li>
            ))}
          </ul>
        )}
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-[16px] font-semibold">Test natijalari</h2>
          {d.attempts.length === 0 ? <p className="mt-3 text-[14px] text-fg-subtle">Hali test topshirmagan.</p> : (
            <ul className="mt-3 space-y-2 text-[13.5px]">
              {d.attempts.slice(0, 15).map((a) => (
                <li key={a.id} className="flex justify-between gap-3">
                  <span className="truncate">{a.quizTitle}</span>
                  <span className={a.passed ? "text-success" : "text-danger"}>{a.score}% · {timeAgo(a.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-[16px] font-semibold">Sertifikatlar</h2>
          {d.certificates.length === 0 ? <p className="mt-3 text-[14px] text-fg-subtle">Sertifikat yo‘q.</p> : (
            <ul className="mt-3 space-y-2 text-[13.5px]">
              {d.certificates.map((c) => (
                <li key={c.id} className="flex justify-between gap-3">
                  <Link href={`/sertifikat/${c.code}`} className="truncate hover:underline">{c.courseTitle}</Link>
                  <span className="font-mono text-fg-subtle">{c.code}{c.revoked ? " (bekor)" : ""}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
