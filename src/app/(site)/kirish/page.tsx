import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/auth-forms";
import { authMode, getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Kirish", robots: { index: false } };

const ERRORS: Record<string, string> = {
  google: "Google orqali kirish hozircha sozlanmagan yoki xatolik yuz berdi.",
  callback: "Kirish havolasi eskirgan yoki noto‘g‘ri. Qayta urinib ko‘ring.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const next = sp.next && sp.next.startsWith("/") && !sp.next.startsWith("//") ? sp.next : "/kabinet";
  if (await getCurrentUser()) redirect(next);
  const mode = authMode();
  return (
    <AuthShell
      title="Xush kelibsiz"
      subtitle="Hisobingizga kiring va o‘qishni to‘xtagan joyingizdan davom ettiring."
      aside={
        <blockquote>
          <p className="font-display-italic text-[34px] leading-[1.15] tracking-[-0.01em]">“Ilm — yo‘qolmas xazina.”</p>
          <footer className="mt-4 text-[14px] text-fg-muted">Xalq maqoli</footer>
        </blockquote>
      }
    >
      <LoginForm next={next} google={mode.google} error={sp.xato ? ERRORS[sp.xato] : undefined} />
    </AuthShell>
  );
}
