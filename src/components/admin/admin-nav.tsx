"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, FolderTree, GraduationCap, Image as ImageIcon, LayoutDashboard, Menu, MessageCircleQuestion, Users, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { LogoMark } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/ui/theme";

const ITEMS = [
  { href: "/admin", label: "Umumiy ko‘rinish", icon: LayoutDashboard },
  { href: "/admin/kurslar", label: "Kurslar", icon: GraduationCap },
  { href: "/admin/yonalishlar", label: "Yo‘nalishlar", icon: FolderTree },
  { href: "/admin/talabalar", label: "Talabalar", icon: Users },
  { href: "/admin/savollar", label: "Savol-javoblar", icon: MessageCircleQuestion },
  { href: "/admin/sertifikatlar", label: "Sertifikatlar", icon: Award },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
];

export function AdminNav({ name, storeKind, persistError }: { name: string; storeKind: string; persistError: string | null }) {
  const pathname = usePathname();
  // Menyu ochilgan sahifa yo‘li eslab qolinadi — boshqa sahifaga o‘tilganda avtomatik yopiladi
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (v: boolean) => setOpenAt(v ? pathname : null);
  const links = (
    <ul className="space-y-0.5">
      {ITEMS.map((it) => {
        const active = it.href === "/admin" ? pathname === "/admin" : pathname.startsWith(it.href);
        return (
          <li key={it.href}>
            <Link
              href={it.href}
              className={cn("flex items-center gap-2.5 rounded-lg px-3 py-2 text-[14px] transition-colors", active ? "bg-fg/[0.07] font-medium text-fg" : "text-fg-muted hover:bg-fg/[0.04] hover:text-fg")}
              aria-current={active ? "page" : undefined}
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
  const footer = (
    <div className="space-y-3 border-t border-border p-4 text-[12px] text-fg-subtle">
      <p>
        Ma’lumotlar ombori: <span className="font-medium text-fg">{storeKind === "supabase" ? "Supabase (PostgreSQL)" : "Lokal JSON"}</span>
      </p>
      {persistError && <p className="text-danger">Diskka yozib bo‘lmadi — o‘zgarishlar faqat xotirada. Supabase’ni sozlang.</p>}
      <div className="flex items-center justify-between">
        <span className="truncate">{name}</span>
        <ThemeToggle />
      </div>
    </div>
  );
  return (
    <>
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-bg-subtle lg:flex">
        <div className="flex h-16 items-center gap-2.5 px-5">
          <LogoMark size={26} />
          <span className="text-[15px] font-semibold tracking-tight">Admin</span>
          <Link href="/" className="ml-auto text-[12px] text-fg-subtle hover:text-fg">Saytga →</Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label="Admin menyu">{links}</nav>
        {footer}
      </aside>
      <header className="glass sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border px-4 lg:hidden">
        <button onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-fg/5" aria-label="Menyu">
          <Menu className="h-5 w-5" />
        </button>
        <LogoMark size={22} />
        <span className="text-[14px] font-semibold">Admin</span>
        <Link href="/" className="ml-auto text-[12.5px] text-fg-subtle">Saytga →</Link>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-bg">
            <div className="flex h-14 items-center justify-between px-4">
              <span className="text-[14px] font-semibold">Admin menyu</span>
              <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-fg/5" aria-label="Yopish">
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 px-3">{links}</nav>
            {footer}
          </div>
        </div>
      )}
    </>
  );
}
