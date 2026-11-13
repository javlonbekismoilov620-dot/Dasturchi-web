"use client";

import { Bookmark, BookmarkCheck, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleSaveCourseAction } from "@/app/actions/learning";
import { cn } from "@/lib/cn";
import { useToast } from "@/components/ui/toast";

export function SaveCourseButton({ courseId, initial, loggedIn, className }: { courseId: string; initial: boolean; loggedIn: boolean; className?: string }) {
  const [saved, setSaved] = useState(initial);
  const [pending, start] = useTransition();
  const { push } = useToast();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!loggedIn) {
          router.push(`/kirish?next=${encodeURIComponent(location.pathname)}`);
          return;
        }
        start(async () => {
          const res = await toggleSaveCourseAction(courseId);
          if ("saved" in res) {
            setSaved(res.saved);
            push({ kind: "success", title: res.saved ? "Kurs saqlandi" : "Saqlanganlardan olib tashlandi" });
          } else push({ kind: "error", title: "Saqlab bo‘lmadi", description: res.error });
        });
      }}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border-strong px-4 text-[14px] font-medium transition-colors hover:bg-fg/[0.04]",
        className,
      )}
      aria-pressed={saved}
    >
      {saved ? <BookmarkCheck className="h-4 w-4 text-accent" /> : <Bookmark className="h-4 w-4" />}
      {saved ? "Saqlangan" : "Saqlash"}
    </button>
  );
}

export function ShareButton({ title }: { title: string }) {
  const { push } = useToast();
  return (
    <button
      type="button"
      onClick={async () => {
        const url = location.href;
        try {
          if (navigator.share) await navigator.share({ title, url });
          else {
            await navigator.clipboard.writeText(url);
            push({ kind: "success", title: "Havola nusxalandi" });
          }
        } catch {
          /* bekor qilindi */
        }
      }}
      className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border-strong transition-colors hover:bg-fg/[0.04]"
      aria-label="Ulashish"
    >
      <Share2 className="h-4 w-4" />
    </button>
  );
}
