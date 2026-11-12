"use client";

import { useCallback, useSyncExternalStore } from "react";

const EVENT = "dch:local-flag";

/** localStorage'da saqlanadigan boolean holat (SSR uchun xavfsiz) */
export function useLocalFlag(key: string, fallback: boolean): [boolean, (v: boolean) => void] {
  const read = () => {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : v === "1";
    } catch {
      return fallback;
    }
  };
  const subscribe = useCallback(
    (cb: () => void) => {
      const onStorage = (e: Event) => {
        if (e instanceof StorageEvent ? e.key === key : (e as CustomEvent<string>).detail === key) cb();
      };
      window.addEventListener("storage", onStorage);
      window.addEventListener(EVENT, onStorage);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(EVENT, onStorage);
      };
    },
    [key],
  );
  const value = useSyncExternalStore(subscribe, read, () => fallback);
  const set = useCallback(
    (v: boolean) => {
      try {
        localStorage.setItem(key, v ? "1" : "0");
      } catch {
        /* xususiy rejim */
      }
      window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
    },
    [key],
  );
  return [value, set];
}
