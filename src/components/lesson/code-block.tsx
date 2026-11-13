import { highlight, LANGUAGE_LABEL } from "@/lib/highlight";
import type { CodeSnippet } from "@/lib/types";
import { CopyButton } from "./copy-button";

export function CodeBlock({ snippet }: { snippet: CodeSnippet }) {
  const html = highlight(snippet.code, snippet.language);
  return (
    <div className="code-surface my-4 overflow-hidden rounded-xl border border-border-strong bg-bg-subtle">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="font-mono text-[11.5px] text-fg-subtle">{snippet.filename ?? LANGUAGE_LABEL[snippet.language] ?? snippet.language}</span>
        <CopyButton text={snippet.code} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-[1.7]">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
