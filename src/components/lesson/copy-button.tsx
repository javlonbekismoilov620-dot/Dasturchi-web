"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* ruxsat yo‘q */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[11.5px] text-fg-subtle hover:bg-fg/5 hover:text-fg"
      aria-label="Kodni nusxalash"
    >
      {done ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "Nusxalandi" : "Nusxa"}
    </button>
  );
}
