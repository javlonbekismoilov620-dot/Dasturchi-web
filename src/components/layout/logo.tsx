import Link from "next/link";
import { cn } from "@/lib/cn";

/** Girih yulduzidan ilhomlangan belgi: ikki kvadrat kesishmasidan hosil bo‘lgan sakkiz qirrali yulduz */
export function LogoMark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id="dch-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--teal)" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="20" height="20" rx="3" fill="url(#dch-mark)" />
      <rect x="6" y="6" width="20" height="20" rx="3" fill="url(#dch-mark)" transform="rotate(45 16 16)" opacity="0.85" />
      <path d="M13 11.5 L9.5 16 L13 20.5 M19 11.5 L22.5 16 L19 20.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="Dasturchi — bosh sahifa">
      <LogoMark className="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-[45deg]" />
      {!compact && <span className="text-[17px] font-semibold tracking-[-0.03em]">Dasturchi</span>}
    </Link>
  );
}
