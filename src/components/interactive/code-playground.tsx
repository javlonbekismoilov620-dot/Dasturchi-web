"use client";

import { Check, Copy, Loader2, Play, RotateCcw, Terminal } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { LANGUAGE_LABEL } from "@/lib/highlight";
import { CodeEditor } from "./code-editor";

type Lang = "html" | "javascript" | "python";
type Line = { kind: "log" | "warn" | "error" | "info" | "system"; text: string };

const PYODIDE_URL = process.env.NEXT_PUBLIC_PYODIDE_URL || "https://cdn.jsdelivr.net/npm/pyodide@314.0.7/";

/* JavaScript alohida oqimda (Web Worker) bajariladi: cheksiz sikl sahifani muzlatmaydi */
const JS_WORKER = `
const fmt = (v) => {
  if (typeof v === 'string') return v;
  if (v instanceof Error) return v.name + ': ' + v.message;
  try { return JSON.stringify(v, null, 2) ?? String(v); } catch { return String(v); }
};
self.onmessage = (e) => {
  const send = (kind) => (...a) => self.postMessage({ kind, text: a.map(fmt).join(' ') });
  const console = { log: send('log'), info: send('info'), warn: send('warn'), error: send('error'), table: send('log') };
  try {
    new Function('console', '"use strict";\\n' + e.data.code)(console);
    self.postMessage({ kind: 'done' });
  } catch (err) {
    self.postMessage({ kind: 'error', text: (err && err.name ? err.name + ': ' + err.message : String(err)) });
    self.postMessage({ kind: 'done' });
  }
};
self.addEventListener('unhandledrejection', (e) => self.postMessage({ kind: 'error', text: 'Promise xatosi: ' + (e.reason && e.reason.message || e.reason) }));
`;

/* Python — Pyodide (WebAssembly) modul-worker ichida ishlaydi */
const PY_WORKER = `
let py = null, loading = null;
self.onmessage = async (e) => {
  const { code, indexURL, stdin } = e.data;
  try {
    if (!py) {
      if (!loading) {
        self.postMessage({ kind: 'system', text: 'Python muhiti yuklanmoqda (birinchi marta ~10 MB)…' });
        loading = import(indexURL + 'pyodide.mjs').then((m) => m.loadPyodide({ indexURL }));
      }
      py = await loading;
    }
    const lines = (stdin || '').split('\\n');
    let i = 0;
    py.setStdin({ stdin: () => (i < lines.length ? lines[i++] : undefined), isatty: false });
    py.setStdout({ batched: (s) => self.postMessage({ kind: 'log', text: s }) });
    py.setStderr({ batched: (s) => self.postMessage({ kind: 'error', text: s }) });
    await py.runPythonAsync(code);
  } catch (err) {
    const msg = String(err && err.message || err);
    const tail = msg.split('\\n').filter(Boolean).slice(-3).join('\\n');
    self.postMessage({ kind: 'error', text: tail });
  }
  self.postMessage({ kind: 'done' });
};
`;

function makeWorker(src: string, module = false) {
  const url = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));
  const w = new Worker(url, module ? { type: "module" } : undefined);
  // Skript yuklanib bo‘lgach URL bo‘shatiladi
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
  return w;
}

function storageGet(key?: string) {
  if (!key) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function storageSet(key: string | undefined, v: string | null) {
  if (!key) return;
  try {
    if (v === null) localStorage.removeItem(key);
    else localStorage.setItem(key, v);
  } catch {
    /* saqlash imkonsiz */
  }
}

export function CodePlayground({
  language,
  code: initial,
  storageKey,
  compact,
  title,
}: {
  language: Lang;
  code: string;
  storageKey?: string;
  compact?: boolean;
  title?: string;
}) {
  // Komponent faqat brauzerda (ssr: false) ishlaydi — saqlangan kod darhol tiklanadi
  const [code, setCode] = useState(() => storageGet(storageKey) ?? initial);
  const [srcDoc, setSrcDoc] = useState(() => (language === "html" ? storageGet(storageKey) ?? initial : ""));
  const [lines, setLines] = useState<Line[]>([]);
  const [running, setRunning] = useState(false);
  const [stdin, setStdin] = useState("");
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"code" | "result">("code");
  const workerRef = useRef<Worker | null>(null);
  const pyWorkerRef = useRef<Worker | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // HTML — jonli ko‘rinish (debounce)
  useEffect(() => {
    if (language !== "html") return;
    const t = setTimeout(() => setSrcDoc(code), 280);
    return () => clearTimeout(t);
  }, [code, language]);

  useEffect(() => {
    const t = setTimeout(() => storageSet(storageKey, code === initial ? null : code), 400);
    return () => clearTimeout(t);
  }, [code, initial, storageKey]);

  useEffect(
    () => () => {
      workerRef.current?.terminate();
      pyWorkerRef.current?.terminate();
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const push = (l: Line) => setLines((prev) => [...prev.slice(-300), l]);

  const runJs = useCallback(() => {
    workerRef.current?.terminate();
    if (timerRef.current) clearTimeout(timerRef.current);
    setLines([]);
    setRunning(true);
    const w = makeWorker(JS_WORKER);
    workerRef.current = w;
    let done = false;
    w.onmessage = (e: MessageEvent<{ kind: Line["kind"] | "done"; text?: string }>) => {
      if (e.data.kind === "done") {
        done = true;
        setRunning(false);
        // Asinxron loglar uchun qisqa muddat kutib, so‘ng to‘xtatish
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => w.terminate(), 3000);
        return;
      }
      push({ kind: e.data.kind, text: e.data.text ?? "" });
    };
    w.onerror = (e) => {
      push({ kind: "error", text: e.message || "Noma’lum xato" });
      setRunning(false);
    };
    timerRef.current = setTimeout(() => {
      if (!done) {
        w.terminate();
        setRunning(false);
        push({ kind: "error", text: "Kod 5 soniyadan ortiq ishladi va to‘xtatildi. Cheksiz sikl yo‘qligini tekshiring." });
      }
    }, 5000);
    w.postMessage({ code });
  }, [code]);

  const runPy = useCallback(() => {
    setLines([]);
    setRunning(true);
    if (!pyWorkerRef.current) pyWorkerRef.current = makeWorker(PY_WORKER, true);
    const w = pyWorkerRef.current;
    let done = false;
    const killer = setTimeout(() => {
      if (!done) {
        w.terminate();
        pyWorkerRef.current = null;
        setRunning(false);
        push({ kind: "error", text: "Dastur 20 soniyadan ortiq ishladi va to‘xtatildi. Cheksiz sikl yo‘qligini tekshiring." });
      }
    }, 20000);
    w.onmessage = (e: MessageEvent<{ kind: Line["kind"] | "done"; text?: string }>) => {
      if (e.data.kind === "done") {
        done = true;
        clearTimeout(killer);
        setRunning(false);
        return;
      }
      push({ kind: e.data.kind, text: e.data.text ?? "" });
    };
    w.onerror = () => {
      done = true;
      clearTimeout(killer);
      setRunning(false);
      pyWorkerRef.current = null;
      push({ kind: "error", text: "Python muhitini yuklab bo‘lmadi. Internet aloqasini tekshirib, qayta urinib ko‘ring." });
    };
    w.postMessage({ code, indexURL: PYODIDE_URL, stdin });
  }, [code, stdin]);

  const run = useCallback(() => {
    setTab("result");
    if (language === "javascript") runJs();
    else if (language === "python") runPy();
    else setSrcDoc(code);
  }, [language, runJs, runPy, code]);

  const reset = () => {
    setCode(initial);
    setLines([]);
    if (language === "html") setSrcDoc(initial);
    storageSet(storageKey, null);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard ruxsati yo‘q */
    }
  };

  const baseStyle = `<style>html{color-scheme:light}body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;margin:16px;line-height:1.5;color:#1b1b1f}</style>`;
  const htmlDoc = /<html[\s>]/i.test(srcDoc)
    ? srcDoc.replace(/<head([^>]*)>/i, `<head$1>${baseStyle}`)
    : `<!DOCTYPE html><html lang="uz"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${baseStyle}</head><body>${srcDoc}</body></html>`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span className="flex gap-1.5 pl-1" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-fg/15" />
        </span>
        <span className="ml-2 truncate font-mono text-[12px] text-fg-subtle">{title ?? `${LANGUAGE_LABEL[language]} muharriri`}</span>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={copy} className="grid h-8 w-8 place-items-center rounded-lg text-fg-subtle hover:bg-fg/5 hover:text-fg" aria-label="Kodni nusxalash" title="Nusxalash">
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </button>
          <button onClick={reset} className="grid h-8 w-8 place-items-center rounded-lg text-fg-subtle hover:bg-fg/5 hover:text-fg" aria-label="Asl holiga qaytarish" title="Asl holiga qaytarish">
            <RotateCcw className="h-4 w-4" />
          </button>
          {language !== "html" && (
            <button
              onClick={run}
              disabled={running}
              className="ml-1 inline-flex h-8 items-center gap-1.5 rounded-lg bg-fg px-3 text-[12.5px] font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
              Ishga tushirish
            </button>
          )}
        </div>
      </div>

      <div className="flex border-b border-border md:hidden" role="tablist">
        {(["code", "result"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn("flex-1 py-2 text-[13px]", tab === t ? "border-b-2 border-fg font-medium text-fg" : "text-fg-subtle")}
          >
            {t === "code" ? "Kod" : language === "html" ? "Natija" : "Konsol"}
          </button>
        ))}
      </div>

      <div className={cn("grid md:grid-cols-2", compact ? "md:min-h-[300px]" : "md:min-h-[360px]")}>
        <div className={cn("max-h-[520px] overflow-auto border-border md:border-r", tab !== "code" && "hidden md:block")}>
          <CodeEditor value={code} onChange={setCode} language={language} onRun={run} minHeight={compact ? 260 : 320} />
        </div>
        <div className={cn("flex min-h-[260px] flex-col bg-bg-subtle", tab !== "result" && "hidden md:flex")}>
          {language === "html" ? (
            <iframe
              title="Natija"
              srcDoc={htmlDoc}
              sandbox="allow-scripts allow-modals allow-popups allow-popups-to-escape-sandbox"
              className="h-full min-h-[300px] w-full flex-1 bg-white"
            />
          ) : (
            <>
              {language === "python" && (
                <label className="border-b border-border px-4 py-2.5">
                  <span className="eyebrow">input() uchun ma’lumotlar · har qatorga bittadan</span>
                  <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    rows={2}
                    className="mt-1.5 w-full resize-y rounded-md border border-border bg-surface px-2 py-1 font-mono text-[12.5px] outline-none focus:border-accent"
                    placeholder="Masalan: Aziz"
                  />
                </label>
              )}
              <div className="flex items-center gap-2 px-4 pt-3 text-fg-subtle">
                <Terminal className="h-3.5 w-3.5" />
                <span className="eyebrow">Konsol</span>
              </div>
              <div className="flex-1 overflow-auto px-4 pb-4 pt-2 font-mono text-[12.5px] leading-relaxed" aria-live="polite">
                {lines.length === 0 && !running && (
                  <p className="text-fg-subtle">“Ishga tushirish” tugmasini bosing yoki Ctrl + Enter.</p>
                )}
                {lines.map((l, i) => (
                  <pre
                    key={i}
                    className={cn(
                      "whitespace-pre-wrap break-words border-b border-border/60 py-1",
                      l.kind === "error" && "text-danger",
                      l.kind === "warn" && "text-warning",
                      l.kind === "system" && "text-fg-subtle italic",
                    )}
                  >
                    {l.text}
                  </pre>
                ))}
                {running && <p className="pt-1 text-fg-subtle">Bajarilmoqda…</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
