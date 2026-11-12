"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Move3d, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Viewport } from "./three-viewport";
import { cone, cube, cylinder, edgesOf, faceCenters, plane, torus, triangulate, uvSphere, type PolyMesh } from "./poly-mesh";

type Shape = "cube" | "sphere" | "cylinder" | "cone" | "torus" | "plane";
type Mode = "object" | "vertex" | "edge" | "face";

const SHAPES: { id: Shape; label: string; segmented: boolean }[] = [
  { id: "cube", label: "Kub", segmented: false },
  { id: "sphere", label: "UV sfera", segmented: true },
  { id: "cylinder", label: "Silindr", segmented: true },
  { id: "cone", label: "Konus", segmented: true },
  { id: "torus", label: "Tor", segmented: true },
  { id: "plane", label: "Tekislik", segmented: false },
];

const MODES: { id: Mode; label: string; key: string }[] = [
  { id: "object", label: "Obyekt", key: "Tab" },
  { id: "vertex", label: "Nuqta", key: "1" },
  { id: "edge", label: "Qirra", key: "2" },
  { id: "face", label: "Yuz", key: "3" },
];

function build(shape: Shape, seg: number): PolyMesh {
  switch (shape) {
    case "cube":
      return cube();
    case "sphere":
      return uvSphere(seg, Math.max(3, Math.round(seg / 2)));
    case "cylinder":
      return cylinder(seg);
    case "cone":
      return cone(seg);
    case "torus":
      return torus(Math.max(3, Math.round(seg * 1.5)), Math.max(3, Math.round(seg * 0.375)), 1, 0.25);
    default:
      return plane();
  }
}

/** Blender viewport'iga o‘xshash interaktiv 3D ko‘rinish */
export function MeshViewer({ initialShape = "cube", compact }: { initialShape?: Shape; compact?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const vpRef = useRef<Viewport | null>(null);
  const groupRef = useRef<import("three").Group | null>(null);
  const [ready, setReady] = useState(false);
  const [shape, setShape] = useState<Shape>(initialShape);
  const [segments, setSegments] = useState(32);
  const [mode, setMode] = useState<Mode>("object");
  const [smooth, setSmooth] = useState(false);
  const [xray, setXray] = useState(false);
  const [loc, setLoc] = useState(0);
  const [rot, setRot] = useState(0);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState(false);

  const mesh = useMemo(() => build(shape, segments), [shape, segments]);
  const edges = useMemo(() => edgesOf(mesh), [mesh]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let alive = true;
    (async () => {
      try {
        const { createViewport } = await import("./three-viewport");
        const vp = await createViewport(mount, { cameraPos: [4.6, 3.4, 5.6] });
        if (!alive) return vp.dispose();
        const { THREE, scene } = vp;
        scene.add(new THREE.HemisphereLight(0xffffff, 0x3a3a40, 1.6));
        const dir = new THREE.DirectionalLight(0xffffff, 2.2);
        dir.position.set(4, 6, 3);
        scene.add(dir);
        const grid = new THREE.GridHelper(20, 20, 0x666670, 0x46464c);
        (grid.material as import("three").Material).transparent = true;
        (grid.material as import("three").Material).opacity = 0.5;
        grid.position.y = -1.001;
        scene.add(grid);
        // Blender'dagi kabi X (qizil) va Y (yashil) o‘qlari
        const axis = (color: number, a: [number, number, number], b: [number, number, number]) =>
          new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...a), new THREE.Vector3(...b)]), new THREE.LineBasicMaterial({ color }));
        scene.add(axis(0xd94848, [-10, -1, 0], [10, -1, 0]));
        scene.add(axis(0x6fb33f, [0, -1, -10], [0, -1, 10]));
        const group = new THREE.Group();
        scene.add(group);
        groupRef.current = group;
        vpRef.current = vp;
        setReady(true);
      } catch (e) {
        console.error(e);
        setError(true);
      }
    })();
    return () => {
      alive = false;
      vpRef.current?.dispose();
      vpRef.current = null;
    };
  }, []);

  // Mesh va ko‘rinish rejimini qayta qurish
  useEffect(() => {
    const vp = vpRef.current;
    const group = groupRef.current;
    if (!ready || !vp || !group) return;
    const { THREE } = vp;
    group.children.forEach((c) => {
      const o = c as unknown as { geometry?: { dispose: () => void }; material?: { dispose: () => void } };
      o.geometry?.dispose();
      o.material?.dispose();
    });
    group.clear();

    const positions = new Float32Array(mesh.verts.flat());
    const tris = triangulate(mesh);
    let geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setIndex(tris);
    if (smooth) geo.computeVertexNormals();
    else {
      geo = geo.toNonIndexed();
      geo.computeVertexNormals();
    }
    const edit = mode !== "object";
    const mat = new THREE.MeshStandardMaterial({
      color: 0xb8b8c0,
      roughness: 0.55,
      metalness: 0.05,
      flatShading: !smooth,
      transparent: xray || edit,
      opacity: xray ? 0.35 : edit ? 0.85 : 1,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    group.add(new THREE.Mesh(geo, mat));

    const linePos = new Float32Array(edges.flatMap(([a, b]) => [...mesh.verts[a], ...mesh.verts[b]]));
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    const lineColor = mode === "edge" ? 0xffa53d : mode === "object" ? 0x1a1a1f : 0x0f0f12;
    const lineMat = new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: mode === "object" ? (xray ? 0.6 : 0.25) : 0.9 });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    if (mode === "vertex") {
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      group.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xffa53d, size: 6, sizeAttenuation: false })));
    }
    if (mode === "face") {
      const cGeo = new THREE.BufferGeometry();
      cGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(faceCenters(mesh).flat()), 3));
      group.add(new THREE.Points(cGeo, new THREE.PointsMaterial({ color: 0xffa53d, size: 5, sizeAttenuation: false })));
      mat.color.set(0xd9c7a8);
    }
    vp.invalidate();
  }, [ready, mesh, edges, mode, smooth, xray]);

  // Transformatsiyalar
  useEffect(() => {
    const g = groupRef.current;
    if (!g || !vpRef.current) return;
    g.position.x = loc;
    g.rotation.y = (rot * Math.PI) / 180;
    g.scale.setScalar(scale);
    vpRef.current.invalidate();
  }, [loc, rot, scale, ready]);

  const segmented = SHAPES.find((s) => s.id === shape)?.segmented;

  return (
    <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border p-2">
        {SHAPES.map((s) => (
          <button
            key={s.id}
            onClick={() => setShape(s.id)}
            className={cn(
              "h-8 rounded-lg px-2.5 text-[12.5px] transition-colors",
              shape === s.id ? "bg-fg text-bg" : "text-fg-muted hover:bg-fg/5 hover:text-fg",
            )}
            aria-pressed={shape === s.id}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className={cn("grid", compact ? "" : "lg:grid-cols-[1fr_260px]")}>
        <div className="relative">
          <div ref={mountRef} className={cn("relative w-full cursor-grab active:cursor-grabbing", compact ? "h-[300px]" : "h-[340px] sm:h-[420px]")} />
          {!ready && !error && <div className="skeleton absolute inset-3" />}
          {error && (
            <p className="absolute inset-0 grid place-items-center p-6 text-center text-[14px] text-fg-muted">
              Brauzeringiz WebGL’ni qo‘llab-quvvatlamaydi yoki u o‘chirilgan.
            </p>
          )}
          {/* Rejim tanlash — Blender sarlavhasi kabi */}
          <div className="absolute left-3 top-3 flex overflow-hidden rounded-lg border border-white/10 bg-black/55 text-[12px] text-white backdrop-blur" role="radiogroup" aria-label="Tahrirlash rejimi">
            {MODES.map((m) => (
              <button
                key={m.id}
                role="radio"
                aria-checked={mode === m.id}
                onClick={() => setMode(m.id)}
                className={cn("px-2.5 py-1.5 transition-colors", mode === m.id ? "bg-[#ff9d2e] text-black" : "hover:bg-white/10")}
                title={`${m.label} rejimi (${m.key})`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="absolute bottom-3 left-3 rounded-lg bg-black/55 px-2.5 py-1.5 font-mono text-[11.5px] leading-relaxed text-white/90 backdrop-blur">
            <div>Nuqtalar: {mesh.verts.length}</div>
            <div>Qirralar: {edges.length}</div>
            <div>Yuzlar: {mesh.faces.length}</div>
          </div>
          <p className="pointer-events-none absolute right-3 top-3 hidden rounded-md bg-black/40 px-2 py-1 text-[11px] text-white/80 md:block">
            Sichqoncha bilan aylantiring · g‘ildirak bilan yaqinlashtiring
          </p>
        </div>

        {!compact && (
          <div className="space-y-5 border-t border-border p-4 lg:border-l lg:border-t-0">
            <div className="space-y-3">
              <p className="eyebrow flex items-center gap-1.5"><Box className="h-3.5 w-3.5" /> Ko‘rinish</p>
              <div className="grid grid-cols-2 gap-1.5">
                <Toggle on={!smooth} onClick={() => setSmooth(false)}>Shade Flat</Toggle>
                <Toggle on={smooth} onClick={() => setSmooth(true)}>Shade Smooth</Toggle>
              </div>
              <Toggle on={xray} onClick={() => setXray((v) => !v)} full>
                X-Ray (Alt + Z)
              </Toggle>
              {segmented && (
                <Slider label="Segmentlar soni" value={segments} min={3} max={64} step={1} onChange={setSegments} format={(v) => `${v}`} />
              )}
            </div>
            <div className="space-y-3">
              <p className="eyebrow flex items-center gap-1.5"><Move3d className="h-3.5 w-3.5" /> Transformatsiya</p>
              <Slider label="Joylashuv X (G)" value={loc} min={-3} max={3} step={0.1} onChange={setLoc} format={(v) => `${v.toFixed(1)} m`} />
              <Slider label="Aylantirish (R)" value={rot} min={-180} max={180} step={1} onChange={setRot} format={(v) => `${v}°`} />
              <Slider label="Masshtab (S)" value={scale} min={0.3} max={2} step={0.05} onChange={setScale} format={(v) => v.toFixed(2)} />
              <button
                onClick={() => {
                  setLoc(0);
                  setRot(0);
                  setScale(1);
                }}
                className="inline-flex items-center gap-1.5 text-[12.5px] text-fg-muted hover:text-fg"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Transformatsiyani tiklash (Alt + G/R/S)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle({ on, onClick, children, full }: { on: boolean; onClick: () => void; children: React.ReactNode; full?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "h-8 rounded-lg border px-2 text-[12px] transition-colors",
        full && "w-full",
        on ? "border-transparent bg-accent text-accent-fg" : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex justify-between text-[12.5px]">
        <span className="text-fg-muted">{label}</span>
        <span className="font-mono tabular-nums text-fg">{format ? format(value) : value}</span>
      </span>
      <input
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
