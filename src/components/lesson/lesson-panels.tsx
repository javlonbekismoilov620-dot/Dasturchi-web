"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Bot, Download, Loader2, MessageCircleQuestion, NotebookPen, Send, Sparkles, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { askQuestionAction, deleteQuestionAction, replyQuestionAction, saveNoteAction } from "@/app/actions/learning";
import type { Question, QuestionReply } from "@/lib/types";
import { cn } from "@/lib/cn";
import { timeAgo } from "@/lib/text";
import { Avatar } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";

type QA = Question & { replies: QuestionReply[] };

export function LessonPanels({
  lessonId,
  lessonTitle,
  loggedIn,
  userId,
  isAdmin,
  initialNote,
  questions,
  aiEnabled,
  loginHref,
}: {
  loginHref: string;
  lessonId: string;
  lessonTitle: string;
  loggedIn: boolean;
  userId: string | null;
  isAdmin: boolean;
  initialNote: string;
  questions: QA[];
  aiEnabled: boolean;
}) {
  const [tab, setTab] = useState<"notes" | "qa" | "ai">("notes");
  const tabs = [
    { id: "notes" as const, label: "Qaydlarim", icon: NotebookPen },
    { id: "qa" as const, label: `Savol-javob${questions.length ? ` (${questions.length})` : ""}`, icon: MessageCircleQuestion },
    { id: "ai" as const, label: "AI ustoz", icon: Sparkles },
  ];
  return (
    <section className="rounded-2xl border border-border bg-surface" aria-label="Dars vositalari">
      <div className="flex gap-1 overflow-x-auto border-b border-border p-1.5 no-scrollbar" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn("relative flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-[13.5px] transition-colors", tab === t.id ? "text-fg" : "text-fg-muted hover:text-fg")}
          >
            {tab === t.id && <motion.span layoutId="lesson-tab" className="absolute inset-0 rounded-lg bg-fg/[0.07]" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
            <t.icon className="relative h-4 w-4" />
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>
      <div className="p-4 sm:p-5">
        {!loggedIn ? (
          <p className="py-6 text-center text-[14px] text-fg-muted">
            Qaydlar yozish, savol berish va AI ustozdan foydalanish uchun{" "}
            <Link href={loginHref} className="font-medium text-fg underline underline-offset-4">
              tizimga kiring
            </Link>
            .
          </p>
        ) : tab === "notes" ? (
          <NotesPanel lessonId={lessonId} lessonTitle={lessonTitle} initial={initialNote} />
        ) : tab === "qa" ? (
          <QaPanel lessonId={lessonId} questions={questions} userId={userId} isAdmin={isAdmin} />
        ) : (
          <AiPanel lessonId={lessonId} enabled={aiEnabled} />
        )}
      </div>
    </section>
  );
}

function NotesPanel({ lessonId, lessonTitle, initial }: { lessonId: string; lessonTitle: string; initial: string }) {
  const [text, setText] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setStatus("saving");
    const t = setTimeout(async () => {
      const res = await saveNoteAction(lessonId, text);
      setStatus("error" in res ? "error" : "saved");
    }, 800);
    return () => clearTimeout(t);
  }, [text, lessonId]);

  const download = () => {
    const blob = new Blob([`${lessonTitle}\n\n${text}`], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `qaydlar-${lessonTitle.toLowerCase().replace(/[^a-z0-9]+/gi, "-").slice(0, 40)}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <label htmlFor="note" className="sr-only">Qaydlarim</label>
      <textarea
        id="note"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={7}
        maxLength={20000}
        placeholder="Muhim fikrlar, savollar va o‘zingiz uchun eslatmalarni shu yerga yozing. Qaydlar avtomatik saqlanadi."
        className="w-full resize-y rounded-xl border border-border bg-bg-subtle p-4 text-[15px] leading-relaxed outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
      />
      <div className="mt-2 flex items-center justify-between text-[12.5px] text-fg-subtle">
        <span aria-live="polite">
          {status === "saving" && "Saqlanmoqda…"}
          {status === "saved" && "Saqlandi ✓"}
          {status === "error" && <span className="text-danger">Saqlab bo‘lmadi</span>}
          {status === "idle" && (text ? "Saqlangan" : "Hali qayd yo‘q")}
        </span>
        {text && (
          <button onClick={download} className="inline-flex items-center gap-1.5 hover:text-fg">
            <Download className="h-3.5 w-3.5" /> .txt yuklab olish
          </button>
        )}
      </div>
    </div>
  );
}

function QaPanel({ lessonId, questions, userId, isAdmin }: { lessonId: string; questions: QA[]; userId: string | null; isAdmin: boolean }) {
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();
  const { push } = useToast();
  const router = useRouter();
  const path = usePathname();
  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          start(async () => {
            const res = await askQuestionAction(lessonId, body);
            if ("error" in res) push({ kind: "error", title: "Savol yuborilmadi", description: res.error });
            else {
              setBody("");
              push({ kind: "success", title: "Savolingiz joylandi" });
              router.refresh();
            }
          });
        }}
        className="space-y-2"
      >
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          maxLength={4000}
          placeholder="Dars bo‘yicha savolingizni aniq yozing: nima qildingiz, nima kutdingiz va nima bo‘ldi?"
          className="w-full resize-y rounded-xl border border-border bg-bg-subtle p-3.5 text-[14.5px] outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
          aria-label="Savol matni"
        />
        <div className="flex justify-end">
          <button disabled={pending || body.trim().length < 5} className="inline-flex h-9 items-center gap-2 rounded-lg bg-fg px-4 text-[13.5px] font-medium text-bg disabled:opacity-50">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-3.5 w-3.5" />} Savol berish
          </button>
        </div>
      </form>
      {questions.length === 0 ? (
        <p className="py-4 text-center text-[14px] text-fg-subtle">Bu dars bo‘yicha hali savollar yo‘q. Birinchi bo‘lib so‘rang!</p>
      ) : (
        <ul className="space-y-4">
          {questions.map((q) => (
            <QuestionItem key={q.id} q={q} canDelete={q.userId === userId || isAdmin} path={path} />
          ))}
        </ul>
      )}
    </div>
  );
}

function QuestionItem({ q, canDelete, path }: { q: QA; canDelete: boolean; path: string }) {
  const [reply, setReply] = useState("");
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const { push } = useToast();
  const router = useRouter();
  return (
    <li className="rounded-xl border border-border p-4">
      <div className="flex items-start gap-3">
        <Avatar name={q.authorName} size={30} />
        <div className="min-w-0 flex-1">
          <p className="text-[13px]">
            <span className="font-medium">{q.authorName}</span> <span className="text-fg-subtle">· {timeAgo(q.createdAt)}</span>
          </p>
          <p className="mt-1 whitespace-pre-wrap text-[14.5px] leading-relaxed">{q.body}</p>
          <ul className="mt-3 space-y-3">
            {q.replies.map((r) => (
              <li key={r.id} className="flex items-start gap-2.5 border-l-2 border-border pl-3">
                <Avatar name={r.authorName} size={24} />
                <div>
                  <p className="text-[12.5px]">
                    <span className="font-medium">{r.authorName}</span>
                    {r.isStaff && <span className="ml-1.5 rounded bg-accent-soft px-1.5 py-0.5 text-[10.5px] font-medium text-accent">Ustoz</span>}
                    <span className="text-fg-subtle"> · {timeAgo(r.createdAt)}</span>
                  </p>
                  <p className="mt-0.5 whitespace-pre-wrap text-[14px] leading-relaxed text-fg-muted">{r.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-3 text-[12.5px] text-fg-subtle">
            <button onClick={() => setOpen((v) => !v)} className="hover:text-fg">Javob yozish</button>
            {canDelete && (
              <button
                onClick={() =>
                  start(async () => {
                    await deleteQuestionAction(q.id, path);
                    router.refresh();
                  })
                }
                className="inline-flex items-center gap-1 hover:text-danger"
              >
                <Trash2 className="h-3 w-3" /> O‘chirish
              </button>
            )}
          </div>
          {open && (
            <form
              className="mt-2 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                start(async () => {
                  const res = await replyQuestionAction(q.id, reply, path);
                  if ("error" in res) push({ kind: "error", title: "Javob yuborilmadi", description: res.error });
                  else {
                    setReply("");
                    setOpen(false);
                    router.refresh();
                  }
                });
              }}
            >
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Javobingiz…"
                className="h-9 flex-1 rounded-lg border border-border bg-bg-subtle px-3 text-[14px] outline-none focus:border-accent"
                aria-label="Javob matni"
              />
              <button disabled={pending || reply.trim().length < 5} className="h-9 rounded-lg bg-fg px-3 text-[13px] text-bg disabled:opacity-50">Yuborish</button>
            </form>
          )}
        </div>
      </div>
    </li>
  );
}

type Msg = { role: "user" | "assistant"; content: string };

function AiPanel({ lessonId, enabled }: { lessonId: string; enabled: boolean }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  if (!enabled) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-fg/[0.05] text-fg-muted">
          <Bot className="h-5 w-5" />
        </span>
        <p className="mt-4 text-[15px] font-medium">AI ustoz hali ulanmagan</p>
        <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-fg-muted">
          Bu funksiya sun’iy intellekt xizmatiga ulanishni talab qiladi. Platforma administratori API kalitini sozlagandan so‘ng, bu yerda dars mavzusi bo‘yicha o‘zbek tilida savol bera olasiz. Hozircha “Savol-javob” bo‘limidan foydalaning.
        </p>
      </div>
    );
  }

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, messages: next.slice(-12) }),
      });
      if (!res.ok || !res.body) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        setMessages([...next, { role: "assistant", content: `⚠ ${err.error ?? "Xatolik yuz berdi."}` }]);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
    } catch {
      setMessages([...next, { role: "assistant", content: "⚠ Tarmoq xatosi. Internet aloqasini tekshiring." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div ref={listRef} className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-[13.5px] text-fg-muted">Dars mavzusi bo‘yicha savol bering. Masalan:</p>
            {["Buni oddiyroq misol bilan tushuntirib bera olasizmi?", "Bu bilim real loyihada qayerda ishlatiladi?", "Mashqni qanday boshlasam bo‘ladi?"].map((s) => (
              <button key={s} onClick={() => setInput(s)} className="block w-full rounded-lg border border-border px-3 py-2 text-left text-[13.5px] text-fg-muted hover:border-border-strong hover:text-fg">
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn("max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed", m.role === "user" ? "ml-auto bg-fg text-bg" : "bg-bg-subtle")}>
            {m.content || <Loader2 className="h-4 w-4 animate-spin text-fg-subtle" />}
          </div>
        ))}
      </div>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={4000}
          placeholder="Savolingizni yozing…"
          className="h-10 flex-1 rounded-xl border border-border bg-bg-subtle px-3.5 text-[14.5px] outline-none focus:border-accent"
          aria-label="AI ustozga savol"
        />
        <button disabled={busy || !input.trim()} className="grid h-10 w-10 place-items-center rounded-xl bg-fg text-bg disabled:opacity-50" aria-label="Yuborish">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
      <p className="mt-2 text-[11.5px] text-fg-subtle">AI xato qilishi mumkin — muhim ma’lumotlarni dars materiali bilan solishtiring.</p>
    </div>
  );
}
