import Link from "next/link";
import { BookOpen, GraduationCap, MessageCircleQuestion, Users } from "lucide-react";
import { WeeklyBars } from "@/components/dashboard/charts";
import { Avatar } from "@/components/ui/primitives";
import { getAdminOverview } from "@/lib/server/services/admin";
import { timeAgo } from "@/lib/text";

const ACT: Record<string, string> = {
  lesson_completed: "darsni yakunladi",
  quiz_passed: "testdan o‘tdi",
  course_enrolled: "kursga yozildi",
  course_completed: "kursni yakunladi",
  certificate_issued: "sertifikat oldi",
};

export default async function AdminHome() {
  const o = await getAdminOverview();
  const cards = [
    { label: "Foydalanuvchilar", value: o.users, sub: `${o.newThisWeek} tasi shu hafta`, icon: Users, href: "/admin/talabalar" },
    { label: "Kursga yozilishlar", value: o.enrollments, sub: `${o.completions} ta yakunlangan · ${o.certificates} sertifikat`, icon: GraduationCap, href: "/admin/kurslar" },
    { label: "Tayyor darslar", value: o.lessons.published, sub: `${o.lessons.planned} rejada · ${o.lessons.draft} qoralama`, icon: BookOpen, href: "/admin/kurslar" },
    { label: "Javobsiz savollar", value: o.unanswered.length, sub: "ustoz javobi kutilmoqda", icon: MessageCircleQuestion, href: "/admin/savollar" },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Umumiy ko‘rinish</h1>
        <p className="mt-1 text-[14px] text-fg-muted">
          {o.courses.total} ta kurs: {o.courses.published} tasi e’lon qilingan, {o.courses.preparing} tasi tayyorlanmoqda.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-border-strong">
            <p className="flex items-center gap-2 text-[13px] text-fg-muted"><c.icon className="h-4 w-4" /> {c.label}</p>
            <p className="mt-2 text-[30px] font-semibold tabular-nums tracking-tight">{c.value}</p>
            <p className="text-[12.5px] text-fg-subtle">{c.sub}</p>
          </Link>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-[16px] font-semibold">Yakunlangan darslar · 14 kun</h2>
          <div className="mt-8"><WeeklyBars data={o.days} /></div>
        </section>
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-[16px] font-semibold">Eng ko‘p yozilgan kurslar</h2>
          <ul className="mt-4 space-y-3">
            {o.topCourses.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 text-[14px]">
                <Link href={`/admin/kurslar/${c.id}`} className="truncate hover:underline">{c.title}</Link>
                <span className="shrink-0 tabular-nums text-fg-muted">{c.enrollments}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-[16px] font-semibold">So‘nggi faollik</h2>
          {o.recentActivity.length === 0 ? (
            <p className="mt-3 text-[14px] text-fg-subtle">Hali faollik yo‘q.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {o.recentActivity.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 text-[13.5px]">
                  <span className="min-w-0"><span className="font-medium">{a.userName}</span> <span className="text-fg-muted">{ACT[a.type]}:</span> {a.label}</span>
                  <span className="shrink-0 text-fg-subtle">{timeAgo(a.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-[16px] font-semibold">Yangi foydalanuvchilar</h2>
          <ul className="mt-4 space-y-3">
            {o.recentUsers.map((u) => (
              <li key={u.id}>
                <Link href={`/admin/talabalar/${u.id}`} className="flex items-center gap-3 rounded-lg hover:bg-fg/[0.03]">
                  <Avatar name={u.name} size={32} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium">{u.name}</span>
                    <span className="block truncate text-[12.5px] text-fg-subtle">{u.email}</span>
                  </span>
                  <span className="text-[12px] text-fg-subtle">{timeAgo(u.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
