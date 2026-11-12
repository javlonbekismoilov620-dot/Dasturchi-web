"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Award, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { submitQuizAction } from "@/app/actions/learning";
import { cn } from "@/lib/cn";
import { ProgressRing } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";
import { Inline } from "./rich-text";

type Q = { id: string; prompt: string; options: string[] };
type Result = Extract<Awaited<ReturnType<typeof submitQuizAction>>, { ok: true }>;

export function QuizRunner({ quizId, questions, passingScore, courseHref, nextHref }: { quizId: string; questions: Q[]; passingScore: number; courseHref: string; nextHref: string | null }) {
  const [answers, setAnswers] = useState<number[]>(() => questions.map(() => -1));
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [result, setResult] = useState<Result | null>(null);
  const [pending, start] = useTransition();
  const { push } = useToast();
  const router = useRouter();
  const q = questions[i];
  const answered = answers.filter((a) => a >= 0).length;

  const choose = (opt: number) => setAnswers((prev) => prev.map((a, k) => (k === i ? opt : a)));
  const go = (n: number) => {
    setDir(n > i ? 1 : -1);
    setI(n);
  };

  const submit = () =>
    start(async () => {
      const res = await submitQuizAction(quizId, answers);
      if ("error" in res) {
        if (res.error === "auth") router.push(`/kirish?next=${encodeURIComponent(location.pathname)}`);
        else push({ kind: "error", title: "Natija saqlanmadi", description: res.error });
        return;
      }
      setResult(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (res.certificateCode) push({ kind: "success", title: "Tabriklaymiz! Sertifikat berildi" });
      router.refresh();
    });

  if (result) {
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center rounded-2xl border border-border-strong bg-surface p-8 text-center">
          <ProgressRing value={result.score} size={112} stroke={8} color={result.passed ? "teal" : "coral"}>
            <span className="text-[24px] font-semibold">{result.score}%</span>
          </ProgressRing>
          <h2 className="mt-5 text-[24px] font-semibold tracking-tight">{result.passed ? "Test muvaffaqiyatli topshirildi!" : "Bu safar o‘tmadingiz"}</h2>
          <p className="mt-2 text-[15px] text-fg-muted">
            {result.correct} / {result.total} to‘g‘ri javob · o‘tish bali {result.passingScore}%
          </p>
          {!result.passed && <p className="mt-2 max-w-md text-[14px] text-fg-muted">Quyidagi izohlarni o‘qing, tegishli darslarni takrorlang va qayta urinib ko‘ring. Urinishlar soni cheklanmagan.</p>}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {result.certificateCode && (
              <Link href={`/sertifikat/${result.certificateCode}`} className="inline-flex h-11 items-center gap-2 rounded-xl bg-gold/15 px-5 text-[14px] font-medium text-gold ring-1 ring-gold/30">
                <Award className="h-4 w-4" /> Sertifikatni ko‘rish
              </Link>
            )}
            {result.passed && nextHref && (
              <Link href={nextHref} className="inline-flex h-11 items-center gap-2 rounded-xl bg-fg px-5 text-[14px] font-medium text-bg">
                Davom etish <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <button
              onClick={() => {
                setResult(null);
                setAnswers(questions.map(() => -1));
                setI(0);
              }}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-border-strong px-5 text-[14px]"
            >
              <RotateCcw className="h-4 w-4" /> Qayta topshirish
            </button>
            <Link href={courseHref} className="inline-flex h-11 items-center rounded-xl px-4 text-[14px] text-fg-muted hover:text-fg">
              Kursga qaytish
            </Link>
          </div>
        </motion.div>

        <div>
          <h3 className="mb-4 text-[18px] font-semibold">Javoblar tahlili</h3>
          <ol className="space-y-3">
            {questions.map((qq, k) => {
              const r = result.review[k];
              const ok = r.chosen === r.correct;
              return (
                <li key={qq.id} className="rounded-2xl border border-border bg-surface p-5">
                  <p className="flex gap-2.5 font-medium">
                    {ok ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />}
                    <span>{k + 1}. <Inline text={qq.prompt} /></span>
                  </p>
                  <div className="mt-3 space-y-1.5 pl-7 text-[14px]">
                    {!ok && <p className="text-danger">Sizning javobingiz: {r.chosen >= 0 ? qq.options[r.chosen] : "javob berilmagan"}</p>}
                    <p className="text-success">To‘g‘ri javob: {qq.options[r.correct]}</p>
                    <p className="pt-1 leading-relaxed text-fg-muted"><Inline text={r.explanation} /></p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex flex-1 gap-1" aria-hidden>
          {questions.map((_, k) => (
            <button
              key={k}
              onClick={() => go(k)}
              className={cn("h-1.5 flex-1 rounded-full transition-colors", k === i ? "bg-fg" : answers[k] >= 0 ? "bg-accent/60" : "bg-fg/10")}
              tabIndex={-1}
            />
          ))}
        </div>
        <span className="font-mono text-[12.5px] tabular-nums text-fg-muted">
          {i + 1}/{questions.length}
        </span>
      </div>

      <div className="relative min-h-[380px] overflow-hidden">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.fieldset
            key={q.id}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <legend className="lesson-prose mb-6 text-balance !text-[22px] font-semibold !leading-snug tracking-[-0.015em] sm:!text-[26px]"><Inline text={q.prompt} /></legend>
            <div className="space-y-2.5" role="radiogroup">
              {q.options.map((opt, k) => {
                const on = answers[i] === k;
                return (
                  <label
                    key={k}
                    className={cn(
                      "flex cursor-pointer items-center gap-4 rounded-xl border p-4 text-[15px] transition-all duration-200",
                      on ? "border-accent bg-accent-soft shadow-[0_0_0_1px_var(--accent)]" : "border-border bg-surface hover:border-border-strong",
                    )}
                  >
                    <input type="radio" name={q.id} checked={on} onChange={() => choose(k)} className="sr-only" />
                    <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-lg border font-mono text-[12px]", on ? "border-accent bg-accent text-accent-fg" : "border-border-strong text-fg-muted")}>
                      {String.fromCharCode(65 + k)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </label>
                );
              })}
            </div>
          </motion.fieldset>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
        <button onClick={() => go(Math.max(0, i - 1))} disabled={i === 0} className="inline-flex h-11 items-center gap-2 rounded-xl border border-border-strong px-4 text-[14px] disabled:opacity-40">
          <ArrowLeft className="h-4 w-4" /> Oldingi
        </button>
        <span className="hidden text-[13px] text-fg-subtle sm:block">{answered} ta savolga javob berildi · o‘tish bali {passingScore}%</span>
        {i < questions.length - 1 ? (
          <button onClick={() => go(i + 1)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-fg px-5 text-[14px] font-medium text-bg">
            Keyingi <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button onClick={submit} disabled={pending || answered < questions.length} className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-5 text-[14px] font-medium text-accent-fg disabled:opacity-50">
            {pending ? "Tekshirilmoqda…" : answered < questions.length ? `Yana ${questions.length - answered} ta savol` : "Natijani ko‘rish"}
          </button>
        )}
      </div>
    </div>
  );
}
