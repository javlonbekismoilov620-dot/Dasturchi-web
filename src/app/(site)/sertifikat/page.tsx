import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getCertificateByCode } from "@/lib/server/services/learning";

export const metadata: Metadata = { title: "Sertifikatni tekshirish" };

async function lookup(form: FormData) {
  "use server";
  const code = String(form.get("code") ?? "").trim().toUpperCase();
  if (!/^[A-Z0-9-]{6,40}$/.test(code)) redirect("/sertifikat?topilmadi=1");
  const cert = await getCertificateByCode(code);
  redirect(cert ? `/sertifikat/${cert.code}` : "/sertifikat?topilmadi=1");
}

export default async function VerifyPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return (
    <div className="container-page grid min-h-[60dvh] place-items-center py-16">
      <div className="w-full max-w-md text-center">
        <ShieldCheck className="mx-auto h-10 w-10 text-fg-muted" strokeWidth={1.4} />
        <h1 className="mt-5 text-[30px] font-semibold tracking-[-0.03em]">Sertifikatni tekshirish</h1>
        <p className="mt-2 text-[15px] text-fg-muted">Sertifikatdagi tekshirish kodini kiriting (masalan: DCH-AB12C-DE34F).</p>
        <form action={lookup} className="mt-8 flex gap-2">
          <label htmlFor="code" className="sr-only">Tekshirish kodi</label>
          <input id="code" name="code" required placeholder="DCH-XXXXX-XXXXX" className="h-12 flex-1 rounded-xl border border-border-strong bg-surface px-4 font-mono text-[15px] uppercase outline-none focus:border-accent focus:ring-4 focus:ring-accent/15" />
          <button className="h-12 rounded-xl bg-fg px-5 text-[14px] font-medium text-bg">Tekshirish</button>
        </form>
        {sp.topilmadi && <p className="mt-4 text-[14px] text-danger" role="alert">Bunday kodli sertifikat topilmadi. Kodni tekshirib, qayta kiriting.</p>}
      </div>
    </div>
  );
}
