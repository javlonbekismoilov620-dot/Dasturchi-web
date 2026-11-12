import type { CourseSeed } from "../../src/lib/types.ts";

export const videoMontajAsoslari: CourseSeed = {
  slug: "video-montaj-asoslari",
  title: "Video montaj: noldan boshlab",
  subtitle: "Bepul DaVinci Resolve'da hikoya qiluvchi videolar yarating",
  description:
    "Montaj — oddiy kadrlarni hikoyaga aylantirish san'ati. Bu kursda montaj tili va kadr turlarini, bepul professional dastur DaVinci Resolve interfeysini, taymlaynda kesish va tartiblashni, ovoz bilan ishlashni, rang korreksiyasi asoslarini, titrlar qo'shish va videoni turli platformalar uchun eksport qilishni o'rganasiz.",
  category: "video",
  level: 1,
  status: "published",
  featured: true,
  order: 4,
  accent: "coral",
  icon: "Clapperboard",
  objectives: [
    "Montaj tilini: kadr turlari, kesish ritmi va hikoya tuzilishini tushunish",
    "DaVinci Resolve'da loyiha yaratish va media bilan ishlash",
    "Taymlaynda kesish, tartiblash va ripple tahrirlarni bajarish",
    "Ovoz balandligini to'g'ri sozlash va musiqa bilan ishlash",
    "Skoplar yordamida asosiy rang korreksiyasini bajarish",
    "Titrlar qo'shish va videoni YouTube hamda ijtimoiy tarmoqlar uchun eksport qilish",
  ],
  skills: ["DaVinci Resolve", "Montaj", "Taymlayn", "Ovoz balansi", "Rang korreksiyasi", "Skoplar", "Titrlar", "Eksport"],
  requirements: [
    "Windows, macOS yoki Linux kompyuter (kamida 16 GB operativ xotira tavsiya etiladi)",
    "Alohida videokarta tavsiya etiladi",
    "Telefon bilan suratga olingan bir nechta video",
  ],
  audience: ["Video montajni noldan o'rganmoqchi bo'lganlar", "Blog yoki biznes uchun video tayyorlovchilar", "Kino va reklama sohasiga qiziquvchilar"],
  software: ["DaVinci Resolve"],
  tags: ["montaj", "video", "davinci resolve", "rang korreksiyasi", "boshlang'ich"],
  estimatedHours: 8,
  finalProject: {
    title: "60 soniyalik promo-video",
    description:
      "O'zingiz suratga olgan kadrlardan mahalliy kafe, do'kon yoki shahringiz haqida 60 soniyalik promo-video yarating: hikoya tuzilmasi, musiqa ritmidagi montaj, rang korreksiyasi, titrlar va to'g'ri eksport bilan.",
    deliverables: [
      "Kirish, asosiy qism va yakundan iborat aniq tuzilma",
      "Kamida 3 xil kadr turi (umumiy, o'rta, yaqin plan)",
      "Musiqa ritmiga mos kesishlar va dialog/musiqa balansi",
      "Barcha kadrlarda bir xil rang korreksiyasi",
      "1920×1080 H.264 formatidagi yakuniy fayl",
    ],
  },
  modules: [
    {
      title: "Montaj asoslari",
      description: "Montaj tili, DaVinci Resolve interfeysi va taymlaynda asosiy ish.",
      lessons: [
        {
          slug: "montaj-tili",
          title: "Montaj nima va hikoya qilish",
          summary: "Kadr turlari, kesish, B-roll va ritm — montajning asosiy tili.",
          durationMin: 14,
          isPreview: true,
          interactive: [{ type: "timeline", title: "Taymlayn bilan tanishuv", description: "Ijro tugmasini bosing va monitorda qaysi klip ko'rinishini kuzating. Keyingi darslarda kesish va ko'chirishni o'rganasiz." }],
          content: {
            intro: "Eng yaxshi montaj ko'rinmaydi: tomoshabin kesishlarni sezmaydi, u shunchaki hikoyaga berilib ketadi. Bu darsda montaj tilining asosiy “so'zlari” bilan tanishasiz.",
            concept:
              "**Montaj** — suratga olingan materiallardan keraklilarini tanlash, ularni ma'lum tartibda joylashtirish va bir butun hikoyaga aylantirish jarayoni.\n\nAsosiy **kadr turlari** (plan):\n- **Umumiy plan** (wide) — joy va vaziyatni ko'rsatadi\n- **O'rta plan** (medium) — odam belidan yuqori; harakat va muloqot\n- **Yaqin plan** (close-up) — yuz yoki detal; his-tuyg'u va muhim narsa\n\n**Kesish** (cut) — bir kadrdan boshqasiga o'tish. **B-roll** — asosiy kadrni (masalan, intervyu) to'ldiruvchi qo'shimcha kadrlar.",
            why: "Bir xil materialdan turli montajchilar butunlay boshqa videolar yaratadi. Montaj hikoyaning sur'ati, kayfiyati va aniqligini belgilaydi. Kadr turlarini bilish suratga olishda ham yordam beradi: montajchi bo'lishni rejalashtirsangiz, kerakli kadrlarni oldindan olasiz.",
            how:
              "Inson miyasi ketma-ket kelgan kadrlarni avtomatik ravishda bog'laydi — bu **Kuleshov effekti** deb ataladi: bir xil yuz ifodasi turli kadrdan keyin turli his-tuyg'u bildirgandek tuyuladi.\n\nKlassik ketma-ketlik: **umumiy → o'rta → yaqin** — tomoshabin avval qayerda ekanini tushunadi, keyin harakatni, so'ng detalni ko'radi. **Ritm** kadrlar davomiyligi bilan yaratiladi: qisqa kadrlar — energiya va tezlik, uzun kadrlar — xotirjamlik va mulohaza. **Harakat ustida kesish** (cut on action) — harakat o'rtasida keyingi kadrga o'tish — kesishni deyarli ko'rinmas qiladi.",
            steps: [
              { title: "Hikoyani bir gapda ifodalang", body: "Montajdan oldin videoning g'oyasini bitta gapda yozing: “Choyxonada bir kunlik hayot — tongdan kechgacha”." },
              { title: "Tuzilmani rejalashtiring", body: "Kirish (diqqatni tortish, 3–5 soniya), asosiy qism (hikoya), yakun (xulosa yoki chaqiriq)." },
              { title: "Kadrlarni ko'rib chiqing va belgilang", body: "Barcha materialni bir marta to'liq ko'ring va eng yaxshi lahzalarni yozib oling. Tajribali montajchilar vaqtining katta qismini aynan shunga sarflaydi." },
              { title: "Kadr turlarini almashtiring", body: "Ikki bir xil umumiy planni ketma-ket qo'ymang — ular orasiga o'rta yoki yaqin plan qo'shing." },
            ],
            examples: [
              { title: "Non yopish jarayoni haqida qisqa video", body: "1) Umumiy plan: novvoyxona, tong. 2) O'rta plan: novvoy xamir yoymoqda. 3) Yaqin plan: qo'llar chekich bilan naqsh solmoqda. 4) Yaqin plan: tandir ichidagi olov. 5) O'rta plan: tayyor nonlar chiqarilmoqda. 6) Yaqin plan: bug'i chiqayotgan non. Har bir kadr 2–4 soniya — butun jarayon 20 soniyada aytib beriladi." },
            ],
            mistakes: [
              { title: "Hamma narsani qoldirish", fix: "Yangi boshlovchilar har bir kadrga achinadi. Qoida: hikoyaga xizmat qilmayotgan kadr — ortiqcha. Qisqa video har doim kuchliroq." },
              { title: "“Jump cut” ni bilmasdan ishlatish", fix: "Bir xil burchakdagi kadrni ozgina siljitib qo'yish “sakrash” effektini beradi. Agar maqsad bo'lmasa, orasiga boshqa kadr (B-roll) qo'ying." },
              { title: "Faqat effektlarga tayanish", fix: "Ko'plab o'tishlar (transitions) va effektlar havaskorlik belgisi. Oddiy kesish 90% hollarda eng yaxshi tanlov." },
            ],
            tips: [
              "Sevimli filmingizdan 1 daqiqalik sahnani ovozsiz ko'rib, kesishlar sonini sanang — montaj ritmini his qilasiz.",
              "Suratga olishda har bir sahnani kamida uch xil planda oling: umumiy, o'rta, yaqin.",
              "Montajdan keyin videoni bir kun o'tib qayta ko'ring — “yangi ko'z” ortiqcha joylarni darhol sezadi.",
            ],
            exercise: {
              title: "Kadrlar ro'yxati (shot list)",
              brief: "Kichik video uchun kadrlar rejasini tuzing va suratga oling.",
              tasks: [
                "Kundalik jarayonni tanlang: choy damlash, nonushta tayyorlash yoki ishga borish.",
                "Kamida 8 ta kadrdan iborat ro'yxat tuzing va har biriga plan turini yozing.",
                "Telefoningizda shu kadrlarni gorizontal holatda, har birini 5–8 soniya suratga oling.",
                "Yuqoridagi taymlaynda ijro tugmasini bosib, kadrlar ketma-ketligi qanday ishlashini kuzating.",
              ],
            },
            summary: [
              "Montaj — materialni tanlash, tartiblash va hikoyaga aylantirish.",
              "Kadr turlari: umumiy, o'rta va yaqin plan.",
              "Ritm kadrlar davomiyligi bilan yaratiladi.",
              "Oddiy kesish — eng kuchli va eng ko'p ishlatiladigan o'tish.",
            ],
            keyTerms: [
              { term: "Kesish (cut)", definition: "Bir kadrdan boshqasiga to'g'ridan-to'g'ri o'tish." },
              { term: "B-roll", definition: "Asosiy kadrni to'ldiruvchi va boyituvchi qo'shimcha kadrlar." },
              { term: "Jump cut", definition: "Bir xil kompozitsiyadagi kadr ichida “sakrash” hissini beruvchi kesish." },
              { term: "Kuleshov effekti", definition: "Kadrlar ketma-ketligi ma'noni o'zgartirishi hodisasi." },
            ],
          },
        },
        {
          slug: "davinci-resolve-interfeysi",
          title: "DaVinci Resolve interfeysi va loyiha",
          summary: "O'rnatish, sahifalar, loyiha sozlamalari va media import.",
          durationMin: 16,
          content: {
            intro: "DaVinci Resolve — Gollivud filmlarida rang korreksiyasi uchun ishlatiladigan dastur. Uning bepul versiyasi montajni o'rganish uchun mutlaqo yetarli.",
            concept:
              "**DaVinci Resolve** — Blackmagic Design kompaniyasining montaj, rang korreksiyasi, vizual effektlar va ovoz bilan ishlash dasturi. U bir nechta **sahifadan** (page) iborat — har biri ish jarayonining bir bosqichi:\n\n- **Media** — fayllarni import qilish va tartiblash\n- **Cut** — tezkor montaj\n- **Edit** — to'liq, an'anaviy montaj\n- **Fusion** — vizual effektlar va motion grafika\n- **Color** — rang korreksiyasi\n- **Fairlight** — ovoz bilan ishlash\n- **Deliver** — eksport\n\n**Loyiha** (project) — barcha media, taymlayn va sozlamalar saqlanadigan ish fayli.",
            why: "Professional dastur bilan boshlash keyinchalik qayta o'rganishga vaqt sarflamaslikni anglatadi. Resolve'dagi tushunchalar (bin, taymlayn, treklar, in/out nuqtalar) boshqa dasturlarda ham bir xil — Premiere Pro'ga o'tish oson bo'ladi.",
            how:
              "Resolve loyihalarni ma'lumotlar bazasida saqlaydi, media fayllarni esa **nusxalamaydi** — faqat ularga havola qiladi. Shuning uchun video fayllarni bir papkada saqlab, keyin ko'chirmaslik muhim; aks holda “Media Offline” (qizil kadr) xatosi chiqadi.\n\n**Taymlayn sozlamalari** — o'lcham (resolution) va kadr tezligi (frame rate) — loyiha boshida belgilanadi. Kadr tezligi taymlayn yaratilgandan keyin o'zgartirilmaydi, shuning uchun uni kameraning kadr tezligiga moslab tanlang (masalan, telefon 30 fps da yozgan bo'lsa — 30).",
            steps: [
              { title: "Dasturni yuklab oling", body: "blackmagicdesign.com saytida DaVinci Resolve (bepul versiya, “Studio” emas) ni tanlang. Ro'yxatdan o'tish formasi chiqadi — u bepul." },
              { title: "Loyiha yarating", body: "Project Manager oynasida **New Project** ni bosing va nom bering." },
              { title: "Loyiha sozlamalarini belgilang", body: "Pastki o'ng burchakdagi tishli g'ildirak (Project Settings) → Master Settings: Timeline resolution 1920 × 1080, Timeline frame rate — videolaringiznikiga mos (25 yoki 30)." },
              { title: "Media import qiling", body: "**Media** sahifasiga o'ting va fayllarni Media Pool'ga sudrab tashlang. Fayllarni “Bin” larga (papkalar) ajrating: Video, Ovoz, Musiqa, Rasmlar." },
              { title: "Taymlayn yarating", body: "**Edit** sahifasida Media Pool'dagi klipni taymlayn maydoniga sudrab tashlang — taymlayn avtomatik yaratiladi." },
            ],
            examples: [
              { title: "Loyiha papkasi tuzilmasi", body: "`Promo_Kafe/` papkasi ichida: `01_Video`, `02_Ovoz`, `03_Musiqa`, `04_Grafika`, `05_Eksport`. Barcha fayllar loyiha boshlanishidan oldin shu yerga ko'chiriladi va keyin joyi o'zgartirilmaydi." },
            ],
            mistakes: [
              { title: "Fayllarni import qilgandan keyin ko'chirish", fix: "Klip qizil “Media Offline” bo'lsa, fayl joyi o'zgargan. Media Pool'da klipni o'ng tugma bilan bosing → **Relink Selected Clips** va yangi papkani ko'rsating." },
              { title: "Noto'g'ri kadr tezligi", fix: "25 fps material 30 fps taymlaynda notekis harakat beradi. Loyiha boshida kameraga mos qiymatni tanlang." },
              { title: "Kompyuter talablarini e'tiborsiz qoldirish", fix: "Resolve videokartaga tayanadi. Kompyuter kuchsiz bo'lsa, **Proxy** fayllar yarating (klip → Generate Proxy Media) — montaj yengil fayllarda, eksport asl fayllarda bajariladi." },
            ],
            tips: [
              "Telefon videolari ko'pincha o'zgaruvchan kadr tezligida (VFR) yoziladi va Resolve'da ovoz siljishi mumkin. Telefon sozlamalarida iloji bo'lsa, qat'iy kadr tezligini tanlang.",
              "Interfeysni o'zgartirib yuborsangiz: Workspace → Reset UI Layout.",
              "Loyihani avtomatik saqlashni yoqing: Preferences → User → Project Save and Load → Live Save.",
            ],
            exercise: {
              title: "Birinchi loyiha",
              brief: "Oldingi darsda suratga olgan kadrlaringiz uchun loyiha tayyorlang.",
              tasks: [
                "Loyiha papkasini tavsiya etilgan tuzilma bo'yicha yarating va fayllarni joylashtiring.",
                "Resolve'da yangi loyiha oching va kadr tezligini videolaringizga moslang.",
                "Media Pool'da kamida ikkita Bin yarating va fayllarni ajrating.",
                "Barcha kadrlarni taymlaynga suring va loyihani saqlang.",
              ],
            },
            summary: [
              "Resolve sahifalari: Media, Cut, Edit, Fusion, Color, Fairlight, Deliver.",
              "Resolve media fayllarga havola qiladi — ularni ko'chirmang.",
              "Kadr tezligi loyiha boshida belgilanadi.",
              "Kuchsiz kompyuterda Proxy media ishlating.",
            ],
            keyTerms: [
              { term: "Media Pool", definition: "Loyihaga import qilingan barcha fayllar saqlanadigan panel." },
              { term: "Bin", definition: "Media Pool ichidagi papka." },
              { term: "Frame rate (kadr tezligi)", definition: "Bir soniyadagi kadrlar soni: 24, 25, 30, 60." },
              { term: "Proxy", definition: "Montajni yengillashtiruvchi past sifatli vaqtinchalik nusxa." },
            ],
          },
        },
        {
          slug: "taymlayn-va-kesish",
          title: "Taymlayn va asosiy kesish",
          summary: "Treklar, ijro boshqaruvi, kesish, trim va ripple o'chirish.",
          durationMin: 20,
          interactive: [{ type: "timeline", title: "Montaj mashqi", description: "Klipni tanlang, ijro chizig'ini qo'ying va “Kesish” tugmasini bosing. Ripple yoqiq holatda o'chirib, bo'sh joy qanday yopilishini kuzating." }],
          content: {
            intro: "Taymlayn — montajchining ish stoli. Bu yerda kliplar vaqt bo'yicha joylashadi, kesiladi va hikoya shakllanadi.",
            concept:
              "**Taymlayn** (timeline) — kliplar vaqt o'qi bo'ylab joylashadigan maydon. U **treklardan** iborat: **V1, V2…** — video treklar (yuqoridagisi pastdagisini yopadi), **A1, A2…** — audio treklar.\n\n**Ijro chizig'i** (playhead) — joriy kadrni ko'rsatuvchi vertikal chiziq. **Trim** — klipning boshi yoki oxirini qisqartirish yoki uzaytirish. **Ripple delete** — klipni o'chirib, keyingi kliplarni bo'sh joyni yopish uchun avtomatik surish.",
            why: "Montajning 80% i — kesish, qisqartirish va tartiblash. Bu amallarni klaviatura bilan tez bajarish qobiliyati professional montajchini havaskordan ajratadi: bir soatlik ish 15 daqiqaga qisqaradi.",
            how:
              "Resolve'ning Edit sahifasida ijro uchun **J / K / L** tugmalari: `L` — oldinga ijro (ikki marta bossangiz — tezroq), `K` — to'xtatish, `J` — orqaga ijro. Strelkalar — kadrma-kadr harakat.\n\nKlipni ijro chizig'i joyida kesish uchun `Ctrl + B` (Razor). `B` tugmasi **Blade** vositasini yoqadi — keyin klipni bosgan joyingizda kesiladi; tanlash vositasiga `A` bilan qaytasiz. Klip chetini sichqoncha bilan sudrash — trim. `Shift + Delete` (macOS'da `Shift + Backspace`) — ripple delete. **Snapping** (`N`) kliplarni bir-biriga va ijro chizig'iga “yopishtiradi”.\n\nKlipni taymlaynga qo'yishdan oldin Source oynasida `I` (In — boshlanish) va `O` (Out — tugash) nuqtalarini belgilab, faqat kerakli qismini qo'shish mumkin.",
            steps: [
              { title: "Klipni taymlaynga qo'ying", body: "Media Pool'dagi klipni ikki marta bosing — u Source monitorda ochiladi. `I` va `O` bilan kerakli qismni belgilang va uni taymlaynga suring." },
              { title: "Ijro va qidiruv", body: "`L`, `K`, `J` va strelkalar bilan kesish kerak bo'lgan joyni toping." },
              { title: "Kesing", body: "Ijro chizig'ini kerakli kadrga qo'yib, `Ctrl + B` bosing. Klip ikkiga bo'linadi." },
              { title: "Keraksiz qismni ripple bilan o'chiring", body: "Ortiqcha bo'lakni tanlab, `Shift + Delete` bosing — keyingi kliplar chapga surilib, bo'sh joy yopiladi." },
              { title: "Tartibni o'zgartiring", body: "Klipni sudrab boshqa joyga ko'chiring. Snapping (`N`) yoqiq bo'lsa, u boshqa klip chetiga aniq yopishadi." },
            ],
            examples: [
              { title: "Intervyu montaji", body: "V1 da intervyu, A1 da uning ovozi. “Hmm”, “anu” kabi joylarni `Ctrl + B` bilan kesib, ripple delete qilasiz. Hosil bo'lgan “jump cut” larni yopish uchun V2 ga B-roll (ish jarayoni kadrlari) qo'yasiz — ovoz uzluksiz davom etadi, tasvir esa almashadi." },
            ],
            mistakes: [
              { title: "Oddiy Delete bilan bo'sh joy qoldirish", fix: "`Delete` (ripple'siz) o'chirilgan klip o'rnida qora bo'shliq qoldiradi. Bo'shliqni tanlab o'chiring yoki ripple delete ishlating." },
              { title: "Video va ovozni sinxrondan chiqarish", fix: "Klipning faqat video yoki faqat audio qismini siljitsangiz, labda ovoz mos kelmay qoladi (qizil raqam paydo bo'ladi). Bog'lanishni saqlash uchun **Linked Selection** yoqiq bo'lsin." },
              { title: "Blade vositasida qolib ketish", fix: "Har bir bosish yangi kesim yaratsa, Blade rejimidasiz. `A` bilan tanlash vositasiga qayting." },
            ],
            tips: [
              "Avval “qo'pol montaj” (rough cut) qiling: barcha kadrlarni tartibda joylashtiring. Aniq kesishlarni keyin qiling.",
              "Ovozni yoqib montaj qiling: ko'p kesishlar musiqa urg'usi yoki gap oxiriga to'g'ri kelganda tabiiy his qilinadi.",
              "Har bir muhim bosqichdan keyin taymlaynni nusxalang (Duplicate Timeline) — tajriba qilishdan qo'rqmaysiz.",
            ],
            exercise: {
              title: "30 soniyalik montaj",
              brief: "Suratga olgan kadrlaringizdan 30 soniyalik ketma-ketlik yarating.",
              tasks: [
                "Interaktiv taymlaynda mashq qiling: klipni kesing, bo'lagini ripple bilan o'chiring va bekor qiling (Ctrl + Z).",
                "Resolve'da kadrlarni umumiy → o'rta → yaqin tartibida joylashtiring.",
                "Har bir kadrni 2–5 soniyagacha qisqartiring.",
                "Jami davomiylikni 30 soniyaga keltiring va loyihani saqlang.",
              ],
            },
            summary: [
              "Taymlayn treklardan iborat: V — video, A — audio; yuqori trek pastkisini yopadi.",
              "J/K/L — ijro boshqaruvi; I/O — kirish va chiqish nuqtalari.",
              "`Ctrl + B` — ijro chizig'ida kesish; `B` — Blade vositasi, `A` — tanlash.",
              "`Shift + Delete` — ripple delete; `N` — snapping.",
            ],
            keyTerms: [
              { term: "Playhead", definition: "Taymlaynda joriy kadrni ko'rsatuvchi chiziq." },
              { term: "Trim", definition: "Klip boshi yoki oxirini qisqartirish/uzaytirish." },
              { term: "Ripple", definition: "O'zgarishdan keyin keyingi kliplarni avtomatik surish." },
              { term: "Rough cut", definition: "Montajning birinchi, qo'pol varianti." },
            ],
          },
        },
      ],
      quiz: {
        title: "1-modul testi: montaj asoslari",
        description: "Montaj tili, Resolve interfeysi va taymlayn bo'yicha savollar.",
        questions: [
          { prompt: "Joy va vaziyatni ko'rsatuvchi kadr turi?", options: ["Yaqin plan", "O'rta plan", "Umumiy plan", "Detal"], correct: 2, explanation: "Umumiy plan (wide) tomoshabinga qayerda ekanini tushuntiradi." },
          { prompt: "DaVinci Resolve'da eksport qaysi sahifada bajariladi?", options: ["Media", "Color", "Fairlight", "Deliver"], correct: 3, explanation: "Deliver sahifasi tayyor videoni faylga chiqaradi." },
          { prompt: "Klip qizil “Media Offline” bo'lib qolsa, sabab nima?", options: ["Video buzilgan", "Fayl joyi o'zgargan yoki o'chirilgan", "Dastur eskirgan", "Rang noto'g'ri"], correct: 1, explanation: "Resolve fayllarga havola qiladi; ko'chirilgan faylni Relink orqali qayta ulash kerak." },
          { prompt: "Ijro chizig'i joyida klipni kesish yorlig'i (Resolve)?", options: ["Ctrl + B", "Ctrl + K", "Ctrl + X", "Shift + C"], correct: 0, explanation: "Resolve'da Razor — `Ctrl + B` (macOS'da `Cmd + B`)." },
          { prompt: "Ripple delete nima qiladi?", options: ["Klipni o'chirib, bo'sh joy qoldiradi", "Klipni o'chirib, keyingi kliplarni surib bo'sh joyni yopadi", "Klipni nusxalaydi", "Ovozni o'chiradi"], correct: 1, explanation: "Ripple keyingi kliplarni avtomatik siljitadi." },
          { prompt: "J / K / L tugmalari nima uchun?", options: ["Rang", "Ijro boshqaruvi", "Ovoz balandligi", "Saqlash"], correct: 1, explanation: "J — orqaga, K — to'xtatish, L — oldinga ijro." },
        ],
      },
    },
    {
      title: "Ovoz, rang va eksport",
      description: "Ovozni to'g'ri balanslash, rang korreksiyasi, titrlar va tayyor videoni chiqarish.",
      lessons: [
        {
          slug: "ovoz-bilan-ishlash",
          title: "Ovoz bilan ishlash",
          summary: "Decibel, dialog va musiqa balansi, fade va LUFS.",
          durationMin: 16,
          content: {
            intro: "Tomoshabin xira tasvirni kechiradi, lekin yomon ovozni — yo'q. Videoning sifatini ko'pincha aynan ovoz belgilaydi.",
            concept:
              "Raqamli ovoz balandligi **desibel**da (dBFS) o'lchanadi. 0 dB — maksimal chegara: undan oshgan ovoz **kesiladi** (clipping) va xirillash paydo bo'ladi. Shuning uchun qiymatlar manfiy bo'ladi: −6 dB, −12 dB va hokazo.\n\n**Fade** — ovozning silliq paydo bo'lishi (fade in) yoki so'nishi (fade out). **LUFS** — inson qulog'i qabul qiladigan o'rtacha balandlik o'lchovi; platformalar videolarni shu ko'rsatkich bo'yicha tenglashtiradi.",
            why: "Musiqa gapni bosib ketsa, tomoshabin videoni yopadi. Ovoz to'satdan baland bo'lsa — qulog'iga og'riq beradi. To'g'ri balans videoni professional qiladi va tomoshabinni ushlab qoladi.",
            how:
              "Resolve'da har bir audio klipning balandligini klip ustidagi gorizontal chiziqni yuqori-pastga surib yoki Inspector panelidagi **Volume** orqali o'zgartirasiz. **Audio meter**lar (o'ng tomonda) joriy balandlikni ko'rsatadi.\n\nAmaliy mo'ljallar:\n- **Dialog** (gap): eng baland joylari taxminan −12…−6 dB atrofida\n- **Fon musiqasi** gap ostida: dialogdan ancha past, taxminan −25…−20 dB\n- **YouTube** uchun yakuniy o'rtacha balandlik taxminan −14 LUFS\n\nKlip burchagidagi kichik oq tutqichni ichkariga sudrash — fade yaratadi. Musiqa gap boshlanganda pasayib, gap tugaganda ko'tarilishi uchun **keyframe** (`Alt` + klik ovoz chizig'ida) ishlatiladi.",
            steps: [
              { title: "Meterlarni kuzating", body: "Videoni ijro etib, audio meterni kuzating. Qizil chiziq yonsa — ovoz kesilmoqda, balandlikni pasaytiring." },
              { title: "Dialogni sozlang", body: "Gap ovozini eng baland joylarida −12…−6 dB ga keltiring." },
              { title: "Musiqani pasaytiring", body: "Musiqa klipining balandligini gapni bosmaydigan darajaga tushiring va quloq bilan tekshiring." },
              { title: "Fade qo'shing", body: "Musiqa boshi va oxiriga 1–2 soniyalik fade bering — to'satdan boshlanish va uzilishdan qochasiz." },
              { title: "Yakuniy balandlikni tekshiring", body: "Fairlight sahifasidagi Loudness meter bilan butun videoning o'rtacha balandligini o'lchang." },
            ],
            examples: [
              { title: "Gap ostida musiqani “cho'ktirish”", body: "Intervyu boshlanishidan oldin musiqa −14 dB da baland. Gap boshlanishidan 1 soniya oldin keyframe qo'yib, musiqani −24 dB ga tushirasiz, gap tugagach yana ko'tarasiz. Bu usul **ducking** deb ataladi." },
            ],
            mistakes: [
              { title: "Kameraning ichki mikrofoniga tayanish", fix: "Uzoqdagi mikrofon xona aks-sadosini va shovqinni yozadi. Petlichka (lav) mikrofon yoki telefonni gapiruvchiga yaqin qo'yish sifatni keskin oshiradi." },
              { title: "Mualliflik huquqi himoyalangan musiqa", fix: "Mashhur qo'shiqlar videongizni bloklashi yoki daromaddan mahrum qilishi mumkin. Litsenziyali yoki bepul foydalanishga ruxsat berilgan kutubxonalardan (YouTube Audio Library va boshqalar) foydalaning." },
              { title: "Faqat noutbuk dinamigida tekshirish", fix: "Ovozni quloqchin va oddiy dinamikda ham tinglang — past chastotalar va balans turlicha eshitiladi." },
            ],
            tips: [
              "Suratga olishda har doim 10 soniya “xona sukunati”ni yozib oling — keyin shovqinni tozalashda yordam beradi.",
              "Ovoz effektlari (qadam, eshik, shamol) videoni jonlantiradi — bu **foley** deb ataladi.",
              "Musiqa tanlashda videoning ritmiga mos tempni tanlang, keyin kesishlarni musiqa urg'ulariga moslang.",
            ],
            exercise: {
              title: "Ovozni balanslash",
              brief: "Oldingi darsdagi 30 soniyalik montajga musiqa qo'shib, ovozni sozlang.",
              tasks: [
                "Bepul kutubxonadan musiqa tanlab, A2 trekka qo'ying.",
                "Agar gap bo'lsa, uni −12…−6 dB ga, musiqani gap ostida −25…−20 dB ga sozlang.",
                "Musiqa boshi va oxiriga fade qo'shing.",
                "Meterda qizil (clipping) yonmasligini tekshiring.",
              ],
            },
            summary: [
              "0 dBFS — chegara; undan oshsa ovoz kesiladi.",
              "Dialog ~ −12…−6 dB, fon musiqasi gap ostida ancha pastroq.",
              "Fade va keyframe bilan silliq o'tishlar.",
              "YouTube uchun o'rtacha balandlik ~ −14 LUFS.",
            ],
            keyTerms: [
              { term: "dBFS", definition: "Raqamli ovoz balandligi; 0 — maksimal chegara." },
              { term: "Clipping", definition: "Ovoz chegaradan oshib, buzilib qolishi." },
              { term: "LUFS", definition: "Eshitiladigan o'rtacha balandlik o'lchovi." },
              { term: "Ducking", definition: "Gap paytida musiqani avtomatik yoki qo'lda pasaytirish." },
            ],
          },
        },
        {
          slug: "rang-korreksiyasi-asoslari",
          title: "Rang korreksiyasi asoslari",
          summary: "Correction va grading farqi, oq balans, ekspozitsiya va skoplar.",
          durationMin: 20,
          interactive: [{ type: "color-grading", title: "Rang laboratoriyasi", description: "Slayderlarni o'zgartiring va waveform skopi qanday o'zgarishini kuzating. Taqqoslash chizig'ini suring." }],
          content: {
            intro: "Telefon har bir kadrni o'zicha “chiroyli” qiladi — natijada kadrlar rangi bir-biridan farq qiladi. Rang korreksiyasi ularni birlashtiradi va videoga kayfiyat beradi.",
            concept:
              "Rang bilan ishlash ikki bosqichdan iborat:\n- **Rang korreksiyasi** (color correction) — texnik tuzatish: oq balans, ekspozitsiya, kontrast; maqsad — tabiiy va bir xil ko'rinish\n- **Color grading** — ijodiy bosqich: iliq, sovuq yoki kinematografik “look” berish\n\n**Skoplar** — tasvirni ko'z bilan emas, o'lchov bilan baholash vositalari. **Waveform** chapdan o'ngga tasvir bo'ylab yorug'lik darajasini ko'rsatadi: pastki chiziq — qora (0), yuqorisi — eng yorqin oq (100).",
            why: "Ko'zimiz aldanadi: ekran yorqinligi, xonadagi yorug'lik va charchoq rangni boshqacha ko'rsatadi. Skoplar esa aniq. Bir xil rangdagi kadrlar videoni yaxlit va professional qiladi, to'g'ri tanlangan “look” esa hikoyaning kayfiyatini kuchaytiradi.",
            how:
              "Resolve'ning **Color** sahifasida har bir klip **nodlar** (tugunlar) zanjiri orqali ishlanadi — har bir nod bitta o'zgarish qatlami. Asosiy vositalar **Primaries** panelida:\n- **Lift** — soyalar (qora qism)\n- **Gamma** — o'rta tonlar\n- **Gain** — yorug' joylar\n\nTo'g'ri tartib: avval **ekspozitsiya va kontrast** (waveform'da tasvir 0 dan pastga va 100 dan yuqoriga chiqmasin), keyin **oq balans** (oq yoki kulrang narsa neytral bo'lsin — Parade skopida R, G, B bir xil balandlikda), keyin **to'yinganlik** va oxirida ijodiy **grading**. Teri ranglari vektorskopdagi maxsus chiziq (skin tone line) yaqinida bo'lishi kerak.",
            steps: [
              { title: "Skoplarni oching", body: "Color sahifasida Workspace → Video Scopes → On. Waveform va Parade'ni tanlang." },
              { title: "Ekspozitsiyani sozlang", body: "Gain bilan eng yorug' joylarni 90–95 atrofiga, Lift bilan eng qora joylarni 0 ga yaqin keltiring." },
              { title: "Oq balansni to'g'rilang", body: "Temperature va Tint bilan kadr umumiy rangini neytrallashtiring. Parade'da oq joylar uchala kanalda bir xil bo'lsin." },
              { title: "To'yinganlikni sozlang", body: "Saturation'ni me'yorida oshiring — teri ranglari tabiiy qolsin." },
              { title: "Kadrlarni moslashtiring", body: "Tayyor klipdagi rangni boshqasiga ko'chirish: klipni tanlab, sozlangan klipni o'rta tugma bilan bosing yoki Stills (still image) bilan solishtiring." },
            ],
            examples: [
              { title: "Iliq va sovuq kayfiyat", body: "Bir xil shahar kadri: iliq grading (Temperature +, yorug' joylarga sariq-to'q sariq) — nostalgiya va qulaylik; sovuq grading (Temperature −, soyalarga havorang, past to'yinganlik) — tashvish va sirlilik. Yuqoridagi laboratoriyada “Iliq kino” va “Sovuq triller” presetlarini solishtiring." },
            ],
            mistakes: [
              { title: "Grading'ni korreksiyadan oldin qilish", fix: "Noto'g'ri ekspozitsiyali kadrga “look” bersangiz, natija buziladi. Avval tuzating, keyin bezang." },
              { title: "Faqat ko'zga ishonish", fix: "Ekraningiz kalibrlanmagan bo'lishi mumkin. Har bir qarorni skop bilan tekshiring." },
              { title: "Haddan tashqari to'yinganlik", fix: "Juda yorqin ranglar arzon ko'rinadi va teri to'q sariq bo'lib qoladi. Vektorskopda teri chizig'ini kuzating." },
            ],
            tips: [
              "Har bir o'zgarishni alohida nodda qiling (`Alt + S` — yangi seriyali nod) — keyin istalgan qatlamni o'chirib-yoqib solishtirish oson.",
              "Kunduzi va kechqurun olingan kadrlarni bitta sahnada ishlatsangiz, avval ularni bir-biriga moslang.",
              "Mashhur filmlardan kadrlar oling va ularning rang palitrasini tahlil qiling — bu eng yaxshi grading darsligi.",
            ],
            exercise: {
              title: "Uchta kadrni bir xil qilish",
              brief: "Turli vaqtda olingan kadrlarni yagona ko'rinishga keltiring.",
              tasks: [
                "Laboratoriyada “Neytral” dan boshlab, ekspozitsiya va kontrastni waveform bo'yicha sozlang.",
                "Resolve'da uchta klipni skoplar yordamida bir xil yorqinlik va oq balansga keltiring.",
                "Ularga umumiy ijodiy “look” bering (masalan, iliq).",
                "Oldin/keyin skrinshotlarini olib, qaydlaringizda farqlarni tasvirlang.",
              ],
            },
            summary: [
              "Korreksiya — texnik tuzatish, grading — ijodiy uslub.",
              "Lift — soyalar, Gamma — o'rta tonlar, Gain — yorug' joylar.",
              "Tartib: ekspozitsiya → oq balans → to'yinganlik → grading.",
              "Ko'zga emas, skoplarga ishoning.",
            ],
            keyTerms: [
              { term: "Waveform", definition: "Tasvirning yorug'lik darajalarini ko'rsatuvchi skop." },
              { term: "Parade", definition: "R, G, B kanallarini alohida ko'rsatuvchi skop." },
              { term: "Vektorskop", definition: "Ranglar tusi va to'yinganligini doira bo'ylab ko'rsatuvchi skop." },
              { term: "Node", definition: "Resolve'dagi alohida rang o'zgarishi qatlami." },
            ],
          },
        },
        {
          slug: "titrlar-va-eksport",
          title: "Titrlar va eksport",
          summary: "Matn va titrlar, xavfsiz zona, Deliver sahifasi va eksport sozlamalari.",
          durationMin: 16,
          content: {
            intro: "Video tayyor — endi unga nom, subtitr qo'shib, to'g'ri formatda chiqarish qoldi. Noto'g'ri eksport butun mehnatni “xira” qilib qo'yishi mumkin.",
            concept:
              "**Titr** (title) — videodagi matn: nom, ism-familiya yozuvi (lower third), subtitr yoki yakuniy yozuvlar. **Xavfsiz zona** (safe area) — matn ekran chetiga juda yaqin bo'lib qolmasligi uchun belgilangan ichki chegara.\n\n**Eksport** (render) — taymlayndagi montajni bitta video faylga aylantirish. Asosiy tushunchalar:\n- **Kodek** — videoni siqish usuli: H.264 (keng tarqalgan), H.265 (HEVC — kichikroq hajm)\n- **Konteyner** — fayl formati: .mp4, .mov\n- **Bitreyt** — soniyasiga ma'lumot hajmi: yuqori — sifatliroq, lekin og'irroq",
            why: "Titrlar tomoshabinga ma'lumot beradi va ko'pchilik ovozsiz ko'radigan ijtimoiy tarmoqlarda (subtitrlar) zarur. To'g'ri eksport sozlamalari esa videoni platformada sifatli ko'rinishini va fayl hajmi me'yorida bo'lishini ta'minlaydi.",
            how:
              "Resolve'da matn uchun Edit sahifasidagi **Effects → Titles** bo'limidan **Text+** ni taymlaynning V2 trekiga suring. Inspector'da shrift, o'lcham, rang va joylashuvni sozlaysiz. Xavfsiz zonani ko'rish: View → Safe Area.\n\n**Deliver** sahifasida tayyor presetlar bor (masalan, **YouTube 1080p**). Yoki **Custom Export** da: Format — MP4, Codec — H.264, Resolution — 1920×1080, Frame rate — taymlayn bilan bir xil. Fayl nomi va papkani tanlab, **Add to Render Queue** → **Render All** bosiladi. Vertikal video (Reels/Shorts) uchun alohida 1080×1920 taymlayn yaratiladi.",
            steps: [
              { title: "Sarlavha qo'shing", body: "Effects → Titles → **Text+** ni V2 trekka suring va matnni yozing." },
              { title: "Uslubni sozlang", body: "Inspector'da shrift, o'lcham va rangni tanlang. Matn fonga nisbatan aniq ko'rinsin; kerak bo'lsa, yengil soya yoki fon plashkasi qo'shing." },
              { title: "Xavfsiz zonani tekshiring", body: "View → Safe Area ni yoqing va matn ichki chegaradan chiqmasligiga ishonch hosil qiling." },
              { title: "Deliver sahifasini oching", body: "Preset tanlang (YouTube 1080p) yoki Custom: MP4, H.264, 1920×1080, kadr tezligi — taymlaynga mos." },
              { title: "Render qiling", body: "Fayl nomi va papkani kiriting, **Add to Render Queue** → **Render All**. Tayyor faylni boshidan oxirigacha ko'rib tekshiring." },
            ],
            examples: [
              { title: "Turli platformalar uchun", body: "YouTube — 1920×1080 (16:9), H.264. Instagram Reels / YouTube Shorts / TikTok — 1080×1920 (9:16), matn ekranning markaziy qismida, chunki pastki va o'ng tomonlarni platforma tugmalari yopadi. Bitta loyihada ikkita taymlayn yaratib, kadrlarni har bir format uchun qayta joylashtirasiz." },
            ],
            mistakes: [
              { title: "Kadr tezligini o'zgartirib eksport qilish", fix: "Taymlayn 25 fps, eksport 30 fps bo'lsa, harakat notekis bo'ladi. Ikkalasi bir xil bo'lsin." },
              { title: "Kichik va o'qilmaydigan matn", fix: "Telefonda ko'riladigan video uchun matn katta va qisqa bo'lsin; ekranda bir vaqtda 1–2 qatordan ortiq emas." },
              { title: "Eksportni tekshirmaslik", fix: "Renderdan keyin faylni to'liq ko'ring: ovoz sinxronmi, qora kadrlar yo'qmi, titrlar to'g'rimi." },
            ],
            tips: [
              "Titr shrifti bitta yoki ikkita bo'lsin — butun video bo'ylab bir xil uslub.",
              "Lower third (ism yozuvi) uchun shablon yarating va har safar qayta ishlating.",
              "Asl yuqori sifatli eksportni arxivda saqlang; platformalar uchun siqilgan versiyani undan qiling.",
            ],
            exercise: {
              title: "Yakuniy chiqarish",
              brief: "Montaj qilgan videongizni ikkita platforma uchun tayyorlang.",
              tasks: [
                "Videoga sarlavha va yakuniy titr qo'shing.",
                "YouTube uchun 1920×1080 H.264 formatida eksport qiling.",
                "Alohida 9:16 taymlayn yaratib, eng yaxshi 15 soniyani vertikal format uchun qayta joylashtiring.",
                "Ikkala faylni ko'rib chiqing va hajmini solishtiring.",
              ],
            },
            summary: [
              "Text+ — Resolve'dagi asosiy titr vositasi.",
              "Matn xavfsiz zona ichida bo'lishi kerak.",
              "Keng tarqalgan eksport: MP4 + H.264, 1920×1080, taymlaynga mos kadr tezligi.",
              "Vertikal platformalar uchun alohida 9:16 taymlayn.",
            ],
            keyTerms: [
              { term: "Lower third", definition: "Ekranning pastki uchdan birida chiqadigan ism yoki izoh yozuvi." },
              { term: "Kodek", definition: "Videoni siqish va ochish usuli (masalan, H.264)." },
              { term: "Bitreyt", definition: "Soniyasiga uzatiladigan ma'lumot hajmi." },
              { term: "Safe area", definition: "Matn joylashtirish uchun xavfsiz ichki chegara." },
            ],
          },
        },
      ],
      quiz: {
        title: "2-modul testi: ovoz, rang va eksport",
        description: "Ovoz balansi, rang korreksiyasi va eksport bo'yicha savollar.",
        questions: [
          { prompt: "Raqamli ovozda 0 dBFS nimani bildiradi?", options: ["Sukunat", "Maksimal chegara", "O'rtacha balandlik", "Musiqa darajasi"], correct: 1, explanation: "0 dBFS dan oshgan ovoz kesiladi (clipping)." },
          { prompt: "Gap ostidagi fon musiqasi dialogga nisbatan qanday bo'lishi kerak?", options: ["Balandroq", "Bir xil", "Ancha pastroq", "Umuman bo'lmasligi kerak"], correct: 2, explanation: "Musiqa gapni bosmasligi uchun ancha past bo'ladi." },
          { prompt: "Rang bilan ishlashda to'g'ri tartib?", options: ["Grading → korreksiya", "Korreksiya → grading", "Faqat grading", "Tartib muhim emas"], correct: 1, explanation: "Avval texnik tuzatish, keyin ijodiy uslub." },
          { prompt: "Lift asosan nimaga ta'sir qiladi?", options: ["Yorug' joylarga", "O'rta tonlarga", "Soyalarga", "Faqat qizil rangga"], correct: 2, explanation: "Lift — soyalar, Gamma — o'rta tonlar, Gain — yorug' joylar." },
          { prompt: "YouTube uchun keng tarqalgan eksport sozlamasi?", options: ["AVI + MJPEG", "MP4 + H.264, 1920×1080", "GIF", "MOV + ProRes 4444 XQ"], correct: 1, explanation: "MP4 konteyneri va H.264 kodeki — eng keng mos keluvchi variant." },
          { prompt: "Reels/Shorts uchun video tomonlar nisbati?", options: ["16:9", "4:3", "9:16", "21:9"], correct: 2, explanation: "Vertikal format — 9:16 (masalan, 1080×1920)." },
        ],
      },
    },
  ],
  finalQuiz: {
    title: "Yakuniy imtihon: video montaj asoslari",
    description: "Kursni yakunlash va sertifikat olish uchun kamida 70% to'g'ri javob bering.",
    passingScore: 70,
    questions: [
      { prompt: "Asosiy kadrni to'ldiruvchi qo'shimcha kadrlar nima deyiladi?", options: ["A-roll", "B-roll", "Close-up", "Jump cut"], correct: 1, explanation: "B-roll intervyu yoki asosiy kadrni boyitadi va kesishlarni yopadi." },
      { prompt: "Taymlaynda qaysi video trek ustun turadi?", options: ["V1", "Yuqoridagi trek (masalan, V2)", "A1", "Eng uzuni"], correct: 1, explanation: "Yuqori video trek pastdagisini yopadi." },
      { prompt: "Source monitorda klipning boshlanish nuqtasini belgilovchi tugma?", options: ["O", "I", "B", "N"], correct: 1, explanation: "`I` — In (kirish), `O` — Out (chiqish)." },
      { prompt: "Snapping'ni yoqib-o'chiruvchi tugma (Resolve)?", options: ["S", "N", "M", "Ctrl + N"], correct: 1, explanation: "`N` — snapping." },
      { prompt: "Gap paytida musiqani pasaytirish usuli?", options: ["Clipping", "Ducking", "Panning", "Trimming"], correct: 1, explanation: "Ducking — dialog paytida musiqa balandligini tushirish." },
      { prompt: "Tasvir yorug'lik darajalarini o'lchovchi skop?", options: ["Waveform", "Histogram faqat audio uchun", "Timeline", "Inspector"], correct: 0, explanation: "Waveform tasvir bo'ylab yorug'lik darajalarini ko'rsatadi." },
      { prompt: "Taymlayn 25 fps bo'lsa, eksport kadr tezligi qanday bo'lishi kerak?", options: ["30", "60", "25", "Istalgan"], correct: 2, explanation: "Notekis harakatdan qochish uchun eksport kadr tezligi taymlayn bilan bir xil bo'lishi kerak." },
      { prompt: "Matn ekran chetiga yaqin bo'lib qolmasligi uchun nima tekshiriladi?", options: ["Safe Area", "Bitreyt", "LUFS", "Node"], correct: 0, explanation: "Xavfsiz zona (Safe Area) matn uchun ichki chegarani ko'rsatadi." },
    ],
  },
};
