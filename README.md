# Dasturchi

**O‘zbek tilidagi premium ta’lim platformasi** — IT, dizayn, 3D, video montaj va zamonaviy texnologiyalarni mutlaqo noldan professional darajagacha o‘rganish uchun.

> Bilimni o‘zlashtiring. Mahorat yarating. Kelajagingizni quring.

---

## Hozirgi holat (halol ko‘rinish)

| Qism | Holat |
| --- | --- |
| To‘liq yozilgan kurslar | **6 ta**: HTML va CSS · JavaScript asoslari · Python noldan · Blender · Video montaj (DaVinci Resolve) · UI dizayn va Figma |
| Tayyor darslar | **40 ta**, har biri 9 qismli tuzilmada (tushuncha, nega muhim, qanday ishlaydi, qadamlar, misollar, xatolar, maslahatlar, mashq, xulosa) |
| Testlar | 14 ta modul testi + 6 ta yakuniy imtihon |
| Tayyorlanayotgan kurslar | **27 ta** — o‘quv dasturi (modul va dars mavzulari) e’lon qilingan, darslar platformada **“Tayyorlanmoqda”** deb aniq belgilangan |
| Video darslar | Video pleyer to‘liq ishlaydi (MP4/WebM, YouTube, Vimeo, ko‘rish joyini eslab qolish), lekin **hozircha video yuklanmagan** — admin panel orqali qo‘shiladi |
| AI ustoz | Modul tayyor, lekin **`ANTHROPIC_API_KEY` berilmaguncha o‘chiq** va interfeys buni ochiq aytadi |
| Ma’lumotlar ombori | Lokal JSON drayveri to‘liq sinovdan o‘tgan; Supabase drayveri, SQL sxema va RLS yozilgan, lekin **jonli Supabase loyihasida sinalmagan** |

Platformada soxta statistika, soxta sharhlar yoki ishlamaydigan tugmalar yo‘q: bosh sahifadagi barcha raqamlar ma’lumotlar bazasidan hisoblanadi, kabinetdagi “namuna” bloklari esa aniq belgilangan.

---

## Imkoniyatlar

**Talaba uchun**
- Kinematografik bosh sahifa (Three.js “bilim yadrosi”, scroll animatsiyalari, `prefers-reduced-motion` hurmat qilinadi)
- Katalog: qidiruv, yo‘nalish, daraja (1–5), holat va dastur bo‘yicha filtrlar, saralash (tavsiya, mashhur, yangi)
- `⌘K` / `Ctrl+K` buyruqlar palitrasi: kurslar, darslar, yo‘nalishlar, dasturlar, ko‘nikmalar va o‘quv yo‘llari bo‘yicha qidiruv (apostrof variantlariga chidamli: `o'zbek` = `o‘zbek`)
- 7 ta interaktiv o‘quv yo‘li (roadmap) va shaxsiy progress
- Dars sahifasi: chalg‘itmaydigan rejim, dars ro‘yxati paneli, mundarija (scrollspy), o‘qish progressi, oxirgi o‘qilgan joyni eslab qolish, qaydlar (avto-saqlash), xatcho‘plar, savol-javob, `Alt+←/→` navigatsiya
- Testlar: to‘g‘ri javoblar brauzerga yuborilmaydi, baholash serverda; javoblar tahlili va izohlar
- Avtomatik sertifikat (barcha darslar + yakuniy imtihon), ochiq tekshirish sahifasi va chop etish/PDF
- Kabinet: o‘qish seriyasi, haftalik maqsad, 15 haftalik faollik xaritasi, yutuqlar, kunlik vazifalar, tavsiyalar
- Darajani aniqlash savolnomasi (qoidaga asoslangan, AI emas) va o‘quv yo‘li tavsiyasi

**Interaktiv laboratoriyalar** (hammasi haqiqiy ishlaydi)
- Kod muharriri: HTML/CSS jonli ko‘rinish, JavaScript (Web Worker’da, cheksiz sikl himoyasi bilan), Python (Pyodide/WebAssembly, `input()` qo‘llab-quvvatlanadi)
- Blender uslubidagi 3D mesh ko‘rinishi: nuqta/qirra/yuz rejimlari, Blender standart obyektlari bilan bir xil sonlar, flat/smooth, X-Ray, G/R/S
- Uch nuqtali yoritish laboratoriyasi (soyalar, Kelvin harorati, presetlar)
- Montaj taymlayni: ijro, kesish, ripple o‘chirish, snapping, sudrab ko‘chirish, bekor qilish
- Rang korreksiyasi: ekspozitsiya, kontrast, lift/gain, to‘yinganlik, harorat, oldin/keyin taqqoslash va jonli luma waveform skopi
- Tipografiya o‘yingohi, WCAG 2.2 kontrast tekshirgich, CSS box model laboratoriyasi

**Administrator uchun**
- Umumiy ko‘rinish: foydalanuvchilar, yozilishlar, tayyor/rejadagi darslar, javobsiz savollar, faollik grafigi
- Kurslar: yaratish, tahrirlash, o‘chirish, holat (e’lon qilingan / tayyorlanmoqda / qoralama), bosh sahifada tavsiya
- Modullar va darslar: qo‘shish, tartiblash, o‘chirish; 9 qismli tuzilmali dars muharriri, kod bloklari, video (yuklash yoki havola), resurslar, interaktiv bloklar
- Testlar muharriri, yo‘nalishlar, talabalar (progress, natijalar, rol), sertifikatlarni bekor qilish/tiklash, savol-javob moderatsiyasi
- Media kutubxonasi (200 MB gacha, video uchun Range so‘rovlari)

---

## Texnologiyalar

Next.js 16 (App Router, Server Actions) · React 19 · TypeScript · Tailwind CSS v4 · Motion (Framer Motion) · Three.js · Zod · Lucide · Supabase (ixtiyoriy) · Anthropic SDK (ixtiyoriy)

Ortiqcha kutubxonalar yo‘q: grafiklar, sintaksis yoritgich, kod muharriri va 3D meshlar o‘zimizniki.

---

## Tez boshlash

Talablar: Node.js 20.9+ (22 tavsiya etiladi).

```bash
npm install
cp .env.example .env.local      # ADMIN_EMAILS ga o‘z pochtangizni yozing
npm run dev                     # http://localhost:3000
```

Birinchi ishga tushirishda `.data/db.json` avtomatik yaratiladi va `content/` papkasidagi kurslar bilan to‘ldiriladi.

**Admin bo‘lish:** `.env.local` dagi `ADMIN_EMAILS` ro‘yxatidagi pochta bilan ro‘yxatdan o‘ting — siz avtomatik administrator bo‘lasiz va `/admin` ochiladi. Keyin boshqa foydalanuvchilarga admin panelidan rol berish mumkin.

### Buyruqlar

| Buyruq | Vazifasi |
| --- | --- |
| `npm run dev` | Ishlab chiqish serveri |
| `npm run build` / `npm start` | Ishlab chiqarish (production) yig‘ish va ishga tushirish |
| `npm run lint` · `npm run typecheck` | ESLint va TypeScript tekshiruvi |
| `npm run seed` | `content/` dagi kontentni bazaga qo‘shish/yangilash (admin qo‘shgan boshqa kurslar saqlanadi) |
| `npm run seed -- --reset` | Kontent jadvallarini seed bilan to‘liq almashtirish (foydalanuvchi ma’lumotlariga tegilmaydi) |
| `npm run test:e2e` | Asosiy oqimlarni tekshiruvchi tutun (smoke) testi — `playwright` o‘rnatilgan bo‘lishi va server ishlab turishi kerak |

Seed’dan keyin dev serverni qayta ishga tushiring — lokal drayver ma’lumotlarni xotirada saqlaydi.

---

## Muhit o‘zgaruvchilari

To‘liq ro‘yxat va izohlar: [`.env.example`](.env.example).

| O‘zgaruvchi | Majburiy | Izoh |
| --- | --- | --- |
| `ADMIN_EMAILS` | Ha (admin uchun) | Vergul bilan ajratilgan pochtalar |
| `NEXT_PUBLIC_SITE_URL` | Production’da | Sitemap va OAuth qaytish manzili |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Yo‘q | Uchalasi berilsa — Supabase rejimi |
| `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` | Yo‘q | `true` — Google orqali kirish tugmasi (faqat Supabase rejimida) |
| `ANTHROPIC_API_KEY`, `AI_MODEL` | Yo‘q | AI ustozni yoqadi (standart model: `claude-opus-5-5`) |
| `DATA_DIR` | Yo‘q | Lokal ombor papkasi (standart `./.data`) |
| `NEXT_PUBLIC_PYODIDE_URL` | Yo‘q | Python mashqlari uchun Pyodide manzili (standart: jsDelivr CDN) |

**Maxfiy kalitlar** (`SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`) faqat `server-only` modullarda o‘qiladi va brauzerga hech qachon yuborilmaydi.

---

## Supabase’ni ulash

1. supabase.com’da loyiha yarating.
2. **SQL Editor**’da [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) faylini to‘liq bajaring — jadvallar, indekslar, RLS siyosatlari, yangi foydalanuvchi uchun profil triggeri va `media` storage bucket yaratiladi.
3. **Project Settings → API**’dan URL, `anon` va `service_role` kalitlarini `.env.local` ga yozing.
4. Kontentni yuklang: `npm run seed` (skript Supabase sozlanganini avtomatik aniqlaydi).
5. **Authentication → URL Configuration**’da Site URL’ni va `…/auth/callback` qaytish manzilini qo‘shing.
6. Google orqali kirish uchun: **Authentication → Providers → Google** ni yoqing va `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` qo‘ying.

**Xavfsizlik modeli:** Next.js serveri service-role kaliti bilan ishlaydi va har bir amalda ruxsatni o‘zi tekshiradi (talaba faqat o‘z ma’lumotlarini o‘zgartiradi, admin amallari `role = 'admin'` ni talab qiladi). RLS esa `anon` kalit orqali brauzerdan to‘g‘ridan-to‘g‘ri kirishga qarshi ikkinchi himoya qatlami: test javoblari ochiq o‘qilmaydi, test natijalari va sertifikatlarni faqat server yozadi, foydalanuvchi o‘z rolini o‘zgartira olmaydi.

> Eslatma: Supabase drayveri va SQL sxemasi yozilgan va typecheck’dan o‘tgan, lekin jonli Supabase loyihasida sinab ko‘rilmagan. Birinchi ulashda asosiy oqimlarni (ro‘yxatdan o‘tish, dars yakunlash, test, admin tahriri) tekshirib chiqing.

---

## Joylashtirish (deploy)

- **Lokal JSON drayveri** bitta server nusxasi uchun mo‘ljallangan (VPS, Docker, `npm start`). `.data/` papkasi doimiy diskda bo‘lishi kerak.
- **Serverless platformalarda** (Vercel va boshqalar) fayl tizimi doimiy emas — **Supabase’ni sozlang**. Admin panel pastki qismida joriy ombor turi va diskka yozib bo‘lmaganligi haqida ogohlantirish ko‘rsatiladi.
- Tezlik cheklovchi (login, ro‘yxatdan o‘tish, savollar, AI) xotirada ishlaydi; ko‘p nusxali muhitda uni Redis kabi umumiy omborga almashtirish tavsiya etiladi.

---

## Arxitektura

```
content/                  Kontent seed fayllari (kurslar, yo‘nalishlar, yo‘llar)
  courses/*.ts            To‘liq kurslar va tayyorlanayotganlar dasturi
scripts/seed.ts           Kontentni lokal yoki Supabase bazasiga yozish
supabase/migrations/      PostgreSQL sxemasi + RLS + storage
src/
  app/
    (site)/               Ommaviy sahifalar va kabinet (header/footer bilan)
    (learn)/              Dars va test sahifalari (chalg‘itmaydigan rejim)
    admin/                Admin panel
    actions/              Server Actions (auth, learning, admin) — zod validatsiya
    api/                  Qidiruv indeksi, media, video progress beacon, AI ustoz
  components/
    ui/ layout/ landing/ course/ lesson/ dashboard/ admin/ interactive/
  lib/
    server/store/         Umumiy Store interfeysi: local.ts (JSON) va supabase.ts
    server/auth/          scrypt parollar, xeshlangan sessiya tokenlari, Supabase Auth
    server/services/      content, learning, dashboard, admin — biznes mantiq
    text.ts               O‘zbek tipografiyasi (o‘, g‘, ’), qidiruv kaliti, sanalar
    highlight.ts          Sintaksis yoritgich
```

**Kontent formati.** Har bir dars `LessonContent` tuzilmasiga ega (`src/lib/types.ts`): `intro`, `concept`, `why`, `how`, `steps[]`, `examples[]`, `mistakes[]`, `tips[]`, `exercise`, `summary[]`, `keyTerms[]`. Matnda `**qalin**`, `*kursiv*`, `` `kod` `` va `- ` ro‘yxatlar ishlatiladi — HTML render qilinmaydi (XSS’dan himoyalangan). Seed paytida `o'` → `o‘`, `g'` → `g‘` va tutuq belgisi `’` ga avtomatik aylantiriladi (kod qismlari o‘zgarmaydi).

**Kurs holatlari.** `published` — to‘liq; `preparing` — dastur e’lon qilingan, darslar yozilmoqda; `draft` — faqat admin ko‘radi. Dars holatlari: `published`, `planned` (dasturda ko‘rinadi, lekin ochilmaydi), `draft` (yashirin). Rejadagi darslari bor kurs to‘liq yakunlangan hisoblanmaydi va sertifikat bermaydi.

---

## Xavfsizlik

- Parollar `scrypt` bilan xeshlanadi; sessiya tokeni tasodifiy 256 bit, bazada faqat SHA-256 xeshi saqlanadi; cookie `HttpOnly`, `SameSite=Lax`, production’da `Secure`
- Parol o‘zgartirilganda boshqa qurilmalardagi sessiyalar yopiladi
- Login, ro‘yxatdan o‘tish, savollar, testlar va AI uchun tezlik cheklovi
- Barcha mutatsiyalar Server Actions orqali (Next.js Origin tekshiruvi) va zod bilan tekshiriladi
- Ochiq redirect’dan himoya (`next` parametri faqat ichki yo‘l)
- Foydalanuvchi kodi sandbox’dagi iframe yoki Web Worker’da bajariladi
- Yuklangan fayllar MIME bo‘yicha cheklangan, `nosniff` va SVG uchun qat’iy CSP bilan uzatiladi
- Xavfsizlik sarlavhalari: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`

---

## Litsenziya va kontent

Kod va kurs materiallari loyiha egasiga tegishli. Kurs matnlari “Dasturchi o‘quv jamoasi” nomidan yozilgan; real shaxslar nomidan muallif sifatida foydalanilmagan.
