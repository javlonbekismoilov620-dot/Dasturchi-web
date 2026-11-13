import { AlertTriangle, BookMarked, CheckCircle2, Download, ExternalLink, Lightbulb, ListChecks, PencilRuler, Sparkles } from "lucide-react";
import type { Lesson } from "@/lib/types";
import { InteractiveSection } from "@/components/interactive/interactive-block";
import { CodeBlock } from "./code-block";
import { Inline, RichText } from "./rich-text";

export type TocItem = { id: string; label: string };

/** Darsning 9 qismli tuzilmasi uchun mundarija */
export function lessonToc(lesson: Lesson): TocItem[] {
  const c = lesson.content;
  const items: (TocItem | false)[] = [
    Boolean(c.concept) && { id: "tushuncha", label: "Tushuncha nima?" },
    Boolean(c.why) && { id: "nega-muhim", label: "Nima uchun muhim?" },
    Boolean(c.how) && { id: "qanday-ishlaydi", label: "Qanday ishlaydi?" },
    c.steps.length > 0 && { id: "qadamlar", label: "Qadamma-qadam" },
    lesson.interactive.length > 0 && { id: "interaktiv", label: "Interaktiv mashg‘ulot" },
    c.examples.length > 0 && { id: "misollar", label: "Amaliy misollar" },
    c.mistakes.length > 0 && { id: "xatolar", label: "Keng tarqalgan xatolar" },
    c.tips.length > 0 && { id: "maslahatlar", label: "Professional maslahatlar" },
    Boolean(c.exercise?.title) && { id: "mashq", label: "Amaliy mashq" },
    c.summary.length > 0 && { id: "xulosa", label: "Xulosa" },
    c.keyTerms.length > 0 && { id: "atamalar", label: "Asosiy atamalar" },
    lesson.resources.length > 0 && { id: "resurslar", label: "Resurslar" },
  ];
  return items.filter(Boolean) as TocItem[];
}

function Section({ id, n, title, icon, children }: { id: string; n?: number; title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-5 flex items-center gap-3 text-[22px] font-semibold tracking-[-0.02em] sm:text-[24px]">
        {n !== undefined ? (
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border-strong font-mono text-[12.5px] text-fg-muted">{n}</span>
        ) : (
          icon
        )}
        {title}
      </h2>
      {children}
    </section>
  );
}

function formatSize(n?: number | null) {
  if (!n) return "";
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function LessonContentView({ lesson }: { lesson: Lesson }) {
  const c = lesson.content;
  let n = 0;
  return (
    <div className="space-y-14">
      {c.intro && <p className="text-pretty text-[19px] leading-[1.65] text-fg-muted sm:text-[21px]"><Inline text={c.intro} /></p>}

      {c.concept && (
        <Section id="tushuncha" n={++n} title="Tushuncha nima?">
          <RichText text={c.concept} />
        </Section>
      )}

      {c.why && (
        <Section id="nega-muhim" n={++n} title="Nima uchun muhim?">
          <RichText text={c.why} />
        </Section>
      )}

      {c.how && (
        <Section id="qanday-ishlaydi" n={++n} title="Qanday ishlaydi?">
          <RichText text={c.how} />
        </Section>
      )}

      {c.steps.length > 0 && (
        <Section id="qadamlar" n={++n} title="Qadamma-qadam">
          <ol className="relative space-y-6 border-l border-border pl-7">
            {c.steps.map((s, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[42px] top-0 grid h-7 w-7 place-items-center rounded-full border border-border-strong bg-bg font-mono text-[12px] font-semibold">
                  {i + 1}
                </span>
                <h3 className="text-[17px] font-semibold tracking-[-0.01em]">{s.title}</h3>
                <RichText text={s.body} className="mt-1.5 text-fg-muted" />
                {s.code && <CodeBlock snippet={s.code} />}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {lesson.interactive.length > 0 && (
        <section id="interaktiv" className="scroll-mt-24">
          <InteractiveSection blocks={lesson.interactive} lessonId={lesson.id} />
        </section>
      )}

      {c.examples.length > 0 && (
        <Section id="misollar" n={++n} title="Amaliy misollar">
          <div className="space-y-8">
            {c.examples.map((e, i) => (
              <div key={i}>
                <h3 className="text-[17px] font-semibold tracking-[-0.01em]">{e.title}</h3>
                <RichText text={e.body} className="mt-1.5 text-fg-muted" />
                {e.code && <CodeBlock snippet={e.code} />}
              </div>
            ))}
          </div>
        </Section>
      )}

      {c.mistakes.length > 0 && (
        <Section id="xatolar" n={++n} title="Keng tarqalgan xatolar">
          <div className="space-y-3">
            {c.mistakes.map((m, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface p-5">
                <p className="flex items-start gap-2.5 font-semibold">
                  <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-warning" />
                  <Inline text={m.title} />
                </p>
                <p className="mt-2 flex items-start gap-2.5 text-[15.5px] leading-relaxed text-fg-muted">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-success" />
                  <span><Inline text={m.fix} /></span>
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {c.tips.length > 0 && (
        <Section id="maslahatlar" n={++n} title="Professional maslahatlar">
          <ul className="space-y-3">
            {c.tips.map((t, i) => (
              <li key={i} className="flex gap-3 rounded-xl bg-accent-soft/70 p-4 text-[15.5px] leading-relaxed">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span><Inline text={t} /></span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {c.exercise?.title && (
        <Section id="mashq" n={++n} title="Amaliy mashq">
          <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface">
            <div className="flex items-center gap-3 border-b border-border bg-bg-subtle px-5 py-4">
              <PencilRuler className="h-5 w-5 text-teal" />
              <h3 className="text-[17px] font-semibold">{c.exercise.title}</h3>
            </div>
            <div className="space-y-4 p-5">
              <RichText text={c.exercise.brief} />
              <ol className="space-y-2.5">
                {c.exercise.tasks.map((t, i) => (
                  <li key={i} className="flex gap-3 text-[15.5px] leading-relaxed">
                    <ListChecks className="mt-1 h-4 w-4 shrink-0 text-fg-subtle" />
                    <span><Inline text={t} /></span>
                  </li>
                ))}
              </ol>
              {c.exercise.hint && (
                <details className="rounded-lg border border-border px-4 py-3 text-[14.5px]">
                  <summary className="cursor-pointer font-medium">Yordam kerakmi? Maslahatni ko‘rish</summary>
                  <p className="mt-2 text-fg-muted"><Inline text={c.exercise.hint} /></p>
                </details>
              )}
              {c.exercise.starter && <CodeBlock snippet={c.exercise.starter} />}
            </div>
          </div>
        </Section>
      )}

      {c.summary.length > 0 && (
        <Section id="xulosa" n={++n} title="Xulosa">
          <ul className="space-y-2.5 rounded-2xl border border-border bg-surface p-5">
            {c.summary.map((s, i) => (
              <li key={i} className="flex gap-3 text-[15.5px] leading-relaxed">
                <Sparkles className="mt-1 h-4 w-4 shrink-0 text-gold" />
                <span><Inline text={s} /></span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {c.keyTerms.length > 0 && (
        <Section id="atamalar" title="Asosiy atamalar" icon={<BookMarked className="h-5 w-5 text-fg-muted" />}>
          <dl className="grid gap-3 sm:grid-cols-2">
            {c.keyTerms.map((k) => (
              <div key={k.term} className="rounded-xl border border-border p-4">
                <dt className="font-semibold">{k.term}</dt>
                <dd className="mt-1 text-[14.5px] leading-relaxed text-fg-muted"><Inline text={k.definition} /></dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {lesson.resources.length > 0 && (
        <Section id="resurslar" title="Yuklab olinadigan resurslar" icon={<Download className="h-5 w-5 text-fg-muted" />}>
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
            {lesson.resources.map((r) => (
              <li key={r.id}>
                <a
                  href={r.url}
                  target={r.type === "link" ? "_blank" : undefined}
                  rel={r.type === "link" ? "noopener noreferrer" : undefined}
                  download={r.type === "file" ? "" : undefined}
                  className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-fg/[0.03]"
                >
                  {r.type === "file" ? <Download className="h-4 w-4 text-fg-subtle" /> : <ExternalLink className="h-4 w-4 text-fg-subtle" />}
                  <span className="flex-1 text-[15px]">{r.title}</span>
                  <span className="text-[12.5px] text-fg-subtle">{r.type === "file" ? formatSize(r.size) || "Fayl" : "Havola"}</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
