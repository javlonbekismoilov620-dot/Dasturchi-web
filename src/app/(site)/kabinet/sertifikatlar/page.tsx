import Link from "next/link";
import { Award, ExternalLink } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/primitives";
import { requireUser } from "@/lib/server/auth";
import { listUserCertificates } from "@/lib/server/services/learning";
import { formatDate } from "@/lib/text";

export default async function CertificatesPage() {
  const user = await requireUser("/kabinet/sertifikatlar");
  const certs = await listUserCertificates(user.id);
  return (
    <div>
      <h1 className="mb-2 text-[30px] font-semibold tracking-[-0.03em]">Sertifikatlar</h1>
      <p className="mb-8 max-w-2xl text-[15px] text-fg-muted">Kursning barcha darslarini yakunlab, yakuniy testdan o‘tganingizda sertifikat avtomatik beriladi. Har bir sertifikat noyob kod orqali tekshiriladi.</p>
      {certs.length === 0 ? (
        <EmptyState icon={<Award className="h-5 w-5" />} title="Hali sertifikat yo‘q" description="Birinchi kursingizni yakunlang — sertifikat shu yerda paydo bo‘ladi." action={<ButtonLink href="/kabinet/kurslarim" variant="secondary">Kurslarimga o‘tish</ButtonLink>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {certs.map((c) => (
            <Link key={c.id} href={`/sertifikat/${c.code}`} className="group relative overflow-hidden rounded-2xl border border-border-strong bg-surface p-6 transition-shadow hover:shadow-[var(--shadow-lg)]">
              <div className="girih pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden />
              <Award className="relative h-8 w-8 text-gold" strokeWidth={1.5} />
              <p className="relative mt-5 text-[19px] font-semibold tracking-tight">{c.courseTitle}</p>
              <p className="relative mt-1 text-[13.5px] text-fg-muted">Berilgan sana: {formatDate(c.issuedAt)}</p>
              <p className="relative mt-4 flex items-center justify-between font-mono text-[12.5px] text-fg-subtle">
                {c.code}
                <ExternalLink className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
