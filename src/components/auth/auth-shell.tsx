import type { ReactNode } from "react";
import { LogoMark } from "@/components/layout/logo";

export function AuthShell({ title, subtitle, children, aside }: { title: string; subtitle: string; children: ReactNode; aside: ReactNode }) {
  return (
    <div className="container-page grid min-h-[calc(100dvh-64px)] items-center gap-12 py-12 lg:grid-cols-[1fr_1fr]">
      <div className="mx-auto w-full max-w-[400px]">
        <LogoMark size={36} />
        <h1 className="mt-6 text-[30px] font-semibold tracking-[-0.03em]">{title}</h1>
        <p className="mt-2 text-[15px] text-fg-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
      <div className="relative hidden h-full min-h-[560px] overflow-hidden rounded-[28px] border border-border bg-surface lg:block">
        <div className="girih absolute inset-0 opacity-[0.08]" aria-hidden />
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_35%,transparent),transparent_70%)] blur-2xl" aria-hidden />
        <div className="absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--teal)_25%,transparent),transparent_70%)] blur-2xl" aria-hidden />
        <div className="relative flex h-full flex-col justify-end p-10">{aside}</div>
      </div>
    </div>
  );
}
