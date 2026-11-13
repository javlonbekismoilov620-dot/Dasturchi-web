/* Tayyorlanayotgan kurslar.
   Bu kurslarning o'quv dasturi (modullar va dars mavzulari) e'lon qilingan,
   lekin darslar hali yozilmoqda. Platformada ular "Tayyorlanmoqda" belgisi
   bilan ko'rsatiladi va darslar "rejalashtirilgan" holatda bo'ladi. */
import type { CourseSeed, LessonSeed, ModuleSeed } from "../../src/lib/types.ts";
import { slugify } from "../../src/lib/text.ts";

function L(title: string, summary: string, durationMin = 15): LessonSeed {
  return { slug: slugify(title), title, summary, durationMin };
}

function M(title: string, description: string, lessons: LessonSeed[]): ModuleSeed {
  return { title, description, lessons };
}

type Upcoming = Omit<CourseSeed, "status" | "requirements" | "audience"> &
  Partial<Pick<CourseSeed, "requirements" | "audience">>;

function upcoming(c: Upcoming): CourseSeed {
  return {
    requirements: ["Kompyuter va internet", "Har kuni 30–60 daqiqa vaqt"],
    audience: ["Ushbu sohani o'rganmoqchi bo'lgan har bir kishi"],
    ...c,
    status: "preparing",
  };
}

export const upcomingCourses: CourseSeed[] = [
  /* ───────────── Dasturlash va IT ───────────── */
  upcoming({
    slug: "kompyuter-fanlari-asoslari",
    title: "Kompyuter fanlari asoslari",
    subtitle: "Kompyuter qanday ishlaydi va dasturchi qanday fikrlaydi",
    description:
      "Bitlar va baytlardan algoritmlar va ma'lumotlar tuzilmalarigacha. Bu kurs har qanday dasturlash tilini o'rganishdan oldin mustahkam nazariy poydevor beradi.",
    category: "dasturlash",
    level: 1,
    accent: "azure",
    icon: "Cpu",
    objectives: [
      "Kompyuter apparati va dasturiy ta'minoti qanday hamkorlik qilishini tushunish",
      "Ikkilik sanoq tizimi va ma'lumotlarning kodlanishini bilish",
      "Algoritm tuzish va uning samaradorligini baholash",
    ],
    skills: ["Algoritmik tafakkur", "Ikkilik tizim", "Ma'lumotlar tuzilmalari", "Big O"],
    software: ["Python"],
    tags: ["computer science", "algoritm", "nazariya"],
    estimatedHours: 14,
    modules: [
      M("Kompyuter ichida nima bor", "Apparat, operatsion tizim va dastur o'rtasidagi bog'liqlik.", [
        L("Protsessor, xotira va disk", "Kompyuterning asosiy qismlari va ularning vazifasi."),
        L("Ikkilik sanoq tizimi", "Nega kompyuter faqat 0 va 1 ni tushunadi."),
        L("Matn, rasm va ovoz qanday kodlanadi", "ASCII, Unicode, piksellar va diskretizatsiya."),
      ]),
      M("Algoritmlar", "Muammoni qadamlarga bo'lish san'ati.", [
        L("Algoritm nima", "Kundalik hayotdagi algoritmlar va ularning xususiyatlari."),
        L("Qidiruv algoritmlari", "Chiziqli va ikkilik qidiruv."),
        L("Saralash algoritmlari", "Pufakchali, tanlash va birlashtirib saralash."),
        L("Algoritm murakkabligi (Big O)", "Algoritm tezligini qanday o'lchaymiz."),
      ]),
      M("Ma'lumotlar tuzilmalari", "Ma'lumotlarni samarali saqlash usullari.", [
        L("Massiv va ro'yxat", "Eng oddiy tuzilmalar."),
        L("Stek va navbat", "LIFO va FIFO tamoyillari."),
        L("Daraxt va graflar", "Ierarxik va tarmoq ma'lumotlari."),
      ]),
    ],
  }),
  upcoming({
    slug: "git-github",
    title: "Git va GitHub: versiyalarni boshqarish",
    subtitle: "Kodingiz tarixini saqlang va jamoada ishlang",
    description:
      "Har bir professional dasturchi ishlatadigan vosita. Kod o'zgarishlarini saqlash, xatolarni bekor qilish, tarmoqlar (branch) bilan ishlash va GitHub'da hamkorlik.",
    category: "dasturlash",
    level: 2,
    accent: "azure",
    icon: "GitBranch",
    objectives: [
      "Git yordamida loyiha tarixini boshqarish",
      "Branch va merge bilan parallel ishlash",
      "GitHub'da pull request orqali hamkorlik qilish",
    ],
    skills: ["Git", "Commit", "Branch", "Pull request", "Konfliktlarni hal qilish"],
    software: ["Git", "GitHub", "VS Code"],
    tags: ["git", "github", "versiya", "jamoa"],
    estimatedHours: 8,
    modules: [
      M("Git asoslari", "Repozitoriy, commit va tarix.", [
        L("Versiyalarni boshqarish nima uchun kerak", "Git'siz va Git bilan ishlash farqi."),
        L("Git'ni o'rnatish va sozlash", "Ism, email va birinchi repozitoriy."),
        L("add, commit va log", "O'zgarishlarni saqlash sikli."),
      ]),
      M("Tarmoqlar (branch)", "Parallel ishlash va birlashtirish.", [
        L("Branch yaratish va almashtirish", "Xavfsiz tajriba qilish usuli."),
        L("Merge va konfliktlar", "O'zgarishlarni birlashtirish."),
      ]),
      M("GitHub bilan hamkorlik", "Masofaviy repozitoriylar.", [
        L("push, pull va clone", "Kodni bulutga yuklash."),
        L("Pull request va kod ko'rib chiqish", "Jamoaviy ish jarayoni."),
        L("GitHub Pages'da sayt joylashtirish", "Birinchi saytingizni internetga chiqarish."),
      ]),
    ],
  }),
  upcoming({
    slug: "typescript-asoslari",
    title: "TypeScript asoslari",
    subtitle: "Ishonchli va tushunarli JavaScript kodi",
    description:
      "TypeScript — turlar qo'shilgan JavaScript. Xatolarni dastur ishga tushmasdan oldin topish va katta loyihalarni boshqarishni o'rganasiz.",
    category: "dasturlash",
    level: 2,
    accent: "azure",
    icon: "FileCode2",
    objectives: ["Turlar tizimini tushunish", "Interfeys va generiklardan foydalanish", "Mavjud JS loyihani TS'ga o'tkazish"],
    skills: ["Turlar", "Interfeyslar", "Generiklar", "Tur xavfsizligi"],
    software: ["TypeScript", "VS Code", "Node.js"],
    tags: ["typescript", "javascript", "turlar"],
    estimatedHours: 10,
    requirements: ["JavaScript asoslarini bilish"],
    modules: [
      M("Turlar bilan tanishuv", "Nega turlar kerak.", [
        L("TypeScript nima va u qanday ishlaydi", "Kompilyatsiya va tur tekshiruvi."),
        L("Asosiy turlar", "string, number, boolean, massiv va obyektlar."),
        L("Funksiyalarni turlash", "Parametr va qaytish turlari."),
      ]),
      M("Murakkab turlar", "Real loyihalardagi turlar.", [
        L("Interfeys va type", "Obyekt shakllarini tasvirlash."),
        L("Union va narrowing", "Bir nechta turdagi qiymatlar."),
        L("Generiklar", "Qayta ishlatiladigan turlar."),
      ]),
    ],
  }),
  upcoming({
    slug: "react-asoslari",
    title: "React: zamonaviy interfeyslar",
    subtitle: "Komponentlar, holat va hooklar",
    description:
      "Dunyodagi eng mashhur interfeys kutubxonasi. Komponentlarga asoslangan fikrlash, holat (state) boshqaruvi va real ilova yaratish.",
    category: "dasturlash",
    level: 3,
    accent: "azure",
    icon: "Atom",
    objectives: ["Komponentlar bilan interfeys qurish", "Holat va effektlarni boshqarish", "API bilan ishlaydigan ilova yaratish"],
    skills: ["JSX", "Komponentlar", "useState", "useEffect", "Props"],
    software: ["React", "Vite", "VS Code"],
    tags: ["react", "frontend", "komponent"],
    estimatedHours: 18,
    requirements: ["JavaScript asoslari", "HTML va CSS"],
    modules: [
      M("Komponentlar", "React'ning asosiy g'oyasi.", [
        L("React nima uchun yaratilgan", "Deklarativ interfeyslar."),
        L("JSX sintaksisi", "HTML'ga o'xshash JavaScript."),
        L("Props orqali ma'lumot uzatish", "Komponentlar o'rtasidagi aloqa."),
      ]),
      M("Holat va hodisalar", "Interaktivlik.", [
        L("useState", "Komponent xotirasi."),
        L("Formalar bilan ishlash", "Boshqariladigan inputlar."),
        L("useEffect va API so'rovlari", "Tashqi ma'lumotlarni yuklash."),
      ]),
      M("Loyiha", "To'liq ilova.", [L("Vazifalar menejeri ilovasi", "O'rganilganlarni amalda qo'llash.", 40)]),
    ],
  }),
  upcoming({
    slug: "nextjs-fullstack",
    title: "Next.js: full-stack veb-ilovalar",
    subtitle: "Frontend va backend bitta loyihada",
    description:
      "Next.js yordamida tez, SEO uchun qulay va to'liq stekli ilovalar yaratish: marshrutlash, server komponentlari, ma'lumotlar bazasi va joylashtirish.",
    category: "dasturlash",
    level: 4,
    accent: "azure",
    icon: "Layers",
    objectives: ["App Router bilan sahifalar tuzish", "Server komponentlari va Server Actions", "Autentifikatsiya va ma'lumotlar bazasi ulash"],
    skills: ["App Router", "Server Components", "Server Actions", "SSR", "Deploy"],
    software: ["Next.js", "React", "TypeScript", "PostgreSQL"],
    tags: ["nextjs", "fullstack", "react"],
    estimatedHours: 24,
    requirements: ["React asoslari", "TypeScript asoslari"],
    modules: [
      M("Marshrutlash", "Fayllarga asoslangan routing.", [
        L("App Router tuzilmasi", "Sahifalar, layoutlar va segmentlar."),
        L("Dinamik marshrutlar", "Parametrli sahifalar."),
      ]),
      M("Ma'lumotlar", "Server tomonida ishlash.", [
        L("Server va klient komponentlari", "Qayerda nima ishlaydi."),
        L("Server Actions", "Formalar va ma'lumot o'zgartirish."),
        L("Ma'lumotlar bazasini ulash", "PostgreSQL bilan ishlash."),
      ]),
      M("Ishlab chiqarish", "Ilovani dunyoga chiqarish.", [
        L("Autentifikatsiya", "Foydalanuvchilarni tizimga kiritish."),
        L("Deploy va monitoring", "Ilovani internetga joylashtirish."),
      ]),
    ],
  }),
  upcoming({
    slug: "nodejs-backend",
    title: "Node.js: backend dasturlash",
    subtitle: "Server, API va ma'lumotlar bazasi",
    description:
      "JavaScript'da server yozishni o'rganasiz: HTTP qanday ishlaydi, REST API dizayni, ma'lumotlar bazasi bilan ishlash va xavfsizlik.",
    category: "dasturlash",
    level: 3,
    accent: "teal",
    icon: "Server",
    objectives: ["HTTP protokolini tushunish", "REST API yaratish", "Ma'lumotlar bazasi bilan ishlash"],
    skills: ["HTTP", "REST API", "Express", "Autentifikatsiya", "Validatsiya"],
    software: ["Node.js", "Express", "PostgreSQL", "Postman"],
    tags: ["nodejs", "backend", "api", "server"],
    estimatedHours: 20,
    requirements: ["JavaScript asoslari"],
    modules: [
      M("Server asoslari", "Internet qanday ishlaydi.", [
        L("Klient va server", "So'rov va javob modeli."),
        L("HTTP metodlari va status kodlari", "GET, POST, 404, 500..."),
        L("Birinchi Node.js serveri", "http moduli bilan ishlash."),
      ]),
      M("REST API", "Professional API yaratish.", [
        L("Express bilan marshrutlar", "Endpointlar tuzish."),
        L("Ma'lumotlarni tekshirish", "Validatsiya va xatolarni qayta ishlash."),
        L("Ma'lumotlar bazasini ulash", "SQL so'rovlarini koddan yuborish."),
      ]),
    ],
  }),
  upcoming({
    slug: "malumotlar-bazasi-sql",
    title: "Ma'lumotlar bazasi va SQL",
    subtitle: "Ma'lumotlarni saqlash, qidirish va tahlil qilish",
    description:
      "Deyarli har bir ilova ma'lumotlar bazasidan foydalanadi. Jadval loyihalash, SQL so'rovlari, bog'lanishlar va indekslar haqida o'rganasiz.",
    category: "dasturlash",
    level: 2,
    accent: "teal",
    icon: "Database",
    objectives: ["Relyatsion model tushunchasi", "SELECT, JOIN va agregatsiya so'rovlari", "Jadval tuzilmasini loyihalash"],
    skills: ["SQL", "JOIN", "Indekslar", "Normalizatsiya", "PostgreSQL"],
    software: ["PostgreSQL", "SQLite", "DBeaver"],
    tags: ["sql", "database", "postgresql"],
    estimatedHours: 12,
    modules: [
      M("Relyatsion model", "Jadvallar va bog'lanishlar.", [
        L("Ma'lumotlar bazasi nima", "Fayl va bazaning farqi."),
        L("Jadval, satr va ustun", "Asosiy tushunchalar."),
        L("Birlamchi va tashqi kalitlar", "Jadvallarni bog'lash."),
      ]),
      M("SQL so'rovlari", "Ma'lumotlarni olish va o'zgartirish.", [
        L("SELECT va WHERE", "Ma'lumotlarni filtrlash."),
        L("JOIN", "Bir nechta jadvaldan ma'lumot olish."),
        L("GROUP BY va agregatsiya", "Hisobotlar tayyorlash."),
        L("INSERT, UPDATE, DELETE", "Ma'lumotlarni o'zgartirish."),
      ]),
    ],
  }),
  upcoming({
    slug: "kiberxavfsizlik-asoslari",
    title: "Kiberxavfsizlik asoslari",
    subtitle: "O'zingizni va ilovalaringizni himoya qilish",
    description:
      "Raqamli xavfsizlikning asosiy tamoyillari: parollar, fishing, shifrlash, tarmoq xavfsizligi va veb-ilovalardagi keng tarqalgan zaifliklar.",
    category: "dasturlash",
    level: 1,
    accent: "rose",
    icon: "ShieldCheck",
    objectives: ["Asosiy tahdid turlarini tanish", "Shaxsiy hisoblarni himoya qilish", "Veb-ilovalardagi zaifliklarni tushunish"],
    skills: ["Parol gigiyenasi", "Fishingni aniqlash", "Shifrlash", "OWASP Top 10"],
    software: ["Brauzer", "Parol menejeri"],
    tags: ["xavfsizlik", "security", "kiber"],
    estimatedHours: 10,
    modules: [
      M("Shaxsiy xavfsizlik", "Kundalik raqamli gigiyena.", [
        L("Kuchli parol va parol menejerlari", "Hisoblarni himoyalashning birinchi qadami."),
        L("Ikki bosqichli autentifikatsiya", "Qo'shimcha himoya qatlami."),
        L("Fishing va ijtimoiy muhandislik", "Firibgarlikni qanday tanish mumkin."),
      ]),
      M("Texnik asoslar", "Xavfsizlik qanday ishlaydi.", [
        L("Shifrlash va HTTPS", "Ma'lumotlarni yashirish tamoyillari."),
        L("Tarmoq xavfsizligi", "Wi-Fi, VPN va xavf-xatarlar."),
        L("Veb-zaifliklar: XSS va SQL injection", "Dasturchilar biladigan asosiy xatolar."),
      ]),
    ],
  }),
  upcoming({
    slug: "suniy-intellekt-asoslari",
    title: "Sun'iy intellekt asoslari",
    subtitle: "AI qanday ishlaydi — oddiy tilda",
    description:
      "Sun'iy intellekt, mashinali o'qitish va neyron tarmoqlar haqida murakkab matematikasiz tushuncha. Til modellari qanday ishlashi va ularning cheklovlari.",
    category: "dasturlash",
    level: 2,
    accent: "rose",
    icon: "BrainCircuit",
    objectives: ["AI, ML va deep learning farqini tushunish", "Model qanday o'qitilishini bilish", "AI'ning cheklovlari va etik masalalarini anglash"],
    skills: ["AI tushunchalari", "Mashinali o'qitish", "Neyron tarmoqlar", "Til modellari"],
    software: ["Python", "Jupyter"],
    tags: ["ai", "suniy intellekt", "ml"],
    estimatedHours: 10,
    modules: [
      M("Asosiy tushunchalar", "AI dunyosiga kirish.", [
        L("Sun'iy intellekt nima", "Tarix va hozirgi holat."),
        L("Mashinali o'qitish qanday ishlaydi", "Ma'lumotdan o'rganish."),
        L("Neyron tarmoqlar", "Miyadan ilhomlangan modellar."),
      ]),
      M("Zamonaviy AI", "Bugungi texnologiyalar.", [
        L("Katta til modellari", "Matn yaratuvchi modellar qanday ishlaydi."),
        L("AI etikasi va xavfsizligi", "Mas'uliyatli foydalanish."),
      ]),
    ],
  }),
  upcoming({
    slug: "machine-learning-python",
    title: "Python'da mashinali o'qitish",
    subtitle: "Ma'lumotdan bashorat qiluvchi modellar",
    description:
      "Python kutubxonalari yordamida ma'lumotlarni tayyorlash, regressiya va klassifikatsiya modellarini o'qitish va ularni baholash.",
    category: "dasturlash",
    level: 4,
    accent: "rose",
    icon: "LineChart",
    objectives: ["Ma'lumotlarni tozalash va tahlil qilish", "Regressiya va klassifikatsiya modellarini o'qitish", "Model sifatini baholash"],
    skills: ["pandas", "scikit-learn", "Regressiya", "Klassifikatsiya", "Baholash metrikalari"],
    software: ["Python", "Jupyter", "pandas", "scikit-learn"],
    tags: ["machine learning", "python", "data science"],
    estimatedHours: 22,
    requirements: ["Python asoslari", "Maktab matematikasi"],
    modules: [
      M("Ma'lumotlar bilan ishlash", "Tahlil uchun tayyorgarlik.", [
        L("pandas bilan tanishuv", "Jadvalli ma'lumotlar."),
        L("Ma'lumotlarni tozalash", "Bo'sh va noto'g'ri qiymatlar."),
        L("Vizualizatsiya", "Grafiklar orqali tushunish."),
      ]),
      M("Modellar", "Birinchi modellarni o'qitish.", [
        L("Chiziqli regressiya", "Sonli qiymatni bashorat qilish."),
        L("Klassifikatsiya", "Toifani bashorat qilish."),
        L("Modelni baholash", "Aniqlik, xatolik va ortiqcha moslashuv."),
      ]),
    ],
  }),

  /* ───────────── Video ───────────── */
  upcoming({
    slug: "capcut-mobil-montaj",
    title: "CapCut: telefonda montaj",
    subtitle: "Reels, Shorts va TikTok uchun tezkor montaj",
    description:
      "Telefoningizda professional ko'rinishdagi qisqa videolar yarating: kesish, subtitrlar, effektlar, musiqa va vertikal format qoidalari.",
    category: "video",
    level: 1,
    accent: "coral",
    icon: "Smartphone",
    objectives: ["Vertikal video montaj qilish", "Avtomatik subtitrlardan foydalanish", "Ritmga mos kesish"],
    skills: ["Mobil montaj", "Subtitrlar", "Vertikal format", "Ritm"],
    software: ["CapCut"],
    tags: ["capcut", "reels", "shorts", "mobil"],
    estimatedHours: 6,
    modules: [
      M("Asoslar", "Interfeys va birinchi video.", [
        L("CapCut interfeysi", "Asosiy panellar."),
        L("Kesish va tartiblash", "Kliplar bilan ishlash."),
        L("Matn va subtitrlar", "O'qiladigan matnlar."),
      ]),
      M("Kreativ montaj", "Videoni jonlantirish.", [
        L("Musiqa ritmiga montaj", "Beat-sync."),
        L("O'tishlar va effektlar", "Me'yorida ishlatish."),
        L("Eksport sozlamalari", "Har bir platforma uchun."),
      ]),
    ],
  }),
  upcoming({
    slug: "premiere-pro",
    title: "Adobe Premiere Pro",
    subtitle: "Sanoat standartidagi montaj dasturi",
    description:
      "Premiere Pro'da loyihalarni tashkil qilish, ko'p trekli montaj, ovoz miksi, rang va eksport. Reklama, intervyu va vloglar uchun professional ish jarayoni.",
    category: "video",
    level: 2,
    accent: "coral",
    icon: "Film",
    objectives: ["Loyihani to'g'ri tashkil qilish", "Ko'p kamerali montaj", "Lumetri bilan rang korreksiyasi"],
    skills: ["Premiere Pro", "Ko'p trekli montaj", "Lumetri", "Proxy"],
    software: ["Premiere Pro"],
    tags: ["premiere", "adobe", "montaj"],
    estimatedHours: 14,
    requirements: ["Video montaj asoslari kursi yoki shunga teng bilim"],
    modules: [
      M("Ish muhiti", "Loyiha va media.", [
        L("Interfeys va ish maydonlari", "Panellarni sozlash."),
        L("Media import va proxy", "Og'ir fayllar bilan qulay ishlash."),
      ]),
      M("Montaj", "Professional usullar.", [
        L("Ripple, roll va slip tahrirlari", "Aniq montaj vositalari."),
        L("Ko'p kamerali montaj", "Intervyu va konsertlar."),
        L("Lumetri Color", "Rang korreksiyasi."),
        L("Essential Sound", "Ovozni tozalash."),
      ]),
    ],
  }),
  upcoming({
    slug: "after-effects-motion",
    title: "After Effects: motion grafika",
    subtitle: "Harakatlanuvchi grafika va vizual effektlar",
    description:
      "Kalit kadrlar, animatsiya egri chiziqlari, shakl qatlamlari va kompozitsiya. Logotip animatsiyasi, titrlar va infografikalar yaratish.",
    category: "video",
    level: 3,
    accent: "violet",
    icon: "Sparkle",
    objectives: ["Kalit kadrlar bilan animatsiya", "Graph Editor bilan silliq harakat", "Motion grafika loyihasini yakunlash"],
    skills: ["Keyframe", "Graph Editor", "Shape layers", "Expressions"],
    software: ["After Effects"],
    tags: ["after effects", "motion", "animatsiya"],
    estimatedHours: 16,
    modules: [
      M("Animatsiya asoslari", "Harakat tamoyillari.", [
        L("Kompozitsiya va qatlamlar", "After Effects mantig'i."),
        L("Kalit kadrlar", "Harakatni yaratish."),
        L("Easing va Graph Editor", "Tabiiy harakat."),
      ]),
      M("Motion dizayn", "Amaliy loyihalar.", [
        L("Shape layers", "Vektor animatsiya."),
        L("Matn animatsiyasi", "Kinetik tipografiya."),
        L("Logotip animatsiyasi", "Brend uchun intro."),
      ]),
    ],
  }),
  upcoming({
    slug: "rang-korreksiyasi",
    title: "Rang korreksiyasi va color grading",
    subtitle: "Rang bilan kayfiyat va hikoya yaratish",
    description:
      "DaVinci Resolve'da professional rang bilan ishlash: skoplar, birlamchi va ikkilamchi korreksiya, LUT'lar va kinematografik ko'rinishlar.",
    category: "video",
    level: 4,
    accent: "gold",
    icon: "Palette",
    objectives: ["Skoplarni o'qish", "Kadrlarni bir-biriga moslash", "Kinematografik look yaratish"],
    skills: ["Color correction", "Color grading", "Skoplar", "LUT", "Nodlar"],
    software: ["DaVinci Resolve"],
    tags: ["color grading", "rang", "davinci"],
    estimatedHours: 14,
    modules: [
      M("Asoslar", "Rang nazariyasi va skoplar.", [
        L("Rang nazariyasi", "Ton, to'yinganlik va yorug'lik."),
        L("Waveform va vektorskop", "Ko'z emas, o'lchov asboblari."),
      ]),
      M("Amaliyot", "Professional jarayon.", [
        L("Birlamchi korreksiya", "Balans va ekspozitsiya."),
        L("Ikkilamchi korreksiya", "Teri ranglari va maskalar."),
        L("Kinematografik look", "Mood va uslub."),
      ]),
    ],
  }),
  upcoming({
    slug: "ovoz-dizayni",
    title: "Ovoz dizayni va audio montaj",
    subtitle: "Video sifatining yarmi — ovoz",
    description:
      "Toza dialog, musiqa va effektlar balansi. Shovqinni tozalash, ekvalayzer, kompressor va ovoz effektlari bilan atmosfera yaratish.",
    category: "video",
    level: 3,
    accent: "coral",
    icon: "AudioLines",
    objectives: ["Dialogni tozalash", "Miks qilish", "Ovoz effektlari bilan atmosfera yaratish"],
    skills: ["EQ", "Kompressor", "Shovqin tozalash", "Miks", "Foley"],
    software: ["DaVinci Resolve Fairlight", "Audacity"],
    tags: ["audio", "ovoz", "miks"],
    estimatedHours: 8,
    modules: [
      M("Ovoz asoslari", "Ovoz qanday ishlaydi.", [
        L("Chastota va balandlik", "Ovozning fizikasi."),
        L("Mikrofon va yozib olish", "Sifatli manba."),
      ]),
      M("Miks", "Professional ovoz.", [
        L("Ekvalayzer", "Chastotalarni sozlash."),
        L("Kompressor", "Balandlikni boshqarish."),
        L("Ovoz effektlari va atmosfera", "Sahnani jonlantirish."),
      ]),
    ],
  }),

  /* ───────────── 3D ───────────── */
  upcoming({
    slug: "blender-modellashtirish",
    title: "Blender: professional modellashtirish",
    subtitle: "Hard-surface va mahsulot vizualizatsiyasi",
    description:
      "Toza topologiya, modifikatorlar, subdivision modellashtirish va mahsulot vizualizatsiyasi. Portfolio uchun yuqori sifatli renderlar yaratish.",
    category: "3d",
    level: 3,
    accent: "violet",
    icon: "Boxes",
    objectives: ["Toza topologiya bilan modellashtirish", "Modifikatorlardan samarali foydalanish", "Mahsulot vizualizatsiyasini yaratish"],
    skills: ["Topologiya", "Subdivision", "Modifikatorlar", "UV unwrap", "Mahsulot vizualizatsiyasi"],
    software: ["Blender"],
    tags: ["blender", "3d", "modellashtirish"],
    estimatedHours: 18,
    requirements: ["Blender: 3D olamiga ilk qadam kursi"],
    modules: [
      M("Topologiya", "To'g'ri mesh tuzilmasi.", [
        L("Quad, n-gon va edge flow", "Yaxshi topologiya qoidalari."),
        L("Subdivision Surface", "Silliq shakllar."),
      ]),
      M("Mahsulot vizualizatsiyasi", "Tijoriy loyiha.", [
        L("Modellashtirish: suv shishasi", "Bosqichma-bosqich loyiha.", 30),
        L("UV va teksturalar", "Yorliq va materiallar."),
        L("Studiya yoritish va render", "Reklama kadri."),
      ]),
    ],
  }),
  upcoming({
    slug: "blender-skulpting",
    title: "Blender: skulpting va personajlar",
    subtitle: "Raqamli loydan shakl yaratish",
    description:
      "Skulpting cho'tkalari, dinamik topologiya, anatomiya asoslari va retopologiya. Stilizatsiyalangan personaj boshini noldan yaratish.",
    category: "3d",
    level: 4,
    accent: "violet",
    icon: "Hand",
    objectives: ["Skulpting vositalarini o'zlashtirish", "Anatomiya asoslarini qo'llash", "Retopologiya qilish"],
    skills: ["Skulpting", "Dyntopo", "Multires", "Retopologiya", "Anatomiya"],
    software: ["Blender"],
    tags: ["skulpting", "personaj", "blender"],
    estimatedHours: 20,
    modules: [
      M("Skulpting asoslari", "Cho'tkalar va jarayon.", [
        L("Skulpt rejimi va cho'tkalar", "Asosiy vositalar."),
        L("Dyntopo va Remesh", "Detal qo'shish usullari."),
      ]),
      M("Personaj", "Bosh skulpturasi.", [
        L("Bosh proporsiyalari", "Anatomiya asoslari."),
        L("Yuz detallari", "Ko'z, burun, lab."),
        L("Retopologiya", "Animatsiya uchun tayyorlash."),
      ]),
    ],
  }),
  upcoming({
    slug: "unreal-engine-asoslari",
    title: "Unreal Engine asoslari",
    subtitle: "Real vaqtli render va muhit dizayni",
    description:
      "Unreal Engine'da sahna yig'ish, materiallar, Lumen yoritish, landshaft va kinematografik kameralar. Interaktiv muhit yaratishning to'liq jarayoni.",
    category: "3d",
    level: 2,
    accent: "violet",
    icon: "Mountain",
    objectives: ["Unreal Editor bilan ishlash", "Material va yoritishni sozlash", "Muhit sahnasini yaratish"],
    skills: ["Unreal Editor", "Materiallar", "Lumen", "Landshaft", "Sequencer"],
    software: ["Unreal Engine"],
    tags: ["unreal", "real-time", "muhit"],
    estimatedHours: 16,
    modules: [
      M("Muharrir", "Interfeys va sahna.", [
        L("Unreal Editor interfeysi", "Viewport va panellar."),
        L("Aktyorlar va sahna yig'ish", "Obyektlarni joylashtirish."),
      ]),
      M("Vizual sifat", "Material va yorug'lik.", [
        L("Material muharriri", "Nodlar bilan materiallar."),
        L("Lumen yoritish", "Global yoritish real vaqtda."),
        L("Landshaft yaratish", "Tabiiy muhitlar."),
        L("Sequencer bilan kinematografiya", "Kamera harakatlari."),
      ]),
    ],
  }),
  upcoming({
    slug: "oyin-yaratish",
    title: "O'yin yaratish asoslari",
    subtitle: "G'oyadan o'ynaladigan prototipgacha",
    description:
      "O'yin dizayni tamoyillari, Blueprint vizual dasturlash, personaj boshqaruvi va birinchi o'ynaladigan prototip.",
    category: "3d",
    level: 3,
    accent: "lime",
    icon: "Gamepad2",
    objectives: ["O'yin mexanikasini loyihalash", "Blueprint bilan mantiq yozish", "Prototipni yakunlash"],
    skills: ["Game design", "Blueprint", "Kolliziya", "UI"],
    software: ["Unreal Engine"],
    tags: ["gamedev", "o'yin", "blueprint"],
    estimatedHours: 20,
    modules: [
      M("Dizayn", "O'yin g'oyasi.", [
        L("O'yin mexanikasi nima", "Qoidalar, maqsad va mukofot."),
        L("Prototip rejasi", "Kichikdan boshlash."),
      ]),
      M("Dasturlash", "Blueprint.", [
        L("Blueprint asoslari", "Vizual dasturlash."),
        L("Personaj harakati", "Boshqaruv va kamera."),
        L("To'qnashuv va hodisalar", "O'yin mantig'i."),
      ]),
    ],
  }),

  /* ───────────── Dizayn ───────────── */
  upcoming({
    slug: "photoshop-asoslari",
    title: "Adobe Photoshop asoslari",
    subtitle: "Rasm tahrirlash va kompozitsiya",
    description:
      "Qatlamlar, maskalar, tanlash vositalari, retush va kollaj. Ijtimoiy tarmoqlar va reklama uchun vizuallar tayyorlash.",
    category: "dizayn",
    level: 1,
    accent: "teal",
    icon: "Image",
    objectives: ["Qatlam va maskalar bilan ishlash", "Rasmni retush qilish", "Kollaj va banner yaratish"],
    skills: ["Qatlamlar", "Maskalar", "Retush", "Tanlash vositalari"],
    software: ["Photoshop"],
    tags: ["photoshop", "rasm", "retush"],
    estimatedHours: 10,
    modules: [
      M("Asoslar", "Interfeys va qatlamlar.", [
        L("Interfeys va hujjat sozlamalari", "Rastr grafika asoslari."),
        L("Qatlamlar", "Photoshop'ning yuragi."),
        L("Maskalar", "Buzmasdan tahrirlash."),
      ]),
      M("Amaliyot", "Real vazifalar.", [
        L("Retush", "Portretni tozalash."),
        L("Kollaj", "Bir nechta rasmni birlashtirish."),
      ]),
    ],
  }),
  upcoming({
    slug: "illustrator-asoslari",
    title: "Adobe Illustrator: vektor grafika",
    subtitle: "Logotip, ikonka va illustratsiya",
    description:
      "Pen tool, shakllar, ranglar va tipografiya bilan vektor grafika. Logotip, ikonkalar to'plami va illustratsiyalar yaratish.",
    category: "dizayn",
    level: 2,
    accent: "gold",
    icon: "PenTool",
    objectives: ["Pen tool'ni o'zlashtirish", "Shakllar bilan qurish", "Ikonkalar to'plamini yaratish"],
    skills: ["Pen tool", "Pathfinder", "Vektor illustratsiya", "Ikonka dizayni"],
    software: ["Illustrator"],
    tags: ["illustrator", "vektor", "logotip"],
    estimatedHours: 10,
    modules: [
      M("Vektor asoslari", "Nuqta va chiziqlar.", [
        L("Vektor va rastr farqi", "Qachon qaysi biri."),
        L("Pen tool", "Bezye egri chiziqlari."),
        L("Pathfinder va shakllar", "Murakkab shakllarni qurish."),
      ]),
      M("Loyiha", "Ikonkalar to'plami.", [L("Ikonka tizimi yaratish", "Bir xil uslubdagi ikonkalar.", 30)]),
    ],
  }),
  upcoming({
    slug: "brending-va-logotip",
    title: "Brending va logotip dizayni",
    subtitle: "Brend identifikatsiyasini noldan yaratish",
    description:
      "Brend strategiyasi, logotip turlari, rang va shrift tanlash, brendbuk tayyorlash. Haqiqiy buyurtmachi bilan ishlash jarayoni.",
    category: "dizayn",
    level: 3,
    accent: "gold",
    icon: "Gem",
    objectives: ["Brend strategiyasini tushunish", "Logotip konsepsiyalarini ishlab chiqish", "Brendbuk tayyorlash"],
    skills: ["Brend strategiyasi", "Logotip", "Brendbuk", "Taqdimot"],
    software: ["Illustrator", "Figma"],
    tags: ["brending", "logotip", "identity"],
    estimatedHours: 12,
    modules: [
      M("Strategiya", "Dizayndan oldin.", [
        L("Brend nima", "Logotipdan kattaroq tushuncha."),
        L("Brif va tadqiqot", "Buyurtmachini tushunish."),
      ]),
      M("Identifikatsiya", "Vizual tizim.", [
        L("Logotip konsepsiyalari", "Eskizdan vektorgacha."),
        L("Rang va shrift tizimi", "Brend tili."),
        L("Brendbuk", "Qoidalar hujjati."),
      ]),
    ],
  }),

  /* ───────────── Marketing ───────────── */
  upcoming({
    slug: "digital-marketing",
    title: "Raqamli marketing asoslari",
    subtitle: "Mahsulotni internetda to'g'ri auditoriyaga yetkazish",
    description:
      "Marketing voronkasi, maqsadli auditoriya, kontent marketing, reklama kampaniyalari va natijalarni o'lchash.",
    category: "marketing",
    level: 1,
    accent: "gold",
    icon: "TrendingUp",
    objectives: ["Marketing voronkasini tushunish", "Maqsadli auditoriyani aniqlash", "Kampaniya natijalarini o'lchash"],
    skills: ["Voronka", "Auditoriya tahlili", "Kontent marketing", "Analitika"],
    software: ["Google Analytics", "Meta Business Suite"],
    tags: ["marketing", "smm", "reklama"],
    estimatedHours: 10,
    modules: [
      M("Strategiya", "Marketing asoslari.", [
        L("Marketing voronkasi", "Bilishdan sotib olishgacha."),
        L("Maqsadli auditoriya", "Kim uchun ishlayapmiz."),
      ]),
      M("Kanallar", "Amaliyot.", [
        L("Kontent marketing", "Foydali kontent orqali sotish."),
        L("Pullik reklama", "Byudjet va nishonlash."),
        L("Analitika", "Raqamlar bilan qaror qabul qilish."),
      ]),
    ],
  }),
  upcoming({
    slug: "youtube-kontent",
    title: "YouTube kanal yuritish",
    subtitle: "G'oyadan auditoriyagacha",
    description:
      "Kanal konsepsiyasi, ssenariy, suratga olish, montaj, prevyu (thumbnail) va YouTube analitikasi.",
    category: "marketing",
    level: 2,
    accent: "coral",
    icon: "MonitorPlay",
    objectives: ["Kanal konsepsiyasini ishlab chiqish", "Ssenariy va prevyu tayyorlash", "Analitika asosida o'sish"],
    skills: ["Ssenariy", "Thumbnail", "SEO", "Analitika"],
    software: ["YouTube Studio", "DaVinci Resolve"],
    tags: ["youtube", "blog", "kontent"],
    estimatedHours: 8,
    modules: [
      M("Tayyorgarlik", "Kanal asoslari.", [
        L("Kanal konsepsiyasi", "Nima haqida va kim uchun."),
        L("Ssenariy yozish", "Tomoshabinni ushlab qolish."),
      ]),
      M("O'sish", "Auditoriya.", [
        L("Sarlavha va prevyu", "Bosish darajasini oshirish."),
        L("YouTube analitikasi", "Saqlanish va CTR."),
      ]),
    ],
  }),
  upcoming({
    slug: "mobil-fotografiya",
    title: "Mobil fotografiya",
    subtitle: "Telefon bilan professional suratlar",
    description:
      "Kompozitsiya qoidalari, tabiiy yorug'lik, portret va mahsulot suratlari, mobil tahrirlash ilovalari.",
    category: "marketing",
    level: 1,
    accent: "gold",
    icon: "Camera",
    objectives: ["Kompozitsiya qoidalarini qo'llash", "Yorug'likdan to'g'ri foydalanish", "Suratlarni tahrirlash"],
    skills: ["Kompozitsiya", "Yorug'lik", "Portret", "Mobil tahrirlash"],
    software: ["Telefon kamerasi", "Lightroom Mobile"],
    tags: ["foto", "fotografiya", "mobil"],
    estimatedHours: 6,
    modules: [
      M("Asoslar", "Yaxshi surat qoidalari.", [
        L("Uchdan bir qoidasi va kompozitsiya", "Kadrni tuzish."),
        L("Tabiiy yorug'lik", "Oltin soat va soya."),
      ]),
      M("Janrlar", "Amaliy suratga olish.", [
        L("Portret", "Odamlarni chiroyli suratga olish."),
        L("Mahsulot surati", "Onlayn do'kon uchun."),
        L("Mobil tahrirlash", "Lightroom Mobile."),
      ]),
    ],
  }),

  /* ───────────── Karyera ───────────── */
  upcoming({
    slug: "ai-vositalari",
    title: "AI vositalari bilan samarali ishlash",
    subtitle: "Sun'iy intellektni kundalik ishingizga qo'shing",
    description:
      "AI yordamchilardan to'g'ri foydalanish: aniq so'rov (prompt) yozish, natijani tekshirish, matn, rasm va kod bilan ishlash, cheklovlar va xavfsizlik.",
    category: "karyera",
    level: 1,
    accent: "rose",
    icon: "Sparkles",
    objectives: ["Samarali prompt yozish", "AI natijalarini tanqidiy tekshirish", "Ish jarayonlarini avtomatlashtirish"],
    skills: ["Prompt yozish", "Faktlarni tekshirish", "AI bilan avtomatlashtirish"],
    software: ["AI yordamchilar"],
    tags: ["ai", "prompt", "produktivlik"],
    estimatedHours: 5,
    modules: [
      M("Asoslar", "AI bilan to'g'ri muloqot.", [
        L("AI yordamchilar qanday ishlaydi", "Imkoniyat va cheklovlar."),
        L("Yaxshi prompt tuzilmasi", "Kontekst, vazifa, format."),
        L("Natijani tekshirish", "Xato va to'qima ma'lumotlardan saqlanish."),
      ]),
      M("Amaliyot", "Real vazifalar.", [
        L("Matn va hujjatlar bilan ishlash", "Xulosa, tarjima, tahrir."),
        L("AI bilan o'qish", "Yangi mavzularni tezroq tushunish."),
      ]),
    ],
  }),
  upcoming({
    slug: "frilans-va-portfolio",
    title: "Frilans va portfolio",
    subtitle: "Ko'nikmalaringizni daromadga aylantiring",
    description:
      "Kuchli portfolio tuzish, birinchi buyurtmachini topish, narx belgilash, shartnoma va muloqot. Mahalliy va xalqaro platformalarda ishlash.",
    category: "karyera",
    level: 2,
    accent: "lime",
    icon: "Briefcase",
    objectives: ["Portfolio tayyorlash", "Narx belgilash", "Buyurtmachi bilan professional muloqot"],
    skills: ["Portfolio", "Narx belgilash", "Muzokaralar", "Vaqtni boshqarish"],
    software: ["Behance", "GitHub", "Upwork"],
    tags: ["frilans", "portfolio", "karyera"],
    estimatedHours: 6,
    modules: [
      M("Portfolio", "O'zingizni ko'rsatish.", [
        L("Portfolio tuzilmasi", "Qaysi ishlarni qanday ko'rsatish."),
        L("Keys (case study) yozish", "Jarayonni hikoya qilish."),
      ]),
      M("Buyurtmalar", "Frilans amaliyoti.", [
        L("Birinchi buyurtmachini topish", "Kanal va platformalar."),
        L("Narx va shartnoma", "O'z mehnatingizni qadrlash."),
        L("Muloqot va muddatlar", "Uzoq muddatli hamkorlik."),
      ]),
    ],
  }),
];
