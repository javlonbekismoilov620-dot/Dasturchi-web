"use client";

import { useActionState } from "react";
import { changePasswordAction, updateProfileAction } from "@/app/actions/learning";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/cn";

type Cat = { slug: string; title: string };

function Status({ state, ok }: { state: { error?: string; ok?: boolean } | null; ok: string }) {
  if (!state) return null;
  return (
    <p role="status" className={cn("text-[13.5px]", state.error ? "text-danger" : "text-success")}>
      {state.error ?? ok}
    </p>
  );
}

export function ProfileForm({
  user,
  categories,
}: {
  user: { name: string; email: string; bio: string; goal: string; weeklyGoal: number; interests: string[] };
  categories: Cat[];
}) {
  const [state, action, pending] = useActionState(updateProfileAction, null);
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Ism" htmlFor="name">
          <Input id="name" name="name" defaultValue={user.name} required />
        </Field>
        <Field label="Elektron pochta" htmlFor="email" hint="Pochta manzilini o‘zgartirib bo‘lmaydi.">
          <Input id="email" defaultValue={user.email} disabled />
        </Field>
      </div>
      <Field label="O‘zim haqimda" htmlFor="bio" optional>
        <Textarea id="bio" name="bio" defaultValue={user.bio} maxLength={500} rows={3} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-[1fr_200px]">
        <Field label="O‘quv maqsadim" htmlFor="goal" optional hint="Masalan: “6 oyda frontend dasturchi bo‘lish”">
          <Input id="goal" name="goal" defaultValue={user.goal} maxLength={200} />
        </Field>
        <Field label="Haftalik maqsad (dars)" htmlFor="weeklyGoal">
          <Input id="weeklyGoal" name="weeklyGoal" type="number" min={1} max={50} defaultValue={user.weeklyGoal} required />
        </Field>
      </div>
      <fieldset>
        <legend className="mb-2 text-[13px] font-medium">Qiziqishlarim</legend>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <label key={c.slug} className="cursor-pointer">
              <input type="checkbox" name="interests" value={c.slug} defaultChecked={user.interests.includes(c.slug)} className="peer sr-only" />
              <span className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-[13.5px] text-fg-muted transition-colors peer-checked:border-transparent peer-checked:bg-fg peer-checked:text-bg peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                {c.title}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex items-center gap-4">
        <Button type="submit" loading={pending}>Saqlash</Button>
        <Status state={state} ok="Profil yangilandi." />
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, null);
  return (
    <form action={action} className="space-y-4">
      <Field label="Joriy parol" htmlFor="current">
        <Input id="current" name="current" type="password" autoComplete="current-password" required />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Yangi parol" htmlFor="next" hint="Kamida 8 ta belgi, harf va raqam.">
          <Input id="next" name="next" type="password" autoComplete="new-password" required />
        </Field>
        <Field label="Yangi parolni takrorlang" htmlFor="confirm">
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required />
        </Field>
      </div>
      <div className="flex items-center gap-4">
        <Button type="submit" variant="secondary" loading={pending}>Parolni yangilash</Button>
        <Status state={state} ok="Parol yangilandi. Boshqa qurilmalardagi sessiyalar yopildi." />
      </div>
    </form>
  );
}
