"use client";

import Link from "next/link";
import { ExternalLink, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteLessonAction, updateLessonAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import type { CodeLanguage, CodeSnippet, InteractiveBlock, InteractiveType, Lesson, LessonExample, LessonStatus, LessonStep, Module } from "@/lib/types";
import { AdminCard, ConfirmButton, LinesInput, Repeater, UploadButton, useAdminAction } from "./form-kit";

const LANGS: CodeLanguage[] = ["html", "css", "javascript", "typescript", "python", "bash", "json", "sql", "text"];
const INTERACTIVE: { type: InteractiveType; label: string; config?: Record<string, unknown> }[] = [
  { type: "code-playground", label: "Kod muharriri", config: { language: "html", code: "<h1>Salom!</h1>" } },
  { type: "mesh-viewer", label: "3D mesh ko‘rinishi (Blender uslubida)", config: { shape: "cube" } },
  { type: "lighting-lab", label: "Yoritish laboratoriyasi (3 nuqtali)" },
  { type: "timeline", label: "Montaj taymlayni" },
  { type: "color-grading", label: "Rang korreksiyasi va skop" },
  { type: "typography", label: "Tipografiya o‘yingohi" },
  { type: "contrast", label: "Kontrast tekshirgich (WCAG)" },
  { type: "box-model", label: "CSS box model laboratoriyasi" },
];

function CodeFields({ value, onChange, label = "Kod (ixtiyoriy)" }: { value?: CodeSnippet; onChange: (v: CodeSnippet | undefined) => void; label?: string }) {
  const v = value ?? { language: "html" as CodeLanguage, code: "" };
  return (
    <details className="rounded-lg border border-border bg-surface p-3" open={Boolean(value?.code)}>
      <summary className="cursor-pointer text-[13px] text-fg-muted">{label}</summary>
      <div className="mt-3 space-y-2">
        <div className="flex gap-2">
          <Select value={v.language} onChange={(e) => onChange({ ...v, language: e.target.value as CodeLanguage })} className="h-9 w-40" aria-label="Til">
            {LANGS.map((l) => <option key={l}>{l}</option>)}
          </Select>
          <Input value={v.filename ?? ""} onChange={(e) => onChange({ ...v, filename: e.target.value || undefined })} placeholder="fayl nomi (ixtiyoriy)" className="h-9" aria-label="Fayl nomi" />
        </div>
        <Textarea value={v.code} onChange={(e) => onChange(e.target.value ? { ...v, code: e.target.value } : undefined)} rows={6} className="font-mono text-[13px]" spellCheck={false} aria-label="Kod" />
      </div>
    </details>
  );
}

export function LessonEditor({ lesson, modules, courseSlug }: { lesson: Lesson; modules: Module[]; courseSlug: string }) {
  const [l, setL] = useState(lesson);
  const { pending, run } = useAdminAction();
  const c = l.content;
  const set = <K extends keyof Lesson>(k: K, v: Lesson[K]) => setL((p) => ({ ...p, [k]: v }));
  const setC = <K extends keyof Lesson["content"]>(k: K, v: Lesson["content"][K]) => setL((p) => ({ ...p, content: { ...p.content, [k]: v } }));

  const save = () =>
    run(
      () =>
        updateLessonAction(lesson.id, {
          title: l.title,
          slug: l.slug,
          summary: l.summary,
          durationMin: l.durationMin,
          status: l.status,
          isPreview: l.isPreview,
          moduleId: l.moduleId,
          video: l.video?.url ? l.video : null,
          resources: l.resources,
          interactive: l.interactive,
          content: { ...c, exercise: { ...c.exercise, hint: c.exercise.hint || undefined } },
        }),
      "Dars saqlandi",
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="space-y-6"
    >
      <AdminCard title="Asosiy">
        <Field label="Dars nomi" htmlFor="l-title"><Input id="l-title" value={l.title} onChange={(e) => set("title", e.target.value)} required /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Manzil (slug)" htmlFor="l-slug" hint={`/kurslar/${courseSlug}/dars/${l.slug}`}><Input id="l-slug" value={l.slug} onChange={(e) => set("slug", e.target.value)} pattern="[a-z0-9\-]+" required /></Field>
          <Field label="Qisqa mazmun" htmlFor="l-sum"><Input id="l-sum" value={l.summary} onChange={(e) => set("summary", e.target.value)} /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Holat" htmlFor="l-status">
            <Select id="l-status" value={l.status} onChange={(e) => set("status", e.target.value as LessonStatus)}>
              <option value="draft">Qoralama (yashirin)</option>
              <option value="planned">Rejada (dasturda ko‘rinadi)</option>
              <option value="published">E’lon qilingan</option>
            </Select>
          </Field>
          <Field label="Modul" htmlFor="l-mod">
            <Select id="l-mod" value={l.moduleId} onChange={(e) => set("moduleId", e.target.value)}>
              {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
            </Select>
          </Field>
          <Field label="Davomiyligi (daq)" htmlFor="l-dur"><Input id="l-dur" type="number" min={1} max={600} value={l.durationMin} onChange={(e) => set("durationMin", Number(e.target.value))} /></Field>
          <Field label="Namuna dars" htmlFor="l-prev">
            <label className="flex h-11 items-center gap-2 text-[14px]"><input id="l-prev" type="checkbox" checked={l.isPreview} onChange={(e) => set("isPreview", e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" /> Ro‘yxatdan o‘tmasdan ochiq</label>
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Video" description="MP4/WebM fayl yuklang yoki YouTube/Vimeo havolasini kiriting. Talabaning ko‘rish joyi avtomatik eslab qolinadi.">
        <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
          <Select value={l.video?.provider ?? "file"} onChange={(e) => set("video", { url: l.video?.url ?? "", provider: e.target.value as "file", poster: l.video?.poster ?? null })} aria-label="Video manbasi">
            <option value="file">Fayl (MP4/WebM)</option>
            <option value="youtube">YouTube</option>
            <option value="vimeo">Vimeo</option>
          </Select>
          <div className="flex gap-2">
            <Input value={l.video?.url ?? ""} onChange={(e) => set("video", e.target.value ? { url: e.target.value, provider: l.video?.provider ?? "file", poster: l.video?.poster ?? null } : null)} placeholder="Video manzili" aria-label="Video manzili" />
            <UploadButton accept="video/mp4,video/webm" label="Video" onUploaded={(a) => set("video", { url: a.url, provider: "file", poster: l.video?.poster ?? null })} />
          </div>
        </div>
        {l.video?.url && <button type="button" onClick={() => set("video", null)} className="text-[13px] text-danger">Videoni olib tashlash</button>}
      </AdminCard>

      <AdminCard title="Dars matni — 9 qismli tuzilma" description="Matnda **qalin**, *kursiv*, `kod`, “- ” bilan boshlanadigan ro‘yxat ishlatish mumkin. Paragraflar bo‘sh qator bilan ajratiladi.">
        <Field label="Kirish (lead)" htmlFor="c-intro"><Textarea id="c-intro" value={c.intro} onChange={(e) => setC("intro", e.target.value)} rows={2} /></Field>
        <Field label="1. Tushuncha nima?" htmlFor="c-concept"><Textarea id="c-concept" value={c.concept} onChange={(e) => setC("concept", e.target.value)} rows={6} /></Field>
        <Field label="2. Nima uchun muhim?" htmlFor="c-why"><Textarea id="c-why" value={c.why} onChange={(e) => setC("why", e.target.value)} rows={4} /></Field>
        <Field label="3. Qanday ishlaydi?" htmlFor="c-how"><Textarea id="c-how" value={c.how} onChange={(e) => setC("how", e.target.value)} rows={6} /></Field>
        <div>
          <p className="mb-2 text-[13px] font-medium">4. Qadamma-qadam ko‘rsatma</p>
          <Repeater<LessonStep>
            items={c.steps}
            onChange={(v) => setC("steps", v)}
            make={() => ({ title: "", body: "" })}
            addLabel="Qadam qo‘shish"
            render={(s, up) => (
              <div className="space-y-2">
                <Input value={s.title} onChange={(e) => up({ title: e.target.value })} placeholder="Qadam sarlavhasi" aria-label="Qadam sarlavhasi" />
                <Textarea value={s.body} onChange={(e) => up({ body: e.target.value })} rows={3} placeholder="Tushuntirish" aria-label="Qadam matni" />
                <CodeFields value={s.code} onChange={(code) => up({ code })} />
              </div>
            )}
          />
        </div>
        <div>
          <p className="mb-2 text-[13px] font-medium">5. Amaliy misollar</p>
          <Repeater<LessonExample>
            items={c.examples}
            onChange={(v) => setC("examples", v)}
            make={() => ({ title: "", body: "" })}
            addLabel="Misol qo‘shish"
            render={(s, up) => (
              <div className="space-y-2">
                <Input value={s.title} onChange={(e) => up({ title: e.target.value })} placeholder="Misol sarlavhasi" aria-label="Misol sarlavhasi" />
                <Textarea value={s.body} onChange={(e) => up({ body: e.target.value })} rows={3} aria-label="Misol matni" />
                <CodeFields value={s.code} onChange={(code) => up({ code })} />
              </div>
            )}
          />
        </div>
        <div>
          <p className="mb-2 text-[13px] font-medium">6. Keng tarqalgan xatolar</p>
          <Repeater
            items={c.mistakes}
            onChange={(v) => setC("mistakes", v)}
            make={() => ({ title: "", fix: "" })}
            addLabel="Xato qo‘shish"
            render={(s, up) => (
              <div className="space-y-2">
                <Input value={s.title} onChange={(e) => up({ title: e.target.value })} placeholder="Xato" aria-label="Xato" />
                <Textarea value={s.fix} onChange={(e) => up({ fix: e.target.value })} rows={2} placeholder="To‘g‘ri yo‘l" aria-label="Yechim" />
              </div>
            )}
          />
        </div>
        <Field label="7. Professional maslahatlar (har qatorga bittadan)" htmlFor="c-tips"><LinesInput id="c-tips" value={c.tips} onChange={(v) => setC("tips", v)} /></Field>
        <div className="space-y-3 rounded-xl border border-border p-4">
          <p className="text-[13px] font-medium">8. Amaliy mashq</p>
          <Input value={c.exercise.title} onChange={(e) => setC("exercise", { ...c.exercise, title: e.target.value })} placeholder="Mashq nomi" aria-label="Mashq nomi" />
          <Textarea value={c.exercise.brief} onChange={(e) => setC("exercise", { ...c.exercise, brief: e.target.value })} rows={2} placeholder="Qisqa tavsif" aria-label="Mashq tavsifi" />
          <LinesInput value={c.exercise.tasks} onChange={(v) => setC("exercise", { ...c.exercise, tasks: v })} placeholder="Vazifalar — har qatorga bittadan" />
          <Input value={c.exercise.hint ?? ""} onChange={(e) => setC("exercise", { ...c.exercise, hint: e.target.value })} placeholder="Maslahat (ixtiyoriy)" aria-label="Maslahat" />
          <CodeFields value={c.exercise.starter} onChange={(starter) => setC("exercise", { ...c.exercise, starter })} label="Boshlang‘ich kod (ixtiyoriy)" />
        </div>
        <Field label="9. Xulosa (har qatorga bitta fikr)" htmlFor="c-sum"><LinesInput id="c-sum" value={c.summary} onChange={(v) => setC("summary", v)} /></Field>
        <div>
          <p className="mb-2 text-[13px] font-medium">Asosiy atamalar</p>
          <Repeater
            items={c.keyTerms}
            onChange={(v) => setC("keyTerms", v)}
            make={() => ({ term: "", definition: "" })}
            addLabel="Atama qo‘shish"
            render={(s, up) => (
              <div className="grid gap-2 sm:grid-cols-[200px_1fr]">
                <Input value={s.term} onChange={(e) => up({ term: e.target.value })} placeholder="Atama" aria-label="Atama" />
                <Input value={s.definition} onChange={(e) => up({ definition: e.target.value })} placeholder="Ta’rifi" aria-label="Ta’rifi" />
              </div>
            )}
          />
        </div>
      </AdminCard>

      <AdminCard title="Interaktiv mashg‘ulotlar">
        <Repeater<InteractiveBlock>
          items={l.interactive}
          onChange={(v) => set("interactive", v)}
          make={() => ({ type: "code-playground", title: "", config: INTERACTIVE[0].config })}
          addLabel="Interaktiv blok qo‘shish"
          max={10}
          render={(b, up) => (
            <div className="space-y-2">
              <Select value={b.type} onChange={(e) => up({ type: e.target.value as InteractiveType, config: INTERACTIVE.find((x) => x.type === e.target.value)?.config })} aria-label="Blok turi">
                {INTERACTIVE.map((x) => <option key={x.type} value={x.type}>{x.label}</option>)}
              </Select>
              <Input value={b.title ?? ""} onChange={(e) => up({ title: e.target.value })} placeholder="Sarlavha" aria-label="Sarlavha" />
              <Input value={b.description ?? ""} onChange={(e) => up({ description: e.target.value })} placeholder="Qisqa izoh" aria-label="Izoh" />
              {b.type === "code-playground" && (
                <div className="space-y-2">
                  <Select value={String(b.config?.language ?? "html")} onChange={(e) => up({ config: { ...b.config, language: e.target.value } })} className="h-9 w-44" aria-label="Til">
                    <option value="html">HTML/CSS</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                  </Select>
                  <Textarea value={String(b.config?.code ?? "")} onChange={(e) => up({ config: { ...b.config, code: e.target.value } })} rows={8} className="font-mono text-[13px]" spellCheck={false} aria-label="Boshlang‘ich kod" />
                </div>
              )}
              {b.type === "mesh-viewer" && (
                <Select value={String(b.config?.shape ?? "cube")} onChange={(e) => up({ config: { shape: e.target.value } })} className="h-9 w-44" aria-label="Boshlang‘ich shakl">
                  {["cube", "sphere", "cylinder", "cone", "torus", "plane"].map((s) => <option key={s}>{s}</option>)}
                </Select>
              )}
            </div>
          )}
        />
      </AdminCard>

      <AdminCard title="Yuklab olinadigan resurslar">
        <Repeater
          items={l.resources}
          onChange={(v) => set("resources", v)}
          make={() => ({ id: `res_${Math.random().toString(36).slice(2, 10)}`, title: "", type: "link" as const, url: "" })}
          addLabel="Resurs qo‘shish"
          max={30}
          render={(r, up) => (
            <div className="space-y-2">
              <div className="grid gap-2 sm:grid-cols-[1fr_140px]">
                <Input value={r.title} onChange={(e) => up({ title: e.target.value })} placeholder="Nomi" aria-label="Resurs nomi" />
                <Select value={r.type} onChange={(e) => up({ type: e.target.value as "file" | "link" })} aria-label="Turi">
                  <option value="link">Havola</option>
                  <option value="file">Fayl</option>
                </Select>
              </div>
              <div className="flex gap-2">
                <Input value={r.url} onChange={(e) => up({ url: e.target.value })} placeholder="https://… yoki yuklang" aria-label="Manzil" />
                <UploadButton onUploaded={(a) => up({ url: a.url, type: "file", size: a.size, title: r.title || a.name })} />
              </div>
            </div>
          )}
        />
      </AdminCard>

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-2xl border border-border-strong bg-elevated/95 p-3 shadow-[var(--shadow-lg)] backdrop-blur">
        <ConfirmButton message={`“${lesson.title}” darsini o‘chirasizmi? Talabalarning shu darsdagi progressi, qaydlari va savollari ham o‘chiriladi.`} onConfirm={() => run(() => deleteLessonAction(lesson.id, lesson.courseId))}>
          <Trash2 className="h-4 w-4" /> O‘chirish
        </ConfirmButton>
        <div className="flex gap-2">
          <Link href={`/kurslar/${courseSlug}/dars/${l.slug}`} target="_blank" className="inline-flex h-10 items-center gap-1.5 rounded-[10px] px-3 text-[13.5px] text-fg-muted hover:text-fg">
            <ExternalLink className="h-4 w-4" /> Ko‘rish
          </Link>
          <Button type="submit" loading={pending}>Saqlash</Button>
        </div>
      </div>
    </form>
  );
}
