"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const LABELS = [
  { text: "Dasturlash", color: "--accent" },
  { text: "3D", color: "--violet" },
  { text: "Video montaj", color: "--coral" },
  { text: "Dizayn", color: "--teal" },
];

/* Markaziy vizual: “bilim yadrosi” — ikosaedr karkasi, orbitalar va zarrachalar.
   three.js faqat brauzerda, sahifa yuklangandan keyin dinamik yuklanadi. */
export function HeroScene({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const small = window.innerWidth < 768;
      const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#5b82ff";
      const isLight = () => document.documentElement.getAttribute("data-theme") === "light";

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0, 8.2);

      const root = new THREE.Group();
      scene.add(root);

      /* Yadro: ikosaedr karkasi */
      const ico = new THREE.IcosahedronGeometry(1.45, 1);
      const edges = new THREE.EdgesGeometry(ico);
      const lineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.6 });
      const wire = new THREE.LineSegments(edges, lineMat);
      root.add(wire);

      /* Ichki fresnel nur */
      const glowMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uA: { value: new THREE.Color(css("--accent")) },
          uB: { value: new THREE.Color(css("--teal")) },
          uIntensity: { value: 1 },
        },
        vertexShader: `
          varying vec3 vN; varying vec3 vV;
          void main(){
            vec4 mv = modelViewMatrix * vec4(position,1.0);
            vN = normalize(normalMatrix * normal);
            vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          uniform vec3 uA; uniform vec3 uB; uniform float uIntensity;
          varying vec3 vN; varying vec3 vV;
          void main(){
            float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.2);
            vec3 col = mix(uA, uB, clamp(vN.y*0.5+0.5, 0.0, 1.0));
            gl_FragColor = vec4(col, f * 0.85 * uIntensity);
          }`,
      });
      const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.32, 4), glowMat);
      root.add(core);

      /* Uchlar: yorqin nuqtalar */
      const vtxMat = new THREE.PointsMaterial({ size: 0.075, transparent: true, opacity: 0.95, sizeAttenuation: true });
      const vtx = new THREE.Points(ico, vtxMat);
      root.add(vtx);

      /* Orbitalar va tugunlar */
      const orbitDefs = [
        { r: 2.35, tiltX: 1.15, tiltZ: 0.25, speed: 0.22, phase: 0.2 },
        { r: 2.75, tiltX: 1.9, tiltZ: -0.55, speed: -0.16, phase: 2.1 },
        { r: 3.1, tiltX: 0.55, tiltZ: 0.9, speed: 0.12, phase: 3.9 },
        { r: 2.55, tiltX: 2.5, tiltZ: 1.6, speed: -0.19, phase: 5.2 },
      ];
      const orbitMats: InstanceType<typeof THREE.LineBasicMaterial>[] = [];
      const nodes: { mesh: InstanceType<typeof THREE.Mesh>; group: InstanceType<typeof THREE.Group>; def: (typeof orbitDefs)[number]; mat: InstanceType<typeof THREE.MeshBasicMaterial> }[] = [];
      orbitDefs.forEach((def, i) => {
        const group = new THREE.Group();
        group.rotation.set(def.tiltX, 0, def.tiltZ);
        const curve = new THREE.EllipseCurve(0, 0, def.r, def.r, 0, Math.PI * 2, false, 0);
        const pts = curve.getPoints(160).map((p) => new THREE.Vector3(p.x, p.y, 0));
        const mat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.18 });
        orbitMats.push(mat);
        group.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), mat));
        const nodeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(css(LABELS[i].color)) });
        const node = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), nodeMat);
        group.add(node);
        root.add(group);
        nodes.push({ mesh: node, group, def, mat: nodeMat });
      });

      /* Fon zarrachalari */
      const count = small ? 320 : 760;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const r = 3.4 + Math.random() * 4.2;
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(p) * Math.cos(t);
        positions[i * 3 + 1] = r * Math.sin(p) * Math.sin(t) * 0.7;
        positions[i * 3 + 2] = r * Math.cos(p);
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const dustMat = new THREE.PointsMaterial({ size: 0.022, transparent: true, opacity: 0.55, sizeAttenuation: true, depthWrite: false });
      const dust = new THREE.Points(dustGeo, dustMat);
      scene.add(dust);

      const applyTheme = () => {
        const light = isLight();
        const accent = new THREE.Color(css("--accent"));
        const fg = new THREE.Color(light ? "#0c0c0f" : "#eeeef2");
        lineMat.color = light ? accent.clone().multiplyScalar(0.9) : accent.clone().lerp(new THREE.Color("#ffffff"), 0.25);
        lineMat.opacity = light ? 0.55 : 0.6;
        vtxMat.color = light ? accent : new THREE.Color("#ffffff");
        glowMat.uniforms.uA.value = accent;
        glowMat.uniforms.uB.value = new THREE.Color(css("--teal"));
        glowMat.uniforms.uIntensity.value = light ? 0.55 : 1;
        glowMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
        orbitMats.forEach((m) => {
          m.color = fg;
          m.opacity = light ? 0.16 : 0.16;
        });
        nodes.forEach((n, i) => n.mat.color.set(css(LABELS[i].color)));
        dustMat.color = fg;
        dustMat.opacity = light ? 0.35 : 0.5;
        glowMat.needsUpdate = true;
      };
      applyTheme();
      const themeObs = new MutationObserver(applyTheme);
      themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = mount;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.position.z = w < 520 ? 9.6 : 8.2;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(mount);

      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      const onPointer = (e: PointerEvent) => {
        pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      let visible = true;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(mount);

      const tmp = new THREE.Vector3();
      const clock = new THREE.Clock();
      let raf = 0;

      const updateLabels = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        nodes.forEach((n, i) => {
          const el = labelRefs.current[i];
          if (!el) return;
          n.mesh.getWorldPosition(tmp);
          const depth = tmp.z;
          tmp.project(camera);
          const x = (tmp.x * 0.5 + 0.5) * w;
          const y = (-tmp.y * 0.5 + 0.5) * h;
          el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -150%)`;
          el.style.opacity = String(Math.max(0.15, Math.min(1, 0.55 + depth * 0.22)));
        });
      };

      const frame = () => {
        raf = requestAnimationFrame(frame);
        if (!visible || document.hidden) return;
        const t = clock.getElapsedTime();
        pointer.x += (pointer.tx - pointer.x) * 0.04;
        pointer.y += (pointer.ty - pointer.y) * 0.04;
        root.rotation.y = t * 0.12 + pointer.x * 0.35;
        root.rotation.x = Math.sin(t * 0.2) * 0.08 + pointer.y * 0.2;
        wire.rotation.z = t * 0.05;
        core.scale.setScalar(1 + Math.sin(t * 1.3) * 0.015);
        nodes.forEach((n) => {
          const a = n.def.phase + t * n.def.speed * 2;
          n.mesh.position.set(Math.cos(a) * n.def.r, Math.sin(a) * n.def.r, 0);
        });
        dust.rotation.y = t * 0.015;
        renderer.render(scene, camera);
        updateLabels();
      };

      if (reduce) {
        nodes.forEach((n) => n.mesh.position.set(Math.cos(n.def.phase) * n.def.r, Math.sin(n.def.phase) * n.def.r, 0));
        root.rotation.set(0.1, 0.6, 0);
        renderer.render(scene, camera);
        updateLabels();
      } else {
        frame();
      }
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onPointer);
        ro.disconnect();
        io.disconnect();
        themeObs.disconnect();
        scene.traverse((obj) => {
          const o = obj as { geometry?: { dispose: () => void }; material?: { dispose: () => void } | { dispose: () => void }[] };
          o.geometry?.dispose();
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
          else o.material?.dispose();
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    })().catch((err) => console.error("[hero-scene]", err));

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className={cn("relative", className)} aria-hidden>
      {/* Yuklanguncha ko‘rinadigan yengil CSS fon */}
      <div className={cn("absolute inset-0 grid place-items-center transition-opacity duration-1000", ready ? "opacity-0" : "opacity-100")}>
        <div className="h-[46%] w-[46%] rounded-full bg-[radial-gradient(circle,var(--accent-soft),transparent_70%)] blur-2xl" />
      </div>
      <div ref={mountRef} className={cn("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")} />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {LABELS.map((l, i) => (
          <span
            key={l.text}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className={cn(
              "absolute left-0 top-0 hidden whitespace-nowrap rounded-full border border-border-strong bg-elevated/80 px-2.5 py-1 text-[11.5px] font-medium text-fg-muted shadow-[var(--shadow-md)] backdrop-blur-md transition-opacity sm:inline-flex",
              ready ? "" : "!opacity-0",
            )}
          >
            <span className="mr-1.5 mt-[5px] h-1.5 w-1.5 rounded-full" style={{ background: `var(${l.color})` }} />
            {l.text}
          </span>
        ))}
      </div>
    </div>
  );
}
