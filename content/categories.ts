import type { CategorySeed } from "../src/lib/seed/build.ts";

export const categories: CategorySeed[] = [
  {
    slug: "dasturlash",
    title: "Dasturlash va IT",
    description:
      "Kompyuter fanlari asoslaridan full-stack dasturlashgacha: HTML, CSS, JavaScript, Python, ma'lumotlar bazalari, kiberxavfsizlik va sun'iy intellekt.",
    icon: "Code2",
    color: "azure",
    order: 0,
    topics: [
      "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "Git", "GitHub",
      "SQL", "Backend", "Full-stack", "Kiberxavfsizlik", "Sun'iy intellekt", "Machine Learning", "Computer Science",
    ],
  },
  {
    slug: "video",
    title: "Video montaj va motion",
    description:
      "Montajni noldan o'rganing: kadrlar ketma-ketligi, rang korreksiyasi, ovoz dizayni, motion grafika va kinematografik hikoya qilish.",
    icon: "Clapperboard",
    color: "coral",
    order: 1,
    topics: [
      "DaVinci Resolve", "Premiere Pro", "After Effects", "CapCut", "Rang korreksiyasi", "Color grading",
      "Ovoz dizayni", "Motion grafika", "Vizual hikoya",
    ],
  },
  {
    slug: "3d",
    title: "3D va raqamli ijod",
    description:
      "Blender va Unreal Engine yordamida modellashtirish, skulpting, teksturalash, yoritish, render, animatsiya va o'yin yaratish.",
    icon: "Box",
    color: "violet",
    order: 2,
    topics: [
      "Blender", "3D modellashtirish", "Skulpting", "Teksturalash", "Yoritish", "Render", "Animatsiya",
      "Unreal Engine", "O'yin yaratish", "Real vaqtli render",
    ],
  },
  {
    slug: "dizayn",
    title: "Dizayn va kreativ dasturlar",
    description:
      "UI/UX dizayn, grafik dizayn, tipografiya va brending. Figma, Photoshop va Illustrator bilan professional ishlash.",
    icon: "PenTool",
    color: "teal",
    order: 3,
    topics: ["Figma", "Photoshop", "Illustrator", "UI dizayn", "UX dizayn", "Grafik dizayn", "Brending", "Tipografiya", "Veb-dizayn"],
  },
  {
    slug: "marketing",
    title: "Marketing va kontent",
    description:
      "Raqamli marketing, YouTube va Instagram uchun kontent yaratish, mobil fotografiya va auditoriya bilan ishlash.",
    icon: "Megaphone",
    color: "gold",
    order: 4,
    topics: ["Digital marketing", "YouTube", "Instagram", "Kontent yaratish", "Fotografiya", "SMM"],
  },
  {
    slug: "karyera",
    title: "AI vositalar va karyera",
    description:
      "Sun'iy intellekt vositalaridan samarali foydalanish, produktivlik, frilans va kuchli portfolio yaratish.",
    icon: "Sparkles",
    color: "rose",
    order: 5,
    topics: ["AI vositalari", "Produktivlik", "Frilans", "Portfolio", "Rezyume"],
  },
];
