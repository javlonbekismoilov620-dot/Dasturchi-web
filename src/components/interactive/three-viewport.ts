"use client";

import type * as THREE_NS from "three";
import type { OrbitControls as OrbitControlsT } from "three/addons/controls/OrbitControls.js";

export type ThreeModule = typeof THREE_NS;

export interface Viewport {
  THREE: ThreeModule;
  renderer: THREE_NS.WebGLRenderer;
  scene: THREE_NS.Scene;
  camera: THREE_NS.PerspectiveCamera;
  controls: OrbitControlsT;
  /** Keyingi kadrni chizishni so‘rash (talab bo‘yicha render — batareyani tejaydi) */
  invalidate: () => void;
  isLight: () => boolean;
  dispose: () => void;
}

/** Interaktiv 3D vositalar uchun umumiy sahna: renderer, kamera, orbit boshqaruvi, o‘lcham, mavzu */
export async function createViewport(
  mount: HTMLElement,
  opts: { cameraPos?: [number, number, number]; target?: [number, number, number]; shadows?: boolean; onTheme?: (light: boolean) => void } = {},
): Promise<Viewport> {
  const THREE = await import("three");
  const { OrbitControls } = await import("three/addons/controls/OrbitControls.js");

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  if (opts.shadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.touchAction = "none";
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 200);
  camera.position.set(...(opts.cameraPos ?? [4.2, 3.2, 5.2]));

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 2;
  controls.maxDistance = 20;
  controls.target.set(...(opts.target ?? [0, 0, 0]));

  const isLight = () => document.documentElement.getAttribute("data-theme") === "light";
  const applyTheme = () => {
    // Blender viewport'iga yaqin neytral kulrang fon
    scene.background = new THREE.Color(isLight() ? "#e9e9ec" : "#2a2a2e");
    opts.onTheme?.(isLight());
    invalidate();
  };

  let frameRequested = false;
  let raf = 0;
  const render = () => {
    frameRequested = false;
    const moving = controls.update();
    renderer.render(scene, camera);
    if (moving) invalidate();
  };
  const invalidate = () => {
    if (frameRequested) return;
    frameRequested = true;
    raf = requestAnimationFrame(render);
  };
  controls.addEventListener("change", invalidate);

  const resize = () => {
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    invalidate();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(mount);
  const themeObs = new MutationObserver(applyTheme);
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  applyTheme();
  resize();

  return {
    THREE,
    renderer,
    scene,
    camera,
    controls,
    invalidate,
    isLight,
    dispose: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      themeObs.disconnect();
      controls.dispose();
      scene.traverse((obj) => {
        const o = obj as { geometry?: { dispose: () => void }; material?: { dispose: () => void } | { dispose: () => void }[] };
        o.geometry?.dispose();
        if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
        else o.material?.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
