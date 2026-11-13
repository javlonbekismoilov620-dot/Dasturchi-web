"use client";

import { ArrowDown, ArrowUp, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type ReactNode } from "react";
import { uploadMediaAction } from "@/app/actions/admin";
import type { MediaAsset } from "@/lib/types";
import { cn } from "@/lib/cn";
import { inputClass } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";

type R = { ok: true; data?: unknown } | { ok: false; error: string };

/** Admin amallarini bajarish: kutish holati, xabarnoma, sahifani yangilash */
export function useAdminAction() {
  const [pending, start] = useTransition();
  const { push } = useToast();
  const router = useRouter();
  const run = (fn: () => Promise<R | void>, success?: string, after?: (r: R) => void) =>
    start(async () => {
      try {
        const res = await fn();
        if (!res) return;
        if (res.ok) {
          if (success) push({ kind: "success", title: success });
          after?.(res);
          router.refresh();
        } else push({ kind: "error", title: "Saqlanmadi", description: res.error });
      } catch (e) {
        // redirect() xatosi — normal holat
        if ((e as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) throw e;
        push({ kind: "error", title: "Xatolik", description: (e as Error).message });
      }
    });
  return { pending, run };
}

/** Har bir qator — alohida element */
export function LinesInput({ value, onChange, rows = 4, placeholder, id }: { value: string[]; onChange: (v: string[]) => void; rows?: number; placeholder?: string; id?: string }) {
  const [text, setText] = useState(value.join("\n"));
  return (
    <textarea
      id={id}
      value={text}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => {
        setText(e.target.value);
        onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean));
      }}
      className={cn(inputClass, "py-2.5 leading-relaxed")}
    />
  );
}

/** Takrorlanuvchi kartochkalar muharriri */
export function Repeater<T>({
  items,
  onChange,
  make,
  render,
  addLabel,
  max = 50,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  make: () => T;
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  addLabel: string;
  max?: number;
}) {
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-border bg-bg-subtle p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[12px] text-fg-subtle">#{i + 1}</span>
            <div className="flex gap-1">
              <IconBtn label="Yuqoriga" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp className="h-3.5 w-3.5" /></IconBtn>
              <IconBtn label="Pastga" onClick={() => move(i, 1)} disabled={i === items.length - 1}><ArrowDown className="h-3.5 w-3.5" /></IconBtn>
              <IconBtn label="O‘chirish" onClick={() => onChange(items.filter((_, k) => k !== i))} danger><Trash2 className="h-3.5 w-3.5" /></IconBtn>
            </div>
          </div>
          {render(item, (patch) => onChange(items.map((x, k) => (k === i ? { ...x, ...patch } : x))), i)}
        </div>
      ))}
      {items.length < max && (
        <button type="button" onClick={() => onChange([...items, make()])} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-dashed border-border-strong px-3 text-[13px] text-fg-muted hover:text-fg">
          <Plus className="h-3.5 w-3.5" /> {addLabel}
        </button>
      )}
    </div>
  );
}

export function IconBtn({ children, label, onClick, disabled, danger }: { children: ReactNode; label: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label} className={cn("grid h-7 w-7 place-items-center rounded-md text-fg-subtle transition-colors hover:bg-fg/5 disabled:opacity-30", danger ? "hover:text-danger" : "hover:text-fg")}>
      {children}
    </button>
  );
}

/** Faylni yuklash va URL qaytarish */
export function UploadButton({ accept, onUploaded, label = "Fayl yuklash", maxMb }: { accept?: string; onUploaded: (asset: MediaAsset) => void; label?: string; maxMb?: number }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const { push } = useToast();
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (maxMb && file.size > maxMb * 1024 * 1024) {
            e.target.value = "";
            push({ kind: "error", title: "Yuklanmadi", description: `Fayl hajmi ${maxMb} MB dan oshmasligi kerak` });
            return;
          }
          setBusy(true);
          const fd = new FormData();
          fd.append("file", file);
          const res = await uploadMediaAction(fd);
          setBusy(false);
          e.target.value = "";
          if (res.ok && res.data) {
            onUploaded(res.data);
            push({ kind: "success", title: "Fayl yuklandi", description: res.data.name });
          } else if (!res.ok) push({ kind: "error", title: "Yuklanmadi", description: res.error });
        }}
      />
      <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[10px] border border-border-strong px-3 text-[13px] hover:bg-fg/[0.04] disabled:opacity-60">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {busy ? "Yuklanmoqda…" : label}
      </button>
    </>
  );
}

export function AdminCard({ title, description, children, className }: { title: string; description?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-border bg-surface p-5 sm:p-6", className)}>
      <h2 className="text-[16px] font-semibold">{title}</h2>
      {description && <p className="mt-0.5 text-[13px] text-fg-muted">{description}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function ConfirmButton({ onConfirm, children, message, className }: { onConfirm: () => void; children: ReactNode; message: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (window.confirm(message)) onConfirm();
      }}
      className={cn("inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] text-danger hover:bg-danger/10", className)}
    >
      {children}
    </button>
  );
}
