import { cn } from "@/lib/cn";
import { colorVar, tint } from "@/lib/colors";
import type { ColorKey } from "@/lib/types";
import { Icon } from "@/components/ui/icon";

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Har bir kurs uchun takrorlanmas, lekin bir xil uslubdagi generativ muqova */
export function CourseCover({
  slug,
  accent,
  icon,
  coverUrl,
  className,
  size = "md",
  title,
}: {
  slug: string;
  accent: ColorKey;
  icon: string;
  coverUrl?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  title?: string;
}) {
  const h = hash(slug);
  const variant = h % 4;
  const rot = (h % 7) * 8 - 24;
  const c = colorVar[accent];
  const iconSize = size === "lg" ? 72 : size === "sm" ? 28 : 44;

  return (
    <div
      className={cn("relative isolate overflow-hidden", className)}
      style={{ background: `linear-gradient(140deg, ${tint(accent, 26)} 0%, ${tint(accent, 8)} 55%, ${tint(accent, 3)} 100%)` }}
      aria-hidden={!title}
      role={title ? "img" : undefined}
      aria-label={title}
    >
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      ) : (
        <>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <g stroke={c} fill="none" strokeOpacity="0.28" strokeWidth="1" transform={`rotate(${rot} 200 125)`}>
              {variant === 0 &&
                Array.from({ length: 5 }).map((_, i) => (
                  <g key={i} transform={`translate(${60 + i * 80} 125)`}>
                    <rect x="-26" y="-26" width="52" height="52" />
                    <rect x="-26" y="-26" width="52" height="52" transform="rotate(45)" />
                  </g>
                ))}
              {variant === 1 &&
                Array.from({ length: 9 }).map((_, i) => <circle key={i} cx="320" cy="60" r={30 + i * 34} />)}
              {variant === 2 &&
                Array.from({ length: 16 }).map((_, i) => <line key={i} x1={-100 + i * 40} y1="-40" x2={i * 40 + 60} y2="300" />)}
              {variant === 3 &&
                Array.from({ length: 6 }).map((_, row) =>
                  Array.from({ length: 10 }).map((__, col) => (
                    <circle key={`${row}-${col}`} cx={20 + col * 42} cy={20 + row * 42} r={row % 2 === col % 2 ? 3 : 1.5} fill={c} fillOpacity="0.35" stroke="none" />
                  )),
                )}
            </g>
          </svg>
          <div
            className="absolute -bottom-1/3 -right-1/4 h-[120%] w-[80%] rounded-full blur-3xl"
            style={{ background: tint(accent, 30) }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <div
              className="grid place-items-center rounded-2xl border backdrop-blur-sm"
              style={{
                width: iconSize * 1.9,
                height: iconSize * 1.9,
                borderColor: tint(accent, 35),
                background: tint(accent, 12),
                color: c,
                boxShadow: `0 20px 60px -20px ${tint(accent, 70)}`,
              }}
            >
              <Icon name={icon} size={iconSize} strokeWidth={1.4} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
