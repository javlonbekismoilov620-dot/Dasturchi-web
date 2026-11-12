"use client";

import dynamic from "next/dynamic";
import { MousePointerClick } from "lucide-react";
import type { InteractiveBlock as Block } from "@/lib/types";

const Loading = () => <div className="skeleton h-[360px] w-full rounded-2xl" />;

/* Har bir interaktiv vosita faqat kerak bo‘lganda yuklanadi (kodni bo‘lish) */
const CodePlayground = dynamic(() => import("./code-playground").then((m) => m.CodePlayground), { ssr: false, loading: Loading });
const MeshViewer = dynamic(() => import("./mesh-viewer").then((m) => m.MeshViewer), { ssr: false, loading: Loading });
const LightingLab = dynamic(() => import("./lighting-lab").then((m) => m.LightingLab), { ssr: false, loading: Loading });
const TimelineDemo = dynamic(() => import("./timeline-demo").then((m) => m.TimelineDemo), { ssr: false, loading: Loading });
const ColorGrading = dynamic(() => import("./color-grading").then((m) => m.ColorGrading), { ssr: false, loading: Loading });
const TypographyPlayground = dynamic(() => import("./design-tools").then((m) => m.TypographyPlayground), { ssr: false, loading: Loading });
const ContrastChecker = dynamic(() => import("./design-tools").then((m) => m.ContrastChecker), { ssr: false, loading: Loading });
const BoxModelLab = dynamic(() => import("./design-tools").then((m) => m.BoxModelLab), { ssr: false, loading: Loading });

export function InteractiveRenderer({ block, storageKey }: { block: Block; storageKey?: string }) {
  const cfg = (block.config ?? {}) as Record<string, unknown>;
  switch (block.type) {
    case "code-playground":
      return (
        <CodePlayground
          language={(cfg.language as "html" | "javascript" | "python") ?? "html"}
          code={String(cfg.code ?? "")}
          storageKey={storageKey}
          title={block.title}
        />
      );
    case "mesh-viewer":
      return <MeshViewer initialShape={(cfg.shape as "cube") ?? "cube"} />;
    case "lighting-lab":
      return <LightingLab />;
    case "timeline":
      return <TimelineDemo />;
    case "color-grading":
      return <ColorGrading />;
    case "typography":
      return <TypographyPlayground />;
    case "contrast":
      return <ContrastChecker />;
    case "box-model":
      return <BoxModelLab />;
    default:
      return null;
  }
}

export function InteractiveSection({ blocks, lessonId }: { blocks: Block[]; lessonId: string }) {
  if (!blocks.length) return null;
  return (
    <div className="space-y-8">
      {blocks.map((b, i) => (
        <figure key={i} className="space-y-3">
          <figcaption className="flex items-start gap-3">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
              <MousePointerClick className="h-3.5 w-3.5" />
            </span>
            <span>
              <span className="block text-[15px] font-semibold">{b.title ?? "Interaktiv mashg‘ulot"}</span>
              {b.description && <span className="block text-[13.5px] text-fg-muted">{b.description}</span>}
            </span>
          </figcaption>
          <InteractiveRenderer block={b} storageKey={`dch-code:${lessonId}:${i}`} />
        </figure>
      ))}
    </div>
  );
}
