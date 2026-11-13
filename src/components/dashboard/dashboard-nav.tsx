"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/kabinet", label: "Umumiy" },
  { href: "/kabinet/kurslarim", label: "Kurslarim" },
  { href: "/kabinet/saqlanganlar", label: "Saqlanganlar" },
  { href: "/kabinet/sertifikatlar", label: "Sertifikatlar" },
  { href: "/kabinet/profil", label: "Profil" },
];

export function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav className="-mx-4 overflow-x-auto px-4 no-scrollbar" aria-label="Kabinet bo‘limlari">
      <ul className="flex gap-1 border-b border-border">
        {ITEMS.map((it) => {
          const active = it.href === "/kabinet" ? pathname === it.href : pathname.startsWith(it.href);
          return (
            <li key={it.href} className="relative">
              <Link href={it.href} className={cn("block whitespace-nowrap px-3 py-3 text-[14px] transition-colors", active ? "text-fg" : "text-fg-muted hover:text-fg")} aria-current={active ? "page" : undefined}>
                {it.label}
              </Link>
              {active && <motion.span layoutId="dash-underline" className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-fg" />}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
