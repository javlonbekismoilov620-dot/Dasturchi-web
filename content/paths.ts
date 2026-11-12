import type { PathSeed } from "../src/lib/seed/build.ts";

export const paths: PathSeed[] = [
  {
    slug: "frontend-dasturchi",
    title: "Frontend dasturchi",
    subtitle: "Veb-sahifalardan zamonaviy veb-ilovalargacha",
    description:
      "Brauzerda ishlaydigan interfeyslarni yaratishni o'rganasiz: avval sahifa tuzilmasi va dizayni, keyin dasturlash mantig'i, versiyalarni boshqarish va zamonaviy freymvorklar.",
    icon: "Monitor",
    color: "azure",
    order: 0,
    outcomes: [
      "Moslashuvchan (responsive) veb-sahifalarni noldan yaratish",
      "JavaScript bilan interaktiv interfeyslar qurish",
      "Git va GitHub orqali jamoada ishlash",
      "React va Next.js asosida ilovalar yaratish",
    ],
    steps: [
      { courseSlug: "web-asoslari", note: "Sahifa tuzilmasi (HTML) va dizayni (CSS)" },
      { courseSlug: "javascript-asoslari", note: "Dasturlash mantig'i va interaktivlik" },
      { courseSlug: "git-github", note: "Kodni saqlash va jamoaviy ish" },
      { courseSlug: "typescript-asoslari", note: "Xavfsiz, turlangan JavaScript" },
      { courseSlug: "react-asoslari", note: "Komponentlarga asoslangan interfeyslar" },
      { courseSlug: "nextjs-fullstack", note: "To'liq stekli veb-ilovalar" },
    ],
  },
  {
    slug: "backend-dasturchi",
    title: "Backend dasturchi",
    subtitle: "Server, ma'lumotlar bazasi va API",
    description:
      "Ilovalarning “ko'rinmas” qismini o'rganasiz: dasturlash asoslari, ma'lumotlarni saqlash, server yozish va xavfsizlik.",
    icon: "Server",
    color: "teal",
    order: 1,
    outcomes: [
      "Python va JavaScript'da mustaqil dastur yozish",
      "SQL so'rovlari bilan ma'lumotlar bazasini boshqarish",
      "Node.js'da REST API yaratish",
      "Ilovalarni asosiy xavfsizlik tahdidlaridan himoya qilish",
    ],
    steps: [
      { courseSlug: "python-noldan", note: "Dasturlash tafakkuri" },
      { courseSlug: "git-github", note: "Versiyalarni boshqarish" },
      { courseSlug: "malumotlar-bazasi-sql", note: "Ma'lumotlarni saqlash va so'rovlar" },
      { courseSlug: "javascript-asoslari", note: "Server uchun JavaScript" },
      { courseSlug: "nodejs-backend", note: "API va server dasturlash" },
      { courseSlug: "kiberxavfsizlik-asoslari", note: "Xavfsizlik asoslari" },
    ],
  },
  {
    slug: "3d-rassom",
    title: "3D rassom",
    subtitle: "Blender'dan Unreal Engine'gacha",
    description:
      "3D sahna yaratishni bosqichma-bosqich o'rganasiz: interfeys va modellashtirish, materiallar va yoritish, skulpting, so'ngra real vaqtli muhitlar.",
    icon: "Box",
    color: "violet",
    order: 2,
    outcomes: [
      "Blender'da obyekt va sahnalarni modellashtirish",
      "Material, yorug'lik va render sozlamalarini boshqarish",
      "Personaj va organik shakllarni skulpting qilish",
      "Unreal Engine'da interaktiv muhit yaratish",
    ],
    steps: [
      { courseSlug: "blender-boshlangich", note: "Interfeys, obyektlar va birinchi render" },
      { courseSlug: "blender-modellashtirish", note: "Professional modellashtirish texnikalari" },
      { courseSlug: "blender-skulpting", note: "Organik shakllar va personajlar" },
      { courseSlug: "unreal-engine-asoslari", note: "Real vaqtli muhitlar" },
      { courseSlug: "oyin-yaratish", note: "Birinchi o'yin prototipi" },
    ],
  },
  {
    slug: "video-montajchi",
    title: "Video montajchi",
    subtitle: "Telefondagi montajdan kinematografik loyihalargacha",
    description:
      "Montaj tilini o'rganasiz: kesish ritmi, rang, ovoz va harakatli grafika. Yakunda portfolio uchun to'liq loyihalarga ega bo'lasiz.",
    icon: "Clapperboard",
    color: "coral",
    order: 3,
    outcomes: [
      "Hikoya qiluvchi montaj qilish",
      "Rang korreksiyasi va grading",
      "Toza ovoz va musiqa bilan ishlash",
      "Motion grafika elementlarini yaratish",
    ],
    steps: [
      { courseSlug: "video-montaj-asoslari", note: "Montaj asoslari (DaVinci Resolve)" },
      { courseSlug: "capcut-mobil-montaj", note: "Ijtimoiy tarmoqlar uchun tezkor montaj" },
      { courseSlug: "premiere-pro", note: "Professional montaj dasturi" },
      { courseSlug: "rang-korreksiyasi", note: "Rang bilan hikoya qilish" },
      { courseSlug: "ovoz-dizayni", note: "Ovoz va musiqa" },
      { courseSlug: "after-effects-motion", note: "Motion grafika" },
    ],
  },
  {
    slug: "ui-ux-dizayner",
    title: "UI/UX dizayner",
    subtitle: "Foydalanuvchi uchun qulay va chiroyli interfeyslar",
    description:
      "Dizayn tamoyillari, tipografiya, rang va kompozitsiyadan boshlab Figma'da to'liq ilova prototipigacha.",
    icon: "PenTool",
    color: "teal",
    order: 4,
    outcomes: [
      "Tipografiya, rang va tarmoq (grid) bilan ishlash",
      "Figma'da komponentlar va prototiplar yaratish",
      "Rastr va vektor grafikani tahrirlash",
      "Brend identifikatsiyasini ishlab chiqish",
    ],
    steps: [
      { courseSlug: "ui-dizayn-asoslari", note: "Dizayn tamoyillari va Figma" },
      { courseSlug: "photoshop-asoslari", note: "Rasmlar bilan ishlash" },
      { courseSlug: "illustrator-asoslari", note: "Vektor grafika" },
      { courseSlug: "brending-va-logotip", note: "Brend va logotip" },
    ],
  },
  {
    slug: "ai-mutaxassis",
    title: "Sun'iy intellekt mutaxassisi",
    subtitle: "Python'dan mashinali o'qitishgacha",
    description:
      "Dasturlash va matematik tafakkurdan boshlab sun'iy intellekt qanday ishlashini tushunasiz va birinchi modellaringizni o'qitasiz.",
    icon: "BrainCircuit",
    color: "rose",
    order: 5,
    outcomes: [
      "Python'da ma'lumotlar bilan ishlash",
      "Sun'iy intellekt va mashinali o'qitish tushunchalarini tushunish",
      "Oddiy modellarni o'qitish va baholash",
    ],
    steps: [
      { courseSlug: "python-noldan", note: "Python asoslari" },
      { courseSlug: "kompyuter-fanlari-asoslari", note: "Algoritmlar va tafakkur" },
      { courseSlug: "suniy-intellekt-asoslari", note: "AI qanday ishlaydi" },
      { courseSlug: "machine-learning-python", note: "Mashinali o'qitish amaliyoti" },
    ],
  },
  {
    slug: "kontent-yaratuvchi",
    title: "Kontent yaratuvchi",
    subtitle: "YouTube va Instagram uchun professional kontent",
    description:
      "Suratga olish, montaj va auditoriya bilan ishlashni o'rganib, o'z blogingiz yoki biznesingiz uchun kontent yaratasiz.",
    icon: "Video",
    color: "gold",
    order: 6,
    outcomes: [
      "Telefonda sifatli surat va video olish",
      "Qisqa formatli videolarni montaj qilish",
      "Kontent rejasi va auditoriya o'sishi strategiyasi",
    ],
    steps: [
      { courseSlug: "mobil-fotografiya", note: "Kompozitsiya va yorug'lik" },
      { courseSlug: "capcut-mobil-montaj", note: "Tezkor montaj" },
      { courseSlug: "youtube-kontent", note: "YouTube kanal yuritish" },
      { courseSlug: "digital-marketing", note: "Raqamli marketing asoslari" },
      { courseSlug: "ai-vositalari", note: "AI bilan samaradorlik" },
    ],
  },
];
