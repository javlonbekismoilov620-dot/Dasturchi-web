import type { CourseSeed } from "../../src/lib/types.ts";

export const blenderBoshlangich: CourseSeed = {
  slug: "blender-boshlangich",
  title: "Blender: 3D olamiga ilk qadam",
  subtitle: "Bepul professional dasturda birinchi 3D sahnangizni yarating",
  description:
    "Blender — 3D modellashtirish, animatsiya va render uchun bepul va ochiq kodli professional dastur. U kino, reklama, o'yin va mahsulot vizualizatsiyasida ishlatiladi. Bu kursda 3D grafikaning asosiy tushunchalarini, Blender interfeysi va navigatsiyani, obyektlar bilan ishlashni, Edit Mode'da modellashtirishni, material va yorug'likni o'rganasiz va birinchi renderingizni yaratasiz.",
  category: "3d",
  level: 1,
  status: "published",
  featured: true,
  order: 3,
  accent: "violet",
  icon: "Box",
  objectives: [
    "3D grafikaning asosiy tushunchalarini (nuqta, qirra, yuz, mesh) tushunish",
    "Blender interfeysi va viewport navigatsiyasini erkin boshqarish",
    "Obyektlarni qo'shish, siljitish, aylantirish va masshtablash",
    "Edit Mode'da extrude, inset, loop cut va bevel bilan modellashtirish",
    "Material, yorug'lik va kamerani sozlab, yakuniy render olish",
  ],
  skills: ["Blender", "3D navigatsiya", "Transformatsiyalar", "Edit Mode", "Low-poly modellashtirish", "Materiallar", "Yoritish", "Render"],
  requirements: [
    "Windows, macOS yoki Linux kompyuter",
    "Uch tugmali (g'ildirakli) sichqoncha tavsiya etiladi",
    "Alohida videokarta tavsiya etiladi, lekin boshlash uchun shart emas",
  ],
  audience: ["3D grafikaga qiziquvchi yangi boshlovchilar", "O'yin, animatsiya yoki vizualizatsiya sohasiga kirmoqchi bo'lganlar", "Mahsulotlarini 3D'da ko'rsatmoqchi bo'lgan dizaynerlar"],
  software: ["Blender"],
  tags: ["blender", "3d", "modellashtirish", "render", "boshlang'ich"],
  estimatedHours: 8,
  finalProject: {
    title: "Low-poly xona sahnasi",
    description:
      "Oddiy shakllardan stol, stul, lampa va kitob javonidan iborat kichik izometrik xona modelini yarating, unga materiallar bering, yorug'likni sozlang va 1920×1080 o'lchamdagi render oling.",
    deliverables: [
      "Kamida 5 ta alohida modellashtirilgan obyekt",
      "Extrude, inset va bevel kabi vositalardan foydalanish",
      "Kamida 4 xil rangdagi material",
      "Uch nuqtali yoki o'ylangan yoritish sxemasi",
      "Yakuniy render PNG formatida",
    ],
  },
  modules: [
    {
      title: "Blender interfeysi va asoslar",
      description: "3D tushunchalari, interfeys, navigatsiya va obyektlar bilan ishlash.",
      lessons: [
        {
          slug: "3d-grafika-va-blender",
          title: "3D grafika nima va Blender'ni o'rnatish",
          summary: "Nuqta, qirra, yuz va mesh tushunchalari; Blender'ni yuklab olish.",
          durationMin: 14,
          isPreview: true,
          interactive: [
            {
              type: "mesh-viewer",
              title: "3D obyektning tuzilishi",
              description: "Yuqoridagi rejimlarni almashtirib, kub va sferaning nuqta, qirra va yuzlarini ko'ring. Sichqoncha bilan aylantiring.",
              config: { shape: "cube" },
            },
          ],
          content: {
            intro: "Multfilmlardagi qahramonlar, o'yinlardagi shaharlar, reklamadagi mahsulot suratlari — ularning ko'pchiligi aslida 3D modellardir. Bu darsda 3D obyekt nimadan iboratini tushunib, Blender'ni o'rnatasiz.",
            concept:
              "**3D model** — uch o'lchamli fazodagi (eni X, chuqurligi Y, balandligi Z) raqamli shakl. Ko'pchilik 3D modellar **mesh** (to'r) ko'rinishida bo'ladi va uch elementdan quriladi:\n\n- **Nuqta (vertex)** — fazodagi bitta koordinata\n- **Qirra (edge)** — ikki nuqtani tutashtiruvchi chiziq\n- **Yuz (face)** — qirralar bilan o'ralgan yassi sirt\n\nMasalan, kub 8 ta nuqta, 12 ta qirra va 6 ta yuzdan iborat. **Render** — 3D sahnani yorug'lik, material va kamera asosida yakuniy rasm yoki videoga aylantirish jarayoni.",
            why: "Bu uchta element har qanday 3D dasturning — Blender, Maya, 3ds Max, Unreal Engine — asosi. Ularni tushunsangiz, modellashtirish vositalari nima qilayotganini mantiqan anglaysiz. Blender esa bepul, ochiq kodli va professional darajadagi dastur: unda modellashtirish, skulpting, animatsiya, render va hatto video montaj bor.",
            how:
              "Kompyuter mesh'ni ekranga chizishda har bir yuzni kichik uchburchaklarga ajratadi va yorug'lik yuzga qanday burchak ostida tushayotganini hisoblaydi — shuning uchun yuzlarning yo'nalishi (normal) muhim. Nuqtalar qanchalik ko'p bo'lsa, shakl shunchalik silliq ko'rinadi, lekin kompyuterga yuk ham ortadi. Buni yuqoridagi interaktiv ko'rinishda UV sferaning segmentlar sonini o'zgartirib sinab ko'rishingiz mumkin.\n\nBlender sahnani **obyektlar** ko'rinishida saqlaydi: mesh, kamera, yorug'lik. Har bir obyektning joylashuvi (location), aylanishi (rotation) va masshtabi (scale) bor.",
            steps: [
              { title: "Blender'ni yuklab oling", body: "blender.org/download sahifasidan operatsion tizimingizga mos versiyani tanlang. Blender to'liq bepul — hech qanday obuna yoki litsenziya kerak emas." },
              { title: "O'rnating va ishga tushiring", body: "O'rnatgandan keyin Blender'ni oching. Birinchi ochilishda chiqqan oynada til va asosiy sozlamalarni tanlash mumkin; kurs davomida ingliz tilidagi interfeysdan foydalanamiz, chunki darsliklar va hamjamiyat asosan shu tilda." },
              { title: "Yangi loyiha yarating", body: "Ochilish oynasida **General** ni tanlang. Sahnada standart kub, kamera va yorug'lik paydo bo'ladi — bu Blender'ning boshlang'ich sahnasi." },
              { title: "Faylni saqlang", body: "`Ctrl + S` bosing va loyihaga nom bering. Blender fayllari `.blend` kengaytmasiga ega. Ishlash davomida tez-tez saqlashni odat qiling." },
            ],
            examples: [
              {
                title: "Kundalik buyumlar meshi",
                body: "Choynakni tasavvur qiling: korpus — ko'p segmentli silindr, jo'mrak — egilgan quvur, qopqoq — yarim sfera. Professional modellar ham shunday oddiy shakllardan boshlanadi va bosqichma-bosqich aniqlashtiriladi.",
              },
            ],
            mistakes: [
              { title: "Faqat sensorli panel bilan ishlash", fix: "Noutbuk sensorli paneli bilan Blender'da ishlash ancha qiyin. Iloji bo'lsa, g'ildirakli sichqoncha ishlating; aks holda Preferences → Input → **Emulate 3 Button Mouse** sozlamasini yoqing." },
              { title: "Norasmiy saytlardan yuklab olish", fix: "Blender faqat blender.org yoki rasmiy do'konlardan (Steam, Microsoft Store) olinadi. Boshqa saytlardagi “maxsus versiyalar” virus bo'lishi mumkin." },
              { title: "Saqlamaslik", fix: "Blender kamdan-kam bo'lsa ham to'satdan yopilishi mumkin. `Ctrl + S` ni har bir muhim qadamdan keyin bosing." },
            ],
            tips: [
              "Blender'ning versiya raqamiga e'tibor bering: darslik va siz ishlatayotgan versiya juda farq qilsa, ba'zi tugmalar boshqa joyda bo'lishi mumkin.",
              "Ishlarni alohida papkada saqlang: `.blend` fayl, teksturalar va renderlar bir joyda bo'lsin.",
              "Har kuni 10–15 daqiqa navigatsiya va tugmalar bilan mashq qilish — eng tez rivojlanish usuli.",
            ],
            exercise: {
              title: "Interaktiv ko'rinishda tajriba",
              brief: "Yuqoridagi 3D ko'rinish orqali mesh tuzilishini o'rganing.",
              tasks: [
                "Kubni tanlab, nuqta, qirra va yuz sonlarini yozib oling (8, 12, 6 ekanini tekshiring).",
                "UV sferaga o'ting va segmentlar sonini 6 dan 64 gacha o'zgartiring. Shakl va nuqtalar soni qanday o'zgaradi?",
                "Shade Flat va Shade Smooth rejimlarini solishtiring.",
                "Blender'ni o'rnatib, birinchi `.blend` faylingizni saqlang.",
              ],
            },
            summary: [
              "3D model fazodagi raqamli shakl; mesh nuqta, qirra va yuzlardan quriladi.",
              "Ko'proq nuqta — silliqroq shakl, lekin og'irroq sahna.",
              "Render — sahnani yakuniy rasm/videoga aylantirish.",
              "Blender bepul va rasmiy blender.org saytidan olinadi.",
            ],
            keyTerms: [
              { term: "Vertex (nuqta)", definition: "3D fazodagi bitta koordinata." },
              { term: "Edge (qirra)", definition: "Ikki nuqtani tutashtiruvchi chiziq." },
              { term: "Face (yuz)", definition: "Qirralar bilan o'ralgan sirt." },
              { term: "Mesh", definition: "Nuqta, qirra va yuzlardan iborat 3D shakl." },
              { term: "Render", definition: "3D sahnani yakuniy rasm yoki videoga aylantirish jarayoni." },
            ],
          },
        },
        {
          slug: "interfeys-va-navigatsiya",
          title: "Interfeys va viewport navigatsiyasi",
          summary: "Asosiy panellar, kamera boshqaruvi, ko'rinishlar va raqamli klaviatura.",
          durationMin: 16,
          interactive: [{ type: "mesh-viewer", title: "Navigatsiyani mashq qiling", description: "Sichqoncha bilan aylantiring, g'ildirak bilan yaqinlashtiring.", config: { shape: "torus" } }],
          content: {
            intro: "Blender interfeysi birinchi qarashda murakkab ko'rinadi. Lekin uni bir marta tushunib olsangiz, har bir panel nima uchun kerakligi ayon bo'ladi.",
            concept:
              "Blender oynasi bir nechta **maydonlarga** (areas) bo'lingan:\n\n- **3D Viewport** — sahna ko'rinadigan va ishlanadigan asosiy oyna\n- **Outliner** (yuqori o'ngda) — sahnadagi barcha obyektlar ro'yxati\n- **Properties** (pastki o'ngda) — tanlangan obyekt, material, render sozlamalari\n- **Timeline** (pastda) — animatsiya vaqt shkalasi\n\nViewport ichida chapda **Toolbar** (`T` tugmasi) va o'ngda **Sidebar** (`N` tugmasi) bor. Navigatsiya — sahna atrofida “kamera bilan yurish”: aylantirish, surish va yaqinlashtirish.",
            why: "Navigatsiya — 3D ishining 50% i. Obyektni turli burchaklardan ko'ra olmasangiz, uni to'g'ri modellashtira olmaysiz. Professionallar sichqoncha va klaviaturani “ko'r” ishlatishadi — bu tezlik va aniqlik beradi.",
            how:
              "Viewport navigatsiyasi sichqonchaning o'rta tugmasi (g'ildirak) atrofida quriladi:\n\n- **G'ildirakni bosib surish** — sahna atrofida aylanish (orbit)\n- **Shift + g'ildirakni bosib surish** — yon tomonga surish (pan)\n- **G'ildirakni aylantirish** — yaqinlashtirish/uzoqlashtirish (zoom)\n\nRaqamli klaviatura (numpad) tayyor ko'rinishlarni beradi: `1` — old, `3` — o'ng yon, `7` — yuqoridan, `0` — kamera ko'rinishi, `5` — perspektiva va ortografik ko'rinish o'rtasida almashish. Raqamli klaviatura yo'q bo'lsa, Preferences → Input → **Emulate Numpad** ni yoqing yoki viewport'ning o'ng yuqorisidagi o'qlar gizmosini bosing.",
            steps: [
              { title: "Sahna atrofida aylaning", body: "G'ildirakni bosib turing va sichqonchani suring. Kub turli tomonlardan ko'rinadi." },
              { title: "Yaqinlashtiring va suring", body: "G'ildirakni aylantiring, so'ng `Shift` + g'ildirakni bosib, ko'rinishni yon tomonga siljiting." },
              { title: "Tayyor ko'rinishlardan foydalaning", body: "`Numpad 1`, `3` va `7` ni navbatma-navbat bosing. Ortografik ko'rinishda perspektiva yo'qoladi — o'lchamlarni aniq solishtirish uchun qulay." },
              { title: "Obyektga fokuslaning", body: "Obyektni tanlab, `Numpad .` (nuqta) ni bosing — ko'rinish shu obyektga markazlashadi. Butun sahnani ko'rish uchun `Home` tugmasi." },
              { title: "Panellarni oching-yoping", body: "`T` — vositalar paneli, `N` — sidebar (u yerda obyektning aniq joylashuv raqamlari bor)." },
            ],
            examples: [
              { title: "Old va yon ko'rinishda ishlash", body: "Stul modellashtirayotganda avval `Numpad 1` (old) da oyoqlar orasidagi masofani, so'ng `Numpad 3` (yon) da suyanchiq egilishini to'g'rilaysiz. Perspektivasiz ortografik ko'rinish o'lchamlarni buzmaydi." },
            ],
            mistakes: [
              { title: "Sahnani “yo'qotib qo'yish”", fix: "Obyektlar ekrandan chiqib ketsa, `Home` bosing — barcha obyektlar ko'rinishga sig'diriladi." },
              { title: "Ko'rinishni kamera bilan adashtirish", fix: "Viewport ko'rinishi va render kamerasi — boshqa narsalar. Render kamera nima ko'rsa, shuni oladi. Kamera ko'rinishiga `Numpad 0` bilan o'tasiz." },
              { title: "Sichqoncha kursori viewport'dan tashqarida", fix: "Blender tugmalari kursor turgan maydonga ta'sir qiladi. Tugma ishlamasa, kursor kerakli oyna ustidami — tekshiring." },
            ],
            tips: [
              "Klaviatura yorliqlarini darhol yodlashga urinmang — har kuni 2–3 tasini ongli ishlating.",
              "Interfeysni o'zgartirib qo'ysangiz, File → Defaults → Load Factory Settings bilan qaytarish mumkin (shaxsiy sozlamalar ham o'chadi).",
              "`F3` — buyruqlar qidiruvi: menyuda qayerdaligini unutgan buyruqni nomi bilan topasiz.",
            ],
            exercise: {
              title: "Navigatsiya mashqi",
              brief: "Standart sahnada navigatsiyani avtomatik darajaga yetkazing.",
              tasks: [
                "Kubni old, yon va yuqoridan (`1`, `3`, `7`) ko'ring va har birining skrinshotini oling.",
                "Kamera ko'rinishiga o'ting (`0`) va undan chiqing.",
                "Sidebar'ni (`N`) ochib, kubning Location qiymatlarini toping.",
                "`F3` orqali “Add Cube” buyrug'ini qidirib toping.",
              ],
            },
            summary: [
              "Asosiy maydonlar: 3D Viewport, Outliner, Properties, Timeline.",
              "Orbit — g'ildirak, pan — Shift + g'ildirak, zoom — aylantirish.",
              "Numpad: 1 — old, 3 — yon, 7 — yuqori, 0 — kamera, 5 — perspektiva/ortografik.",
              "`Home` — hammasini ko'rsatish, `Numpad .` — tanlanganga fokus, `F3` — qidiruv.",
            ],
            keyTerms: [
              { term: "Viewport", definition: "3D sahna ko'rinadigan va tahrirlanadigan oyna." },
              { term: "Outliner", definition: "Sahnadagi obyektlar ierarxiyasi ro'yxati." },
              { term: "Ortografik ko'rinish", definition: "Perspektivasiz, o'lchamlar buzilmaydigan ko'rinish." },
            ],
          },
        },
        {
          slug: "obyektlar-grs",
          title: "Obyektlar bilan ishlash: G, R, S",
          summary: "Qo'shish, tanlash, siljitish, aylantirish, masshtablash va nusxalash.",
          durationMin: 18,
          interactive: [{ type: "mesh-viewer", title: "Transformatsiyalarni sinab ko'ring", description: "O'ng paneldagi G, R, S slayderlari bilan obyektni boshqaring.", config: { shape: "cylinder" } }],
          content: {
            intro: "3D sahna — bu obyektlarni to'g'ri joyga qo'yish san'ati. Blender'da buning uchun uchta asosiy tugma bor: G, R va S.",
            concept:
              "Har bir obyekt uchta **transformatsiyaga** ega:\n- **Location** (joylashuv) — `G` (Grab)\n- **Rotation** (aylanish) — `R`\n- **Scale** (masshtab) — `S`\n\nBu amallarni **o'q** bilan cheklash mumkin: `G` bosgandan keyin `X`, `Y` yoki `Z` bossangiz, obyekt faqat shu o'q bo'ylab harakatlanadi. Raqam yozsangiz — aniq qiymat beriladi. Masalan, `G Z 2 Enter` — obyektni 2 metr yuqoriga ko'taradi.",
            why: "G, R, S — Blender'da eng ko'p bosiladigan tugmalar. Ularni o'q va raqamlar bilan birga ishlatish sahnani aniq va tez qurish imkonini beradi: “taxminan” emas, aynan kerakli joyga.",
            how:
              "Blender'da **Object Mode** (obyekt rejimi) — butun obyektlar bilan ishlash rejimi. Obyekt sichqonchaning **chap tugmasi** bilan tanlanadi; `Shift` bilan bir nechtasini tanlash mumkin, `A` — hammasini tanlash, `Alt + A` — tanlovni bekor qilish.\n\n`Shift + A` — qo'shish menyusi: mesh (kub, sfera, silindr), yorug'lik, kamera. Yangi obyekt **3D kursor** (qizil-oq doira) joylashgan nuqtada paydo bo'ladi. Transformatsiya paytida sichqonchaning chap tugmasi yoki `Enter` — tasdiqlash, o'ng tugma yoki `Esc` — bekor qilish.\n\nMasshtab o'zgartirilgandan keyin `Ctrl + A` → **Scale** bilan uni “qo'llash” tavsiya etiladi: aks holda keyingi vositalar (bevel, modifikatorlar) noto'g'ri ishlashi mumkin.",
            steps: [
              { title: "Obyekt qo'shing", body: "`Shift + A` → Mesh → **UV Sphere**. Sfera 3D kursor joyida paydo bo'ladi." },
              { title: "Siljiting", body: "`G` bosing va sichqonchani suring. So'ng `G X` — faqat X o'qi bo'ylab. Aniq qiymat: `G Z 1.5 Enter`." },
              { title: "Aylantiring", body: "`R Z 45 Enter` — Z o'qi atrofida 45 gradusga aylantirish." },
              { title: "Masshtablang", body: "`S 2 Enter` — ikki baravar kattalashtirish; `S Z 0.5` — faqat balandlikni yarmiga qisqartirish. So'ng `Ctrl + A` → Scale." },
              { title: "Nusxalang va o'chiring", body: "`Shift + D` — nusxa (darhol siljitish rejimida), `X` yoki `Delete` — o'chirish." },
            ],
            examples: [
              { title: "Oddiy stol yasash", body: "Kubni `S Z 0.1` bilan yupqalashtiring — stol usti. Oyoq uchun yangi kub qo'shib, `S 0.1` va `S Z 1` bilan ingichka ustun qiling. `Shift + D X 1.8` bilan oyoqni nusxalab, X o'qi bo'ylab 1.8 m ga suring. To'rt oyoq tayyor bo'lgach, ularni stol ostiga joylashtiring." },
            ],
            mistakes: [
              { title: "Masshtabni qo'llamaslik", fix: "Kub `S Z 0.1` dan keyin bevel g'alati chiqsa, sabab qo'llanmagan masshtab. `Ctrl + A` → Scale bosing." },
              { title: "Edit Mode'da obyekt siljitish", fix: "Agar obyekt shakli buzilib ketsa, siz Edit Mode'dasiz. `Tab` bilan Object Mode'ga qayting." },
              { title: "Transformatsiyani noto'g'ri bekor qilish", fix: "`Esc` yoki o'ng tugma joriy amalni bekor qiladi; allaqachon tasdiqlangan amalni `Ctrl + Z` bekor qiladi." },
            ],
            tips: [
              "`Alt + G`, `Alt + R`, `Alt + S` — tegishli transformatsiyani nolga qaytaradi.",
              "Sidebar (`N`) dagi Location/Rotation/Scale maydonlariga to'g'ridan-to'g'ri raqam yozish ham mumkin.",
              "Obyektlarga Outliner'da ma'noli nom bering (`F2`): “Stol_ustki”, “Stol_oyoq_1”.",
            ],
            exercise: {
              title: "Qorbobo",
              brief: "Faqat oddiy shakllar va G, R, S yordamida qorbobo yasang.",
              tasks: [
                "Uchta UV sferadan turli o'lchamdagi tana va bosh yarating.",
                "Konusdan sabzi-burun yasab, uni boshga `R` bilan to'g'ri burchakda joylashtiring.",
                "Silindrdan shlyapa yasang (`S Z` bilan balandligini sozlang).",
                "Barcha obyektlarga Outliner'da nom bering va masshtabni qo'llang.",
              ],
            },
            summary: [
              "`G` — siljitish, `R` — aylantirish, `S` — masshtablash.",
              "O'q bilan cheklash: `X`/`Y`/`Z`; aniq qiymat — raqam yozish.",
              "`Shift + A` — qo'shish, `Shift + D` — nusxa, `X` — o'chirish.",
              "Masshtabdan keyin `Ctrl + A` → Scale.",
            ],
            keyTerms: [
              { term: "Object Mode", definition: "Butun obyektlar bilan ishlash rejimi." },
              { term: "3D kursor", definition: "Yangi obyektlar paydo bo'ladigan nuqta." },
              { term: "Transformatsiya", definition: "Obyektning joylashuvi, aylanishi va masshtabi." },
            ],
          },
        },
      ],
      quiz: {
        title: "1-modul testi: Blender asoslari",
        description: "3D tushunchalari, interfeys va transformatsiyalar bo'yicha savollar.",
        questions: [
          { prompt: "Standart kubda nechta nuqta (vertex) bor?", options: ["6", "8", "12", "24"], correct: 1, explanation: "Kubda 8 ta nuqta, 12 ta qirra va 6 ta yuz bor." },
          { prompt: "Render nima?", options: ["Obyektni o'chirish", "3D sahnani yakuniy rasm yoki videoga aylantirish", "Faylni saqlash", "Modelni aylantirish"], correct: 1, explanation: "Render yorug'lik, material va kamera asosida yakuniy tasvir yaratadi." },
          { prompt: "Viewport'da kamera ko'rinishiga qaysi tugma bilan o'tiladi?", options: ["Numpad 1", "Numpad 7", "Numpad 0", "Numpad 5"], correct: 2, explanation: "`Numpad 0` faol kamera ko'rinishini ko'rsatadi." },
          { prompt: "Obyektni faqat Z o'qi bo'ylab 2 metr ko'tarish uchun?", options: ["S Z 2", "R Z 2", "G Z 2", "Z 2 G"], correct: 2, explanation: "`G` — siljitish, `Z` — o'q, `2` — masofa." },
          { prompt: "Obyektni nusxalash yorlig'i?", options: ["Ctrl + C", "Shift + D", "Alt + D", "D"], correct: 1, explanation: "`Shift + D` nusxa yaratadi va uni darhol siljitish rejimiga o'tkazadi." },
          { prompt: "Masshtab o'zgartirilgandan keyin nima qilish tavsiya etiladi?", options: ["Ctrl + A → Scale", "Faylni qayta ochish", "Obyektni o'chirish", "Hech narsa"], correct: 0, explanation: "Masshtabni qo'llash vositalar to'g'ri ishlashini ta'minlaydi." },
        ],
      },
    },
    {
      title: "Modellashtirish, material va render",
      description: "Edit Mode'da shakl yaratasiz, material va yorug'lik berasiz va birinchi renderingizni olasiz.",
      lessons: [
        {
          slug: "edit-mode",
          title: "Edit Mode: nuqta, qirra va yuz",
          summary: "Extrude, inset, loop cut va bevel — asosiy modellashtirish vositalari.",
          durationMin: 22,
          interactive: [{ type: "mesh-viewer", title: "Tanlash rejimlari", description: "Nuqta, Qirra va Yuz rejimlarini almashtiring — Blender'dagi 1, 2, 3 tugmalari kabi.", config: { shape: "cube" } }],
          content: {
            intro: "Object Mode'da obyektni butunligicha harakatlantirasiz. Shaklning o'zini o'zgartirish uchun esa Edit Mode kerak — haqiqiy modellashtirish shu yerda boshlanadi.",
            concept:
              "**Edit Mode** — mesh'ning ichki tuzilmasini (nuqta, qirra, yuz) tahrirlash rejimi. Unga `Tab` bilan kiriladi va chiqiladi. Uchta **tanlash rejimi** bor: `1` — nuqtalar, `2` — qirralar, `3` — yuzlar.\n\nAsosiy vositalar:\n- **Extrude** (`E`) — tanlangan qismni “cho'zib chiqarish”, yangi geometriya yaratadi\n- **Inset** (`I`) — yuz ichida kichikroq yuz yaratadi\n- **Loop Cut** (`Ctrl + R`) — mesh atrofida yangi qirralar halqasini kesadi\n- **Bevel** (`Ctrl + B`) — o'tkir qirralarni qiyshaytiradi (yumaloqlaydi)",
            why: "Deyarli har qanday hard-surface model — mebel, bino, gadjet — shu to'rt vosita bilan yaratiladi. Real hayotda mukammal o'tkir qirralar yo'q: bevel yorug'likni qirrada aks ettiradi va model ancha realistik ko'rinadi.",
            how:
              "Extrude tanlangan yuzni nusxalab, uni asl yuz bilan yangi yon yuzlar orqali tutashtiradi. Inset yuz chegarasidan ichkariga yangi halqa yaratadi — uni keyin extrude qilib chuqurcha yoki chiqiq hosil qilinadi.\n\nLoop Cut sichqoncha ostidagi qirra halqasiga perpendikulyar kesim qo'shadi; sichqoncha g'ildiragi bilan kesimlar sonini oshirish mumkin. Bevel'da sichqonchani surish kenglikni, g'ildirak esa segmentlar sonini o'zgartiradi. Edit Mode'da ham `G`, `R`, `S` ishlaydi — faqat tanlangan nuqta/qirra/yuzlarga.",
            steps: [
              { title: "Edit Mode'ga kiring", body: "Kubni tanlab, `Tab` bosing. Barcha nuqtalar sariq bo'lsa, hammasi tanlangan; `Alt + A` bilan tanlovni bekor qiling." },
              { title: "Yuzni extrude qiling", body: "`3` (yuz rejimi) ni bosing, kubning yuqori yuzini tanlang va `E` bosib sichqonchani yuqoriga suring. Yangi “qavat” paydo bo'ladi." },
              { title: "Inset va chuqurcha", body: "Yuqori yuzni tanlab `I` bosing, ichki yuz hosil qiling. So'ng `E` bosib, pastga suring — quti yoki stakan shakli hosil bo'ladi." },
              { title: "Loop Cut qo'shing", body: "`Ctrl + R` bosib, sichqonchani kubning yon qirrasi ustiga olib boring, g'ildirak bilan kesimlar sonini tanlang va ikki marta chap tugmani bosing." },
              { title: "Qirralarni bevel qiling", body: "`2` (qirra rejimi), yuqori halqa qirralarini `Alt` + chap tugma bilan tanlang, `Ctrl + B` bosib suring va g'ildirak bilan 3 segment bering." },
            ],
            examples: [
              { title: "Stakan modeli", body: "Silindr qo'shing (`Shift + A` → Cylinder). Edit Mode'da yuqori yuzni o'chiring yoki inset qilib pastga extrude qiling — ichi bo'sh stakan hosil bo'ladi. Pastki va yuqori qirralarga kichik bevel bering. Object Mode'da o'ng tugma → **Shade Smooth** (yoki **Shade Auto Smooth**) bilan sirtni silliqlang." },
            ],
            mistakes: [
              { title: "Extrude'ni bekor qilib, geometriyani qoldirish", fix: "`E` dan keyin `Esc` bosish faqat siljitishni bekor qiladi — yangi nuqtalar joyida qoladi va ustma-ust tushadi. To'liq bekor qilish uchun `Ctrl + Z` bosing. Ustma-ust nuqtalarni tozalash: `M` → **By Distance**." },
              { title: "Qo'llanmagan masshtab bilan bevel", fix: "Bevel bir tomonda keng, boshqa tomonda tor chiqsa — Object Mode'da `Ctrl + A` → Scale qiling." },
              { title: "Hamma narsani bitta mesh'da qilish", fix: "Alohida qismlar (stol usti va oyoqlar) alohida obyekt bo'lgani ma'qul — keyin tahrirlash osonroq." },
            ],
            tips: [
              "Iloji boricha to'rtburchak (quad) yuzlar bilan ishlang — ular silliqlash va bevel bilan yaxshi ishlaydi.",
              "`Alt` + chap tugma — butun qirra halqasini (edge loop) tanlaydi.",
              "Model ichidagi nuqtalarni ko'rish uchun X-Ray rejimini yoqing (`Alt + Z`).",
            ],
            exercise: {
              title: "Kitob javoni",
              brief: "Bitta kubdan boshlab, uch qavatli kitob javoni modellashtiring.",
              tasks: [
                "Kubni javon o'lchamiga masshtablang va masshtabni qo'llang.",
                "Loop Cut bilan gorizontal ikki kesim qo'shing.",
                "Old yuzlarni inset qilib, ichkariga extrude qiling — uchta tokcha hosil bo'lsin.",
                "Tashqi qirralarga kichik bevel bering.",
              ],
              hint: "Uchala old yuzni birga tanlab, inset paytida `I` ni ikki marta bossangiz, har bir yuz alohida inset bo'ladi.",
            },
            summary: [
              "`Tab` — Edit Mode; `1/2/3` — nuqta/qirra/yuz rejimlari.",
              "`E` — extrude, `I` — inset, `Ctrl + R` — loop cut, `Ctrl + B` — bevel.",
              "Bevel realistik yorug'lik aksini beradi.",
              "Ustma-ust nuqtalarni `M` → By Distance bilan birlashtiring.",
            ],
            keyTerms: [
              { term: "Edit Mode", definition: "Mesh ichki tuzilmasini tahrirlash rejimi." },
              { term: "Extrude", definition: "Tanlangan qismdan yangi geometriya cho'zib chiqarish." },
              { term: "Edge loop", definition: "Mesh atrofidan aylanib chiquvchi qirralar halqasi." },
              { term: "Quad", definition: "To'rt qirrali yuz — modellashtirishda eng qulay yuz turi." },
            ],
          },
        },
        {
          slug: "material-va-yoritish",
          title: "Materiallar va yoritish",
          summary: "Principled BSDF, rang, g'adir-budurlik, metall va uch nuqtali yoritish.",
          durationMin: 20,
          interactive: [{ type: "lighting-lab", title: "Yoritish laboratoriyasi", description: "Tayyor sxemalarni almashtiring va har bir yorug'likning kuchi, burchagi va rangini o'zgartiring." }],
          content: {
            intro: "Bir xil model plastmassa, oltin yoki yog'ochdek ko'rinishi mumkin — bularni material belgilaydi. Kayfiyatni esa yorug'lik yaratadi.",
            concept:
              "**Material** — obyekt sirti yorug'lik bilan qanday o'zaro ta'sirlashishini tasvirlaydi. Blender'ning asosiy materiali — **Principled BSDF**. Uning muhim parametrlari:\n- **Base Color** — asosiy rang\n- **Roughness** (g'adir-budurlik) — 0 = oyna kabi silliq va yaltiroq, 1 = mat\n- **Metallic** — 0 = metall emas (plastik, yog'och), 1 = metall\n\nBlender'da yorug'lik turlari: **Point** (lampochka), **Sun** (quyosh — parallel nurlar), **Spot** (projektor), **Area** (yumshoq yorug'lik beruvchi panel).",
            why: "Yaxshi model yomon yorug'likda zerikarli ko'rinadi, oddiy model esa yaxshi yorug'likda ta'sirli bo'ladi. Fotografiya, kino va 3D'da ishlatiladigan **uch nuqtali yoritish** sxemasini bilish — professional natijaga eng tez yo'l.",
            how:
              "Render dvigateli kameradan chiqqan nurlarni kuzatadi: nur sirtga tushganda material qancha yorug'likni qaytarishini, qaysi yo'nalishda va qanday rangda sochishini hisoblaydi. Roughness past bo'lsa, aks aniq; yuqori bo'lsa — yoyilgan.\n\n**Uch nuqtali yoritish**:\n- **Asosiy (Key)** — eng kuchli, odatda 45° yon va yuqoridan; shaklni ochadi\n- **To'ldiruvchi (Fill)** — qarama-qarshi tomondan, kuchsizroq; soyalarni yumshatadi\n- **Orqa (Rim)** — obyekt orqasidan; uni fondan ajratuvchi yorug' kontur beradi\n\nYorug'lik rangi **Kelvin** haroratida o'lchanadi: ~3000 K — iliq sariq, ~5500 K — kunduzgi oq, ~8000 K — sovuq havorang.",
            steps: [
              { title: "Material qo'shing", body: "Obyektni tanlab, Properties'da qizil shar belgili **Material** tabiga o'ting va **New** bosing." },
              { title: "Rang va sirtni sozlang", body: "Base Color'ni tanlang. Plastmassa uchun Roughness ~0.4, Metallic 0; oltin uchun Base Color sarg'ish, Metallic 1, Roughness ~0.25." },
              { title: "Natijani ko'ring", body: "Viewport'ning yuqori o'ng burchagidagi sharlardan **Material Preview** yoki **Rendered** rejimini tanlang (`Z` menyusi orqali ham)." },
              { title: "Asosiy yorug'likni qo'ying", body: "`Shift + A` → Light → **Area**. Uni obyektdan yuqoriroq va 45° yonga joylashtiring, Power'ni sahna o'lchamiga qarab sozlang." },
              { title: "Fill va Rim qo'shing", body: "Qarama-qarshi tomonga kuchsizroq Area, obyekt orqasiga esa Rim yorug'lik joylashtiring. Yuqoridagi laboratoriyada sxemani avval sinab ko'ring." },
            ],
            examples: [
              { title: "Mahsulot surati yoritishi", body: "Smartfon modelini yumshoq studiya yorug'ligida ko'rsatish uchun ikki katta Area yorug'lik (key va fill) va orqada ingichka rim ishlatiladi. Ekran uchun Emission (o'z-o'zidan nur chiqaruvchi) material beriladi — u qorong'ida ham porlaydi." },
            ],
            mistakes: [
              { title: "Faqat bitta kuchli yorug'lik", fix: "Bitta yorug'lik qop-qora soyalar beradi. Kamida kuchsiz fill yorug'lik yoki fon yoritilishi (World) qo'shing." },
              { title: "Hamma narsani Metallic 1 qilish", fix: "Real dunyoda metall bo'lmagan materiallar ko'pchilikni tashkil qiladi. Metallic faqat haqiqiy metallar uchun." },
              { title: "Solid rejimda material qidirish", fix: "Solid ko'rinishda material ranglari to'liq ko'rinmaydi. Material Preview yoki Rendered rejimiga o'ting." },
            ],
            tips: [
              "Iliq asosiy va sovuq to'ldiruvchi yorug'lik — kinematografik ko'rinishning eng oddiy siri.",
              "Real buyumlarga qarab o'rganing: kofe krujkasi, telefon, yog'och stol — ular yorug'likni qanday aks ettiradi?",
              "Yorug'lik o'lchami (Size) soyalarning yumshoqligini belgilaydi: katta manba — yumshoq soya.",
            ],
            exercise: {
              title: "Uch xil material, uch xil kayfiyat",
              brief: "Bitta obyektni turli materiallar va yoritish sxemalari bilan ko'rsating.",
              tasks: [
                "Sfera yoki maymun boshiga (Monkey) uch xil material bering: mat plastik, yaltiroq qora, oltin.",
                "Laboratoriyadagi “Uch nuqtali” va “Drama” sxemalarini Blender'da qayta yarating.",
                "Har bir variantdan viewport skrinshoti oling va farqlarni qaydlaringizga yozing.",
              ],
            },
            summary: [
              "Principled BSDF: Base Color, Roughness, Metallic — asosiy parametrlar.",
              "Yorug'lik turlari: Point, Sun, Spot, Area.",
              "Uch nuqtali yoritish: key, fill, rim.",
              "Rang harorati Kelvinda: past — iliq, yuqori — sovuq.",
            ],
            keyTerms: [
              { term: "Principled BSDF", definition: "Blender'ning universal fizik asoslangan materiali." },
              { term: "Roughness", definition: "Sirtning g'adir-budurligi: aks qanchalik yoyilishini belgilaydi." },
              { term: "Key light", definition: "Sahnadagi asosiy, eng kuchli yorug'lik manbai." },
              { term: "Rim light", definition: "Obyekt konturini fondan ajratuvchi orqa yorug'lik." },
            ],
          },
        },
        {
          slug: "kamera-va-render",
          title: "Kamera va birinchi render",
          summary: "Kamerani joylashtirish, EEVEE va Cycles, render sozlamalari va saqlash.",
          durationMin: 18,
          content: {
            intro: "Sahna tayyor — endi uni dunyoga ko'rsatish vaqti. Bu darsda kamerani to'g'ri joylashtirib, birinchi yakuniy renderingizni olasiz.",
            concept:
              "**Kamera** — render qaysi nuqtadan va qaysi burchakda olinishini belgilovchi obyekt. Sahnada bir nechta kamera bo'lishi mumkin, lekin render **faol** kameradan olinadi.\n\nBlender'da ikki asosiy **render dvigateli** bor:\n- **EEVEE** — real vaqtli dvigatel: juda tez, tayyor ko'rinish soniyalarda; animatsiya va dizayn uchun qulay\n- **Cycles** — yorug'lik nurlarini fizik kuzatuvchi (path tracing) dvigatel: sekinroq, lekin yorug'lik va akslar ancha realistik",
            why: "Kamera burchagi kompozitsiyani belgilaydi: bir xil sahna noto'g'ri burchakdan zerikarli, to'g'ri burchakdan esa ta'sirli ko'rinadi. To'g'ri dvigatel va sozlamalarni tanlash esa vaqtni tejaydi: test uchun EEVEE, yakuniy portfolio surati uchun Cycles.",
            how:
              "Eng qulay usul — viewport'da sahnani kerakli burchakdan ko'rib turib, `Ctrl + Alt + Numpad 0` bosish: faol kamera shu ko'rinishga ko'chadi. Keyin `Numpad 0` da kamera ichidan qarab, N panelidagi **View → Lock Camera to View** ni yoqib, navigatsiya bilan aniq sozlash mumkin.\n\nRender sozlamalari **Properties**'dagi Render (kamera orqasi belgisi) va Output (printer belgisi) tablarida: dvigatel, sifat (Cycles'da **Samples** — namunalar soni), o'lcham (Resolution X/Y, masalan 1920×1080). `F12` — render boshlaydi; natija alohida oynada chiqadi va **Image → Save As** (`Shift + Alt + S`) bilan PNG sifatida saqlanadi.",
            steps: [
              { title: "Kamerani joylashtiring", body: "Sahnani chiroyli burchakdan ko'ring va `Ctrl + Alt + Numpad 0` bosing. Kamera ko'rinishidagi to'rtburchak — kadr chegarasi." },
              { title: "Kadrni aniq sozlang", body: "`N` → View → **Lock Camera to View** ni yoqing, navigatsiya bilan kadrni to'g'rilang va keyin o'chiring (aks holda keyin kamera tasodifan siljiydi)." },
              { title: "O'lchamni belgilang", body: "Output tabida Resolution: 1920 × 1080, 100%." },
              { title: "Dvigatelni tanlang", body: "Render tabida EEVEE yoki Cycles. Cycles uchun videokartangiz bo'lsa, Preferences → System'da uni yoqing va Render tabida Device: **GPU Compute** ni tanlang." },
              { title: "Render qiling va saqlang", body: "`F12` bosing. Tayyor bo'lgach, Image → Save As bilan PNG formatda saqlang." },
            ],
            examples: [
              { title: "Uchdan bir qoidasi", body: "Kamerani tanlab, Properties'dagi yashil kamera belgili **Object Data** tabida **Viewport Display → Composition Guides → Thirds** ni yoqing. Asosiy obyektni chiziqlar kesishgan nuqtalardan biriga joylashtirsangiz, kompozitsiya tabiiyroq va qiziqarliroq ko'rinadi." },
            ],
            mistakes: [
              { title: "Lock Camera to View'ni o'chirmaslik", fix: "Bu sozlama yoqiq qolsa, sahna atrofida aylanganingizda kamera ham siljiydi va kadr buziladi. Sozlab bo'lgach o'chiring." },
              { title: "Juda ko'p samples bilan test", fix: "Cycles'da test renderlarini past samples (64–128) va Denoise bilan oling; yuqori qiymatni faqat yakuniy render uchun qo'ying." },
              { title: "Render natijasini saqlamay yopish", fix: "Render oynasidagi rasm avtomatik saqlanmaydi. Yopishdan oldin `Shift + Alt + S` bosing." },
            ],
            tips: [
              "Kameraning **Focal Length** (fokus masofasi) ni o'zgartiring: 50 mm — tabiiy, 85–135 mm — mahsulot va portret uchun, 24 mm — keng manzara.",
              "Fonni ham o'ylang: oddiy egilgan tekislik (“cyclorama”) studiya fonini beradi va burchakni ko'rsatmaydi.",
              "Render vaqtini kamaytirish uchun avval o'lchamni 50% ga tushirib test qiling.",
            ],
            exercise: {
              title: "Birinchi portfolio renderi",
              brief: "Oldingi darslarda yaratgan modelingizdan yakuniy rasm tayyorlang.",
              tasks: [
                "Modelni fon (egilgan tekislik) ustiga joylashtiring.",
                "Uch nuqtali yoritishni sozlang.",
                "Kamerani uchdan bir qoidasi bo'yicha joylashtiring va fokus masofasini tanlang.",
                "Avval EEVEE, keyin Cycles'da render qilib, natijalarni solishtiring.",
                "Yakuniy renderni 1920×1080 PNG sifatida saqlang.",
              ],
            },
            summary: [
              "Render faol kameradan olinadi; `Ctrl + Alt + Numpad 0` — kamerani ko'rinishga moslash.",
              "EEVEE — tez, real vaqtli; Cycles — sekinroq, lekin fizik aniq.",
              "`F12` — render, `Shift + Alt + S` — natijani saqlash.",
              "Kompozitsiya va fokus masofasi kadr ta'sirini belgilaydi.",
            ],
            keyTerms: [
              { term: "EEVEE", definition: "Blender'ning real vaqtli render dvigateli." },
              { term: "Cycles", definition: "Nurlarni fizik kuzatuvchi (path tracing) render dvigateli." },
              { term: "Samples", definition: "Har bir piksel uchun hisoblanadigan nurlar soni: ko'proq — tozaroq, lekin sekinroq." },
              { term: "Focal length", definition: "Kamera obyektivining fokus masofasi — ko'rish burchagini belgilaydi." },
            ],
          },
        },
      ],
      quiz: {
        title: "2-modul testi: modellashtirish va render",
        description: "Edit Mode vositalari, materiallar, yoritish va render bo'yicha savollar.",
        questions: [
          { prompt: "Edit Mode'ga qaysi tugma bilan kiriladi?", options: ["E", "Tab", "Ctrl + E", "M"], correct: 1, explanation: "`Tab` Object Mode va Edit Mode o'rtasida almashtiradi." },
          { prompt: "Yuz ichida kichikroq yuz yaratuvchi vosita?", options: ["Extrude (E)", "Inset (I)", "Bevel (Ctrl + B)", "Loop Cut (Ctrl + R)"], correct: 1, explanation: "Inset yuz chegarasidan ichkariga yangi halqa yaratadi." },
          { prompt: "Principled BSDF'da sirtni oynadek silliq qilish uchun?", options: ["Roughness = 1", "Roughness = 0", "Metallic = 0", "Base Color = oq"], correct: 1, explanation: "Roughness qanchalik past bo'lsa, aks shunchalik aniq." },
          { prompt: "Uch nuqtali yoritishda obyektni fondan ajratuvchi yorug'lik?", options: ["Key", "Fill", "Rim", "Ambient"], correct: 2, explanation: "Rim (orqa) yorug'lik obyekt konturini yoritadi." },
          { prompt: "Render boshlash tugmasi?", options: ["F2", "F5", "F12", "Ctrl + R"], correct: 2, explanation: "`F12` joriy kadrni render qiladi." },
          { prompt: "Qaysi dvigatel tezroq, real vaqtli natija beradi?", options: ["Cycles", "EEVEE", "Workbench emas, Cycles", "Ikkalasi bir xil"], correct: 1, explanation: "EEVEE real vaqtli dvigatel; Cycles fizik aniqroq, lekin sekinroq." },
        ],
      },
    },
  ],
  finalQuiz: {
    title: "Yakuniy imtihon: Blender asoslari",
    description: "Kursni yakunlash va sertifikat olish uchun kamida 70% to'g'ri javob bering.",
    passingScore: 70,
    questions: [
      { prompt: "Mesh qaysi elementlardan iborat?", options: ["Piksellar va qatlamlar", "Nuqta, qirra va yuz", "Kamera va yorug'lik", "Material va tekstura"], correct: 1, explanation: "Mesh nuqta (vertex), qirra (edge) va yuz (face)dan quriladi." },
      { prompt: "Viewport'da sahna atrofida aylanish (orbit) uchun?", options: ["Chap tugmani bosib surish", "G'ildirakni bosib surish", "O'ng tugmani bosib surish", "Shift + chap tugma"], correct: 1, explanation: "Orbit — sichqonchaning o'rta tugmasi (g'ildirak) bilan." },
      { prompt: "`R Z 90` nima qiladi?", options: ["Z o'qi bo'ylab 90 m siljitadi", "Z o'qi atrofida 90° aylantiradi", "Z bo'yicha 90 marta kattalashtiradi", "90 ta nusxa yaratadi"], correct: 1, explanation: "`R` — aylantirish, `Z` — o'q, `90` — gradus." },
      { prompt: "Qirra halqasini qo'shuvchi vosita?", options: ["Ctrl + R", "Ctrl + B", "I", "E"], correct: 0, explanation: "Loop Cut — `Ctrl + R`." },
      { prompt: "Qirralarni qiyshaytirib, yumaloqroq qiluvchi vosita?", options: ["Extrude", "Bevel", "Inset", "Merge"], correct: 1, explanation: "Bevel — `Ctrl + B`." },
      { prompt: "Haqiqiy metall material uchun Metallic qiymati?", options: ["0", "0.5", "1", "Ahamiyatsiz"], correct: 2, explanation: "Metallar uchun Metallic = 1, metall bo'lmaganlar uchun 0." },
      { prompt: "Faol kamerani joriy ko'rinishga moslash yorlig'i?", options: ["Numpad 0", "Ctrl + Alt + Numpad 0", "Shift + C", "Ctrl + 0"], correct: 1, explanation: "`Ctrl + Alt + Numpad 0` kamerani viewport ko'rinishiga ko'chiradi." },
      { prompt: "Render natijasini saqlash yorlig'i?", options: ["Ctrl + S", "Shift + Alt + S", "F12", "Ctrl + E"], correct: 1, explanation: "Render oynasida Image → Save As — `Shift + Alt + S`." },
    ],
  },
};
