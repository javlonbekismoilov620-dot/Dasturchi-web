import Link from "next/link";
import { LogoMark } from "@/components/layout/logo";

export default function NotFound() {
  return (
    <main id="asosiy" className="grid min-h-dvh place-items-center px-4">
      <div className="relative text-center">
        <div className="girih pointer-events-none absolute -inset-40 opacity-[var(--pattern-opacity)] [mask-image:radial-gradient(circle,black,transparent_65%)]" aria-hidden />
        <LogoMark size={40} className="relative mx-auto" />
        <p className="relative mt-8 font-mono text-[13px] text-fg-subtle">404</p>
        <h1 className="relative mt-2 text-[34px] font-semibold tracking-[-0.035em] sm:text-[44px]">Sahifa topilmadi</h1>
        <p className="relative mx-auto mt-3 max-w-md text-[16px] text-fg-muted">Siz qidirgan sahifa ko‘chirilgan, o‘chirilgan yoki umuman mavjud bo‘lmagan bo‘lishi mumkin.</p>
        <div className="relative mt-8 flex justify-center gap-2">
          <Link href="/" className="inline-flex h-11 items-center rounded-xl bg-fg px-5 text-[14px] font-medium text-bg">Bosh sahifa</Link>
          <Link href="/kurslar" className="inline-flex h-11 items-center rounded-xl border border-border-strong px-5 text-[14px]">Kurslar</Link>
        </div>
      </div>
    </main>
  );
}
