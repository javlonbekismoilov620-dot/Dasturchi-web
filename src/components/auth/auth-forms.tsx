"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { googleLoginAction, loginAction, registerAction, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

function PasswordInput({ id, name, autoComplete, invalid }: { id: string; name: string; autoComplete: string; invalid?: boolean }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input id={id} name={name} type={show ? "text" : "password"} autoComplete={autoComplete} required className="pr-11" aria-invalid={invalid || undefined} />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-fg-subtle hover:text-fg"
        aria-label={show ? "Parolni yashirish" : "Parolni ko‘rsatish"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function Alert({ state }: { state: AuthState }) {
  if (!state?.error && !state?.info) return null;
  return (
    <p
      role="alert"
      className={
        state.error
          ? "rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-[13.5px] text-danger"
          : "rounded-lg border border-success/30 bg-success/10 px-3 py-2.5 text-[13.5px] text-success"
      }
    >
      {state.error ?? state.info}
    </p>
  );
}

function GoogleButton({ next }: { next: string }) {
  return (
    <form action={googleLoginAction}>
      <input type="hidden" name="next" value={next} />
      <button className="flex h-11 w-full items-center justify-center gap-2.5 rounded-[10px] border border-border-strong bg-surface text-[14px] font-medium transition-colors hover:bg-fg/[0.04]">
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
        Google orqali davom etish
      </button>
    </form>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 text-[12px] text-fg-subtle">
      <span className="h-px flex-1 bg-border" />
      yoki
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function LoginForm({ next, google, error }: { next: string; google: boolean; error?: string }) {
  const [state, action, pending] = useActionState(loginAction, error ? { error } : null);
  return (
    <div className="space-y-5">
      {google && (
        <>
          <GoogleButton next={next} />
          <Divider />
        </>
      )}
      <form action={action} className="space-y-4" noValidate>
        <input type="hidden" name="next" value={next} />
        <Alert state={state} />
        <Field label="Elektron pochta" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" required defaultValue={state?.fields?.email} placeholder="siz@misol.uz" />
        </Field>
        <Field label="Parol" htmlFor="password">
          <PasswordInput id="password" name="password" autoComplete="current-password" invalid={Boolean(state?.error)} />
        </Field>
        <Button type="submit" size="lg" className="w-full" loading={pending}>
          Kirish
        </Button>
      </form>
      <p className="text-center text-[14px] text-fg-muted">
        Hisobingiz yo‘qmi?{" "}
        <Link href={`/royxatdan-otish${next !== "/kabinet" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-fg underline-offset-4 hover:underline">
          Ro‘yxatdan o‘ting
        </Link>
      </p>
    </div>
  );
}

export function RegisterForm({ next, google }: { next: string; google: boolean }) {
  const [state, action, pending] = useActionState(registerAction, null);
  return (
    <div className="space-y-5">
      {google && (
        <>
          <GoogleButton next={next} />
          <Divider />
        </>
      )}
      <form action={action} className="space-y-4" noValidate>
        <input type="hidden" name="next" value={next} />
        <Alert state={state} />
        <Field label="Ismingiz" htmlFor="name">
          <Input id="name" name="name" autoComplete="name" required defaultValue={state?.fields?.name} placeholder="Masalan: Dilnoza Karimova" />
        </Field>
        <Field label="Elektron pochta" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" required defaultValue={state?.fields?.email} placeholder="siz@misol.uz" />
        </Field>
        <Field label="Parol" htmlFor="password" hint="Kamida 8 ta belgi, harf va raqam bo‘lsin.">
          <PasswordInput id="password" name="password" autoComplete="new-password" />
        </Field>
        <label className="flex items-start gap-2.5 text-[13.5px] leading-snug text-fg-muted">
          <input type="checkbox" name="terms" className="mt-0.5 h-4 w-4 accent-[var(--accent)]" required />
          Ma’lumotlarim faqat o‘quv jarayoni uchun saqlanishiga roziman.
        </label>
        <Button type="submit" size="lg" className="w-full" loading={pending}>
          Hisob yaratish
        </Button>
      </form>
      <p className="text-center text-[14px] text-fg-muted">
        Hisobingiz bormi?{" "}
        <Link href="/kirish" className="font-medium text-fg underline-offset-4 hover:underline">
          Kirish
        </Link>
      </p>
    </div>
  );
}
