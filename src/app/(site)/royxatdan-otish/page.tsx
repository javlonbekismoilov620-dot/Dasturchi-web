import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/auth-forms";
import { authMode, getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Ro‘yxatdan o‘tish", robots: { index: false } };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const next = sp.next && sp.next.startsWith("/") && !sp.next.startsWith("//") ? sp.next : "/baholash";
  if (await getCurrentUser()) redirect("/kabinet");
  const mode = authMode();
  return (
    <AuthShell
      title="Ta’limni boshlang"
      subtitle="Bepul hisob yarating — progressingiz, qaydlaringiz va sertifikatlaringiz saqlanadi."
      aside={
        <div>
          <p className="text-[26px] font-semibold leading-tight tracking-[-0.02em]">Hisob yaratganingizdan so‘ng:</p>
          <ul className="mt-6 space-y-3 text-[15px] text-fg-muted">
            {[
              "2 daqiqalik savolnoma orqali darajangiz aniqlanadi",
              "Sizga mos o‘quv yo‘li tavsiya qilinadi",
              "Har bir dars va test natijasi saqlanadi",
              "Kursni yakunlab, sertifikat olasiz",
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <RegisterForm next={next} google={mode.google} />
    </AuthShell>
  );
}
