"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main id="asosiy" className="grid min-h-[70dvh] place-items-center px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-[13px] text-fg-subtle">Xatolik</p>
        <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.03em]">Nimadir noto‘g‘ri ketdi</h1>
        <p className="mt-3 text-[15px] text-fg-muted">Sahifani yuklashda kutilmagan xato yuz berdi. Qayta urinib ko‘ring — muammo takrorlansa, birozdan so‘ng qayting.</p>
        {error.digest && <p className="mt-2 font-mono text-[12px] text-fg-subtle">Kod: {error.digest}</p>}
        <button onClick={reset} className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-fg px-5 text-[14px] font-medium text-bg">
          <RotateCcw className="h-4 w-4" /> Qayta urinish
        </button>
      </div>
    </main>
  );
}
