"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { highlight } from "@/lib/highlight";
import { cn } from "@/lib/cn";

/** Sintaksis yoritilgan, yengil kod muharriri (textarea + yoritilgan qatlam) */
export function CodeEditor({
  value,
  onChange,
  language,
  onRun,
  className,
  minHeight = 220,
  label = "Kod muharriri",
}: {
  value: string;
  onChange: (v: string) => void;
  language: string;
  onRun?: () => void;
  className?: string;
  minHeight?: number;
  label?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const html = useMemo(() => highlight(value, language) + "\n", [value, language]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.max(el.scrollHeight, minHeight)}px`;
  }, [value, minHeight]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onRun?.();
      return;
    }
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const { selectionStart: s, selectionEnd: en } = el;
      const next = value.slice(0, s) + "  " + value.slice(en);
      onChange(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = s + 2;
      });
    } else if (e.key === "Enter") {
      // Avtomatik surilish: joriy qator boshidagi bo‘sh joylarni saqlash
      const { selectionStart: s, selectionEnd: en } = el;
      const lineStart = value.lastIndexOf("\n", s - 1) + 1;
      const indent = /^[ \t]*/.exec(value.slice(lineStart, s))?.[0] ?? "";
      const prevChar = value[s - 1];
      const extra = prevChar === "{" || prevChar === ":" || prevChar === ">" ? "  " : "";
      if (!indent && !extra) return;
      e.preventDefault();
      const insert = "\n" + indent + extra;
      onChange(value.slice(0, s) + insert + value.slice(en));
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = s + insert.length;
      });
    } else if (e.key === "Escape") {
      el.blur();
    }
  };

  return (
    <div className={cn("code-surface relative font-mono text-[13px] leading-[1.7] sm:text-[13.5px]", className)}>
      <pre
        aria-hidden
        className="pointer-events-none absolute inset-0 m-0 overflow-hidden whitespace-pre-wrap break-words p-4 text-fg"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        aria-label={`${label}. Ishga tushirish uchun Ctrl+Enter, muharrirdan chiqish uchun Esc tugmasini bosing.`}
        className="relative block w-full resize-none overflow-hidden whitespace-pre-wrap break-words bg-transparent p-4 text-transparent caret-[var(--fg)] outline-none selection:bg-accent/25"
        style={{ minHeight }}
      />
    </div>
  );
}
