"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Award, Bookmark, BookmarkCheck, Check, CheckCircle2, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setLessonCompleteAction, toggleBookmarkAction } from "@/app/actions/learning";
import { cn } from "@/lib/cn";
import { useToast } from "@/components/ui/toast";

export function CompleteButton({
  lessonId,
  initial,
  loggedIn,
  nextHref,
  size = "md",
}: {
  lessonId: string;
  initial: boolean;
  loggedIn: boolean;
  nextHref?: string | null;
  size?: "md" | "lg";
}) {
  const [done, setDone] = useState(initial);
  const [pending, start] = useTransition();
  const [cert, setCert] = useState<string | null>(null);
  const { push } = useToast();
  const router = useRouter();

  const toggle = () => {
    if (!loggedIn) {
      router.push(`/kirish?next=${encodeURIComponent(location.pathname)}`);
      return;
    }
    const next = !done;
    setDone(next);
    start(async () => {
      const res = await setLessonCompleteAction(lessonId, next);
      if ("error" in res) {
        setDone(!next);
        push({ kind: "error", title: "Saqlab bo‘lmadi", description: res.error === "auth" ? "Tizimga qayta kiring." : res.error });
        return;
      }
      if (next) push({ kind: "success", title: "Dars yakunlandi", description: `Kurs progressi: ${res.percent}%` });
      if (res.certificateCode) {
        setCert(res.certificateCode);
        push({ kind: "success", title: "Tabriklaymiz! Sertifikat berildi", description: "Kursni to‘liq yakunladingiz." });
      }
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={done}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-medium transition-all duration-300",
          size === "lg" ? "h-12 px-6 text-[15px]" : "h-10 px-4 text-[14px]",
          done ? "bg-success/15 text-success ring-1 ring-success/30" : "bg-fg text-bg hover:opacity-90",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={done ? "done" : "todo"}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="inline-flex items-center gap-2"
          >
            {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            {done ? "Dars yakunlangan" : "Darsni yakunladim"}
          </motion.span>
        </AnimatePresence>
      </button>
      {done && nextHref && (
        <Link
          href={nextHref}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-xl border border-border-strong font-medium transition-colors hover:bg-fg/[0.04]",
            size === "lg" ? "h-12 px-6 text-[15px]" : "h-10 px-4 text-[14px]",
          )}
        >
          Keyingi dars →
        </Link>
      )}
      {cert && (
        <Link href={`/sertifikat/${cert}`} className="inline-flex h-12 items-center gap-2 rounded-xl bg-gold/15 px-5 text-[14px] font-medium text-gold ring-1 ring-gold/30">
          <Award className="h-4 w-4" /> Sertifikatni ko‘rish
        </Link>
      )}
    </div>
  );
}

export function BookmarkButton({ lessonId, initial, loggedIn }: { lessonId: string; initial: boolean; loggedIn: boolean }) {
  const [on, setOn] = useState(initial);
  const [pending, start] = useTransition();
  const { push } = useToast();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!loggedIn) return router.push(`/kirish?next=${encodeURIComponent(location.pathname)}`);
        setOn(!on);
        start(async () => {
          const res = await toggleBookmarkAction(lessonId);
          if ("error" in res) {
            setOn(on);
            push({ kind: "error", title: "Xatcho‘p saqlanmadi" });
          } else push({ kind: "success", title: res.bookmarked ? "Xatcho‘pga qo‘shildi" : "Xatcho‘pdan olib tashlandi" });
        });
      }}
      aria-pressed={on}
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-border-strong px-3.5 text-[13.5px] transition-colors hover:bg-fg/[0.04]"
    >
      {on ? <BookmarkCheck className="h-4 w-4 text-accent" /> : <Bookmark className="h-4 w-4" />}
      <span className="hidden sm:inline">{on ? "Saqlangan" : "Xatcho‘p"}</span>
    </button>
  );
}

export function CompletedMark() {
  return <Check className="h-3.5 w-3.5" />;
}
