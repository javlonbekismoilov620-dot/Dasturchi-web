"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import {
  Award,
  Bookmark,
  ChevronDown,
  Compass,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  Menu,
  Search,
  Settings,
  Shield,
  User as UserIcon,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/button";
import { Avatar, Kbd } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/ui/theme";
import { Logo } from "./logo";
import { openSearch } from "./search-bus";

export type NavUser = { name: string; email: string; role: "student" | "admin" } | null;

const NAV = [
  { href: "/kurslar", label: "Kurslar" },
  { href: "/yonalishlar", label: "Yo‘nalishlar" },
  { href: "/yollar", label: "O‘quv yo‘llari" },
  { href: "/baholash", label: "Darajani aniqlash" },
];

export function SiteHeader({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 8));

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || mobileOpen ? "glass border-b border-border" : "border-b border-transparent",
        )}
      >
        <div className="container-page flex h-16 items-center gap-6">
          <Logo />

          <nav className="hidden items-center lg:flex" aria-label="Asosiy menyu">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    className={cn(
                      "relative z-10 block rounded-lg px-3 py-1.5 text-[14px] transition-colors",
                      isActive(item.href) ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-fg/[0.06]"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={openSearch}
              className="hidden h-9 items-center gap-2 rounded-[10px] border border-border bg-surface/60 pl-3 pr-1.5 text-[13px] text-fg-subtle transition-colors hover:border-border-strong hover:text-fg-muted md:flex"
              aria-label="Qidiruv"
            >
              <Search className="h-4 w-4" />
              <span className="pr-6">Kurs, dars yoki dastur…</span>
              <Kbd>⌘K</Kbd>
            </button>
            <button
              type="button"
              onClick={openSearch}
              className="grid h-9 w-9 place-items-center rounded-[10px] text-fg-muted hover:bg-fg/[0.06] hover:text-fg md:hidden"
              aria-label="Qidiruv"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <ThemeToggle />
            {user ? (
              <UserMenu user={user} />
            ) : (
              <div className="hidden items-center gap-1.5 sm:flex">
                <ButtonLink href="/kirish" variant="ghost" size="sm" className="h-9 px-3">
                  Kirish
                </ButtonLink>
                <ButtonLink href="/royxatdan-otish" size="sm" className="h-9 px-3.5">
                  Boshlash
                </ButtonLink>
              </div>
            )}
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-[10px] text-fg-muted hover:bg-fg/[0.06] hover:text-fg lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Menyuni yopish" : "Menyuni ochish"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && <MobileMenu user={user} onClose={() => setMobileOpen(false)} pathname={pathname} />}
      </AnimatePresence>
    </>
  );
}

function MobileMenu({ user, onClose, pathname }: { user: NavUser; onClose: () => void; pathname: string }) {
  const first = useRef(pathname);
  useEffect(() => {
    if (pathname !== first.current) onClose();
  }, [pathname, onClose]);

  const links = [
    { href: "/", label: "Bosh sahifa" },
    ...NAV,
    ...(user ? [{ href: "/kabinet", label: "Shaxsiy kabinet" }] : []),
    ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin panel" }] : []),
  ];
  return (
    <motion.div
      className="fixed inset-0 z-40 bg-bg/97 pt-16 backdrop-blur-xl lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <nav className="container-page flex h-full flex-col pb-[calc(96px+env(safe-area-inset-bottom))] pt-6" aria-label="Mobil menyu">
        <motion.ul
          className="flex flex-col"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } } }}
        >
          {links.map((l) => (
            <motion.li
              key={l.href}
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } } }}
              className="border-b border-border"
            >
              <Link href={l.href} onClick={onClose} className="flex items-center justify-between py-4 text-[26px] font-semibold tracking-[-0.03em]">
                {l.label}
                <span className="text-[13px] font-normal text-fg-subtle">→</span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-auto flex flex-col gap-2">
          {user ? (
            <form action={logoutAction}>
              <button className="h-12 w-full rounded-xl border border-border-strong text-[15px] font-medium">Chiqish</button>
            </form>
          ) : (
            <>
              <ButtonLink href="/royxatdan-otish" size="lg" onClick={onClose}>
                Ta’limni boshlash
              </ButtonLink>
              <ButtonLink href="/kirish" size="lg" variant="secondary" onClick={onClose}>
                Kirish
              </ButtonLink>
            </>
          )}
        </div>
      </nav>
    </motion.div>
  );
}

function UserMenu({ user }: { user: NonNullable<NavUser> }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (v: boolean | ((p: boolean) => boolean)) => setOpenAt((cur) => ((typeof v === "function" ? v(cur === pathname) : v) ? pathname : null));
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpenAt(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenAt(null);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items = [
    { href: "/kabinet", label: "Kabinet", icon: LayoutDashboard },
    { href: "/kabinet/kurslarim", label: "Kurslarim", icon: GraduationCap },
    { href: "/kabinet/saqlanganlar", label: "Saqlanganlar", icon: Bookmark },
    { href: "/kabinet/sertifikatlar", label: "Sertifikatlar", icon: Award },
    { href: "/kabinet/profil", label: "Profil sozlamalari", icon: Settings },
  ];

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-2 rounded-[10px] pl-1 pr-2 transition-colors hover:bg-fg/[0.06]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar name={user.name} size={28} />
        <ChevronDown className={cn("h-3.5 w-3.5 text-fg-subtle transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } }}
            transition={{ type: "spring", stiffness: 500, damping: 36 }}
            className="absolute right-0 top-[calc(100%+8px)] w-64 origin-top-right rounded-xl border border-border-strong bg-elevated p-1.5 shadow-[var(--shadow-lg)]"
          >
            <div className="px-2.5 py-2">
              <p className="truncate text-[14px] font-medium">{user.name}</p>
              <p className="truncate text-[12.5px] text-fg-subtle">{user.email}</p>
            </div>
            <div className="my-1 h-px bg-border" />
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                role="menuitem"
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] text-fg-muted hover:bg-fg/[0.05] hover:text-fg"
              >
                <it.icon className="h-4 w-4" />
                {it.label}
              </Link>
            ))}
            {user.role === "admin" && (
              <Link
                href="/admin"
                role="menuitem"
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] text-fg-muted hover:bg-fg/[0.05] hover:text-fg"
              >
                <Shield className="h-4 w-4" />
                Admin panel
              </Link>
            )}
            <div className="my-1 h-px bg-border" />
            <form action={logoutAction}>
              <button
                role="menuitem"
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] text-fg-muted hover:bg-fg/[0.05] hover:text-fg"
              >
                <LogOut className="h-4 w-4" />
                Chiqish
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Mobil qurilmalar uchun pastki navigatsiya paneli */
export function MobileTabBar({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const tabs = [
    { href: "/", label: "Asosiy", icon: Home, match: (p: string) => p === "/" },
    { href: "/kurslar", label: "Kurslar", icon: Compass, match: (p: string) => p.startsWith("/kurslar") || p.startsWith("/yonalishlar") },
    { href: "#qidiruv", label: "Qidiruv", icon: Search, match: () => false, action: openSearch },
    { href: "/yollar", label: "Yo‘llar", icon: MapIcon, match: (p: string) => p.startsWith("/yollar") },
    user
      ? { href: "/kabinet", label: "Kabinet", icon: LayoutDashboard, match: (p: string) => p.startsWith("/kabinet") }
      : { href: "/kirish", label: "Kirish", icon: UserIcon, match: (p: string) => p.startsWith("/kirish") },
  ];
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      aria-label="Pastki navigatsiya"
    >
      <ul className="grid grid-cols-5">
        {tabs.map((t) => {
          const active = t.match(pathname);
          const content = (
            <>
              <span className="relative grid h-7 w-12 place-items-center">
                {active && (
                  <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-fg/[0.08]" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
                )}
                <t.icon className={cn("relative h-[19px] w-[19px]", active ? "text-fg" : "text-fg-subtle")} />
              </span>
              <span className={cn("text-[10.5px]", active ? "text-fg" : "text-fg-subtle")}>{t.label}</span>
            </>
          );
          return (
            <li key={t.label}>
              {"action" in t && t.action ? (
                <button type="button" onClick={t.action} className="flex h-[58px] w-full flex-col items-center justify-center gap-0.5">
                  {content}
                </button>
              ) : (
                <Link href={t.href} className="flex h-[58px] flex-col items-center justify-center gap-0.5" aria-current={active ? "page" : undefined}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
