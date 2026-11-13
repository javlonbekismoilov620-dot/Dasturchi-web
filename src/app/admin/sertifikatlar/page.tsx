import Link from "next/link";
import { CertificateToggle } from "@/components/admin/misc-admin";
import { listAllCertificates } from "@/lib/server/services/admin";
import { formatDate } from "@/lib/text";

export const metadata = { title: "Sertifikatlar" };

export default async function AdminCertificates() {
  const certs = await listAllCertificates();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Sertifikatlar <span className="text-fg-subtle">({certs.length})</span></h1>
        <p className="mt-1 text-[14px] text-fg-muted">Sertifikatlar kursni to‘liq yakunlaganda avtomatik beriladi. Bu yerda ularni bekor qilish yoki tiklash mumkin.</p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[680px] text-left text-[14px]">
          <thead className="border-b border-border text-[12px] uppercase tracking-wider text-fg-subtle">
            <tr><th className="px-4 py-3 font-medium">Kod</th><th className="px-4 py-3 font-medium">Talaba</th><th className="px-4 py-3 font-medium">Kurs</th><th className="px-4 py-3 font-medium">Sana</th><th className="px-4 py-3" /></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {certs.map((c) => (
              <tr key={c.id} className={c.revoked ? "opacity-60" : ""}>
                <td className="px-4 py-3 font-mono text-[13px]"><Link href={`/sertifikat/${c.code}`} className="hover:underline">{c.code}</Link></td>
                <td className="px-4 py-3"><Link href={`/admin/talabalar/${c.userId}`} className="hover:underline">{c.userName}</Link></td>
                <td className="px-4 py-3 text-fg-muted">{c.courseTitle}</td>
                <td className="px-4 py-3 text-fg-muted">{formatDate(c.issuedAt)}</td>
                <td className="px-4 py-3 text-right"><CertificateToggle id={c.id} revoked={c.revoked} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {certs.length === 0 && <p className="p-8 text-center text-[14px] text-fg-subtle">Hali sertifikatlar berilmagan.</p>}
      </div>
    </div>
  );
}
