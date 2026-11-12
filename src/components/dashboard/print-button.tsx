"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="inline-flex h-9 items-center gap-2 rounded-lg bg-fg px-3.5 text-[13.5px] font-medium text-bg">
      <Printer className="h-4 w-4" /> Chop etish / PDF
    </button>
  );
}
