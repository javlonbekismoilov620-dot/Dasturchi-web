"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteQuizAction, saveQuizAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import type { Quiz, QuizQuestion } from "@/lib/types";
import { cn } from "@/lib/cn";
import { AdminCard, ConfirmButton, Repeater, useAdminAction } from "./form-kit";

export function QuizEditor({ quiz, courseId }: { quiz: Quiz | (Omit<Quiz, "id"> & { id?: string }); courseId: string }) {
  const [q, setQ] = useState(quiz);
  const { pending, run } = useAdminAction();
  const router = useRouter();
  const isNew = !quiz.id;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(() => saveQuizAction(q), "Test saqlandi", (res) => {
          const id = (res as { data?: { id: string } }).data?.id;
          if (isNew && id) router.replace(`/admin/kurslar/${courseId}/testlar/${id}`);
        });
      }}
      className="space-y-6"
    >
      <AdminCard title="Test sozlamalari">
        <Field label="Test nomi" htmlFor="q-title"><Input id="q-title" value={q.title} onChange={(e) => setQ({ ...q, title: e.target.value })} required /></Field>
        <Field label="Tavsif" htmlFor="q-desc"><Textarea id="q-desc" value={q.description} onChange={(e) => setQ({ ...q, description: e.target.value })} rows={2} /></Field>
        <Field label="O‘tish bali (%)" htmlFor="q-pass" className="max-w-[200px]"><Input id="q-pass" type="number" min={1} max={100} value={q.passingScore} onChange={(e) => setQ({ ...q, passingScore: Number(e.target.value) })} /></Field>
      </AdminCard>
      <AdminCard title={`Savollar (${q.questions.length})`} description="To‘g‘ri javobni chapdagi doiracha bilan belgilang.">
        <Repeater<QuizQuestion>
          items={q.questions}
          onChange={(questions) => setQ({ ...q, questions })}
          make={() => ({ id: "", prompt: "", options: ["", ""], correct: 0, explanation: "" })}
          addLabel="Savol qo‘shish"
          render={(item, up) => (
            <div className="space-y-2">
              <Textarea value={item.prompt} onChange={(e) => up({ prompt: e.target.value })} rows={2} placeholder="Savol matni" aria-label="Savol matni" />
              {item.options.map((o, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input type="radio" checked={item.correct === oi} onChange={() => up({ correct: oi })} className="h-4 w-4 accent-[var(--success)]" aria-label={`${oi + 1}-variant to‘g‘ri`} />
                  <Input value={o} onChange={(e) => up({ options: item.options.map((x, k) => (k === oi ? e.target.value : x)) })} className={cn("h-9", item.correct === oi && "border-success")} placeholder={`${String.fromCharCode(65 + oi)} variant`} aria-label={`${oi + 1}-variant`} />
                  <button type="button" disabled={item.options.length <= 2} onClick={() => up({ options: item.options.filter((_, k) => k !== oi), correct: item.correct >= oi && item.correct > 0 ? item.correct - 1 : item.correct })} className="grid h-9 w-9 place-items-center rounded-md text-fg-subtle hover:text-danger disabled:opacity-30" aria-label="Variantni o‘chirish">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {item.options.length < 6 && (
                <button type="button" onClick={() => up({ options: [...item.options, ""] })} className="text-[13px] text-fg-muted hover:text-fg">+ Variant qo‘shish</button>
              )}
              <Textarea value={item.explanation} onChange={(e) => up({ explanation: e.target.value })} rows={2} placeholder="Izoh: nega aynan shu javob to‘g‘ri" aria-label="Izoh" />
            </div>
          )}
        />
      </AdminCard>
      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl border border-border-strong bg-elevated/95 p-3 shadow-[var(--shadow-lg)] backdrop-blur">
        {!isNew ? (
          <ConfirmButton message="Testni va unga oid barcha urinishlarni o‘chirasizmi?" onConfirm={() => run(() => deleteQuizAction(quiz.id!), "Test o‘chirildi", () => router.replace(`/admin/kurslar/${courseId}?tab=dastur`))}>
            <Trash2 className="h-4 w-4" /> O‘chirish
          </ConfirmButton>
        ) : (
          <span />
        )}
        <Button type="submit" loading={pending}>{isNew ? "Testni yaratish" : "Saqlash"}</Button>
      </div>
    </form>
  );
}
