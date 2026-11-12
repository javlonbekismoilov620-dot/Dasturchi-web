"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Slider } from "./mesh-viewer";
import type { Viewport } from "./three-viewport";

type Light = { intensity: number; angle: number; kelvin: number };
type Setup = { key: Light; fill: Light; rim: Light; ambient: number };

const PRESETS: Record<string, { label: string; hint: string; setup: Setup }> = {
  three: {
    label: "Uch nuqtali",
    hint: "Klassik sxema: asosiy yorug‘lik shaklni beradi, to‘ldiruvchi soyalarni yumshatadi, orqa yorug‘lik obyektni fondan ajratadi.",
    setup: { key: { intensity: 3.2, angle: 40, kelvin: 4800 }, fill: { intensity: 1.1, angle: -55, kelvin: 7000 }, rim: { intensity: 2.6, angle: 160, kelvin: 6500 }, ambient: 0.15 },
  },
  key: {
    label: "Faqat asosiy",
    hint: "Bitta yorug‘lik — kuchli kontrast va qattiq soyalar. To‘ldiruvchi yo‘qligi soyalarni butunlay qoraytiradi.",
    setup: { key: { intensity: 3.6, angle: 45, kelvin: 5200 }, fill: { intensity: 0, angle: -55, kelvin: 6500 }, rim: { intensity: 0, angle: 160, kelvin: 6500 }, ambient: 0.05 },
  },
  drama: {
    label: "Drama",
    hint: "Yon tomondan past burchakdagi iliq yorug‘lik va sovuq orqa nur — kinematografik, sirli kayfiyat.",
    setup: { key: { intensity: 4, angle: 90, kelvin: 3200 }, fill: { intensity: 0.25, angle: -60, kelvin: 8000 }, rim: { intensity: 3.5, angle: 200, kelvin: 9000 }, ambient: 0.03 },
  },
  soft: {
    label: "Yumshoq studiya",
    hint: "Mahsulot vizualizatsiyasi uchun: yorug‘lik teng taqsimlangan, soyalar yengil.",
    setup: { key: { intensity: 2.2, angle: 30, kelvin: 5600 }, fill: { intensity: 1.8, angle: -40, kelvin: 5600 }, rim: { intensity: 1.2, angle: 170, kelvin: 6000 }, ambient: 0.45 },
  },
};

/** Kelvin → RGB (Tanner Helland taxminiy formulasi) */
function kelvinToRgb(k: number): [number, number, number] {
  const t = k / 100;
  let r: number, g: number, b: number;
  if (t <= 66) {
    r = 255;
    g = 99.47 * Math.log(t) - 161.12;
    b = t <= 19 ? 0 : 138.52 * Math.log(t - 10) - 305.04;
  } else {
    r = 329.7 * Math.pow(t - 60, -0.1332);
    g = 288.12 * Math.pow(t - 60, -0.0755);
    b = 255;
  }
  const c = (v: number) => Math.max(0, Math.min(255, v)) / 255;
  return [c(r), c(g), c(b)];
}

export function LightingLab() {
  const mountRef = useRef<HTMLDivElement>(null);
  const vpRef = useRef<Viewport | null>(null);
  const lightsRef = useRef<{ key: import("three").SpotLight; fill: import("three").SpotLight; rim: import("three").SpotLight; amb: import("three").AmbientLight } | null>(null);
  const [ready, setReady] = useState(false);
  const [preset, setPreset] = useState<keyof typeof PRESETS>("three");
  const [setup, setSetup] = useState<Setup>(PRESETS.three.setup);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let alive = true;
    (async () => {
      const { createViewport } = await import("./three-viewport");
      const vp = await createViewport(mount, { cameraPos: [0, 1.4, 6.2], target: [0, 0.6, 0], shadows: true });
      if (!alive) return vp.dispose();
      const { THREE, scene } = vp;
      scene.background = new THREE.Color("#0d0d10");
      vp.controls.minDistance = 3.5;
      vp.controls.maxDistance = 10;

      const floor = new THREE.Mesh(new THREE.CircleGeometry(8, 64), new THREE.MeshStandardMaterial({ color: 0x3a3a40, roughness: 0.9 }));
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      // “Haykal”: bosh shaklidagi sfera, ustun va halqa — yorug‘lik ta’sirini ko‘rish uchun
      const mat = new THREE.MeshStandardMaterial({ color: 0xd8d2c8, roughness: 0.45, metalness: 0 });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.85, 64, 48), mat);
      head.position.y = 1.55;
      head.scale.set(0.9, 1.08, 0.95);
      head.castShadow = true;
      const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 0.7, 48), new THREE.MeshStandardMaterial({ color: 0x8c8c94, roughness: 0.6 }));
      pedestal.position.y = 0.35;
      pedestal.castShadow = pedestal.receiveShadow = true;
      const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.35, 0.12, 160, 24), new THREE.MeshStandardMaterial({ color: 0xc9a46a, roughness: 0.25, metalness: 0.6 }));
      knot.position.set(1.9, 0.62, 0.4);
      knot.castShadow = true;
      scene.add(head, pedestal, knot);

      const mk = () => {
        const s = new THREE.SpotLight(0xffffff, 1, 30, Math.PI / 5, 0.5, 1.2);
        s.castShadow = true;
        s.shadow.mapSize.set(1024, 1024);
        s.shadow.bias = -0.0004;
        s.target.position.set(0, 1.2, 0);
        scene.add(s, s.target);
        return s;
      };
      const amb = new THREE.AmbientLight(0xffffff, 0.1);
      scene.add(amb);
      lightsRef.current = { key: mk(), fill: mk(), rim: mk(), amb };
      vpRef.current = vp;
      setReady(true);
    })().catch(console.error);
    return () => {
      alive = false;
      vpRef.current?.dispose();
      vpRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = lightsRef.current;
    const vp = vpRef.current;
    if (!ready || !L || !vp) return;
    const place = (light: import("three").SpotLight, cfg: Light, height: number, dist: number) => {
      const a = (cfg.angle * Math.PI) / 180;
      light.position.set(Math.sin(a) * dist, height, Math.cos(a) * dist);
      light.intensity = cfg.intensity * 12;
      light.color.setRGB(...kelvinToRgb(cfg.kelvin));
      light.visible = cfg.intensity > 0.01;
    };
    place(L.key, setup.key, 4, 4.5);
    place(L.fill, setup.fill, 2.4, 4.8);
    place(L.rim, setup.rim, 3.6, 4.2);
    L.amb.intensity = setup.ambient;
    vp.invalidate();
  }, [setup, ready]);

  const update = (which: "key" | "fill" | "rim", patch: Partial<Light>) => setSetup((s) => ({ ...s, [which]: { ...s[which], ...patch } }));

  return (
    <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface">
      <div className="flex flex-wrap gap-1.5 border-b border-border p-2">
        {Object.entries(PRESETS).map(([id, p]) => (
          <button
            key={id}
            onClick={() => {
              setPreset(id as keyof typeof PRESETS);
              setSetup(p.setup);
            }}
            aria-pressed={preset === id}
            className={cn("h-8 rounded-lg px-3 text-[12.5px]", preset === id ? "bg-fg text-bg" : "text-fg-muted hover:bg-fg/5 hover:text-fg")}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1fr_280px]">
        <div className="relative">
          <div ref={mountRef} className="h-[340px] w-full sm:h-[420px]" />
          {!ready && <div className="skeleton absolute inset-3" />}
          <p className="absolute bottom-3 left-3 right-3 rounded-lg bg-black/55 px-3 py-2 text-[12.5px] leading-snug text-white/90 backdrop-blur">
            {PRESETS[preset].hint}
          </p>
        </div>
        <div className="space-y-5 border-t border-border p-4 lg:border-l lg:border-t-0">
          {(
            [
              ["key", "Asosiy (Key)"],
              ["fill", "To‘ldiruvchi (Fill)"],
              ["rim", "Orqa (Rim)"],
            ] as const
          ).map(([id, label]) => (
            <div key={id} className="space-y-2.5">
              <p className="eyebrow">{label}</p>
              <Slider label="Kuchi" value={setup[id].intensity} min={0} max={5} step={0.1} onChange={(v) => update(id, { intensity: v })} format={(v) => v.toFixed(1)} />
              <Slider label="Burchak" value={setup[id].angle} min={-180} max={220} step={1} onChange={(v) => update(id, { angle: v })} format={(v) => `${v}°`} />
              <Slider label="Rang harorati" value={setup[id].kelvin} min={2000} max={10000} step={100} onChange={(v) => update(id, { kelvin: v })} format={(v) => `${v} K`} />
            </div>
          ))}
          <Slider label="Atrof yorug‘ligi (Ambient)" value={setup.ambient} min={0} max={1} step={0.01} onChange={(v) => setSetup((s) => ({ ...s, ambient: v }))} format={(v) => v.toFixed(2)} />
        </div>
      </div>
    </div>
  );
}
