/* Ko‘pburchakli (polygon) meshlar generatori.
   Blender'dagidek kvadrat va n-burchak yuzlar saqlanadi, shuning uchun
   nuqta/qirra/yuz sonlari Blender standart obyektlari bilan mos keladi. */

export type Vec3 = [number, number, number];
export interface PolyMesh {
  verts: Vec3[];
  faces: number[][];
}

export function plane(): PolyMesh {
  return { verts: [[-1, 0, -1], [1, 0, -1], [1, 0, 1], [-1, 0, 1]], faces: [[0, 3, 2, 1]] };
}

export function cube(): PolyMesh {
  const v: Vec3[] = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
  ];
  return { verts: v, faces: [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [1, 2, 6, 5], [0, 4, 7, 3]] };
}

export function cylinder(n = 32): PolyMesh {
  const verts: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    verts.push([Math.cos(a), -1, Math.sin(a)]);
  }
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    verts.push([Math.cos(a), 1, Math.sin(a)]);
  }
  const faces: number[][] = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    faces.push([i, n + i, n + j, j]);
  }
  faces.push([...Array(n).keys()]);
  faces.push([...Array(n).keys()].map((i) => 2 * n - 1 - i));
  return { verts, faces };
}

export function cone(n = 32): PolyMesh {
  const verts: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    verts.push([Math.cos(a), -1, Math.sin(a)]);
  }
  verts.push([0, 1, 0]);
  const faces: number[][] = [];
  for (let i = 0; i < n; i++) faces.push([i, n, (i + 1) % n]);
  faces.push([...Array(n).keys()]);
  return { verts, faces };
}

export function uvSphere(segments = 32, rings = 16): PolyMesh {
  const verts: Vec3[] = [[0, 1, 0]];
  for (let r = 1; r < rings; r++) {
    const phi = (r / rings) * Math.PI;
    for (let s = 0; s < segments; s++) {
      const th = (s / segments) * Math.PI * 2;
      verts.push([Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th)]);
    }
  }
  verts.push([0, -1, 0]);
  const bottom = verts.length - 1;
  const idx = (r: number, s: number) => 1 + (r - 1) * segments + (s % segments);
  const faces: number[][] = [];
  for (let s = 0; s < segments; s++) faces.push([0, idx(1, s + 1), idx(1, s)]);
  for (let r = 1; r < rings - 1; r++) {
    for (let s = 0; s < segments; s++) faces.push([idx(r, s), idx(r, s + 1), idx(r + 1, s + 1), idx(r + 1, s)]);
  }
  for (let s = 0; s < segments; s++) faces.push([idx(rings - 1, s), idx(rings - 1, s + 1), bottom]);
  return { verts, faces };
}

export function torus(major = 48, minor = 12, R = 1, r = 0.25 * 1.0): PolyMesh {
  const verts: Vec3[] = [];
  for (let i = 0; i < major; i++) {
    const u = (i / major) * Math.PI * 2;
    for (let j = 0; j < minor; j++) {
      const v = (j / minor) * Math.PI * 2;
      verts.push([(R + r * Math.cos(v)) * Math.cos(u), r * Math.sin(v), (R + r * Math.cos(v)) * Math.sin(u)]);
    }
  }
  const id = (i: number, j: number) => (i % major) * minor + (j % minor);
  const faces: number[][] = [];
  for (let i = 0; i < major; i++) for (let j = 0; j < minor; j++) faces.push([id(i, j), id(i, j + 1), id(i + 1, j + 1), id(i + 1, j)]);
  return { verts, faces };
}

export function edgesOf(mesh: PolyMesh): [number, number][] {
  const set = new Set<string>();
  const out: [number, number][] = [];
  for (const f of mesh.faces) {
    for (let i = 0; i < f.length; i++) {
      const a = f[i];
      const b = f[(i + 1) % f.length];
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      if (!set.has(key)) {
        set.add(key);
        out.push([a, b]);
      }
    }
  }
  return out;
}

/** Yuzlarni uchburchaklarga ajratish (render uchun) — markaz atrofida “yelpig‘ich” usulida */
export function triangulate(mesh: PolyMesh): number[] {
  const tris: number[] = [];
  for (const f of mesh.faces) for (let i = 1; i < f.length - 1; i++) tris.push(f[0], f[i], f[i + 1]);
  return tris;
}

export function faceCenters(mesh: PolyMesh): Vec3[] {
  return mesh.faces.map((f) => {
    const c: Vec3 = [0, 0, 0];
    for (const i of f) {
      c[0] += mesh.verts[i][0];
      c[1] += mesh.verts[i][1];
      c[2] += mesh.verts[i][2];
    }
    return [c[0] / f.length, c[1] / f.length, c[2] / f.length];
  });
}
