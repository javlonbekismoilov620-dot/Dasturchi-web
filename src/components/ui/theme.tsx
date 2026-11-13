"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

/* Mavzu sahifa chizilishidan oldin <head> dagi skript orqali o‘rnatiladi (miltillashsiz). */
export const themeScript = `(function(){try{var t=localStorage.getItem('dch-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','dark')}})();`;

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    () => (document.documentElement.getAttribute("data-theme") as "light" | "dark") ?? "dark",
    () => "dark" as const,
  );
  const setTheme = useCallback((t: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem("dch-theme", t);
    } catch {
      /* xususiy rejim */
    }
  }, []);
  return { theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "relative grid h-9 w-9 place-items-center overflow-hidden rounded-[10px] text-fg-muted transition-colors hover:bg-fg/[0.06] hover:text-fg",
        className,
      )}
      aria-label={isDark ? "Yorug‘ mavzuga o‘tish" : "Qorong‘i mavzuga o‘tish"}
      title={isDark ? "Yorug‘ mavzu" : "Qorong‘i mavzu"}
    >
      <Sun
        className={cn("absolute h-[18px] w-[18px] transition-all duration-500", isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100")}
      />
      <Moon
        className={cn("absolute h-[18px] w-[18px] transition-all duration-500", isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0")}
      />
    </button>
  );
}
