"use client";

import { Check, Copy, FileText, Film, Image as ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  deleteCategoryAction,
  deleteMediaAction,
  deleteQuestionAdminAction,
  saveCategoryAction,
  setCertificateRevokedAction,
  setRoleAction,
} from "@/app/actions/admin";
import { replyQuestionAction } from "@/app/actions/learning";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { ICON_NAMES, Icon } from "@/components/ui/icon";
import { COLOR_KEYS, colorVar, tint } from "@/lib/colors";
import type { Category, ColorKey, MediaAsset } from "@/lib/types";
import { cn } from "@/lib/cn";
import { ConfirmButton, LinesInput, UploadButton, useAdminAction } from "./form-kit";

/* ── Yo‘nalishlar ─────────────────────────────────────────── */
type CatDraft = { id?: string; slug?: string; title: string; description: string; icon: string; color: ColorKey; topics: string[] };

export function CategoryManager({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  const [editing, setEditing] = useState<CatDraft | null>(null);
  const { pending, run } = useAdminAction();
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        {categories.map((c) => (
          <div key={c.id} className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ background: tint(c.color, 12), color: colorVar[c.color] }}><Icon name={c.icon} className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{c.title}</p>
              <p className="line-clamp-2 text-[13px] text-fg-muted">{c.description}</p>
              <p className="mt-2 text-[12px] text-fg-subtle">{counts[c.id] ?? 0} ta kurs · /{c.slug}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setEditing({ ...c })} className="grid h-8 w-8 place-items-center rounded-md text-fg-subtle hover:bg-fg/5 hover:text-fg" aria-label="Tahrirlash"><Pencil className="h-4 w-4" /></button>
              <button
                onClick={() => window.confirm(`“${c.title}” yo‘nalishini o‘chirasizmi?`) && run(() => deleteCategoryAction(c.id), "Yo‘nalish o‘chirildi")}
                className="grid h-8 w-8 place-items-center rounded-md text-fg-subtle hover:bg-fg/5 hover:text-danger"
                aria-label="O‘chirish"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {!editing && (
        <Button variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={() => setEditing({ title: "", description: "", icon: "GraduationCap", color: "azure", topics: [] })}>
          Yangi yo‘nalish
        </Button>
      )}
      {editing && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(() => saveCategoryAction(editing), "Yo‘nalish saqlandi", () => setEditing(null));
          }}
          className="space-y-4 rounded-2xl border border-border-strong bg-surface p-6"
        >
          <h2 className="text-[16px] font-semibold">{editing.id ? "Yo‘nalishni tahrirlash" : "Yangi yo‘nalish"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nomi" htmlFor="cat-title"><Input id="cat-title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required /></Field>
            <Field label="Manzil (slug)" htmlFor="cat-slug" optional><Input id="cat-slug" value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} pattern="[a-z0-9\-]*" /></Field>
          </div>
          <Field label="Tavsif" htmlFor="cat-desc"><Textarea id="cat-desc" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ikonka" htmlFor="cat-icon">
              <Select id="cat-icon" value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })}>
                {ICON_NAMES.map((n) => <option key={n}>{n}</option>)}
              </Select>
            </Field>
            <Field label="Rang" htmlFor="cat-color">
              <div className="flex flex-wrap gap-2" id="cat-color">
                {COLOR_KEYS.map((k) => (
                  <button key={k} type="button" onClick={() => setEditing({ ...editing, color: k })} aria-label={k} aria-pressed={editing.color === k} className={cn("h-8 w-8 rounded-full ring-offset-2 ring-offset-surface", editing.color === k && "ring-2 ring-fg")} style={{ background: colorVar[k] }} />
                ))}
              </div>
            </Field>
          </div>
          <Field label="Mavzular (har qatorga bittadan)" htmlFor="cat-topics"><LinesInput id="cat-topics" value={editing.topics} onChange={(v) => setEditing({ ...editing, topics: v })} /></Field>
          <div className="flex gap-2">
            <Button type="submit" loading={pending}>Saqlash</Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Bekor qilish</Button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ── Rol va sertifikatlar ─────────────────────────────────── */
export function RoleSelect({ userId, role }: { userId: string; role: "student" | "admin" }) {
  const { pending, run } = useAdminAction();
  return (
    <select
      value={role}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as "student" | "admin";
        if (next === "admin" && !window.confirm("Bu foydalanuvchiga to‘liq admin huquqi berilsinmi?")) return;
        run(() => setRoleAction(userId, next), "Rol yangilandi");
      }}
      className="h-9 rounded-lg border border-border bg-surface px-2 text-[13px]"
      aria-label="Foydalanuvchi roli"
    >
      <option value="student">Talaba</option>
      <option value="admin">Administrator</option>
    </select>
  );
}

export function CertificateToggle({ id, revoked }: { id: string; revoked: boolean }) {
  const { pending, run } = useAdminAction();
  return (
    <button
      disabled={pending}
      onClick={() => {
        if (!revoked && !window.confirm("Sertifikatni bekor qilasizmi? Tekshirish sahifasida “bekor qilingan” deb ko‘rsatiladi.")) return;
        run(() => setCertificateRevokedAction(id, !revoked), revoked ? "Sertifikat tiklandi" : "Sertifikat bekor qilindi");
      }}
      className={cn("h-8 rounded-lg px-3 text-[12.5px]", revoked ? "border border-border text-fg-muted hover:text-fg" : "text-danger hover:bg-danger/10")}
    >
      {revoked ? "Tiklash" : "Bekor qilish"}
    </button>
  );
}

/* ── Savol-javoblar ───────────────────────────────────────── */
export function StaffReply({ questionId, path }: { questionId: string; path: string }) {
  const [text, setText] = useState("");
  const { pending, run } = useAdminAction();
  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
      <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ustoz sifatida javob yozing…" className="h-10" aria-label="Javob" />
      <div className="flex gap-2">
        <Button size="md" loading={pending} disabled={text.trim().length < 5} onClick={() => run(async () => {
          const r = await replyQuestionAction(questionId, text, path);
          return "error" in r ? { ok: false as const, error: r.error ?? "Xato" } : { ok: true as const };
        }, "Javob yuborildi", () => setText(""))}>Javob berish</Button>
        <ConfirmButton message="Savolni va unga yozilgan javoblarni o‘chirasizmi?" onConfirm={() => run(() => deleteQuestionAdminAction(questionId), "Savol o‘chirildi")} className="h-10">
          <Trash2 className="h-4 w-4" />
        </ConfirmButton>
      </div>
    </div>
  );
}

/* ── Media ────────────────────────────────────────────────── */
export function MediaManager({ items }: { items: MediaAsset[] }) {
  const { run } = useAdminAction();
  const [copied, setCopied] = useState<string | null>(null);
  const icon = (m: string) => (m.startsWith("image/") ? ImageIcon : m.startsWith("video/") ? Film : FileText);
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border-strong p-5">
        <UploadButton onUploaded={() => run(async () => ({ ok: true as const }))} label="Fayl yuklash (200 MB gacha)" />
        <p className="text-[13px] text-fg-muted">Rasm, video (MP4/WebM), audio, PDF, ZIP. Yuklangan faylning manzilini dars yoki kursga qo‘yishingiz mumkin.</p>
      </div>
      {items.length === 0 ? (
        <p className="py-10 text-center text-[14px] text-fg-subtle">Hali fayllar yuklanmagan.</p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {items.map((m) => {
            const I = icon(m.mime);
            return (
              <li key={m.id} className="flex items-center gap-3 px-4 py-3">
                {m.mime.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" loading="lazy" />
                ) : (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-fg/[0.05] text-fg-muted"><I className="h-4 w-4" /></span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium">{m.name}</span>
                  <span className="block truncate font-mono text-[12px] text-fg-subtle">{m.url} · {(m.size / 1024 / 1024).toFixed(2)} MB</span>
                </span>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(m.url.startsWith("/") ? `${location.origin}${m.url}` : m.url).catch(() => {});
                    setCopied(m.id);
                    setTimeout(() => setCopied(null), 1500);
                  }}
                  className="grid h-8 w-8 place-items-center rounded-md text-fg-subtle hover:bg-fg/5 hover:text-fg"
                  aria-label="Manzilni nusxalash"
                >
                  {copied === m.id ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => window.confirm(`“${m.name}” faylini o‘chirasizmi? Bu faylga havola qilgan darslarda u ishlamay qoladi.`) && run(() => deleteMediaAction(m.id), "Fayl o‘chirildi")}
                  className="grid h-8 w-8 place-items-center rounded-md text-fg-subtle hover:bg-fg/5 hover:text-danger"
                  aria-label="O‘chirish"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
