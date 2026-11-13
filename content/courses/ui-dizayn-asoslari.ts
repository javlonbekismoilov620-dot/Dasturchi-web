import type { CourseSeed } from "../../src/lib/types.ts";

export const uiDizaynAsoslari: CourseSeed = {
  slug: "ui-dizayn-asoslari",
  title: "UI dizayn asoslari va Figma",
  subtitle: "Chiroyli va qulay interfeyslarni loyihalashni o'rganing",
  description:
    "Yaxshi interfeys — nafaqat chiroyli, balki tushunarli va qulay bo'ladi. Bu kursda UI va UX farqini, dizayn jarayonini, tipografiya va rang bilan ishlash tamoyillarini, kirish imkoniyatini (accessibility) o'rganasiz, so'ng Figma'da freymlar, Auto Layout, komponentlar va interaktiv prototip yaratasiz.",
  category: "dizayn",
  level: 1,
  status: "published",
  featured: true,
  order: 5,
  accent: "teal",
  icon: "PenTool",
  objectives: [
    "UI va UX farqini hamda dizayn jarayonini tushunish",
    "Tipografik ierarxiya va o'qiladigan matn yaratish",
    "Rang palitrasini tanlash va kontrastni WCAG talablariga moslash",
    "Figma'da freym, shakl, matn va tarmoq bilan ishlash",
    "Auto Layout va komponentlar bilan moslashuvchan dizayn yaratish",
    "Interaktiv prototip yaratib, dizaynni dasturchiga topshirish",
  ],
  skills: ["UI dizayn", "UX asoslari", "Tipografiya", "Rang nazariyasi", "Accessibility", "Figma", "Auto Layout", "Komponentlar", "Prototiplash"],
  requirements: ["Kompyuter va zamonaviy brauzer", "Bepul Figma hisobi", "Chizish yoki dizayn tajribasi talab qilinmaydi"],
  audience: ["UI/UX dizaynerlikni boshlamoqchi bo'lganlar", "Interfeys sifatini oshirmoqchi bo'lgan dasturchilar", "O'z mahsuloti uchun dizayn qilmoqchi bo'lgan tadbirkorlar"],
  software: ["Figma", "Brauzer"],
  tags: ["ui", "ux", "figma", "dizayn", "tipografiya", "rang"],
  estimatedHours: 8,
  finalProject: {
    title: "Kofe buyurtma ilovasi prototipi",
    description:
      "Mahalliy kofexona uchun mobil ilovaning uchta ekranini (menyu, mahsulot sahifasi, savatcha) Figma'da loyihalang va ularni interaktiv prototip bilan bog'lang.",
    deliverables: [
      "Matn uslublari va rang palitrasidan iborat kichik dizayn tizimi",
      "Auto Layout asosidagi tugma, kartochka va navigatsiya komponentlari",
      "Uchta mobil ekran (390 px kenglikda)",
      "Barcha matnlar uchun WCAG AA kontrastiga muvofiqlik",
      "Ekranlar orasida bosish orqali o'tadigan prototip",
    ],
  },
  modules: [
    {
      title: "Dizayn tamoyillari",
      description: "UI va UX, tipografiya, rang va kontrast — har qanday interfeysning poydevori.",
      lessons: [
        {
          slug: "ui-va-ux",
          title: "UI va UX: farqi va dizayner vazifasi",
          summary: "Interfeys va tajriba, dizayn jarayoni va yaxshi dizayn mezonlari.",
          durationMin: 14,
          isPreview: true,
          content: {
            intro: "Bank ilovasida pul o'tkazish tugmasini topa olmay qiynalganmisiz? Yoki aksincha — biror ilovadan foydalanish shunchalik oson ediki, hatto o'ylamadingizmi? Bu farqni dizaynerlar yaratadi.",
            concept:
              "**UI** (User Interface — foydalanuvchi interfeysi) — mahsulotning ko'rinadigan qismi: tugmalar, ranglar, shriftlar, ikonkalar, joylashuv.\n\n**UX** (User Experience — foydalanuvchi tajribasi) — mahsulotdan foydalanishdagi umumiy his: maqsadga qanchalik tez va oson yetish, qayerda adashish, nimadan zavqlanish.\n\nOddiy o'xshatish: UI — eshik tutqichining shakli va rangi, UX — eshikni ochish qanchalik tabiiy ekani. Chiroyli, lekin qayerdan ushlashni bilmaydigan tutqich — yaxshi UI, yomon UX.",
            why: "Har bir raqamli mahsulot — sayt, ilova, terminal — dizayn qilingan bo'lishi kerak. Yaxshi dizayn sotuvlarni oshiradi, foydalanuvchi xatolarini va qo'llab-quvvatlash xizmati xarajatlarini kamaytiradi. UI/UX dizayner — O'zbekistonda ham, xalqaro frilans bozorida ham talab yuqori bo'lgan kasb.",
            how:
              "Professional dizayn jarayoni odatda quyidagi bosqichlardan iborat:\n\n1. **Tadqiqot** — foydalanuvchilar kim, ularning muammosi nima\n2. **Tuzilma** — qanday sahifalar va qadamlar kerak (foydalanuvchi oqimi)\n3. **Wireframe** — rangsiz, sxematik eskiz: nima qayerda joylashadi\n4. **Vizual dizayn** — tipografiya, rang, ikonkalar, rasmlar\n5. **Prototip** — bosiladigan interaktiv model\n6. **Test** — real odamlar bilan sinash va yaxshilash\n\nBu bosqichlar bir marta emas, takroriy (iterativ) bajariladi: testdan keyin dizayn yaxshilanadi va yana sinaladi.",
            steps: [
              { title: "Foydalanuvchini aniqlang", body: "Kim uchun dizayn qilyapsiz? Masalan: “Toshkentda yashovchi, ishga shoshayotgan, kofeni oldindan buyurtma qilmoqchi bo'lgan 20–35 yoshli xodim”." },
              { title: "Asosiy vazifani belgilang", body: "Foydalanuvchi ilovada eng ko'p nima qiladi? Kofe ilovasida — 3 bosishda buyurtma berish." },
              { title: "Oqimni chizing", body: "Qog'ozda ekranlar ketma-ketligini chizing: Menyu → Mahsulot → Savatcha → To'lov → Tasdiq." },
              { title: "Wireframe tayyorlang", body: "Har bir ekranni to'rtburchak va chiziqlar bilan sxematik chizing — rang va shrift hali kerak emas." },
            ],
            examples: [
              { title: "Yaxshi UX belgilari", body: "Taksi ilovasida manzil maydoni darhol fokusda, so'nggi manzillar ro'yxati ostida, narx buyurtmadan oldin ko'rinadi. Foydalanuvchi o'ylamaydi — ilova uning o'rniga o'ylagan." },
            ],
            mistakes: [
              { title: "O'zi uchun dizayn qilish", fix: "Dizayner — foydalanuvchi emas. Qaror “menga yoqadi” asosida emas, real foydalanuvchilar ehtiyoji asosida qabul qilinadi." },
              { title: "Darhol ranglar bilan boshlash", fix: "Tuzilma aniq bo'lmasdan vizual dizaynga o'tsangiz, keyin hammasini qayta qilishga to'g'ri keladi. Avval wireframe." },
              { title: "Test qilmaslik", fix: "Hatto 3–5 kishi bilan qilingan oddiy test eng katta muammolarni ochib beradi." },
            ],
            tips: [
              "Har kuni ishlatadigan ilovalaringizni tanqidiy ko'z bilan kuzating: nima qulay, nima noqulay va nima uchun?",
              "Dribbble va Behance'dagi chiroyli ishlar ilhom uchun yaxshi, lekin real mahsulotlarning (bank, taksi, do'kon) interfeyslarini o'rganish ko'proq foyda beradi.",
              "Har bir dizayn qaroringizni bir gap bilan tushuntira oling.",
            ],
            exercise: {
              title: "Ilova tahlili",
              brief: "Telefoningizdagi ikki ilovani UI va UX nuqtai nazaridan solishtiring.",
              tasks: [
                "Bir xil vazifani bajaruvchi ikki ilovani tanlang (masalan, ikki bank ilovasi).",
                "Har birida bir xil amalni (pul o'tkazish) bajaring va bosishlar sonini sanang.",
                "Har biri uchun 3 ta UI va 3 ta UX kuzatuvingizni yozing.",
                "Qaysi biri qulayroq va nima uchun — xulosa qiling.",
              ],
            },
            summary: [
              "UI — ko'rinish, UX — foydalanish tajribasi.",
              "Jarayon: tadqiqot → tuzilma → wireframe → vizual → prototip → test.",
              "Dizayn takroriy jarayon: test va yaxshilash davom etadi.",
              "Qarorlar foydalanuvchi ehtiyojiga asoslanadi.",
            ],
            keyTerms: [
              { term: "UI", definition: "Foydalanuvchi interfeysi — mahsulotning vizual qismi." },
              { term: "UX", definition: "Foydalanuvchi tajribasi — mahsulotdan foydalanishning umumiy sifati." },
              { term: "Wireframe", definition: "Interfeysning rangsiz, sxematik eskizi." },
              { term: "Prototip", definition: "Bosish mumkin bo'lgan interaktiv dizayn modeli." },
            ],
          },
        },
        {
          slug: "tipografiya",
          title: "Tipografiya",
          summary: "Shrift turlari, ierarxiya, masshtab, qator balandligi va uzunligi.",
          durationMin: 18,
          interactive: [{ type: "typography", title: "Tipografiya o'yingohi", description: "Masshtab nisbati, qator balandligi va shriftni o'zgartirib, ierarxiya qanday o'zgarishini kuzating." }],
          content: {
            intro: "Interfeysning 90% ga yaqini — matn. Shuning uchun tipografiya UI dizaynning eng muhim ko'nikmasi hisoblanadi.",
            concept:
              "**Tipografiya** — matnni o'qilishi oson va chiroyli qilib joylashtirish san'ati. Asosiy tushunchalar:\n\n- **Shrift oilalari**: *serif* (harf uchlarida kichik “oyoqchalar” bor — an'anaviy, jiddiy), *sans-serif* (oyoqchalarsiz — zamonaviy, ekranda aniq), *monospace* (barcha harflar bir xil kenglikda — kod uchun)\n- **Ierarxiya** — muhimlik darajasini o'lcham, qalinlik va rang orqali ko'rsatish\n- **Tipografik masshtab** — o'lchamlarni bitta nisbat asosida tanlash (masalan, har bir daraja oldingisidan 1.25 marta katta)\n- **Qator balandligi** (line height) va **qator uzunligi** (bir qatordagi belgilar soni)",
            why: "Tartibsiz o'lchamlar va siqiq matn interfeysni arzon va charchatuvchi qiladi. Aniq ierarxiya esa foydalanuvchiga sahifani bir qarashda “o'qish” imkonini beradi: sarlavha qayerda, asosiy harakat qayerda, qo'shimcha ma'lumot qayerda.",
            how:
              "Ko'z birinchi navbatda eng katta va eng kontrastli elementga tushadi. Shuning uchun ierarxiya bir nechta vosita bilan yaratiladi: **o'lcham**, **qalinlik** (weight), **rang** (asosiy matn — to'q, ikkinchi darajali — kulrangroq) va **bo'shliq**.\n\nAmaliy qoidalar:\n- Asosiy matn ekranda 16 px dan kichik bo'lmasin\n- Uzun matn uchun qator balandligi ~1.5–1.7, katta sarlavhalar uchun ~1.1–1.2\n- Qator uzunligi ~45–75 belgi — juda uzun qatorlarda ko'z keyingi qatorni yo'qotadi\n- Bitta interfeysda 1–2 shrift oilasi yetarli\n- Katta sarlavhalarda harflar oralig'ini biroz kamaytirish (−1…−2%) ularni yig'iqroq ko'rsatadi",
            steps: [
              { title: "Asosiy o'lchamni tanlang", body: "Mobil va veb uchun odatda 16 px." },
              { title: "Masshtab nisbatini tanlang", body: "Interfeyslar uchun 1.2–1.25, ifodali sarlavhalar uchun 1.333+. Yuqoridagi o'yingohda turli nisbatlarni solishtiring." },
              { title: "Matn uslublarini yarating", body: "H1, H2, H3, asosiy matn, izoh — 5–6 ta uslub yetarli. Har biri uchun o'lcham, qalinlik va qator balandligini belgilang." },
              { title: "Kontrast va rang bilan ierarxiya", body: "Ikkinchi darajali matnni kichraytirish o'rniga kulrangroq qiling — o'qilishi saqlanadi." },
            ],
            examples: [
              { title: "Mahsulot kartochkasi", body: "Nomi — 18 px, qalin (600); tavsif — 14 px, oddiy (400), kulrang; narx — 20 px, qalin, asosiy rangda. Uchta element — uchta aniq daraja, ko'z avval nom va narxni ko'radi." },
            ],
            mistakes: [
              { title: "Juda ko'p shrift", fix: "3–4 xil shrift tartibsizlik beradi. Bitta oila va uning turli qalinliklari ko'pincha yetarli." },
              { title: "Hamma narsa qalin", fix: "Agar hamma narsa ajratilgan bo'lsa, hech narsa ajralib turmaydi. Qalinlikni faqat muhim joylar uchun saqlang." },
              { title: "Markazga tekislangan uzun matn", fix: "Markazlash qisqa sarlavhalar uchun; uzun matn chapga tekislanadi — aks holda ko'z har qator boshini qidiradi." },
            ],
            tips: [
              "O'zbek tilidagi matn uchun shrift tanlaganda “o‘”, “g‘” va tutuq belgisi (’) to'g'ri ko'rinishini tekshiring.",
              "Google Fonts'dagi Inter, Geist, Manrope kabi shriftlar interfeyslar uchun yaxshi tanlov.",
              "Shriftlarni ekranda emas, haqiqiy matn bilan sinab ko'ring — “Lorem ipsum” yolg'on taassurot beradi.",
            ],
            exercise: {
              title: "Matn uslublari tizimi",
              brief: "Kichik loyiha uchun tipografik tizim yarating.",
              tasks: [
                "O'yingohda asosiy o'lcham va nisbatni tanlab, H1–H4 va matn o'lchamlarini yozib oling.",
                "Figma'da (yoki qog'ozda) shu uslublar bilan yangiliklar sahifasi namunasini tuzing.",
                "Asosiy matn qator uzunligi 75 belgidan oshmasligini tekshiring.",
                "Nima uchun aynan shu shrift va nisbatni tanlaganingizni ikki gapda yozing.",
              ],
            },
            summary: [
              "Serif, sans-serif va monospace — asosiy shrift oilalari.",
              "Ierarxiya o'lcham, qalinlik, rang va bo'shliq bilan yaratiladi.",
              "Masshtab nisbati o'lchamlarni uyg'un qiladi.",
              "Qator balandligi ~1.5 va uzunligi 45–75 belgi — o'qish uchun qulay.",
            ],
            keyTerms: [
              { term: "Serif", definition: "Harf uchlarida kichik “oyoqchalari” bo'lgan shrift turi." },
              { term: "Ierarxiya", definition: "Elementlarning muhimlik darajasini vizual ko'rsatish." },
              { term: "Line height", definition: "Qatorlar orasidagi vertikal masofa." },
              { term: "Tracking", definition: "Harflar orasidagi umumiy masofa." },
            ],
          },
        },
        {
          slug: "rang-va-kontrast",
          title: "Rang va kontrast",
          summary: "Rang rollari, 60-30-10 qoidasi, HSL va WCAG kontrast talablari.",
          durationMin: 18,
          interactive: [{ type: "contrast", title: "Kontrast tekshirgich", description: "Matn va fon rangini o'zgartiring — WCAG talablariga mosligi darhol hisoblanadi." }],
          content: {
            intro: "Rang — eng kuchli, lekin eng ko'p xato qilinadigan dizayn vositasi. Bu darsda ranglarni tasodifiy emas, tizimli tanlashni o'rganasiz.",
            concept:
              "Interfeysda har bir rang **rol** bajaradi:\n- **Asosiy (primary)** rang — brend va asosiy harakatlar (tugmalar, havolalar)\n- **Neytral** ranglar — fon, matn, chegaralar (kulranglar)\n- **Semantik** ranglar — holat: yashil (muvaffaqiyat), qizil (xato), sariq (ogohlantirish)\n\n**Kontrast** — matn va fon yorug'ligi o'rtasidagi farq. **WCAG** (veb kirish imkoniyati xalqaro tavsiyalari) bo'yicha oddiy matn uchun kontrast kamida **4.5 : 1**, katta matn (24 px yoki 18.66 px qalin) uchun kamida **3 : 1** bo'lishi kerak.",
            why: "Har o'n kishidan biri ko'rishda qandaydir muammoga ega bo'lishi mumkin; quyosh ostida telefon ekranidan esa hamma qiynaladi. Past kontrastli “chiroyli” kulrang matn ko'pchilik uchun o'qilmaydi. Rang rollari esa interfeysni bashorat qilinadigan qiladi: foydalanuvchi asosiy rangni ko'rsa — bu bosiladigan narsa ekanini biladi.",
            how:
              "Rangni **HSL** modelida o'ylash qulay: **Hue** (ton — qaysi rang), **Saturation** (to'yinganlik — qanchalik yorqin), **Lightness** (yorug'lik — qanchalik och yoki to'q). Bir xil tonda yorug'likni o'zgartirib, asosiy rangdan butun palitra (50 dan 900 gacha) yaratiladi.\n\n**60-30-10 qoidasi**: 60% — dominant neytral fon, 30% — ikkinchi darajali rang (kartochkalar, panellar), 10% — urg'u (accent) rangi faqat eng muhim elementlar uchun.\n\nKontrast nisbati ranglarning **nisbiy yorug'ligi** (relative luminance) asosida hisoblanadi: 1 : 1 — bir xil rang, 21 : 1 — qora va oq. Yuqoridagi tekshirgich aynan WCAG formulasi bilan ishlaydi.",
            steps: [
              { title: "Asosiy rangni tanlang", body: "Brend yoki mahsulot xarakteriga mos bitta rang: ishonch uchun ko'k, tabiat va salomatlik uchun yashil, energiya uchun to'q sariq." },
              { title: "Neytrallarni yarating", body: "Oq/qora o'rniga ozgina asosiy rang qo'shilgan kulranglar palitrasini tuzing — interfeys yaxlitroq ko'rinadi." },
              { title: "Semantik ranglarni qo'shing", body: "Muvaffaqiyat, xato va ogohlantirish uchun ranglar." },
              { title: "Kontrastni tekshiring", body: "Har bir matn/fon juftligini tekshirgichda sinang: oddiy matn ≥ 4.5 : 1." },
              { title: "Faqat rangga tayanmang", body: "Xatoni faqat qizil rang bilan emas, ikonka va matn bilan ham ko'rsating — rang ajrata olmaydigan foydalanuvchilar uchun." },
            ],
            examples: [
              { title: "Tugma holatlari", body: "Asosiy tugma: fon — asosiy rang, matn — oq (kontrast ≥ 4.5 : 1). Hover: fon 10% to'qroq. O'chirilgan (disabled): shaffofligi kamaytirilgan va kursor o'zgaradi. Har bir holat aniq farqlanadi." },
            ],
            mistakes: [
              { title: "Och kulrang fonda och kulrang matn", fix: "Masalan, #9CA3AF matn oq fonda ~2.5 : 1 beradi — yetarli emas. To'qroq kulrang (#4B5563 va undan to'q) tanlang." },
              { title: "Juda ko'p yorqin rang", fix: "Har bir element o'z rangida bo'lsa, ko'z qayerga qarashni bilmaydi. Urg'u rangi interfeysning taxminan 10% ida bo'lsin." },
              { title: "Faqat rang bilan ma'lumot berish", fix: "Grafikdagi chiziqlarni faqat rang bilan farqlash yetarli emas — belgi, naqsh yoki yozuv qo'shing." },
            ],
            tips: [
              "Qorong'i mavzuda sof qora (#000) o'rniga juda to'q kulrang ishlating — ko'zni kamroq charchatadi.",
              "Ranglarni dizayn tizimida nom bilan saqlang (Primary/500, Neutral/100) — HEX kodlarni har safar qo'lda yozmang.",
              "Palitrani real kontekstda — tugma, kartochka, xabarda — sinab ko'ring.",
            ],
            exercise: {
              title: "Kofexona uchun palitra",
              brief: "Yakuniy loyiha uchun rang tizimini yarating.",
              tasks: [
                "Bitta asosiy rang tanlang va undan 5 ta och-to'q variant yarating.",
                "Neytral kulranglar palitrasini (fon, chegara, ikkinchi darajali matn, asosiy matn) tuzing.",
                "Muvaffaqiyat va xato ranglarini qo'shing.",
                "Barcha matn/fon juftliklarini tekshirgichda sinab, natijalarni jadvalga yozing.",
              ],
            },
            summary: [
              "Ranglar rol bajaradi: asosiy, neytral, semantik.",
              "60-30-10 — muvozanatli taqsimot qoidasi.",
              "WCAG: oddiy matn ≥ 4.5 : 1, katta matn ≥ 3 : 1.",
              "Ma'lumotni faqat rang orqali bermang.",
            ],
            keyTerms: [
              { term: "HSL", definition: "Ton, to'yinganlik va yorug'likka asoslangan rang modeli." },
              { term: "Kontrast nisbati", definition: "Ikki rang yorug'ligi o'rtasidagi nisbat (1:1 dan 21:1 gacha)." },
              { term: "WCAG", definition: "Veb-kontent kirish imkoniyati bo'yicha xalqaro tavsiyalar." },
              { term: "Accent rang", definition: "Eng muhim elementlarni ajratuvchi urg'u rangi." },
            ],
          },
        },
      ],
      quiz: {
        title: "1-modul testi: dizayn tamoyillari",
        description: "UI/UX, tipografiya va rang bo'yicha savollar.",
        questions: [
          { prompt: "Mahsulotdan foydalanishning umumiy qulayligi va hissi qaysi tushuncha?", options: ["UI", "UX", "Wireframe", "Prototip"], correct: 1, explanation: "UX — foydalanuvchi tajribasi." },
          { prompt: "Rangsiz, sxematik interfeys eskizi nima deyiladi?", options: ["Mockup", "Wireframe", "Moodboard", "Logotip"], correct: 1, explanation: "Wireframe tuzilmani rang va bezaksiz ko'rsatadi." },
          { prompt: "Uzun matn uchun tavsiya etilgan qator uzunligi?", options: ["10–20 belgi", "45–75 belgi", "120–150 belgi", "Cheksiz"], correct: 1, explanation: "45–75 belgi qulay o'qish uchun eng maqbul." },
          { prompt: "WCAG bo'yicha oddiy matn uchun minimal kontrast?", options: ["2 : 1", "3 : 1", "4.5 : 1", "10 : 1"], correct: 2, explanation: "AA darajasida oddiy matn uchun 4.5 : 1." },
          { prompt: "60-30-10 qoidasida 10% qaysi rangga to'g'ri keladi?", options: ["Fon", "Ikkinchi darajali", "Urg'u (accent)", "Matn"], correct: 2, explanation: "Urg'u rangi eng kam, lekin eng muhim joylarda ishlatiladi." },
          { prompt: "Harf uchlarida “oyoqchalar” bo'lgan shrift turi?", options: ["Sans-serif", "Serif", "Monospace", "Script"], correct: 1, explanation: "Serif shriftlarda harf uchlarida kichik chiziqchalar bor." },
        ],
      },
    },
    {
      title: "Figma bilan ishlash",
      description: "Freymlar, Auto Layout, komponentlar va interaktiv prototip.",
      lessons: [
        {
          slug: "figma-interfeysi",
          title: "Figma interfeysi va freymlar",
          summary: "Fayl, freym, shakl, matn, qatlamlar va 8 pt tarmoq.",
          durationMin: 18,
          interactive: [{ type: "box-model", title: "Bo'shliqlar mantiqi", description: "Figma'dagi padding va bo'shliqlar CSS box model bilan bir xil mantiqda ishlaydi — slayderlar bilan sinab ko'ring." }],
          content: {
            intro: "Figma — dunyodagi eng mashhur interfeys dizayn vositasi. U brauzerda ishlaydi, bepul rejaga ega va jamoa bilan bir vaqtda ishlash imkonini beradi.",
            concept:
              "**Figma** — vektor asosidagi, bulutli dizayn vositasi. Asosiy tushunchalar:\n\n- **Fayl** — loyiha; ichida bir nechta **sahifa** (page) bo'lishi mumkin\n- **Freym** (Frame, `F` yoki `A`) — ekran yoki konteyner: telefon ekrani, kartochka, tugma\n- **Shakllar** — to'rtburchak (`R`), ellips (`O`), chiziq (`L`)\n- **Matn** (`T`)\n- **Qatlamlar paneli** (chapda) — barcha elementlar ierarxiyasi\n- **Xususiyatlar paneli** (o'ngda) — tanlangan elementning o'lchami, rangi, effektlari\n\nFreym oddiy guruhdan farqli ravishda o'z o'lchamiga, fon rangiga, tarmog'iga va keyinchalik Auto Layout'ga ega bo'ladi.",
            why: "Figma — dizayn jamoalari, dasturchilar va menejerlar uchun umumiy “ish stoli”. Dizaynni havola orqali ulashish, izoh qoldirish va dasturchi uchun o'lchamlarni ko'rish — hammasi bitta joyda. Ish e'lonlarida Figma bilish deyarli har doim talab qilinadi.",
            how:
              "Figma'da hamma narsa **ierarxiya** asosida quriladi: freym ichida freymlar, ular ichida shakl va matnlar. Element freym ichiga sudrab qo'yilsa, uning “farzandi”ga aylanadi va freym bilan birga harakatlanadi.\n\n**8 pt tarmoq** tizimi — barcha o'lcham va bo'shliqlarni 8 ga karrali qiymatlarda (8, 16, 24, 32, 48…) tanlash. Kichik joylarda 4 ishlatiladi. Bu dizaynni yaxlit qiladi va dasturchiga o'tkazishni osonlashtiradi. Freymga **Layout grid** qo'shib, ustunli tarmoq ham yaratish mumkin (masalan, mobil uchun 4 ustun, 16 px chekka).",
            steps: [
              { title: "Hisob yarating va fayl oching", body: "figma.com saytida bepul ro'yxatdan o'ting. **New design file** ni bosing." },
              { title: "Mobil freym yarating", body: "`F` bosing va o'ng paneldan tayyor o'lchamni tanlang (masalan, iPhone — 390×844)." },
              { title: "Elementlar qo'shing", body: "`R` bilan to'rtburchak, `T` bilan matn qo'shing. Ularni freym ichiga joylashtiring." },
              { title: "Xususiyatlarni sozlang", body: "O'ng panelda o'lcham (W, H), burchak radiusi, to'ldirish (Fill) va chegarani (Stroke) o'zgartiring." },
              { title: "Tarmoq qo'shing", body: "Freymni tanlab, o'ng panelda **Layout grid** → `+` → Columns: 4, Margin: 16, Gutter: 16." },
            ],
            examples: [
              { title: "Profil kartochkasi", body: "Freym (343×120, radius 16, oq fon) → ichida avatar ellipsi (56×56), ism matni (16 px, 600), lavozim (14 px, kulrang) va o'ngda tugma. Barcha bo'shliqlar 16 yoki 8 px. Elementlar qatlamlar panelida ma'noli nomlangan: “Card/Profile”." },
            ],
            mistakes: [
              { title: "Qatlamlarni nomlamaslik", fix: "“Rectangle 47”, “Frame 112” kabi nomlar jamoaviy ishni qiyinlashtiradi. Qatlamni ikki marta bosib, aniq nom bering." },
              { title: "Tasodifiy o'lchamlar", fix: "13, 17, 22 px kabi bo'shliqlar betartiblik beradi. 8 pt tizimiga amal qiling." },
              { title: "Guruh va freymni adashtirish", fix: "Konteyner kerak bo'lsa — freym (`Ctrl + Alt + G`), shunchaki birga harakatlantirish kerak bo'lsa — guruh (`Ctrl + G`)." },
            ],
            tips: [
              "`Alt` ni bosib turib sichqonchani elementlar ustiga olib borsangiz, ular orasidagi masofani ko'rasiz.",
              "`Shift + 2` — tanlangan elementga yaqinlashtirish, `Shift + 1` — hammasini ko'rish.",
              "Figma Community'da bepul UI kitlar bor — ularning tuzilmasini o'rganish juda foydali.",
            ],
            exercise: {
              title: "Birinchi ekran",
              brief: "Kofexona ilovasining bosh ekranini wireframe sifatida yarating.",
              tasks: [
                "390×844 o'lchamli freym yarating va 4 ustunli tarmoq qo'shing.",
                "Sarlavha, qidiruv maydoni, toifalar qatori va 4 ta mahsulot kartochkasini joylashtiring.",
                "Barcha bo'shliqlar 8 ga karrali bo'lsin.",
                "Barcha qatlamlarga ma'noli nom bering.",
              ],
            },
            summary: [
              "Figma — bulutli, vektor asosidagi interfeys dizayn vositasi.",
              "Freym — ekran va konteyner; ichma-ich ierarxiya quriladi.",
              "Asosiy yorliqlar: `F` freym, `R` to'rtburchak, `T` matn.",
              "8 pt tizimi va layout grid dizaynni yaxlit qiladi.",
            ],
            keyTerms: [
              { term: "Frame", definition: "Figma'dagi konteyner yoki ekran." },
              { term: "Layout grid", definition: "Freym ichidagi ustunli yoki qatorli yo'naltiruvchi tarmoq." },
              { term: "8 pt tizimi", definition: "O'lcham va bo'shliqlarni 8 ga karrali qilish qoidasi." },
            ],
          },
        },
        {
          slug: "auto-layout-komponentlar",
          title: "Auto Layout va komponentlar",
          summary: "Moslashuvchan tugma va kartochkalar, komponent va variantlar.",
          durationMin: 20,
          content: {
            intro: "Tugma matnini o'zgartirsangiz, tugma o'zi kengaysa; 20 ta kartochkadagi rangni bir joyda o'zgartirsangiz, hammasi yangilansa — Auto Layout va komponentlar aynan shuni beradi.",
            concept:
              "**Auto Layout** — freym ichidagi elementlarni avtomatik joylashtiruvchi tizim (CSS Flexbox'ning Figma'dagi ekvivalenti). Unda yo'nalish (gorizontal/vertikal), elementlar orasidagi **bo'shliq** (gap), ichki **padding** va tekislash belgilanadi.\n\nO'lcham rejimlari: **Hug contents** — kontentga qarab o'sadi, **Fill container** — bo'sh joyni egallaydi, **Fixed** — qat'iy o'lcham.\n\n**Komponent** — qayta ishlatiladigan element (asl nusxa). Uning nusxalari **instance** deyiladi: asl komponent o'zgarsa, barcha nusxalar yangilanadi. **Variant** — bitta komponentning turli holatlari (masalan, tugma: asosiy/ikkinchi darajali, oddiy/hover/disabled).",
            why: "Real loyihalarda yuzlab ekran va minglab element bo'ladi. Komponentlarsiz bitta tugma uslubini o'zgartirish soatlab qo'lda ishni talab qiladi. Auto Layout esa dizaynni “tirik” qiladi va dasturchilarning Flexbox'iga to'g'ridan-to'g'ri mos keladi — dizayn va kod orasidagi farq kamayadi.",
            how:
              "Elementlarni tanlab `Shift + A` bossangiz, ular Auto Layout freymga o'raladi. O'ng panelda yo'nalish strelkalari, gap qiymati va padding maydonlari paydo bo'ladi. Element o'lchamini “Hug” qilsangiz, matn uzaygan sari tugma ham kengayadi.\n\nKomponent yaratish: elementni tanlab `Ctrl + Alt + K` (macOS'da `Cmd + Option + K`). Komponent qatlamlar panelida binafsha rombcha belgisi bilan ko'rinadi. **Assets** panelidan nusxalarni sudrab qo'yasiz. Nusxada matn yoki rangni o'zgartirish mumkin (override), lekin tuzilma asl komponentdan keladi. Variantlar uchun komponentni tanlab, o'ng panelda **Add variant** bosiladi va xususiyatlar (State = Default/Hover) nomlanadi.",
            steps: [
              { title: "Tugma yarating", body: "Matn yozing (`T`), uni tanlab `Shift + A` bosing. Padding: gorizontal 20, vertikal 12; burchak radiusi 10; fon — asosiy rang." },
              { title: "Hug'ni tekshiring", body: "Matnni “Buyurtma berish” deb uzaytiring — tugma avtomatik kengayadi." },
              { title: "Komponentga aylantiring", body: "Tugmani tanlab, `Ctrl + Alt + K`. Nomini “Button” qiling." },
              { title: "Variantlar qo'shing", body: "Add variant: State=Default, State=Hover (fon to'qroq), State=Disabled (shaffofroq)." },
              { title: "Kartochka quring", body: "Rasm, nom, narx va tugmani vertikal Auto Layout'ga o'rang (gap 8, padding 16). Kartochkani ham komponent qiling." },
            ],
            examples: [
              { title: "Mahsulotlar ro'yxati", body: "Kartochka komponentining 6 ta nusxasini gorizontal Auto Layout'ga joylashtirib, **Wrap** rejimini yoqsangiz, ekran kengligiga qarab ular qatorlarga taqsimlanadi — xuddi CSS'dagi `flex-wrap` kabi." },
            ],
            mistakes: [
              { title: "Nusxani komponentdan ajratish (detach)", fix: "“Detach instance” bog'lanishni uzadi va keyingi yangilanishlar kelmaydi. Faqat zarurat bo'lsa ishlating." },
              { title: "Qat'iy o'lchamli matn", fix: "Matn maydoni Fixed bo'lsa, uzun so'z kesilib qoladi. Auto Layout ichida matnni “Hug” yoki “Fill” qiling." },
              { title: "Bo'shliqlarni qo'lda berish", fix: "Elementlar orasiga “bo'sh to'rtburchak” qo'yish o'rniga Auto Layout gap qiymatini ishlating." },
            ],
            tips: [
              "Komponentlarni alohida “Components” sahifasida saqlang — bu sizning kichik dizayn tizimingiz.",
              "Rang va matn uslublarini **Styles** yoki **Variables** sifatida saqlang va komponentlarda ulardan foydalaning.",
              "Komponent nomida “/” ishlatsangiz, Assets panelida papkalarga ajraladi: `Button/Primary`, `Button/Secondary`.",
            ],
            exercise: {
              title: "Kichik komponentlar kutubxonasi",
              brief: "Yakuniy loyiha uchun asosiy komponentlarni yarating.",
              tasks: [
                "Uch holatli (Default, Hover, Disabled) tugma komponentini yarating.",
                "Rasm, nom, narx va tugmali mahsulot kartochkasi komponentini Auto Layout bilan yarating.",
                "Pastki navigatsiya paneli (4 ta ikonka va yozuv) komponentini yarating.",
                "Komponentlarni “Components” sahifasiga joylashtiring va nomlarini tartiblang.",
              ],
            },
            summary: [
              "Auto Layout (`Shift + A`) — Figma'dagi Flexbox: yo'nalish, gap, padding.",
              "Hug, Fill, Fixed — o'lcham rejimlari.",
              "Komponent (`Ctrl + Alt + K`) — asl nusxa, instance — uning nusxasi.",
              "Variantlar bitta komponentning holatlarini birlashtiradi.",
            ],
            keyTerms: [
              { term: "Auto Layout", definition: "Elementlarni avtomatik joylashtiruvchi Figma tizimi." },
              { term: "Component", definition: "Qayta ishlatiladigan asl dizayn elementi." },
              { term: "Instance", definition: "Komponentning bog'langan nusxasi." },
              { term: "Variant", definition: "Komponentning holati yoki turi (masalan, Hover)." },
            ],
          },
        },
        {
          slug: "prototip-va-topshirish",
          title: "Prototip va dizaynni topshirish",
          summary: "Bog'lanishlar, interaksiyalar, Smart Animate, taqdimot va eksport.",
          durationMin: 16,
          content: {
            intro: "Statik ekranlar foydalanuvchi tajribasini to'liq ko'rsatmaydi. Prototip dizaynni “jonlantiradi” — uni sinash va mijozga ko'rsatish mumkin bo'ladi.",
            concept:
              "**Prototip** — ekranlar bosish, surish kabi harakatlar orqali bog'langan interaktiv model. Figma'da u **Prototype** tabida yaratiladi:\n\n- **Connection** (bog'lanish) — elementdan boshqa freymga strelka\n- **Trigger** — harakat turi: On click, On drag, While hovering, After delay\n- **Action** — natija: Navigate to, Open overlay, Back, Scroll to\n- **Animation** — o'tish turi: Instant, Dissolve, Move in, **Smart animate**\n\n**Dizaynni topshirish** (handoff) — dasturchiga o'lcham, rang, shrift va resurslarni aniq yetkazish jarayoni.",
            why: "Prototip qimmat dasturlash boshlanishidan oldin muammolarni topish imkonini beradi: foydalanuvchi qayerda adashadi, qaysi tugma tushunarsiz. Yaxshi tayyorlangan topshirish esa dizayner va dasturchi o'rtasidagi yuzlab savol-javobni tejaydi.",
            how:
              "Prototype tabida elementni tanlaganingizda o'ng chetida doiracha paydo bo'ladi — uni maqsadli freymga sudrab, bog'lanish yaratasiz va trigger/action/animatsiyani tanlaysiz. **Smart animate** ikki freymdagi bir xil nomli qatlamlarni topib, ular orasidagi farqni (joylashuv, o'lcham, rang) silliq animatsiya qiladi.\n\nPrototipni **Present** (yuqori o'ngdagi ▶) tugmasi bilan ishga tushirasiz va **Share prototype** havolasini ulashasiz. Telefonda sinash uchun Figma mobil ilovasi ishlatiladi.\n\nTopshirishda dasturchi **Dev Mode** yoki Inspect orqali har bir element o'lchami, masofalari, rang kodlari va CSS xususiyatlarini ko'radi. Rasm va ikonkalar o'ng paneldagi **Export** bo'limidan PNG, SVG yoki PDF sifatida chiqariladi.",
            steps: [
              { title: "Boshlang'ich freymni belgilang", body: "Prototype tabida bosh ekranni tanlang — u **Flow starting point** bo'ladi." },
              { title: "Bog'lanishlar yarating", body: "Mahsulot kartochkasidan mahsulot sahifasiga strelka torting: On click → Navigate to → Smart animate, 300 ms." },
              { title: "Orqaga qaytishni qo'shing", body: "Mahsulot sahifasidagi “←” ikonkasiga: On click → Back." },
              { title: "Prototipni sinang", body: "▶ Present bilan ishga tushiring va barcha yo'llarni bosib chiqing." },
              { title: "Resurslarni tayyorlang", body: "Ikonkalarni SVG, rasmlarni 2× PNG sifatida eksportga belgilang va dasturchi bilan faylni ulashing." },
            ],
            examples: [
              { title: "Savatchaga qo'shish animatsiyasi", body: "Ikki freym: birida savatcha belgisida “0”, ikkinchisida “1” va kichik yashil nuqta. Qatlam nomlari bir xil. “Savatchaga qo'shish” tugmasiga On click → Navigate → Smart animate qo'yilsa, raqam va nuqta silliq o'zgaradi — haqiqiy ilovadek." },
            ],
            mistakes: [
              { title: "Har xil qatlam nomlari bilan Smart animate", fix: "Smart animate faqat bir xil nomli qatlamlarni bog'laydi. Nomlar farq qilsa, element shunchaki yo'qolib-paydo bo'ladi." },
              { title: "O'lik nuqtalar", fix: "Foydalanuvchi qaytib chiqa olmaydigan ekranlar qoldirmang — har bir ekrandan orqaga yo'l bo'lsin." },
              { title: "Topshirishda holatlarni unutish", fix: "Dasturchiga faqat “chiroyli” holat emas, bo'sh ro'yxat, yuklanish, xato va o'chirilgan tugma holatlarini ham bering." },
            ],
            tips: [
              "Prototipni boshqa odamga bering va hech narsa tushuntirmasdan kuzating — qayerda to'xtasa, o'sha joy muammo.",
              "Animatsiya davomiyligi 200–400 ms atrofida bo'lsin: tezroq — sezilmaydi, sekinroq — sabrni sinaydi.",
              "Har bir ekran freymiga raqamli nom bering: `01 Menyu`, `02 Mahsulot`, `03 Savatcha`.",
            ],
            exercise: {
              title: "Yakuniy loyiha prototipi",
              brief: "Kofexona ilovasining uchta ekranini bog'lang.",
              tasks: [
                "Menyu, mahsulot sahifasi va savatcha ekranlarini komponentlaringiz bilan yakunlang.",
                "Ekranlarni On click bog'lanishlari bilan ulang va orqaga qaytishni qo'shing.",
                "Kamida bitta Smart animate o'tishini yarating.",
                "Prototipni 2 kishiga sinatib, ularning izohlarini yozing va bitta yaxshilanish kiriting.",
              ],
            },
            summary: [
              "Prototip: connection + trigger + action + animation.",
              "Smart animate bir xil nomli qatlamlarni silliq animatsiya qiladi.",
              "Present va Share prototype bilan sinash va ulashish.",
              "Topshirish: Dev Mode, barcha holatlar va eksport qilingan resurslar.",
            ],
            keyTerms: [
              { term: "Trigger", definition: "Interaksiyani boshlovchi harakat (bosish, surish)." },
              { term: "Smart animate", definition: "Freymlar orasidagi farqni avtomatik animatsiya qiluvchi o'tish." },
              { term: "Handoff", definition: "Dizaynni dasturchiga aniq ma'lumotlar bilan topshirish." },
              { term: "Overlay", definition: "Joriy ekran ustida ochiladigan qatlam (modal, menyu)." },
            ],
          },
        },
      ],
      quiz: {
        title: "2-modul testi: Figma",
        description: "Freymlar, Auto Layout, komponentlar va prototiplash bo'yicha savollar.",
        questions: [
          { prompt: "Figma'da freym yaratish tugmasi?", options: ["R", "F", "T", "P"], correct: 1, explanation: "`F` (yoki `A`) — Frame vositasi." },
          { prompt: "Elementlarni Auto Layout'ga o'rash yorlig'i?", options: ["Ctrl + G", "Shift + A", "Ctrl + Alt + K", "Alt + L"], correct: 1, explanation: "`Shift + A` — Add auto layout." },
          { prompt: "Kontentga qarab o'sadigan o'lcham rejimi?", options: ["Fixed", "Fill container", "Hug contents", "Scale"], correct: 2, explanation: "Hug contents — element o'lchami ichidagi kontentga moslashadi." },
          { prompt: "Komponentning bog'langan nusxasi nima deyiladi?", options: ["Variant", "Instance", "Style", "Frame"], correct: 1, explanation: "Instance — asl komponentdan o'zgarishlarni oladigan nusxa." },
          { prompt: "Smart animate qanday qatlamlarni silliq animatsiya qiladi?", options: ["Har qanday qatlamni", "Ikki freymdagi bir xil nomli qatlamlarni", "Faqat matnni", "Faqat rasmlarni"], correct: 1, explanation: "Smart animate qatlamlarni nomi bo'yicha moslaydi." },
          { prompt: "8 pt tizimida qaysi bo'shliq qiymati mos keladi?", options: ["13", "22", "24", "17"], correct: 2, explanation: "24 — 8 ga karrali (8 × 3)." },
        ],
      },
    },
  ],
  finalQuiz: {
    title: "Yakuniy imtihon: UI dizayn va Figma",
    description: "Kursni yakunlash va sertifikat olish uchun kamida 70% to'g'ri javob bering.",
    passingScore: 70,
    questions: [
      { prompt: "Dizayn jarayonida vizual dizayndan oldin qaysi bosqich keladi?", options: ["Prototip", "Wireframe", "Test", "Eksport"], correct: 1, explanation: "Avval tuzilma (wireframe), keyin vizual dizayn." },
      { prompt: "Ekranda asosiy matn uchun tavsiya etilgan minimal o'lcham?", options: ["10 px", "12 px", "16 px", "24 px"], correct: 2, explanation: "16 px — mobil va veb uchun qulay o'qiladigan asosiy o'lcham." },
      { prompt: "Ikkinchi darajali matnni ajratishning yaxshi usuli?", options: ["Uni juda kichik qilish", "Kulrangroq rang berish", "Qizil qilish", "Kursiv va qalin qilish"], correct: 1, explanation: "Kulrangroq rang ierarxiyani saqlaydi va o'qilishni buzmaydi." },
      { prompt: "Qora va oq ranglar o'rtasidagi kontrast nisbati?", options: ["4.5 : 1", "7 : 1", "21 : 1", "100 : 1"], correct: 2, explanation: "Maksimal kontrast — 21 : 1." },
      { prompt: "Xato holatini qanday ko'rsatish to'g'ri?", options: ["Faqat qizil rang bilan", "Rang, ikonka va matn bilan birga", "Faqat ikonka bilan", "Ko'rsatmaslik"], correct: 1, explanation: "Faqat rangga tayanish rang ajrata olmaydiganlar uchun muammo." },
      { prompt: "Figma'da komponent yaratish yorlig'i (Windows)?", options: ["Ctrl + G", "Ctrl + Alt + K", "Shift + A", "Ctrl + D"], correct: 1, explanation: "`Ctrl + Alt + K` (macOS'da `Cmd + Option + K`)." },
      { prompt: "Auto Layout CSS'dagi qaysi tizimga eng yaqin?", options: ["Float", "Flexbox", "Table", "Position: absolute"], correct: 1, explanation: "Auto Layout yo'nalish, gap va padding bilan Flexbox kabi ishlaydi." },
      { prompt: "Prototipda “orqaga” tugmasi uchun mos action?", options: ["Navigate to", "Back", "Open overlay", "Scroll to"], correct: 1, explanation: "Back — oldingi ekranga qaytaradi." },
    ],
  },
};
