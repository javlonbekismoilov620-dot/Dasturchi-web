# Supabase bilan ishlash

Bu qo‘llanma Dasturchi’ni Supabase (PostgreSQL + Auth + Storage) bilan ulash, xavfsiz sozlash va tekshirishni tushuntiradi.

## Arxitektura qisqacha

- **Next.js serveri** ma’lumotlar bazasi va Storage bilan **secret kalit** orqali ishlaydi va har bir amalda ruxsatni o‘zi tekshiradi (`src/lib/server/services/*`, Server Actions + zod).
- **Foydalanuvchi sessiyasi** Supabase Auth’da: server **publishable kalit** va foydalanuvchi cookie’si bilan ishlaydi (`@supabase/ssr`).
- **RLS va minimal grant’lar** — ikkinchi himoya qatlami: kimdir publishable kalit bilan brauzerdan to‘g‘ridan-to‘g‘ri `/rest/v1` ga murojaat qilsa ham, faqat ruxsat etilgan narsani ko‘radi va o‘zgartira oladi.
- Brauzerga hech qanday maxfiy kalit yuborilmaydi; ilova brauzerdan Supabase’ga to‘g‘ridan-to‘g‘ri so‘rov yubormaydi.

## 1. Loyiha va sxema

1. supabase.com’da loyiha yarating (masalan, Frankfurt — `eu-central-1`).
2. **SQL Editor**’da [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql) ni to‘liq bajaring.

Migratsiya **idempotent va ma’lumotni o‘chirmaydi**:

- jadvallar va indekslar `if not exists` bilan yaratiladi — mavjud jadval va qatorlarga tegilmaydi;
- funksiyalar, trigger, grant’lar va RLS siyosatlari shu fayldagi holatga keltiriladi (siyosat — ma’lumot emas);
- `media` bucket `on conflict do nothing` bilan qo‘shiladi.

Shuning uchun uni qayta bajarish xavfsiz. `supabase db push` ishlatsangiz ham muammo yo‘q: migratsiya tarixida yozuv bo‘lmasa, skript shunchaki qayta bajariladi.

## 2. Kalitlar

**Project Settings → API Keys**:

| Kalit | O‘zgaruvchi | Qayerda ishlatiladi |
| --- | --- | --- |
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | server |
| Publishable (`sb_publishable_…`) | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | server (Auth sessiyasi). Ommaviy kalit |
| Secret (`sb_secret_…`) | `SUPABASE_SECRET_KEY` | **faqat server** (baza, Storage, Auth admin) |

Eski nomlar ham qo‘llab-quvvatlanadi: `NEXT_PUBLIC_SUPABASE_ANON_KEY` va `SUPABASE_SERVICE_ROLE_KEY` (eski `eyJ…` JWT kalitlar).

Yangi formatdagi kalitlar JWT emas — Supabase ularni faqat `apikey` sarlavhasida qabul qiladi. `src/lib/supabase-shared.ts` dagi `supabaseFetch` supabase-js qo‘shadigan `Authorization: Bearer <kalit>` sarlavhasini olib tashlaydi; foydalanuvchi tokenlari o‘zgarishsiz qoladi.

Secret kalit oshkor bo‘lsa: Dashboard’da yangi secret kalit yarating, deploy’dagi qiymatni almashtiring va eskisini o‘chiring.

## 3. Kontent (seed)

```bash
npm run seed              # faqat YO‘Q yozuvlarni qo‘shadi — mavjud qatorlar va admin tahrirlari saqlanadi
npm run seed -- --update  # seed’dagi id’li qatorlarni qayta yozadi (shu qatorlardagi admin tahrirlari yo‘qoladi)
```

- Hech qaysi rejim qatorlarni o‘chirmaydi. `--reset` Supabase’da **rad etiladi**.
- Foydalanuvchi ma’lumotlariga (profil, progress, natijalar, sertifikatlar) seed hech qachon tegmaydi.
- Skript har jadval bo‘yicha hisobot beradi: `qo‘shildi N, mavjud (tegilmadi) M`.

## 4. Auth sozlamalari

**Authentication → Sign In / Providers → Email**

- **Confirm email — YOQILGAN bo‘lishi shart.** ADMIN_EMAILS xavfsizligi shunga tayanadi (pastga qarang).
- Parol: kamida **8** belgi, **harf va raqam** (ilovadagi talab bilan bir xil).

**Authentication → URL Configuration**

- Site URL: `https://sizning-domen.uz`
- Redirect URLs: `https://sizning-domen.uz/**` (lokal ishlash uchun `http://localhost:3000/**` ham)

**Pochta (SMTP) — production uchun majburiy**

Supabase’ning standart pochta xizmati faqat **loyiha jamoasi a’zolariga** xat yuboradi va soatiga bir necha xat bilan cheklangan. Haqiqiy foydalanuvchilar tasdiqlash xatini olishi uchun **Authentication → Emails → SMTP Settings**’da o‘z SMTP provayderingizni ulang (Resend, Postmark, SES va h.k.).

SMTP ulangandan keyin tasdiqlash xati shablonini o‘zbekchaga o‘zgartirish mumkin (Free tarifda standart pochta bilan shablonni o‘zgartirib bo‘lmaydi). Tavsiya etilgan shablon `token_hash` havolasidan foydalanadi — u xat boshqa brauzer yoki qurilmada ochilganda ham ishlaydi ([`/auth/confirm`](../src/app/auth/confirm/route.ts)):

- Mavzu: `Dasturchi: elektron pochtangizni tasdiqlang`
- Matn:

```html
<h2>Elektron pochtangizni tasdiqlang</h2>
<p>Assalomu alaykum! Dasturchi platformasida ro‘yxatdan o‘tishni yakunlash uchun quyidagi havolani bosing.</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/baholash">Pochtani tasdiqlash</a></p>
<p>Agar siz ro‘yxatdan o‘tmagan bo‘lsangiz, bu xatni e’tiborsiz qoldiring.</p>
```

Standart shablon bilan ham ishlaydi: havola `/auth/callback?code=…` ga qaytadi. Agar xat boshqa brauzerda ochilsa, pochta baribir tasdiqlanadi va foydalanuvchi parol bilan kirishi mumkinligi haqida xabar ko‘radi.

**Google orqali kirish (ixtiyoriy):** Providers → Google ni yoqing va `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` qo‘ying.

## 5. ADMIN_EMAILS qanday ishlaydi

`ADMIN_EMAILS` — vergul bilan ajratilgan pochtalar. Bu ro‘yxatdagi pochta egasi tizimga kirganda admin bo‘ladi, **lekin faqat pochtaga egalik isbotlangan bo‘lsa**:

1. Yangi profil har doim `student` bo‘lib yaratiladi. Trigger rolni ro‘yxatdan o‘tish metadata’sidan **hech qachon** olmaydi.
2. Supabase rejimida server admin huquqini faqat quyidagilar bajarilganda beradi:
   - `email_confirmed_at` mavjud, **va**
   - foydalanuvchi parol bilan ro‘yxatdan o‘tgan bo‘lsa — loyihada avtomatik tasdiqlash o‘chirilgan (`mailer_autoconfirm = false`, ommaviy `/auth/v1/settings` orqali tekshiriladi). Avtomatik tasdiqlash yoqilsa, `email_confirmed_at` hech narsani isbotlamaydi;
   - faqat OAuth (masalan, Google) bilan kirganlar uchun pochta provayder tomonidan tasdiqlangan hisoblanadi.
3. Tekshirib bo‘lmasa (tarmoq xatosi va h.k.) — huquq **berilmaydi** (fail closed).
4. Ro‘yxatdagi admin’ni admin panel orqali pasaytirib bo‘lmaydi — avval `ADMIN_EMAILS` dan olib tashlang. Admin o‘zini ham pasaytira olmaydi.
5. `role` ustunini faqat server o‘zgartiradi: `authenticated` roliga bu ustunni yangilash grant’i berilmagan (admin uchun ham).

Bu himoya qiladigan hujum: begona odam admin pochtasi bilan birinchi bo‘lib ro‘yxatdan o‘tadi. U pochtani tasdiqlay olmaydi — demak tizimga kira olmaydi va admin bo‘lmaydi.

**Lokal rejimda** (Supabase’siz) pochta tasdiqlanmaydi: ro‘yxatdagi pochta bilan ro‘yxatdan o‘tgan har kim admin bo‘ladi. Shuning uchun lokal rejimda admin hisobini deploy’dan keyin **darhol** o‘zingiz yarating.

## 6. Storage

`media` bucket:

- **ommaviy** — fayllar `…/storage/v1/object/public/media/<uuid>.<ext>` orqali ochiladi (darslardagi video va rasmlar uchun);
- bitta fayl **50 MB** gacha (Supabase Free tarifining global chegarasi; Pro’da oshirish mumkin — `MEDIA_MAX_UPLOAD_MB`);
- faqat ruxsat etilgan MIME turlari (rasm, video, audio, PDF, ZIP, JSON, matn, GLB). Masalan, `text/html` bucket tomonidan rad etiladi;
- ro‘yxatni ko‘rish, yuklash, almashtirish va o‘chirish — faqat admin (RLS). Ilova fayllarni server orqali secret kalit bilan yuklaydi, mavjud faylning ustidan yozmaydi (`upsert: false`).

**Muhim:** o‘chirilgan fayl Storage’dan darhol o‘chadi, lekin ommaviy havola Supabase CDN keshida **taxminan 1 soatgacha** (`cache-control: max-age=3600`) ochilib turishi mumkin. Free tarifda keshni qo‘lda tozalash yo‘q. Admin panel o‘chirishdan oldin bu haqda ogohlantiradi.

## 7. RLS va grant’lar

Supabase standart holatda `anon` va `authenticated` rollariga yangi jadvallar ustida **barcha** huquqlarni (TRUNCATE ham) beradi. Migratsiya ularni olib tashlab, faqat kerakli minimal huquqlarni beradi.

| Ma’lumot | `anon` | `authenticated` (talaba) | Admin (`private.is_admin()`) |
| --- | --- | --- | --- |
| Kategoriya, kurs, modul, yo‘nalish | ochiqlarini o‘qish | ochiqlarini o‘qish | qoralamalar ham; yozish |
| Darslar | namuna va rejalashtirilganlar | barcha ochiq darslar | hammasi; yozish |
| Testlar (to‘g‘ri javoblar bilan) | — | — | o‘qish va yozish |
| Profil | — | faqat o‘ziniki; `role` va `email` dan tashqari | hammasi (rol — faqat server) |
| Yozilish, progress, natijalar, faollik | — | faqat o‘ziniki, **faqat o‘qish** | o‘qish |
| Qaydlar, xatcho‘plar, saqlanganlar | — | faqat o‘ziniki | — |
| Savol-javoblar | — | o‘qish; o‘zinikini o‘chirish (yozish — server) | o‘chirish |
| Sertifikatlar | — (tekshiruv server orqali) | o‘ziniki | o‘qish, bekor qilish |
| Media jadvali va Storage ro‘yxati | — | — | hammasi |

`is_admin()` API’da ochilmagan `private` sxemasida joylashgan — RLS uni chaqiradi, lekin `/rest/v1/rpc/is_admin` orqali chaqirib bo‘lmaydi. Supabase **Security Advisor**’ida ogohlantirish bo‘lmasligi kerak.

## 8. Testlar

**RLS testi** — [`supabase/tests/rls_test.sql`](../supabase/tests/rls_test.sql). SQL Editor’da to‘liq bajaring. U test foydalanuvchilari va yozuvlarini yaratadi, `anon` / talaba / admin rollarini taqlid qiladi (`set local role` + JWT claims) va **oxirida hammasini ROLLBACK qiladi**. Natijada barcha qatorlar `ok = true` bo‘lishi kerak.

**Xavfsizlik testi** — `npm run test:security` (Playwright). Supabase rejimida ishlab turgan server kerak:

```bash
ADMIN_EMAILS=admin@dasturchi.test,admin2@dasturchi.test,owner-unverified@dasturchi.test npm start
# boshqa terminalda (NEXT_PUBLIC_SUPABASE_URL va SUPABASE_SECRET_KEY bilan):
npm run test:security
```

U faqat `@dasturchi.test` hisoblarini Auth admin API orqali yaratadi (xat yuborilmaydi) va oxirida o‘chiradi. Tekshiradi: tasdiqlanmagan admin pochtasi bilan kirib bo‘lmasligi, tasdiqlangandan keyin admin bo‘lishi, `/auth/confirm` havolasining bir martaligi, ochiq redirect himoyasi, Storage chegaralari, sertifikat tekshiruvi; sessiya bilan — admin panel, rol boshqaruvi, media yuklash, parol almashtirish va boshqa sessiyalarning yopilishi.

**E2E** — `npm run test:e2e`. Supabase rejimida pochta tasdiqlash yoqilgan bo‘lsa, `E2E_SKIP_ACCOUNTS=1` bilan faqat ommaviy sahifalarni tekshiradi; hisob oqimlari `test:security` da.

## Sinov holati

Jonli loyihada (Frankfurt, Free tarif) quyidagilar tekshirildi:

- Migratsiya ikki marta ketma-ket qo‘llandi (idempotent), ma’lumot yo‘qolmadi.
- Seed: 333 ta kontent qatori qo‘shildi; qayta ishga tushirishda 0 ta qo‘shildi; admin tahriri qayta seed’dan keyin saqlandi; `--reset` rad etildi.
- RLS testi: **61/61**. Ataylab zaiflashtirilgan nusxada test xatolarni aniqladi (negativ nazorat).
- Supabase Security Advisor: **0** ta ogohlantirish.
- ADMIN_EMAILS: tasdiqlanmagan hisob — kira olmaydi va `student`; tasdiqlangan — `admin`; avtomatik tasdiqlash vaqtincha yoqilganda tasdiqlangan hisob ham `student` bo‘lib qoldi (fail closed), keyin sozlama qaytarildi.
- Storage: yuklash, ustidan yozmaslik, HTML’ni rad etish, ommaviy URL, o‘chirish.
- Katalog, dars, qidiruv, sertifikat tekshiruvi sahifalari Supabase ma’lumotlari bilan.

**Supabase bilan hali tekshirilmagan:** foydalanuvchi sessiyasini talab qiladigan oqimlar — kabinet, admin panel, panel orqali rol o‘zgartirish, admin UI orqali media yuklash, Supabase rejimida parol almashtirish. Sabab: sinov muhitida secret kalit tarmoq proksisi orqali loyiha manziliga yuboriladigan **har bir** so‘rovga qo‘shiladi, Supabase esa secret kalitli so‘rovda foydalanuvchi tokenini service-role bilan almashtiradi. Oddiy deploy’da bunday cheklov yo‘q. Bu oqimlar lokal rejimda (e2e 30/30) tekshirilgan. Birinchi deploy’dan keyin `npm run test:security` ni `SKIP_SESSION_TESTS` siz ishga tushiring.

## Keyingi tavsiyalar

- Custom SMTP ulash (yuqoriga qarang) — usiz haqiqiy foydalanuvchilar ro‘yxatdan o‘ta olmaydi.
- “Parolni unutdingizmi?” oqimi hali yo‘q (`resetPasswordForEmail` + `/auth/confirm?type=recovery`).
- Ro‘yxatdan o‘tish formasiga CAPTCHA (Supabase Auth → Attack Protection).
- Pro tarifda: oshkor bo‘lgan parollardan himoya (HaveIBeenPwned) va kattaroq fayl chegarasi.
- Ko‘p nusxali deploy’da tezlik cheklovchini umumiy omborga (masalan, Redis) o‘tkazish.
