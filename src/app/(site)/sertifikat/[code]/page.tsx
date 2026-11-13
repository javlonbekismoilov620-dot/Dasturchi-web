import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ShieldAlert } from "lucide-react";
import { LogoMark } from "@/components/layout/logo";
import { PrintButton } from "@/components/dashboard/print-button";
import { getCertificateByCode } from "@/lib/server/services/learning";
import { formatDate } from "@/lib/text";

type Params = Promise<{ code: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const cert = await getCertificateByCode((await params).code);
  return cert ? { title: `Sertifikat — ${cert.courseTitle}`, robots: { index: false } } : { title: "Sertifikat topilmadi" };
}

export default async function CertificatePage({ params }: { params: Params }) {
  const { code } = await params;
  if (!/^[A-Z0-9-]{6,40}$/i.test(code)) notFound();
  const cert = await getCertificateByCode(code);
  if (!cert) notFound();

  return (
    <div className="container-page py-10 sm:py-14">
      <div className={`no-print mx-auto mb-6 flex max-w-4xl flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${cert.revoked ? "border-danger/30 bg-danger/10" : "border-success/30 bg-success/10"}`}>
        <p className="flex items-center gap-2.5 text-[14.5px]">
          {cert.revoked ? <ShieldAlert className="h-5 w-5 text-danger" /> : <BadgeCheck className="h-5 w-5 text-success" />}
          {cert.revoked ? "Bu sertifikat bekor qilingan va haqiqiy emas." : "Sertifikat haqiqiy: Dasturchi platformasi tomonidan berilgan."}
        </p>
        {!cert.revoked && <PrintButton />}
      </div>

      <article className="relative mx-auto aspect-[1.414/1] w-full max-w-4xl overflow-hidden rounded-2xl border border-border-strong bg-[#fbfaf6] text-[#16161a] shadow-[var(--shadow-lg)] print:rounded-none print:border-0 print:shadow-none">
        <div className="girih absolute inset-0 opacity-[0.07]" aria-hidden />
        <div className="absolute inset-3 rounded-xl border border-[#c9a45c]/50 sm:inset-5" aria-hidden />
        <div className="absolute inset-[18px] rounded-lg border border-[#c9a45c]/25 sm:inset-[26px]" aria-hidden />
        <div className="relative flex h-full flex-col items-center justify-between px-6 py-8 text-center sm:px-16 sm:py-14">
          <div className="flex items-center gap-2">
            <LogoMark size={26} />
            <span className="text-[15px] font-semibold tracking-[-0.02em] sm:text-[17px]">Dasturchi</span>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#8a7a55] sm:text-[11px]">Kursni tamomlaganlik haqida</p>
            <h1 className="font-display-italic mt-1 text-[34px] leading-none text-[#16161a] sm:text-[64px]">Sertifikat</h1>
            <p className="mt-3 text-[11px] text-[#55555f] sm:mt-6 sm:text-[14px]">Ushbu sertifikat</p>
            <p className="mt-1 text-[20px] font-semibold tracking-[-0.02em] sm:mt-2 sm:text-[34px]">{cert.userName}</p>
            <div className="mx-auto my-2 h-px w-40 bg-[#c9a45c]/60 sm:my-4 sm:w-72" />
            <p className="mx-auto max-w-xl text-[11px] leading-relaxed text-[#55555f] sm:text-[15px]">
              ga <span className="font-semibold text-[#16161a]">“{cert.courseTitle}”</span> kursining barcha darslarini o‘zlashtirib, yakuniy imtihondan muvaffaqiyatli o‘tgani uchun berildi.
            </p>
          </div>
          <div className="grid w-full grid-cols-3 items-end gap-4 text-[9px] text-[#55555f] sm:text-[12px]">
            <div className="text-left">
              <p className="font-medium text-[#16161a]">{formatDate(cert.issuedAt)}</p>
              <p className="mt-0.5 border-t border-[#c9a45c]/50 pt-1">Berilgan sana</p>
            </div>
            <div className="grid place-items-center">
              <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-[#c9a45c] text-[#a8843c] sm:h-20 sm:w-20">
                <BadgeCheck className="h-6 w-6 sm:h-9 sm:w-9" strokeWidth={1.4} />
              </span>
            </div>
            <div className="text-right">
              <p className="font-mono font-medium text-[#16161a]">{cert.code}</p>
              <p className="mt-0.5 border-t border-[#c9a45c]/50 pt-1">Tekshirish kodi</p>
            </div>
          </div>
        </div>
      </article>
      <p className="no-print mx-auto mt-6 max-w-4xl text-center text-[13px] text-fg-subtle">
        Bu sertifikatni istalgan kishi <Link href="/sertifikat" className="underline underline-offset-4">tekshirish sahifasida</Link> {cert.code} kodi orqali tasdiqlashi mumkin.
      </p>
    </div>
  );
}
