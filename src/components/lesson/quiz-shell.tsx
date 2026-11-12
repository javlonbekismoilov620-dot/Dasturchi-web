"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/ui/theme";

/** Test sahifasi uchun chalg‘itmaydigan qobiq (sarlavha + kontent) */
export function QuizShell({ courseSlug, courseTitle, children }: { courseSlug: string; courseTitle: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="glass sticky top-0 z-30 border-b border-border">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
          <Link href={`/kurslar/${courseSlug}`} className="grid h-9 w-9 place-items-center rounded-lg text-fg-muted hover:bg-fg/5 hover:text-fg" aria-label="Kursga qaytish">
            <ArrowLeft className="h-[18px] w-[18px]" />
          </Link>
          <LogoMark size={22} />
          <p className="min-w-0 flex-1 truncate text-[14px] font-medium">{courseTitle}</p>
          <ThemeToggle />
        </div>
      </header>
      <main id="asosiy" className="mx-auto max-w-3xl px-4 pb-24 pt-10">
        {children}
      </main>
    </div>
  );
}
