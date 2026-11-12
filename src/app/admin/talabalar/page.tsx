import Link from "next/link";
import { Avatar } from "@/components/ui/primitives";
import { listStudents } from "@/lib/server/services/admin";
import { timeAgo } from "@/lib/text";

export const metadata = { title: "Talabalar" };

export default async function AdminStudents({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").slice(0, 100);
  const students = await listStudents(q);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Talabalar <span className="text-fg-subtle">({students.length})</span></h1>
        <form className="w-full max-w-xs">
          <input name="q" defaultValue={q} placeholder="Ism yoki pochta bo‘yicha qidirish" className="h-10 w-full rounded-lg border border-border-strong bg-surface px-3 text-[14px] outline-none focus:border-accent" aria-label="Talabalarni qidirish" />
        </form>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[720px] text-left text-[14px]">
          <thead className="border-b border-border text-[12px] uppercase tracking-wider text-fg-subtle">
            <tr>
              <th className="px-4 py-3 font-medium">Foydalanuvchi</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Kurslar</th>
              <th className="px-4 py-3 font-medium">Darslar</th>
              <th className="px-4 py-3 font-medium">Oxirgi faollik</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-fg/[0.02]">
                <td className="px-4 py-3">
                  <Link href={`/admin/talabalar/${s.id}`} className="flex items-center gap-3">
                    <Avatar name={s.name} size={32} />
                    <span>
                      <span className="block font-medium hover:underline">{s.name}</span>
                      <span className="block text-[12.5px] text-fg-subtle">{s.email}</span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-fg-muted">{s.role === "admin" ? "Admin" : "Talaba"}</td>
                <td className="px-4 py-3 tabular-nums text-fg-muted">{s.enrollments} ({s.completedCourses} yakunlangan)</td>
                <td className="px-4 py-3 tabular-nums text-fg-muted">{s.lessonsCompleted}</td>
                <td className="px-4 py-3 text-fg-muted">{s.lastActive ? timeAgo(s.lastActive) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && <p className="p-8 text-center text-[14px] text-fg-subtle">Hech kim topilmadi.</p>}
      </div>
    </div>
  );
}
