"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCallback, type ReactNode, type MouseEvent } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Ekranga kirganda yumshoq paydo bo‘ladigan blok */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Farzandlarni ketma-ket paydo qiluvchi konteyner */
export function Stagger({ children, className, gap = 0.06 }: { children: ReactNode; className?: string; gap?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Kursor ortidan yuruvchi yorug‘lik uchun CSS o‘zgaruvchilarini yangilaydi */
export function useSpotlight() {
  return useCallback((e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);
}

export function SpotlightCard({
  children,
  className,
  color,
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  const onMove = useSpotlight();
  return (
    <div onMouseMove={onMove} className={`spotlight ${className ?? ""}`} style={color ? ({ "--spot": color } as React.CSSProperties) : undefined}>
      {children}
    </div>
  );
}
