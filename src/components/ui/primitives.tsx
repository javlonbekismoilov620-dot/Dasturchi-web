import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { colorVar, tint } from "@/lib/colors";
import type { ColorKey, CourseStatus } from "@/lib/types";
import { levelName } from "@/lib/text";

/* ── Badge ─────────────────────────────────────────────────── */
export function Badge({
  children,
  color,
  className,
  variant = "soft",
}: {
  children: ReactNode;
  color?: ColorKey;
  className?: string;
  variant?: "soft" | "outline" | "solid";
}) {
  const style = color
    ? variant === "solid"
      ? { background: colorVar[color], color: "white" }
      : variant === "outline"
        ? { borderColor: tint(color, 40), color: colorVar[color] }
        : { background: tint(color, 12), color: colorVar[color] }
    : undefined;
  return (
    <span
      style={style}
      className={cn(
        "inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-md px-2 text-[12px] font-medium leading-none",
        !color && "bg-fg/[0.06] text-fg-muted",
        variant === "outline" && "border bg-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** 5 bosqichli daraja ko‘rsatkichi */
export function LevelMeter({ level, className, showLabel = true }: { level: number; className?: string; showLabel?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[12px] text-fg-muted", className)} title={levelName(level)}>
      <span className="flex items-end gap-[3px]" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={cn("w-[3px] rounded-full", i <= level ? "bg-fg" : "bg-fg/15")}
            style={{ height: 4 + i * 2 }}
          />
        ))}
      </span>
      {showLabel && <span>{levelName(level)}</span>}
      <span className="sr-only">Daraja: {level} / 5</span>
    </span>
  );
}

export function StatusBadge({ status }: { status: CourseStatus }) {
  if (status === "published") return null;
  if (status === "preparing")
    return (
      <Badge color="gold">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
        Tayyorlanmoqda
      </Badge>
    );
  return <Badge>Qoralama</Badge>;
}

/* ── Progress ──────────────────────────────────────────────── */
export function ProgressBar({
  value,
  className,
  color = "azure",
  label,
}: {
  value: number;
  className?: string;
  color?: ColorKey;
  label?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-fg/[0.08]", className)}
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
    >
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${v}%`, background: colorVar[color] }}
      />
    </div>
  );
}

export function ProgressRing({
  value,
  size = 56,
  stroke = 5,
  color = "azure",
  children,
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: ColorKey;
  children?: ReactNode;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={colorVar[color]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (v / 100) * c}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-[12px] font-semibold tabular-nums">{children}</div>
    </div>
  );
}

/* ── Card ──────────────────────────────────────────────────── */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("surface-card", className)} {...props} />;
}

/* ── Section header ────────────────────────────────────────── */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="text-balance text-[28px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[40px]">{title}</h2>
        {description && <p className="mt-4 text-pretty text-[16px] leading-relaxed text-fg-muted sm:text-[17px]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/* ── Empty state ───────────────────────────────────────────── */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong px-6 py-14 text-center", className)}>
      {icon && <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-fg/[0.05] text-fg-muted">{icon}</div>}
      <h3 className="text-[16px] font-semibold">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-[14px] leading-relaxed text-fg-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border-strong bg-surface-2 px-1 font-mono text-[10.5px] text-fg-subtle">
      {children}
    </kbd>
  );
}

export function Avatar({ name, size = 32, className }: { name: string; size?: number; className?: string }) {
  const hue = [...name].reduce((a, ch) => a + ch.charCodeAt(0), 0) % 360;
  const parts = name.trim().split(/\s+/);
  const letters = ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
  return (
    <span
      className={cn("inline-grid shrink-0 place-items-center rounded-full font-semibold text-white", className)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 40) % 360} 70% 45%))`,
      }}
      aria-hidden
    >
      {letters}
    </span>
  );
}
