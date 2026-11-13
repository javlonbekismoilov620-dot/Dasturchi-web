"use client";

import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Slider } from "./mesh-viewer";

type Grade = { exposure: number; contrast: number; lift: number; gain: number; saturation: number; temperature: number; tint: number };
const NEUTRAL: Grade = { exposure: 0, contrast: 1, lift: 0, gain: 1, saturation: 1, temperature: 0, tint: 0 };

const PRESETS: Record<string, { label: string; g: Grade }> = {
  neutral: { label: "Neytral", g: NEUTRAL },
  warm: { label: "Iliq kino", g: { exposure: 0.1, contrast: 1.15, lift: 0.03, gain: 0.97, saturation: 1.1, temperature: 0.55, tint: 0.05 } },
  cold: { label: "Sovuq triller", g: { exposure: -0.25, contrast: 1.3, lift: 0.02, gain: 0.95, saturation: 0.7, temperature: -0.6, tint: -0.1 } },
  bleach: { label: "Bleach bypass", g: { exposure: 0, contrast: 1.45, lift: 0, gain: 1, saturation: 0.35, temperature: 0, tint: 0 } },
  mono: { label: "Oq-qora", g: { exposure: 0, contrast: 1.25, lift: 0, gain: 1, saturation: 0, temperature: 0, tint: 0 } },
};

const W = 640;
const H = 360;

function drawScene(ctx: CanvasRenderingContext2D) {
  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.62);
  sky.addColorStop(0, "#2d4f86");
  sky.addColorStop(0.55, "#c9826b");
  sky.addColorStop(1, "#f2b56b");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  const sun = ctx.createRadialGradient(470, 190, 4, 470, 190, 90);
  sun.addColorStop(0, "#fff6d8");
  sun.addColorStop(0.25, "#ffd38a");
  sun.addColorStop(1, "rgba(255,180,100,0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, W, H);
  const mountain = (pts: number[][], color: string) => {
    ctx.beginPath();
    ctx.moveTo(0, H);
    pts.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };
  mountain([[0, 200], [90, 150], [180, 190], [270, 130], [380, 185], [480, 150], [560, 180], [640, 160]], "#6d5a78");
  mountain([[0, 235], [120, 190], [230, 228], [330, 196], [450, 232], [560, 205], [640, 225]], "#3e3550");
  // Ko‘l va aks
  const lake = ctx.createLinearGradient(0, 238, 0, H);
  lake.addColorStop(0, "#d99a6c");
  lake.addColorStop(1, "#24304d");
  ctx.fillStyle = lake;
  ctx.fillRect(0, 238, W, H - 238);
  ctx.fillStyle = "rgba(255,230,180,0.55)";
  for (let i = 0; i < 9; i++) ctx.fillRect(440 - i * 3, 246 + i * 9, 60 + i * 6, 2);
  // Odam silueti va yuz (teri rangi tekshiruvi uchun)
  ctx.fillStyle = "#1c1820";
  ctx.beginPath();
  ctx.ellipse(150, 300, 38, 70, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c98f6d";
  ctx.beginPath();
  ctx.ellipse(150, 214, 20, 25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e3b08f";
  ctx.beginPath();
  ctx.ellipse(157, 208, 9, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  // Rang shkalasi va kulrang karta
  const chips = ["#1a1a1a", "#555555", "#9a9a9a", "#e8e8e8", "#c0392b", "#27ae60", "#2e6bd1", "#e3b04b"];
  chips.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(330 + i * 36, 318, 32, 26);
  });
}

export function ColorGrading() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scopeRef = useRef<HTMLCanvasElement>(null);
  const srcRef = useRef<ImageData | null>(null);
  const [g, setG] = useState<Grade>(PRESETS.warm.g);
  const [preset, setPreset] = useState("warm");
  const [split, setSplit] = useState(50);

  useEffect(() => {
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const ctx = off.getContext("2d")!;
    drawScene(ctx);
    srcRef.current = ctx.getImageData(0, 0, W, H);
  }, []);

  const render = useCallback(() => {
    const src = srcRef.current;
    const canvas = canvasRef.current;
    const scope = scopeRef.current;
    if (!src || !canvas || !scope) return;
    const ctx = canvas.getContext("2d")!;
    const out = ctx.createImageData(W, H);
    const s = src.data;
    const d = out.data;
    const exp = Math.pow(2, g.exposure);
    const splitX = Math.round((split / 100) * W);
    // Kanal bo‘yicha LUT: ekspozitsiya → lift/gain → kontrast → harorat/tus
    const lut = [new Float32Array(256), new Float32Array(256), new Float32Array(256)];
    const temp = [g.temperature * 0.09, -g.tint * 0.06, -g.temperature * 0.09];
    for (let ch = 0; ch < 3; ch++) {
      for (let i = 0; i < 256; i++) {
        let v = (i / 255) * exp;
        v = g.lift + v * (g.gain - g.lift);
        v = (v - 0.5) * g.contrast + 0.5;
        v += temp[ch];
        lut[ch][i] = v;
      }
    }
    const bins = new Uint16Array(256 * 128);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        let r: number, gg: number, b: number;
        if (x < splitX) {
          r = s[i] / 255;
          gg = s[i + 1] / 255;
          b = s[i + 2] / 255;
        } else {
          r = lut[0][s[i]];
          gg = lut[1][s[i + 1]];
          b = lut[2][s[i + 2]];
          const l = 0.2126 * r + 0.7152 * gg + 0.0722 * b;
          r = l + (r - l) * g.saturation;
          gg = l + (gg - l) * g.saturation;
          b = l + (b - l) * g.saturation;
        }
        r = Math.min(1, Math.max(0, r));
        gg = Math.min(1, Math.max(0, gg));
        b = Math.min(1, Math.max(0, b));
        d[i] = r * 255;
        d[i + 1] = gg * 255;
        d[i + 2] = b * 255;
        d[i + 3] = 255;
        if ((y & 1) === 0) {
          const luma = 0.2126 * r + 0.7152 * gg + 0.0722 * b;
          const bx = Math.floor((x / W) * 256);
          const by = 127 - Math.floor(luma * 127);
          bins[by * 256 + bx]++;
        }
      }
    }
    ctx.putImageData(out, 0, 0);
    // Taqqoslash chizig‘i
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillRect(splitX - 1, 0, 2, H);

    // Waveform skopi
    const sctx = scope.getContext("2d")!;
    const img = sctx.createImageData(256, 128);
    for (let k = 0; k < bins.length; k++) {
      const v = Math.min(255, bins[k] * 22);
      img.data[k * 4] = v * 0.45;
      img.data[k * 4 + 1] = v;
      img.data[k * 4 + 2] = v * 0.55;
      img.data[k * 4 + 3] = 255;
    }
    sctx.putImageData(img, 0, 0);
    sctx.fillStyle = "rgba(255,255,255,0.18)";
    for (const lvl of [0, 0.25, 0.5, 0.75, 1]) sctx.fillRect(0, Math.round(127 - lvl * 127), 256, 1);
  }, [g, split]);

  useEffect(() => {
    const id = requestAnimationFrame(render);
    return () => cancelAnimationFrame(id);
  }, [render]);

  const set = (k: keyof Grade) => (v: number) => {
    setPreset("custom");
    setG((p) => ({ ...p, [k]: v }));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface">
      <div className="flex flex-wrap gap-1.5 border-b border-border p-2">
        {Object.entries(PRESETS).map(([id, p]) => (
          <button
            key={id}
            onClick={() => {
              setPreset(id);
              setG(p.g);
            }}
            aria-pressed={preset === id}
            className={cn("h-8 rounded-lg px-3 text-[12.5px]", preset === id ? "bg-fg text-bg" : "text-fg-muted hover:bg-fg/5 hover:text-fg")}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1fr_280px]">
        <div className="bg-black p-3">
          <div className="relative">
            <canvas ref={canvasRef} width={W} height={H} className="h-auto w-full rounded-md" role="img" aria-label="Rang korreksiyasi namunasi: chap tomonda asl kadr, o‘ng tomonda o‘zgartirilgan kadr" />
            <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10.5px] text-white">Oldin</span>
            <span className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10.5px] text-white">Keyin</span>
          </div>
          <label className="mt-3 block text-[11.5px] text-white/60">
            <span className="mb-1 block">Taqqoslash chizig‘i</span>
            <input type="range" className="range" min={0} max={100} value={split} onChange={(e) => setSplit(Number(e.target.value))} />
          </label>
          <div className="mt-3">
            <p className="mb-1 text-[11px] uppercase tracking-wider text-white/50">Luma waveform skopi</p>
            <canvas ref={scopeRef} width={256} height={128} className="h-[110px] w-full rounded bg-black [image-rendering:pixelated]" aria-label="Yorug‘lik taqsimoti grafigi" />
          </div>
        </div>
        <div className="space-y-4 border-t border-border p-4 lg:border-l lg:border-t-0">
          <p className="eyebrow">Birlamchi korreksiya</p>
          <Slider label="Ekspozitsiya" value={g.exposure} min={-2} max={2} step={0.05} onChange={set("exposure")} format={(v) => `${v > 0 ? "+" : ""}${v.toFixed(2)} EV`} />
          <Slider label="Kontrast" value={g.contrast} min={0.5} max={1.8} step={0.01} onChange={set("contrast")} format={(v) => v.toFixed(2)} />
          <Slider label="Soyalar (Lift)" value={g.lift} min={-0.2} max={0.25} step={0.005} onChange={set("lift")} format={(v) => v.toFixed(3)} />
          <Slider label="Yorug‘ joylar (Gain)" value={g.gain} min={0.6} max={1.4} step={0.01} onChange={set("gain")} format={(v) => v.toFixed(2)} />
          <Slider label="To‘yinganlik" value={g.saturation} min={0} max={2} step={0.01} onChange={set("saturation")} format={(v) => `${Math.round(v * 100)}%`} />
          <Slider label="Harorat" value={g.temperature} min={-1} max={1} step={0.01} onChange={set("temperature")} format={(v) => (v > 0 ? "iliq +" : v < 0 ? "sovuq " : "") + v.toFixed(2)} />
          <Slider label="Tus (Tint)" value={g.tint} min={-1} max={1} step={0.01} onChange={set("tint")} format={(v) => v.toFixed(2)} />
          <button
            onClick={() => {
              setG(NEUTRAL);
              setPreset("neutral");
            }}
            className="inline-flex items-center gap-1.5 text-[12.5px] text-fg-muted hover:text-fg"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Hammasini tiklash
          </button>
        </div>
      </div>
    </div>
  );
}
