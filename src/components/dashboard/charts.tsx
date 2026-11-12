import { cn } from "@/lib/cn";

const DAY_NAMES = ["Ya", "Du", "Se", "Ch", "Pa", "Ju", "Sh"];

/** Oxirgi 7 kunlik faollik ustunli diagrammasi (SVG, kutubxonasiz) */
export function WeeklyBars({ data }: { data: { key: string; count: number }[] }) {
  const max = Math.max(3, ...data.map((d) => d.count));
  return (
    <div className="flex h-36 items-end gap-2 sm:gap-3" role="img" aria-label={`Oxirgi 7 kunda ${data.reduce((a, d) => a + d.count, 0)} ta faollik`}>
      {data.map((d, i) => {
        const day = new Date(`${d.key}T00:00:00Z`).getUTCDay();
        const today = i === data.length - 1;
        return (
          <div key={d.key} className="group flex h-full flex-1 flex-col items-center gap-2">
            <div className="relative flex w-full flex-1 items-end">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-fg px-1.5 py-0.5 text-[10.5px] text-bg opacity-0 transition-opacity group-hover:opacity-100">{d.count}</span>
              <div
                className={cn("w-full rounded-md transition-[height] duration-1000 ease-[var(--ease-out-expo)]", d.count ? "bg-gradient-to-t from-accent to-teal" : "bg-fg/[0.07]")}
                style={{ height: `${Math.max(d.count ? 8 : 3, (d.count / max) * 100)}%` }}
              />
            </div>
            <span className={cn("text-[11px]", today ? "font-semibold text-fg" : "text-fg-subtle")}>{today ? "Bugun" : DAY_NAMES[day]}</span>
          </div>
        );
      })}
    </div>
  );
}

/** 15 haftalik faollik xaritasi (GitHub uslubida) */
export function ActivityHeatmap({ data }: { data: { key: string; count: number }[] }) {
  const weeks: { key: string; count: number }[][] = [];
  for (let i = 0; i < data.length; i += 7) weeks.push(data.slice(i, i + 7));
  const level = (n: number) => (n === 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 5 ? 3 : 4);
  const total = data.reduce((a, d) => a + d.count, 0);
  return (
    <div>
      <div className="flex gap-[3px] overflow-x-auto no-scrollbar" role="img" aria-label={`Oxirgi 15 haftada ${total} ta faollik`}>
        {weeks.map((w, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {w.map((d) => (
              <span
                key={d.key}
                title={`${d.key}: ${d.count} ta`}
                className="h-3 w-3 rounded-[3px]"
                style={{
                  background: level(d.count) === 0 ? "color-mix(in oklab, var(--fg) 7%, transparent)" : `color-mix(in oklab, var(--accent) ${[0, 30, 55, 80, 100][level(d.count)]}%, transparent)`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-fg-subtle">
        Kam
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className="h-2.5 w-2.5 rounded-[2px]" style={{ background: l === 0 ? "color-mix(in oklab, var(--fg) 7%, transparent)" : `color-mix(in oklab, var(--accent) ${[0, 30, 55, 80, 100][l]}%, transparent)` }} />
        ))}
        Ko‘p
      </div>
    </div>
  );
}
