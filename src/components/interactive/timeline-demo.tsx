"use client";

import { Magnet, Pause, Play, Scissors, SkipBack, Trash2, Undo2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const FPS = 25;
const TOTAL = 30 * FPS;
type TrackId = "V2" | "V1" | "A1";
type Clip = { id: string; track: TrackId; start: number; dur: number; label: string; hue: number };

const TRACKS: { id: TrackId; label: string; kind: "video" | "audio" }[] = [
  { id: "V2", label: "V2 · Titrlar", kind: "video" },
  { id: "V1", label: "V1 · Video", kind: "video" },
  { id: "A1", label: "A1 · Musiqa", kind: "audio" },
];

const INITIAL: Clip[] = [
  { id: "c1", track: "V1", start: 0, dur: 5 * FPS, label: "Shahar panoramasi", hue: 215 },
  { id: "c2", track: "V1", start: 5 * FPS, dur: 4 * FPS, label: "Bozor — umumiy plan", hue: 32 },
  { id: "c3", track: "V1", start: 9 * FPS, dur: 3 * FPS + 12, label: "Sotuvchi — yaqin plan", hue: 12 },
  { id: "c4", track: "V1", start: 12 * FPS + 12, dur: 6 * FPS, label: "Choyxona interyeri", hue: 150 },
  { id: "c5", track: "V1", start: 18 * FPS + 12, dur: 5 * FPS, label: "Quyosh botishi", hue: 280 },
  { id: "t1", track: "V2", start: 1 * FPS, dur: 3 * FPS, label: "“Toshkent tongi”", hue: 0 },
  { id: "t2", track: "V2", start: 19 * FPS, dur: 3 * FPS, label: "Yakuniy titr", hue: 0 },
  { id: "a1", track: "A1", start: 0, dur: 24 * FPS, label: "Fon musiqasi.wav", hue: 140 },
];

export function timecode(f: number) {
  const fr = Math.floor(f % FPS);
  const s = Math.floor(f / FPS);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(fr)}`;
}

let idSeq = 100;

export function TimelineDemo() {
  const [clips, setClips] = useState<Clip[]>(INITIAL);
  const [history, setHistory] = useState<Clip[][]>([]);
  const [playhead, setPlayhead] = useState(2 * FPS);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [ripple, setRipple] = useState(true);
  const [snap, setSnap] = useState(true);
  const [width, setWidth] = useState(800);
  const areaRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const pxPerFrame = width / TOTAL;

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Ijro
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setPlayhead((p) => {
        const n = p + dt * FPS;
        if (n >= TOTAL) {
          setPlaying(false);
          return TOTAL;
        }
        return n;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const commit = useCallback((next: Clip[]) => {
    setClips((prev) => {
      setHistory((h) => [...h.slice(-30), prev]);
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (!h.length) return h;
      setClips(h[h.length - 1]);
      return h.slice(0, -1);
    });
  }, []);

  const split = useCallback(() => {
    const f = Math.round(playhead);
    const targets = clips.filter((c) => f > c.start && f < c.start + c.dur && (!selected || c.id === selected));
    if (!targets.length) return;
    const next: Clip[] = [];
    for (const c of clips) {
      if (!targets.includes(c)) {
        next.push(c);
        continue;
      }
      const left = f - c.start;
      next.push({ ...c, dur: left });
      next.push({ ...c, id: `c${idSeq++}`, start: f, dur: c.dur - left });
    }
    commit(next);
  }, [clips, playhead, selected, commit]);

  const remove = useCallback(() => {
    const c = clips.find((x) => x.id === selected);
    if (!c) return;
    let next = clips.filter((x) => x.id !== c.id);
    if (ripple) next = next.map((x) => (x.track === c.track && x.start >= c.start + c.dur ? { ...x, start: x.start - c.dur } : x));
    commit(next);
    setSelected(null);
  }, [clips, selected, ripple, commit]);

  // Klaviatura yorliqlari (faqat komponent fokusda bo‘lganda)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " ") {
      e.preventDefault();
      setPlaying((p) => !p);
    } else if (e.key.toLowerCase() === "b" || ((e.ctrlKey || e.metaKey) && e.key === "\\")) {
      e.preventDefault();
      split();
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      remove();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      undo();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPlayhead((p) => Math.max(0, Math.round(p) - (e.shiftKey ? FPS : 1)));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPlayhead((p) => Math.min(TOTAL, Math.round(p) + (e.shiftKey ? FPS : 1)));
    }
  };

  const frameFromEvent = (clientX: number) => {
    const r = areaRef.current!.getBoundingClientRect();
    return Math.max(0, Math.min(TOTAL, (clientX - r.left) / pxPerFrame));
  };

  const scrubStart = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setPlaying(false);
    setPlayhead(frameFromEvent(e.clientX));
    const move = (ev: PointerEvent) => setPlayhead(frameFromEvent(ev.clientX));
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const dragClip = (e: React.PointerEvent, clip: Clip) => {
    e.stopPropagation();
    setSelected(clip.id);
    const startX = e.clientX;
    const orig = clip.start;
    const edges = clips.filter((c) => c.id !== clip.id).flatMap((c) => [c.start, c.start + c.dur]);
    let moved = false;
    let latest = clips;
    const move = (ev: PointerEvent) => {
      const dx = (ev.clientX - startX) / pxPerFrame;
      if (Math.abs(ev.clientX - startX) > 3) moved = true;
      let s = Math.round(orig + dx);
      if (snap) {
        const threshold = 8 / pxPerFrame;
        for (const p of [...edges, Math.round(playhead)]) {
          if (Math.abs(s - p) < threshold) s = p;
          else if (Math.abs(s + clip.dur - p) < threshold) s = p - clip.dur;
        }
      }
      s = Math.max(0, Math.min(TOTAL - clip.dur, s));
      setClips((prev) => {
        latest = prev.map((c) => (c.id === clip.id ? { ...c, start: s } : c));
        return latest;
      });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      if (moved) {
        setHistory((h) => [...h.slice(-30), clips]);
      }
      void latest;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const at = (track: TrackId) => clips.find((c) => c.track === track && playhead >= c.start && playhead < c.start + c.dur);
  const v1 = at("V1");
  const v2 = at("V2");
  const a1 = at("A1");
  const ticks = useMemo(() => Array.from({ length: TOTAL / FPS + 1 }, (_, i) => i), []);
  const sel = clips.find((c) => c.id === selected);

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="overflow-hidden rounded-2xl border border-border-strong bg-[#141417] text-white outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label="Montaj taymlayni. Probel — ijro, B — kesish, Delete — o‘chirish, Ctrl+Z — bekor qilish, strelkalar — kadrma-kadr."
    >
      {/* Monitor */}
      <div className="grid gap-0 border-b border-white/10 md:grid-cols-[1fr_220px]">
        <div className="relative mx-auto aspect-video w-full max-w-[560px] overflow-hidden bg-black">
          {v1 ? (
            <div
              className="absolute inset-0 transition-colors duration-200"
              style={{
                background: `radial-gradient(120% 90% at 30% 20%, hsl(${v1.hue} 70% 55%), hsl(${v1.hue + 30} 60% 18%) 70%), hsl(${v1.hue} 40% 10%)`,
              }}
            >
              <svg className="absolute inset-x-0 bottom-0 h-1/2 w-full opacity-60" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden>
                <path d={`M0 50 L0 ${30 + (v1.hue % 13)} Q 25 ${18 + (v1.hue % 9)} 50 ${32 - (v1.hue % 7)} T 100 ${26 + (v1.hue % 11)} L100 50 Z`} fill="black" fillOpacity="0.45" />
              </svg>
              <span className="absolute left-3 top-3 rounded bg-black/50 px-1.5 py-0.5 font-mono text-[10.5px]">{v1.label}</span>
            </div>
          ) : (
            <div className="absolute inset-0 grid place-items-center text-[12px] text-white/40">Bo‘sh joy (gap) — qora kadr</div>
          )}
          {v2 && (
            <div className="absolute inset-x-0 bottom-[14%] text-center">
              <span className="font-display-italic text-[22px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-[30px]">{v2.label}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-white/10 p-4 md:border-l md:border-t-0">
          <div>
            <p className="font-mono text-[22px] tabular-nums tracking-tight">{timecode(playhead)}</p>
            <p className="mt-1 text-[11.5px] text-white/50">{FPS} kadr/soniya · 1920×1080</p>
          </div>
          <div className="flex h-8 items-end gap-[3px]" aria-hidden>
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="w-1.5 rounded-sm bg-[#4ade80] transition-[height] duration-150"
                style={{ height: a1 && playing ? `${20 + Math.abs(Math.sin(playhead / 3 + i * 1.7)) * 80}%` : a1 ? "12%" : "4%", opacity: a1 ? 1 : 0.25 }}
              />
            ))}
          </div>
          <p className="text-[11.5px] text-white/60">{a1 ? `♪ ${a1.label}` : "Ovoz yo‘q"}</p>
        </div>
      </div>

      {/* Asboblar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-white/10 px-2 py-1.5 text-[12px]">
        <ToolBtn onClick={() => setPlayhead(0)} label="Boshiga"><SkipBack className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn onClick={() => setPlaying((p) => !p)} label={playing ? "Pauza (Probel)" : "Ijro (Probel)"} active={playing}>
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </ToolBtn>
        <span className="mx-1 h-5 w-px bg-white/10" />
        <ToolBtn onClick={split} label="Kesish (B)"><Scissors className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Kesish</span></ToolBtn>
        <ToolBtn onClick={remove} label="O‘chirish (Delete)" disabled={!sel}><Trash2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">O‘chirish</span></ToolBtn>
        <ToolBtn onClick={undo} label="Bekor qilish (Ctrl+Z)" disabled={!history.length}><Undo2 className="h-3.5 w-3.5" /></ToolBtn>
        <span className="mx-1 h-5 w-px bg-white/10" />
        <ToolBtn onClick={() => setRipple((r) => !r)} label="Ripple: o‘chirilgan joyni yopish" active={ripple}>Ripple</ToolBtn>
        <ToolBtn onClick={() => setSnap((s) => !s)} label="Yopishish (snapping)" active={snap}><Magnet className="h-3.5 w-3.5" /></ToolBtn>
        <span className="ml-auto hidden pr-2 text-white/40 lg:inline">Probel · B · Delete · Ctrl+Z · ← →</span>
      </div>

      {/* Taymlayn */}
      <div className="flex">
        <div className="w-[92px] shrink-0 border-r border-white/10 text-[10.5px] text-white/60 sm:w-[120px]">
          <div className="h-6 border-b border-white/10" />
          {TRACKS.map((t) => (
            <div key={t.id} className="flex h-12 items-center border-b border-white/5 px-2">{t.label}</div>
          ))}
        </div>
        <div className="relative min-w-0 flex-1 select-none">
          <div ref={areaRef} className="relative">
            <div className="relative h-6 cursor-ew-resize border-b border-white/10 bg-white/[0.03]" onPointerDown={scrubStart}>
              {ticks.map((s) => (
                <span key={s} className="absolute top-0 h-full border-l border-white/15" style={{ left: s * FPS * pxPerFrame }}>
                  {s % 5 === 0 && <span className="absolute left-1 top-0.5 font-mono text-[9.5px] text-white/45">{s}s</span>}
                </span>
              ))}
            </div>
            {TRACKS.map((t) => (
              <div key={t.id} className="relative h-12 border-b border-white/5" onPointerDown={(e) => { if (e.target === e.currentTarget) { setSelected(null); scrubStart(e); } }}>
                {clips
                  .filter((c) => c.track === t.id)
                  .map((c) => (
                    <button
                      key={c.id}
                      onPointerDown={(e) => dragClip(e, c)}
                      className={cn(
                        "absolute bottom-1 top-1 overflow-hidden rounded-md border text-left text-[10.5px] leading-tight transition-shadow",
                        selected === c.id ? "z-10 border-white shadow-[0_0_0_1px_white]" : "border-black/30",
                      )}
                      style={{
                        left: c.start * pxPerFrame,
                        width: Math.max(4, c.dur * pxPerFrame - 1),
                        background:
                          t.kind === "audio"
                            ? "linear-gradient(#1f6f43,#18563a)"
                            : t.id === "V2"
                              ? "linear-gradient(#6b4fd8,#5038b0)"
                              : `linear-gradient(hsl(${c.hue} 55% 42%), hsl(${c.hue} 55% 32%))`,
                      }}
                      aria-label={`${c.label}, ${timecode(c.start)} dan ${(c.dur / FPS).toFixed(1)} soniya`}
                    >
                      <span className="block truncate px-1.5 pt-1">{c.label}</span>
                      {t.kind === "audio" && (
                        <svg className="absolute inset-x-0 bottom-0 h-1/2 w-full opacity-60" preserveAspectRatio="none" viewBox="0 0 100 10" aria-hidden>
                          {Array.from({ length: 50 }).map((_, i) => {
                            const h = 2 + Math.abs(Math.sin(i * 1.3 + c.start)) * 7;
                            return <rect key={i} x={i * 2} y={5 - h / 2} width="1" height={h} fill="#9ef0bf" />;
                          })}
                        </svg>
                      )}
                    </button>
                  ))}
              </div>
            ))}
            <div className="pointer-events-none absolute bottom-0 top-0 z-20 w-px bg-[#ff4d4d]" style={{ left: playhead * pxPerFrame }}>
              <span className="absolute -left-[5px] top-0 h-0 w-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-[#ff4d4d]" />
            </div>
          </div>
        </div>
      </div>
      <p className="border-t border-white/10 px-3 py-2 text-[11.5px] text-white/50">
        {sel ? `Tanlangan: ${sel.label} · ${(sel.dur / FPS).toFixed(2)} s` : "Klipni tanlang yoki taymlayn bo‘ylab suring. Klipni sudrab boshqa joyga ko‘chiring."}
      </p>
    </div>
  );
}

function ToolBtn({ children, onClick, label, active, disabled }: { children: React.ReactNode; onClick: () => void; label: string; active?: boolean; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-md px-2 transition-colors disabled:opacity-35",
        active ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}
