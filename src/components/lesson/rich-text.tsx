import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/* Xavfsiz mini-markdown: **qalin**, *kursiv*, `kod`, paragraflar, “- ” va “1. ” ro‘yxatlar.
   HTML hech qachon to‘g‘ridan-to‘g‘ri chiqarilmaydi — XSS’dan himoyalangan. */

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const k = `${keyBase}-${i++}`;
    if (tok.startsWith("`")) out.push(<code key={k} className="inline-code">{tok.slice(1, -1)}</code>);
    else if (tok.startsWith("**")) out.push(<strong key={k}>{tok.slice(2, -2)}</strong>);
    else out.push(<em key={k}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Inline({ text }: { text: string }) {
  return <>{inline(text, "i")}</>;
}

export function RichText({ text, className }: { text: string; className?: string }) {
  if (!text?.trim()) return null;
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <div className={cn("lesson-prose", className)}>
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*[-•]\s+/.test(l))) {
          return (
            <ul key={bi}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*[-•]\s+/, ""), `${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
          return (
            <ol key={bi} className="mb-4 list-decimal space-y-1.5 pl-6 marker:text-fg-subtle">
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*\d+[.)]\s+/, ""), `${bi}-${li}`)}</li>
              ))}
            </ol>
          );
        }
        // Aralash blok: avval matn, keyin ro‘yxat bo‘lishi mumkin
        const firstList = lines.findIndex((l) => /^\s*[-•]\s+/.test(l));
        if (firstList > 0 && lines.slice(firstList).every((l) => /^\s*[-•]\s+/.test(l))) {
          return (
            <Fragment key={bi}>
              <p>{inline(lines.slice(0, firstList).join(" "), `${bi}-p`)}</p>
              <ul>
                {lines.slice(firstList).map((l, li) => (
                  <li key={li}>{inline(l.replace(/^\s*[-•]\s+/, ""), `${bi}-${li}`)}</li>
                ))}
              </ul>
            </Fragment>
          );
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {inline(l, `${bi}-${li}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
