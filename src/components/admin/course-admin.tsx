"use client";

import Link from "next/link";
import { ArrowDown, ArrowUp, ExternalLink, FileQuestion, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  createCourseAction,
  createLessonAction,
  createModuleAction,
  deleteCourseAction,
  deleteModuleAction,
  moveLessonAction,
  moveModuleAction,
  quickCourseAction,
  updateCourseAction,
  updateModuleAction,
} from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { ICON_NAMES, Icon } from "@/components/ui/icon";
import { COLOR_KEYS, colorVar } from "@/lib/colors";
import { cn } from "@/lib/cn";
import { LEVELS } from "@/lib/text";
import type { Category, ColorKey, Course, CourseStatus } from "@/lib/types";
import { AdminCard, ConfirmButton, IconBtn, LinesInput, UploadButton, useAdminAction } from "./form-kit";

export const STATUS_LABEL: Record<CourseStatus, string> = { published: "E’lon qilingan", preparing: "Tayyorlanmoqda", draft: "Qoralama" };

export function QuickCourseControls({ course }: { course: Pick<Course, "id" | "featured" | "status"> }) {
  const { pending, run } = useAdminAction();
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => quickCourseAction(course.id, { featured: !course.featured }), course.featured ? "Tavsiyadan olindi" : "Tavsiyaga qo‘shildi")}
        className={cn("grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-fg/5", course.featured ? "text-gold" : "text-fg-subtle")}
        aria-label={course.featured ? "Tavsiya etilganlardan olib tashlash" : "Tavsiya etilgan qilish"}
        aria-pressed={course.featured}
        title="Tavsiya etilgan (bosh sahifada)"
      >
        <Star className="h-4 w-4" fill={course.featured ? "currentColor" : "none"} />
      </button>
      <select
        value={course.status}
        disabled={pending}
        onChange={(e) => run(() => quickCourseAction(course.id, { status: e.target.value as CourseStatus }), "Holat yangilandi")}
        className="h-8 rounded-lg border border-border bg-surface px-2 text-[12.5px]"
        aria-label="Kurs holati"
      >
        {(Object.keys(STATUS_LABEL) as CourseStatus[]).map((s) => (
          <option key={s} value={s}>{STATUS_LABEL[s]}</option>
        ))}
      </select>
    </div>
  );
}

export function NewCourseForm({ categories }: { categories: Category[] }) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [level, setLevel] = useState(1);
  const { pending, run } = useAdminAction();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(() => createCourseAction({ title, categoryId, level }));
      }}
      className="space-y-4"
    >
      <Field label="Kurs nomi" htmlFor="title">
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required minLength={3} placeholder="Masalan: Python bilan ma’lumotlar tahlili" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Yo‘nalish" htmlFor="cat">
          <Select id="cat" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </Select>
        </Field>
        <Field label="Daraja" htmlFor="lvl">
          <Select id="lvl" value={level} onChange={(e) => setLevel(Number(e.target.value))}>
            {LEVELS.map((l) => <option key={l.level} value={l.level}>{l.level} — {l.name}</option>)}
          </Select>
        </Field>
      </div>
      <p className="text-[13px] text-fg-muted">Kurs “Qoralama” holatida yaratiladi — tayyor bo‘lgach e’lon qilasiz.</p>
      <Button type="submit" loading={pending}>Kursni yaratish</Button>
    </form>
  );
}

export function CourseForm({ course, categories }: { course: Course; categories: Category[] }) {
  const [c, setC] = useState(course);
  const [project, setProject] = useState(Boolean(course.finalProject));
  const { pending, run } = useAdminAction();
  const set = <K extends keyof Course>(k: K, v: Course[K]) => setC((p) => ({ ...p, [k]: v }));

  const save = () =>
    run(
      () =>
        updateCourseAction(course.id, {
          title: c.title,
          slug: c.slug,
          subtitle: c.subtitle,
          description: c.description,
          categoryId: c.categoryId,
          level: c.level,
          status: c.status,
          featured: c.featured,
          accent: c.accent,
          icon: c.icon,
          coverUrl: c.coverUrl,
          objectives: c.objectives,
          skills: c.skills,
          requirements: c.requirements,
          audience: c.audience,
          software: c.software,
          tags: c.tags,
          estimatedHours: c.estimatedHours,
          instructor: c.instructor,
          finalProject: project ? c.finalProject ?? { title: "", description: "", deliverables: [] } : null,
        }),
      "Kurs saqlandi",
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="space-y-6"
    >
      <AdminCard title="Asosiy ma’lumotlar">
        <Field label="Kurs nomi" htmlFor="c-title"><Input id="c-title" value={c.title} onChange={(e) => set("title", e.target.value)} required /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Manzil (slug)" htmlFor="c-slug" hint={`/kurslar/${c.slug}`}><Input id="c-slug" value={c.slug} onChange={(e) => set("slug", e.target.value)} pattern="[a-z0-9\-]+" /></Field>
          <Field label="Qisqa tavsif (subtitle)" htmlFor="c-sub"><Input id="c-sub" value={c.subtitle} onChange={(e) => set("subtitle", e.target.value)} /></Field>
        </div>
        <Field label="To‘liq tavsif" htmlFor="c-desc" hint="**qalin**, *kursiv* va `kod` belgilarini ishlatish mumkin. Paragraflarni bo‘sh qator bilan ajrating.">
          <Textarea id="c-desc" value={c.description} onChange={(e) => set("description", e.target.value)} rows={6} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Yo‘nalish" htmlFor="c-cat">
            <Select id="c-cat" value={c.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
              {categories.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}
            </Select>
          </Field>
          <Field label="Daraja" htmlFor="c-lvl">
            <Select id="c-lvl" value={c.level} onChange={(e) => set("level", Number(e.target.value) as Course["level"])}>
              {LEVELS.map((l) => <option key={l.level} value={l.level}>{l.level} — {l.short}</option>)}
            </Select>
          </Field>
          <Field label="Holat" htmlFor="c-status">
            <Select id="c-status" value={c.status} onChange={(e) => set("status", e.target.value as CourseStatus)}>
              {(Object.keys(STATUS_LABEL) as CourseStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </Select>
          </Field>
          <Field label="Taxminiy soat" htmlFor="c-h"><Input id="c-h" type="number" min={0} step={0.5} value={c.estimatedHours} onChange={(e) => set("estimatedHours", Number(e.target.value))} /></Field>
        </div>
        <label className="flex items-center gap-2.5 text-[14px]">
          <input type="checkbox" checked={c.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
          Bosh sahifada tavsiya etilgan kurs sifatida ko‘rsatish
        </label>
      </AdminCard>

      <AdminCard title="Ko‘rinish" description="Muqova rasmi bo‘lmasa, rang va ikonka asosida generativ muqova yaratiladi.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Rang" htmlFor="c-accent">
            <div className="flex flex-wrap gap-2" id="c-accent">
              {COLOR_KEYS.map((k) => (
                <button key={k} type="button" onClick={() => set("accent", k as ColorKey)} aria-label={k} aria-pressed={c.accent === k} className={cn("h-8 w-8 rounded-full ring-offset-2 ring-offset-surface", c.accent === k && "ring-2 ring-fg")} style={{ background: colorVar[k] }} />
              ))}
            </div>
          </Field>
          <Field label="Ikonka" htmlFor="c-icon">
            <div className="flex items-center gap-2">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border" style={{ color: colorVar[c.accent] }}><Icon name={c.icon} className="h-5 w-5" /></span>
              <Select id="c-icon" value={c.icon} onChange={(e) => set("icon", e.target.value)}>
                {ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
              </Select>
            </div>
          </Field>
        </div>
        <Field label="Muqova rasmi (ixtiyoriy)" htmlFor="c-cover">
          <div className="flex gap-2">
            <Input id="c-cover" value={c.coverUrl ?? ""} onChange={(e) => set("coverUrl", e.target.value || null)} placeholder="https://… yoki yuklang" />
            <UploadButton accept="image/*" onUploaded={(a) => set("coverUrl", a.url)} label="Rasm" />
          </div>
        </Field>
      </AdminCard>

      <AdminCard title="O‘quv mazmuni" description="Har bir qatorga bitta element yozing.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="O‘quv maqsadlari" htmlFor="c-obj"><LinesInput id="c-obj" value={c.objectives} onChange={(v) => set("objectives", v)} rows={5} /></Field>
          <Field label="Egallanadigan ko‘nikmalar" htmlFor="c-skills"><LinesInput id="c-skills" value={c.skills} onChange={(v) => set("skills", v)} rows={5} /></Field>
          <Field label="Talablar" htmlFor="c-req"><LinesInput id="c-req" value={c.requirements} onChange={(v) => set("requirements", v)} /></Field>
          <Field label="Kimlar uchun" htmlFor="c-aud"><LinesInput id="c-aud" value={c.audience} onChange={(v) => set("audience", v)} /></Field>
          <Field label="Dasturlar" htmlFor="c-soft"><LinesInput id="c-soft" value={c.software} onChange={(v) => set("software", v)} /></Field>
          <Field label="Teglar (qidiruv uchun)" htmlFor="c-tags"><LinesInput id="c-tags" value={c.tags} onChange={(v) => set("tags", v)} /></Field>
        </div>
      </AdminCard>

      <AdminCard title="Muallif">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ism" htmlFor="i-name"><Input id="i-name" value={c.instructor.name} onChange={(e) => set("instructor", { ...c.instructor, name: e.target.value })} /></Field>
          <Field label="Lavozim" htmlFor="i-role"><Input id="i-role" value={c.instructor.role} onChange={(e) => set("instructor", { ...c.instructor, role: e.target.value })} /></Field>
        </div>
        <Field label="Bio" htmlFor="i-bio"><Textarea id="i-bio" value={c.instructor.bio} onChange={(e) => set("instructor", { ...c.instructor, bio: e.target.value })} rows={3} /></Field>
      </AdminCard>

      <AdminCard title="Yakuniy loyiha">
        <label className="flex items-center gap-2.5 text-[14px]">
          <input type="checkbox" checked={project} onChange={(e) => setProject(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" /> Kursda yakuniy loyiha bor
        </label>
        {project && (
          <>
            <Field label="Loyiha nomi" htmlFor="p-title"><Input id="p-title" value={c.finalProject?.title ?? ""} onChange={(e) => set("finalProject", { title: e.target.value, description: c.finalProject?.description ?? "", deliverables: c.finalProject?.deliverables ?? [] })} /></Field>
            <Field label="Tavsif" htmlFor="p-desc"><Textarea id="p-desc" value={c.finalProject?.description ?? ""} onChange={(e) => set("finalProject", { title: c.finalProject?.title ?? "", description: e.target.value, deliverables: c.finalProject?.deliverables ?? [] })} rows={3} /></Field>
            <Field label="Topshiriladigan natijalar (har qatorga bittadan)" htmlFor="p-del"><LinesInput id="p-del" value={c.finalProject?.deliverables ?? []} onChange={(v) => set("finalProject", { title: c.finalProject?.title ?? "", description: c.finalProject?.description ?? "", deliverables: v })} /></Field>
          </>
        )}
      </AdminCard>

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl border border-border-strong bg-elevated/95 p-3 shadow-[var(--shadow-lg)] backdrop-blur">
        <ConfirmButton message={`“${course.title}” kursini butunlay o‘chirasizmi? Barcha modullar, darslar va talabalar progressi o‘chiriladi. Berilgan sertifikatlar saqlanadi.`} onConfirm={() => run(() => deleteCourseAction(course.id))}>
          <Trash2 className="h-4 w-4" /> Kursni o‘chirish
        </ConfirmButton>
        <div className="flex gap-2">
          <Link href={`/kurslar/${c.slug}`} target="_blank" className="inline-flex h-10 items-center gap-1.5 rounded-[10px] px-3 text-[13.5px] text-fg-muted hover:text-fg"><ExternalLink className="h-4 w-4" /> Ko‘rish</Link>
          <Button type="submit" loading={pending}>Saqlash</Button>
        </div>
      </div>
    </form>
  );
}

type CM = {
  id: string;
  title: string;
  description: string;
  lessons: { id: string; title: string; status: string; durationMin: number; isPreview: boolean }[];
  quiz: { id: string; title: string; questionCount: number } | null;
};

export function CurriculumManager({ courseId, modules, finalQuiz }: { courseId: string; modules: CM[]; finalQuiz: { id: string; title: string; questionCount: number } | null }) {
  const [newModule, setNewModule] = useState("");
  const { pending, run } = useAdminAction();
  return (
    <div className="space-y-4">
      {modules.map((m, mi) => (
        <ModuleCard key={m.id} courseId={courseId} m={m} index={mi} isFirst={mi === 0} isLast={mi === modules.length - 1} />
      ))}
      <form
        className="flex gap-2 rounded-2xl border border-dashed border-border-strong p-4"
        onSubmit={(e) => {
          e.preventDefault();
          run(() => createModuleAction(courseId, newModule), "Modul qo‘shildi", () => setNewModule(""));
        }}
      >
        <Input value={newModule} onChange={(e) => setNewModule(e.target.value)} placeholder="Yangi modul nomi" aria-label="Yangi modul nomi" />
        <Button type="submit" loading={pending} icon={<Plus className="h-4 w-4" />}>Modul</Button>
      </form>
      <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4">
        <span className="flex items-center gap-2 text-[14px]">
          <FileQuestion className="h-4 w-4 text-gold" />
          {finalQuiz ? `${finalQuiz.title} · ${finalQuiz.questionCount} savol` : "Yakuniy imtihon yo‘q (sertifikat uchun tavsiya etiladi)"}
        </span>
        <Link href={`/admin/kurslar/${courseId}/testlar/${finalQuiz?.id ?? "yangi"}`} className="text-[13px] font-medium hover:underline">
          {finalQuiz ? "Tahrirlash" : "Yaratish"}
        </Link>
      </div>
    </div>
  );
}

function ModuleCard({ courseId, m, index, isFirst, isLast }: { courseId: string; m: CM; index: number; isFirst: boolean; isLast: boolean }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(m.title);
  const [desc, setDesc] = useState(m.description);
  const [newLesson, setNewLesson] = useState("");
  const { pending, run } = useAdminAction();
  const STATUS = { published: "text-success", planned: "text-gold", draft: "text-fg-subtle" } as const;
  const STATUS_TXT = { published: "e’lon qilingan", planned: "rejada", draft: "qoralama" } as const;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex items-start gap-3 border-b border-border p-4">
        <span className="mt-1 font-mono text-[12px] text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
        <div className="min-w-0 flex-1">
          {editing ? (
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                run(() => updateModuleAction(m.id, { title, description: desc }), "Modul saqlandi", () => setEditing(false));
              }}
            >
              <Input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Modul nomi" />
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} aria-label="Modul tavsifi" />
              <div className="flex gap-2">
                <Button size="sm" type="submit" loading={pending}>Saqlash</Button>
                <Button size="sm" variant="ghost" type="button" onClick={() => setEditing(false)}>Bekor qilish</Button>
              </div>
            </form>
          ) : (
            <>
              <p className="text-[15px] font-semibold">{m.title}</p>
              {m.description && <p className="text-[13px] text-fg-muted">{m.description}</p>}
            </>
          )}
        </div>
        {!editing && (
          <div className="flex shrink-0 gap-0.5">
            <IconBtn label="Tahrirlash" onClick={() => setEditing(true)}><Pencil className="h-3.5 w-3.5" /></IconBtn>
            <IconBtn label="Yuqoriga" onClick={() => run(() => moveModuleAction(m.id, -1))} disabled={isFirst}><ArrowUp className="h-3.5 w-3.5" /></IconBtn>
            <IconBtn label="Pastga" onClick={() => run(() => moveModuleAction(m.id, 1))} disabled={isLast}><ArrowDown className="h-3.5 w-3.5" /></IconBtn>
            <IconBtn label="Modulni o‘chirish" danger onClick={() => window.confirm(`“${m.title}” modulini va undagi ${m.lessons.length} ta darsni o‘chirasizmi?`) && run(() => deleteModuleAction(m.id), "Modul o‘chirildi")}>
              <Trash2 className="h-3.5 w-3.5" />
            </IconBtn>
          </div>
        )}
      </div>
      <ul className="divide-y divide-border">
        {m.lessons.map((l, li) => (
          <li key={l.id} className="flex items-center gap-3 px-4 py-2.5">
            <Link href={`/admin/kurslar/${courseId}/darslar/${l.id}`} className="min-w-0 flex-1 truncate text-[14px] hover:underline">{l.title}</Link>
            {l.isPreview && <span className="text-[11.5px] text-teal">namuna</span>}
            <span className={cn("text-[12px]", STATUS[l.status as keyof typeof STATUS])}>{STATUS_TXT[l.status as keyof typeof STATUS_TXT]}</span>
            <span className="w-12 text-right font-mono text-[11.5px] text-fg-subtle">{l.durationMin}′</span>
            <div className="flex gap-0.5">
              <IconBtn label="Yuqoriga" onClick={() => run(() => moveLessonAction(l.id, -1))} disabled={li === 0}><ArrowUp className="h-3.5 w-3.5" /></IconBtn>
              <IconBtn label="Pastga" onClick={() => run(() => moveLessonAction(l.id, 1))} disabled={li === m.lessons.length - 1}><ArrowDown className="h-3.5 w-3.5" /></IconBtn>
            </div>
          </li>
        ))}
        <li className="flex items-center justify-between gap-3 px-4 py-2.5 text-[13.5px]">
          <span className="flex items-center gap-2 text-fg-muted"><FileQuestion className="h-4 w-4" /> {m.quiz ? `${m.quiz.title} · ${m.quiz.questionCount} savol` : "Modul testi yo‘q"}</span>
          <Link href={`/admin/kurslar/${courseId}/testlar/${m.quiz?.id ?? `yangi?modul=${m.id}`}`} className="font-medium hover:underline">{m.quiz ? "Testni tahrirlash" : "Test yaratish"}</Link>
        </li>
      </ul>
      <form
        className="flex gap-2 border-t border-border bg-bg-subtle p-3"
        onSubmit={(e) => {
          e.preventDefault();
          run(() => createLessonAction(m.id, newLesson), "Dars qo‘shildi (qoralama)", () => setNewLesson(""));
        }}
      >
        <Input value={newLesson} onChange={(e) => setNewLesson(e.target.value)} placeholder="Yangi dars nomi" className="h-9" aria-label="Yangi dars nomi" />
        <Button type="submit" size="sm" className="h-9" loading={pending} icon={<Plus className="h-3.5 w-3.5" />}>Dars</Button>
      </form>
    </div>
  );
}
