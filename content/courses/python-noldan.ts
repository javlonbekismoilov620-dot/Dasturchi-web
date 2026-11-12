import type { CourseSeed } from "../../src/lib/types.ts";

const code = (...lines: string[]) => lines.join("\n");

export const pythonNoldan: CourseSeed = {
  slug: "python-noldan",
  title: "Python: noldan boshlab",
  subtitle: "Eng sodda va eng kuchli tillardan biri bilan dasturlashni boshlang",
  description:
    "Python — o'qilishi oson sintaksisi tufayli dasturlashni boshlash uchun eng qulay til. U sun'iy intellekt, ma'lumotlar tahlili, avtomatlashtirish va backend dasturlashda keng qo'llaniladi. Bu kursda Python'ni kompyuteringizga o'rnatishdan boshlab, o'zgaruvchilar, shartlar, sikllar, ro'yxatlar, lug'atlar va funksiyalargacha o'rganasiz. Har bir darsdagi kodni brauzerning o'zida ishga tushirasiz.",
  category: "dasturlash",
  level: 1,
  status: "published",
  featured: true,
  order: 2,
  accent: "teal",
  icon: "Cpu",
  objectives: [
    "Python'ni o'rnatish va birinchi dasturni ishga tushirish",
    "Foydalanuvchidan ma'lumot olish va natija chiqarish",
    "Shartlar va sikllar bilan mantiq qurish",
    "Ro'yxat va lug'atlarda ma'lumotlarni saqlash",
    "Funksiyalar yordamida tartibli va qayta ishlatiladigan kod yozish",
  ],
  skills: ["Python", "print va input", "Shartlar", "Sikllar", "Ro'yxatlar", "Lug'atlar", "Funksiyalar", "Algoritmik tafakkur"],
  requirements: ["Kompyuter (Windows, macOS yoki Linux)", "Oldingi dasturlash tajribasi talab qilinmaydi"],
  audience: ["Dasturlashni birinchi marta o'rganayotganlar", "Sun'iy intellekt va ma'lumotlar tahliliga qiziquvchilar", "Ish jarayonlarini avtomatlashtirmoqchi bo'lganlar"],
  software: ["Python", "VS Code", "Brauzer"],
  tags: ["python", "dasturlash", "ai", "boshlang'ich", "algoritm"],
  estimatedHours: 9,
  finalProject: {
    title: "Uy budjeti hisoblagichi",
    description:
      "Foydalanuvchi kirim va chiqimlarni kiritadigan, ularni toifalar bo'yicha saqlaydigan va oy oxirida hisobot chiqaradigan konsol dasturi yarating.",
    deliverables: [
      "Kirim va chiqimlarni input() orqali kiritish",
      "Ma'lumotlarni lug'atlar ro'yxatida saqlash",
      "Toifalar bo'yicha jami summani hisoblovchi funksiya",
      "Eng katta xarajat toifasini aniqlash",
      "Noto'g'ri kiritilgan son uchun tushunarli xabar",
    ],
  },
  modules: [
    {
      title: "Python bilan tanishuv",
      description: "Python'ni o'rnatasiz, birinchi dasturingizni yozasiz va ma'lumotlar bilan ishlashni o'rganasiz.",
      lessons: [
        {
          slug: "birinchi-dastur",
          title: "Python nima va birinchi dastur",
          summary: "Python'ni o'rnatish, print() funksiyasi va izohlar.",
          durationMin: 15,
          isPreview: true,
          interactive: [
            {
              type: "code-playground",
              title: "Python'ni brauzerda ishga tushiring",
              description: "Birinchi ishga tushirishda Python muhiti yuklanadi (bir necha soniya).",
              config: {
                language: "python",
                code: code("# Bu izoh — Python uni bajarmaydi", 'print("Assalomu alaykum!")', 'print("Python bilan tanishuvni boshlaymiz.")', "print(7 * 6)", 'print("Natija:", 2 ** 10)'),
              },
            },
          ],
          content: {
            intro: "Instagram, YouTube va Spotify'ning ayrim qismlari, NASA hisob-kitoblari, sun'iy intellekt modellari — ularning barchasida Python ishlatiladi. Bugun siz ham shu til bilan birinchi dasturingizni yozasiz.",
            concept:
              "**Python** — 1991-yilda Gvido van Rossum tomonidan yaratilgan umumiy maqsadli dasturlash tili. Uning asosiy g'oyasi — kod oddiy ingliz tilidagi matnga o'xshab, oson o'qilishi.\n\nPython **interpretatsiya qilinadigan** til: kodni oldindan maxsus faylga aylantirish shart emas, **interpretator** uni qatorma-qator o'qib, darhol bajaradi. `print()` — ekranga matn yoki qiymat chiqaruvchi funksiya.",
            why: "Python — ma'lumotlar tahlili, sun'iy intellekt va mashinali o'qitish sohalarining asosiy tili. U avtomatlashtirish (fayllarni saralash, hisobotlar tayyorlash), veb-backend va ilmiy hisob-kitoblar uchun ham ishlatiladi. Sintaksisi sodda bo'lgani uchun siz til qoidalariga emas, dasturlash tafakkuriga ko'proq e'tibor qaratasiz.",
            how:
              "Siz `.py` kengaytmali faylga kod yozasiz va `python fayl.py` buyrug'ini berasiz. Interpretator faylni yuqoridan pastga o'qiydi va har bir qatorni bajaradi. Xato uchrasa, u to'xtaydi va xato turi hamda qator raqamini ko'rsatadi.\n\n`#` belgisidan keyin yozilgan hamma narsa **izoh** hisoblanadi. `print()` ichiga vergul bilan bir nechta qiymat berish mumkin — ular orasiga bo'sh joy qo'yiladi. `**` — darajaga ko'tarish operatori: `2 ** 10` = 1024.",
            steps: [
              { title: "Python'ni o'rnating", body: "python.org/downloads saytidan so'nggi versiyani yuklab oling. Windows'da o'rnatishda **“Add python.exe to PATH”** belgisini albatta qo'ying — aks holda terminal Python'ni topa olmaydi." },
              { title: "O'rnatilganini tekshiring", body: "Terminalni (Windows'da “Command Prompt” yoki “PowerShell”) oching va versiyani tekshiring. macOS va Linux'da buyruq `python3` bo'lishi mumkin.", code: { language: "bash", code: "python --version" } },
              { title: "Birinchi faylni yarating", body: "VS Code'da `salom.py` faylini yarating. VS Code taklif qilsa, “Python” kengaytmasini o'rnating.", code: { language: "python", filename: "salom.py", code: code('print("Salom, dunyo!")', 'print("Men Python o\'rganyapman")') } },
              { title: "Dasturni ishga tushiring", body: "Fayl joylashgan papkada terminalda quyidagi buyruqni bering yoki VS Code'ning yuqori o'ng burchagidagi ▶ tugmasini bosing.", code: { language: "bash", code: "python salom.py" } },
            ],
            examples: [
              {
                title: "Python — kalkulyator",
                body: "Arifmetik amallar: `+`, `-`, `*`, `/` (natija kasr), `//` (butun qismi), `%` (qoldiq), `**` (daraja).",
                code: { language: "python", code: code("print(17 / 5)   # 3.4", "print(17 // 5)  # 3", "print(17 % 5)   # 2", "print(3 ** 4)   # 81") },
              },
            ],
            mistakes: [
              { title: "PATH belgisini qo'ymaslik", fix: "Terminal “python is not recognized” deb javob bersa, Python'ni qayta o'rnating va “Add to PATH” ni belgilang." },
              { title: "Qo'shtirnoqni yopmaslik", fix: "`print(\"Salom)` — `SyntaxError: unterminated string literal`. Har bir ochilgan qo'shtirnoqni yoping." },
              { title: "Print'ni katta harf bilan yozish", fix: "Python katta-kichik harflarga sezgir: `Print` emas, `print`." },
            ],
            tips: [
              "Xato xabarining oxirgi qatorini birinchi o'qing — u odatda muammoni aniq aytadi.",
              "Kichik g'oyalarni tez sinash uchun terminalda `python` deb yozib, interaktiv rejimdan foydalaning (`exit()` bilan chiqasiz).",
              "Har kuni oz bo'lsa ham kod yozing: 20 daqiqalik muntazam amaliyot haftada bir marta 3 soatdan samaraliroq.",
            ],
            exercise: {
              title: "Vizitka dasturi",
              brief: "O'zingiz haqingizda ma'lumot chiqaruvchi dastur yozing.",
              tasks: [
                "Ismingiz, shahringiz va sevimli mashg'ulotingizni alohida qatorlarda chiqaring.",
                "Bir kunda necha soniya borligini hisoblang (24 × 60 × 60) va natijani chiqaring.",
                "Har bir qatorga izoh yozing.",
              ],
            },
            summary: [
              "Python — o'qilishi oson, interpretatsiya qilinadigan til.",
              "`print()` ekranga natija chiqaradi; `#` bilan izoh yoziladi.",
              "Windows'da o'rnatishda “Add to PATH” muhim.",
              "Dastur `python fayl.py` buyrug'i bilan ishga tushiriladi.",
            ],
            keyTerms: [
              { term: "Interpretator", definition: "Kodni qatorma-qator o'qib, darhol bajaruvchi dastur." },
              { term: "Terminal", definition: "Kompyuterga matnli buyruqlar beriladigan oyna." },
              { term: "SyntaxError", definition: "Kod tilning yozilish qoidalariga mos kelmaganda chiqadigan xato." },
            ],
          },
        },
        {
          slug: "ozgaruvchilar-input",
          title: "O'zgaruvchilar, turlar va input()",
          summary: "int, float, str, bool, turlarni o'zgartirish va f-satrlar.",
          durationMin: 18,
          interactive: [
            {
              type: "code-playground",
              title: "Foydalanuvchi bilan muloqot",
              description: "Pastdagi “input() uchun ma'lumotlar” maydoniga ism va yilni ikki qatorda yozing.",
              config: {
                language: "python",
                code: code('ism = input("Ismingiz: ")', 'yil = int(input("Tug\'ilgan yilingiz: "))', "yosh = 2026 - yil", "", 'print(f"Salom, {ism}! Siz bu yil {yosh} yoshga to\'lasiz.")', "print(type(ism), type(yil))"),
              },
            },
          ],
          content: {
            intro: "Dastur foydalanuvchi bilan “gaplashishi” kerak: savol beradi, javobni eslab qoladi va unga qarab ish qiladi. Buning uchun o'zgaruvchilar va `input()` funksiyasi kerak.",
            concept:
              "**O'zgaruvchi** — qiymatga berilgan nom. Python'da u `=` belgisi bilan yaratiladi: `narx = 15000`. Maxsus kalit so'z kerak emas.\n\nAsosiy ma'lumot turlari:\n- `int` — butun son: `42`, `-7`\n- `float` — kasr son: `3.14`, `0.5`\n- `str` — matn (satr): `\"Buxoro\"`\n- `bool` — mantiqiy qiymat: `True` yoki `False`\n\n`input()` foydalanuvchidan matn so'raydi va **har doim `str`** qaytaradi. Songa aylantirish uchun `int()` yoki `float()` ishlatiladi.",
            why: "Turlarni tushunmaslik — yangi boshlovchilarning eng ko'p uchraydigan xatosi. `input()` dan olingan “5” bilan “3” ni qo'shsangiz, “53” chiqadi. Turlarni bilsangiz, bunday xatolarni oldindan ko'rasiz va dasturingiz to'g'ri hisoblaydi.",
            how:
              "`yosh = 20` yozilganda Python xotirada `20` qiymatini yaratadi va unga `yosh` nomini bog'laydi. Keyin `yosh = yosh + 1` qilsangiz, nom yangi qiymatga (21) bog'lanadi.\n\n`type(qiymat)` turini ko'rsatadi. **f-satr** (f-string) qo'shtirnoqdan oldin `f` harfi bilan yoziladi va figurali qavslar ichiga o'zgaruvchi yoki ifoda qo'yish imkonini beradi: `f\"Jami: {narx * soni} so'm\"`.\n\nNomlash qoidasi: kichik harflar va so'zlar orasida pastki chiziq — `talaba_ismi`, `umumiy_narx` (bu uslub **snake_case** deyiladi).",
            steps: [
              { title: "O'zgaruvchi yarating", body: "Python turni qiymatga qarab o'zi aniqlaydi.", code: { language: "python", code: code('shahar = "Namangan"', "aholi = 708000", "maydon = 145.0", "markazmi = False") } },
              { title: "Turni tekshiring", body: "`type()` qiymatning turini qaytaradi.", code: { language: "python", code: code("print(type(aholi))   # <class 'int'>", "print(type(maydon))  # <class 'float'>") } },
              { title: "Foydalanuvchidan so'rang", body: "Matnni songa aylantirishni unutmang.", code: { language: "python", code: code('narx = int(input("Narxni kiriting: "))', 'soni = int(input("Soni: "))', "print(narx * soni)") } },
              { title: "f-satr bilan chiroyli chiqaring", body: "`:,` formati minglarni ajratadi.", code: { language: "python", code: code("jami = 1250000", 'print(f"Jami: {jami:,} so\'m")  # Jami: 1,250,000 so\'m') } },
            ],
            examples: [
              {
                title: "Doira yuzi hisoblagichi",
                body: "`round()` sonni kerakli xonagacha yaxlitlaydi.",
                code: { language: "python", code: code('r = float(input("Radius (sm): "))', "yuz = 3.14159 * r ** 2", 'print(f"Doira yuzi: {round(yuz, 2)} sm²")') },
              },
            ],
            mistakes: [
              { title: "input() natijasini songa aylantirmaslik", fix: "`input()` har doim matn qaytaradi. Hisoblashdan oldin `int()` yoki `float()` bilan o'giring." },
              { title: "Matn bilan sonni + bilan qo'shish", fix: "`\"Yosh: \" + 20` — `TypeError`. f-satr ishlating: `f\"Yosh: {20}\"`." },
              { title: "Kalit so'zlarni nom sifatida ishlatish", fix: "`print = 5` yoki `list = []` kabi nomlar o'rnatilgan funksiyalarni “yopib qo'yadi”. Boshqa nom tanlang." },
            ],
            tips: [
              "Nomlar ma'noli bo'lsin: `n` emas, `talabalar_soni`.",
              "Foydalanuvchiga savol berganda nima kiritish kerakligini aniq yozing: `\"Yoshingizni raqamda kiriting: \"`.",
              "Pul summalarida kasr xatolaridan qochish uchun butun sonlar (tiyin yoki so'm) bilan ishlang.",
            ],
            exercise: {
              title: "Taksi narxi kalkulyatori",
              brief: "Masofa va tarifga qarab yo'l narxini hisoblovchi dastur yozing.",
              tasks: [
                "Foydalanuvchidan masofani (km, kasr bo'lishi mumkin) so'rang.",
                "Boshlang'ich narx 7000 so'm, har bir km uchun 2500 so'm deb hisoblang.",
                "Natijani butun songa yaxlitlab, minglar ajratilgan holda chiqaring.",
                "Qo'shimcha: tungi tarif (`True`/`False`) bo'lsa, narxni 20% oshiring.",
              ],
              hint: "`float(input(...))` va `round(...)` dan foydalaning.",
            },
            summary: [
              "O'zgaruvchi `=` bilan yaratiladi; turi qiymatga qarab aniqlanadi.",
              "Asosiy turlar: int, float, str, bool.",
              "`input()` har doim `str` qaytaradi — kerak bo'lsa `int()`/`float()`.",
              "f-satr: `f\"Matn {qiymat}\"`.",
            ],
            keyTerms: [
              { term: "str (satr)", definition: "Matnli qiymat turi." },
              { term: "f-string", definition: "Ichiga `{}` orqali qiymat qo'yiladigan satr." },
              { term: "snake_case", definition: "So'zlar pastki chiziq bilan ajratiladigan nomlash uslubi." },
            ],
          },
        },
        {
          slug: "shartlar-python",
          title: "Shartlar: if, elif, else",
          summary: "Taqqoslash, and/or/not va chekinish (indentatsiya) qoidasi.",
          durationMin: 18,
          interactive: [
            {
              type: "code-playground",
              title: "Kirish tizimi",
              description: "input() maydoniga login va parolni ikki qatorda kiriting.",
              config: {
                language: "python",
                code: code('login = input("Login: ")', 'parol = input("Parol: ")', "", 'if login == "admin" and parol == "uzbek2026":', '    print("Xush kelibsiz!")', 'elif login == "admin":', '    print("Parol noto\'g\'ri")', "else:", '    print("Bunday foydalanuvchi topilmadi")'),
              },
            },
          ],
          content: {
            intro: "Dastur vaziyatga qarab turli qaror qabul qilishi kerak: ball yetarlimi, parol to'g'rimi, balans yetadimi. Python'da buning uchun `if` operatori ishlatiladi.",
            concept:
              "**Shartli operator** dasturga “agar ... bo'lsa, shuni qil” deyish imkonini beradi:\n- `if` — birinchi shart\n- `elif` (else if) — qo'shimcha shartlar\n- `else` — hech bir shart bajarilmasa\n\nTaqqoslash operatorlari: `==` (teng), `!=` (teng emas), `>`, `<`, `>=`, `<=`. Mantiqiy operatorlar inglizcha so'zlar bilan yoziladi: `and`, `or`, `not`.\n\nPython'ning o'ziga xos qoidasi — **chekinish** (indentation): `if` ga tegishli kod 4 ta bo'sh joy ichkariga suriladi. Figurali qavslar ishlatilmaydi.",
            why: "Chekinish qoidasi Python kodini vizual jihatdan toza qiladi — qaysi qator qaysi shartga tegishli ekani darhol ko'rinadi. Shartlar esa har qanday real dasturning asosi: tekshiruvlar, ruxsatlar, hisob-kitob qoidalari.",
            how:
              "Python `if` dan keyingi ifodani hisoblaydi. Natija `True` bo'lsa, ikki nuqtadan (`:`) keyingi surilgan blok bajariladi va `elif`/`else` qismlari o'tkazib yuboriladi. `False` bo'lsa, navbatdagi `elif` tekshiriladi. Birinchi rost shartning bloki bajarilgach, zanjirdan chiqiladi.\n\nPython'da bo'sh qiymatlar — `0`, `\"\"` (bo'sh satr), `[]` (bo'sh ro'yxat) — `False` deb hisoblanadi. Shuning uchun `if ism:` yozuvi “ism bo'sh emasmi?” degan ma'noni bildiradi.",
            steps: [
              { title: "Oddiy shart", body: "Ikki nuqta va 4 ta bo'sh joyli chekinishga e'tibor bering.", code: { language: "python", code: code("harorat = 35", "if harorat > 30:", '    print("Juda issiq")', '    print("Ko\'proq suv iching")', 'print("Bu qator har doim bajariladi")') } },
              { title: "Bir nechta variant", body: "`elif` bilan shartlar zanjiri.", code: { language: "python", code: code("ball = 74", "if ball >= 86:", "    baho = 5", "elif ball >= 71:", "    baho = 4", "elif ball >= 56:", "    baho = 3", "else:", "    baho = 2", 'print(f"Baho: {baho}")') } },
              { title: "Shartlarni birlashtiring", body: "`and`, `or` va `not` bilan murakkab shartlar.", code: { language: "python", code: code("yosh = 20", "guvohnoma = True", "if yosh >= 18 and guvohnoma:", '    print("Mashina haydash mumkin")') } },
              { title: "Bo'sh qiymatni tekshiring", body: "Bo'sh satr `False` deb baholanadi.", code: { language: "python", code: code('ism = input("Ism: ").strip()', "if not ism:", '    print("Ism kiritilmadi")') } },
            ],
            examples: [
              {
                title: "Kabisa yilini aniqlash",
                body: "Yil 4 ga bo'linsa kabisa, lekin 100 ga bo'linsa — yo'q, ammo 400 ga bo'linsa — yana kabisa.",
                code: { language: "python", code: code("yil = 2024", "if (yil % 4 == 0 and yil % 100 != 0) or yil % 400 == 0:", '    print(f"{yil} — kabisa yili")', "else:", '    print(f"{yil} — oddiy yil")') },
              },
            ],
            mistakes: [
              { title: "= va == ni adashtirish", fix: "`if ball = 5:` — `SyntaxError`. Taqqoslash uchun ikkita: `==`." },
              { title: "Chekinishni aralashtirish", fix: "`IndentationError` chiqsa, bo'sh joy va Tab aralashib ketgan bo'lishi mumkin. Har doim 4 ta bo'sh joy ishlating (VS Code buni avtomatik qiladi)." },
              { title: "Ikki nuqtani unutish", fix: "`if`, `elif`, `else` qatorlari `:` bilan tugashi shart." },
            ],
            tips: [
              "Chegaraviy qiymatlarni (aynan 56, aynan 86) albatta sinab ko'ring.",
              "Juda ko'p `elif` bo'lsa, ma'lumotni lug'atda saqlash mumkinligini o'ylab ko'ring — buni keyingi modulda o'rganasiz.",
              "Matnlarni solishtirishdan oldin `.strip().lower()` bilan tozalang — “ HA” va “ha” teng bo'ladi.",
            ],
            exercise: {
              title: "Tana massasi indeksi (TMI)",
              brief: "TMI = vazn (kg) / bo'y (m)². Natijaga qarab toifani aniqlang.",
              tasks: [
                "Foydalanuvchidan vazn va bo'yni (santimetrda) so'rang.",
                "Bo'yni metrga o'tkazib, TMI'ni hisoblang va bir xonali kasrgacha yaxlitlang.",
                "18.5 dan kichik — “Vazn yetishmasligi”, 25 gacha — “Me'yorda”, 30 gacha — “Ortiqcha vazn”, undan yuqori — “Semizlik” deb chiqaring.",
                "Natija tibbiy maslahat emasligi haqida eslatma qo'shing.",
              ],
            },
            summary: [
              "`if / elif / else` — qaror qabul qilish tuzilmasi.",
              "Bloklar `:` va 4 ta bo'sh joyli chekinish bilan belgilanadi.",
              "Mantiqiy operatorlar: `and`, `or`, `not`.",
              "Bo'sh qiymatlar (`0`, `\"\"`, `[]`) `False` hisoblanadi.",
            ],
            keyTerms: [
              { term: "Chekinish (indentation)", definition: "Blokni belgilovchi qator boshidagi bo'sh joylar." },
              { term: "elif", definition: "Qo'shimcha shart — “aks holda, agar”." },
              { term: "Truthy / Falsy", definition: "Shartda rost yoki yolg'on deb baholanadigan qiymatlar." },
            ],
          },
        },
      ],
      quiz: {
        title: "1-modul testi: Python asoslari",
        description: "O'zgaruvchilar, turlar va shartlar bo'yicha savollar.",
        questions: [
          { prompt: "`input()` funksiyasi qaysi turdagi qiymat qaytaradi?", options: ["int", "float", "str", "bool"], correct: 2, explanation: "`input()` har doim matn (str) qaytaradi; songa `int()` yoki `float()` bilan aylantiriladi." },
          { prompt: "`17 // 5` natijasi?", options: ["3.4", "3", "2", "85"], correct: 1, explanation: "`//` bo'linmaning butun qismini beradi." },
          { prompt: "Qaysi yozuv to'g'ri f-satr?", options: ["\"Jami: {narx}\"", "f\"Jami: {narx}\"", "f'Jami: (narx)'", "\"Jami: \" + {narx}"], correct: 1, explanation: "f-satr `f` harfi bilan boshlanadi, qiymat `{}` ichida yoziladi." },
          { prompt: "Python'da if blokini nima belgilaydi?", options: ["Figurali qavslar", "Chekinish (bo'sh joylar)", "begin/end so'zlari", "Nuqta-vergul"], correct: 1, explanation: "Python bloklarni chekinish orqali aniqlaydi." },
          { prompt: "`if not ism:` sharti qachon bajariladi?", options: ["ism bo'sh satr bo'lsa", "ism \"not\" bo'lsa", "Har doim", "Hech qachon"], correct: 0, explanation: "Bo'sh satr `False` deb baholanadi, `not` uni `True` ga aylantiradi." },
          { prompt: "Ikki qiymat tengligini tekshiruvchi operator?", options: ["=", "==", "===", ":="], correct: 1, explanation: "Python'da taqqoslash `==`, `=` esa qiymat berish." },
        ],
      },
    },
    {
      title: "Takrorlash, ma'lumotlar va funksiyalar",
      description: "Sikllar, ro'yxatlar, lug'atlar va funksiyalar bilan haqiqiy dasturlar yozasiz.",
      lessons: [
        {
          slug: "sikllar-python",
          title: "Sikllar: for va while",
          summary: "range(), ro'yxat bo'ylab aylanish, while va break.",
          durationMin: 18,
          interactive: [
            {
              type: "code-playground",
              title: "Sikl bilan tajriba",
              config: {
                language: "python",
                code: code("# 1 dan 5 gacha kvadratlar", "for i in range(1, 6):", '    print(f"{i} ning kvadrati = {i ** 2}")', "", "# Jami summa", "jami = 0", "for son in [12, 7, 30, 5]:", "    jami += son", 'print("Jami:", jami)'),
              },
            },
          ],
          content: {
            intro: "Kompyuterning eng kuchli tomoni — zerikmasdan, xatosiz, million marta takrorlash. Sikllar yordamida biz bu kuchdan foydalanamiz.",
            concept:
              "**for** sikli ketma-ketlikning (ro'yxat, satr, sonlar oralig'i) har bir elementi uchun blokni bir martadan bajaradi. **range()** sonlar ketma-ketligini yaratadi: `range(5)` → 0, 1, 2, 3, 4; `range(1, 6)` → 1 dan 5 gacha; `range(0, 10, 2)` → 0, 2, 4, 6, 8.\n\n**while** sikli shart rost bo'lgan muddatda takrorlanadi. `break` siklni to'xtatadi, `continue` joriy aylanishni o'tkazib yuboradi.",
            why: "Fayldagi har bir qatorni o'qish, har bir mahsulot narxini hisoblash, foydalanuvchi to'g'ri javob bergunicha so'rash — bularning barchasi sikl. Sikllarsiz katta hajmdagi ma'lumot bilan ishlash imkonsiz.",
            how:
              "`for meva in mevalar:` yozilganda Python ro'yxatdan birinchi elementni oladi, uni `meva` nomiga bog'laydi va blokni bajaradi. So'ng keyingi elementga o'tadi va ro'yxat tugaguncha davom etadi.\n\n`range()` ning yuqori chegarasi **kirmaydi**: `range(1, 6)` 6 ni o'z ichiga olmaydi. `while` siklida shartga ta'sir qiluvchi o'zgaruvchi ichkarida o'zgarishi kerak, aks holda sikl cheksiz davom etadi. `enumerate()` element bilan birga uning tartib raqamini ham beradi.",
            steps: [
              { title: "Sonlar oralig'i bo'ylab", body: "`range` bilan sanash.", code: { language: "python", code: code("for i in range(1, 4):", '    print(f"{i}-dars")') } },
              { title: "Ro'yxat bo'ylab", body: "Har bir elementni birma-bir olish.", code: { language: "python", code: code('mevalar = ["olma", "anor", "uzum"]', "for meva in mevalar:", "    print(meva.capitalize())") } },
              { title: "Raqam bilan birga", body: "`enumerate` tartib raqamini qo'shadi.", code: { language: "python", code: code("for raqam, meva in enumerate(mevalar, start=1):", '    print(f"{raqam}. {meva}")') } },
              { title: "To'g'ri javobgacha so'rash", body: "`while True` va `break` — keng tarqalgan usul.", code: { language: "python", code: code("while True:", '    javob = input("2 + 2 = ")', '    if javob == "4":', '        print("To\'g\'ri!")', "        break", '    print("Yana urinib ko\'ring")') } },
            ],
            examples: [
              {
                title: "Sonning raqamlari yig'indisi",
                body: "`while` va qoldiq operatori bilan klassik algoritm.",
                code: { language: "python", code: code("son = 2026", "yigindi = 0", "while son > 0:", "    yigindi += son % 10   # oxirgi raqam", "    son //= 10            # oxirgi raqamni olib tashlash", "print(yigindi)  # 2 + 0 + 2 + 6 = 10") },
              },
            ],
            mistakes: [
              { title: "range chegarasini noto'g'ri tushunish", fix: "`range(1, 10)` 10 ni o'z ichiga olmaydi. 10 gacha kerak bo'lsa: `range(1, 11)`." },
              { title: "Cheksiz while sikli", fix: "Shart o'zgaruvchisi sikl ichida yangilanishini tekshiring. Dastur qotib qolsa, terminalda `Ctrl + C` bilan to'xtating." },
              { title: "Sikl ichida ro'yxatni o'zgartirish", fix: "Aylanib chiqayotgan ro'yxatdan element o'chirish kutilmagan natija beradi. Yangi ro'yxat yarating yoki nusxa bo'ylab aylaning." },
            ],
            tips: [
              "O'zgaruvchi nomlari: ro'yxat — ko'plikda (`talabalar`), sikl elementi — birlikda (`talaba`).",
              "Sonlar ro'yxatining yig'indisi uchun tayyor `sum()` funksiyasi bor: `sum([1, 2, 3])`.",
              "Sikl nima qilayotganini tushunish uchun ichiga vaqtincha `print()` qo'yib, har bir qadamni kuzating.",
            ],
            exercise: {
              title: "Son topish o'yini",
              brief: "Kompyuter 1 dan 100 gacha son “o'ylaydi”, foydalanuvchi uni topishi kerak.",
              tasks: [
                "`import random` va `random.randint(1, 100)` bilan tasodifiy son tanlang.",
                "`while` siklida foydalanuvchidan taxmin so'rang.",
                "Har bir taxmindan keyin “Kattaroq” yoki “Kichikroq” deb ayting.",
                "Topilganda urinishlar sonini chiqarib, siklni `break` bilan tugating.",
              ],
              hint: "Urinishlarni sanash uchun sikldan oldin `urinish = 0` yarating va har safar 1 ga oshiring.",
            },
            summary: [
              "`for` — ketma-ketlik bo'ylab, `while` — shart rost ekan takrorlaydi.",
              "`range(a, b)` — a dan b gacha (b kirmaydi).",
              "`break` — to'xtatish, `continue` — keyingi aylanishga o'tish.",
              "`enumerate()` — element bilan uning tartib raqami.",
            ],
            keyTerms: [
              { term: "range()", definition: "Sonlar ketma-ketligini yaratuvchi funksiya." },
              { term: "Iteratsiya", definition: "Siklning bitta aylanishi." },
              { term: "Algoritm", definition: "Muammoni hal qilish uchun aniq qadamlar ketma-ketligi." },
            ],
          },
        },
        {
          slug: "royxat-va-lugat",
          title: "Ro'yxatlar va lug'atlar",
          summary: "list va dict: qo'shish, o'chirish, qidirish va birga ishlatish.",
          durationMin: 20,
          interactive: [
            {
              type: "code-playground",
              title: "Telefon kitobi",
              config: {
                language: "python",
                code: code("kontaktlar = {", '    "Ona": "+998 90 123 45 67",', '    "Akmal": "+998 93 765 43 21",', "}", "", 'kontaktlar["Shahlo"] = "+998 97 111 22 33"  # qo\'shish', "", "for ism, raqam in kontaktlar.items():", '    print(f"{ism}: {raqam}")', "", 'print("Jami:", len(kontaktlar), "ta kontakt")', 'print(kontaktlar.get("Botir", "Topilmadi"))'),
              },
            },
          ],
          content: {
            intro: "Bitta o'zgaruvchiga bitta qiymat — kichik dasturlar uchun yetarli. Ammo 30 ta talaba yoki 500 ta mahsulot bilan ishlash uchun ma'lumot tuzilmalari kerak.",
            concept:
              "**Ro'yxat** (list) — tartiblangan va o'zgartirilishi mumkin bo'lgan qiymatlar to'plami: `[\"Toshkent\", \"Andijon\", \"Qarshi\"]`. Elementlar **indeks** orqali olinadi; birinchi indeks — 0. Manfiy indeks oxiridan sanaydi: `[-1]` — oxirgi element.\n\n**Lug'at** (dictionary, dict) — **kalit: qiymat** juftliklari to'plami: `{\"ism\": \"Kamola\", \"yosh\": 22}`. Qiymat kalit orqali olinadi: `talaba[\"ism\"]`. Lug'at real hayotdagi lug'at kabi ishlaydi: so'z (kalit) bo'yicha ma'nosini (qiymat) topasiz.",
            why: "Ro'yxat bir turdagi ko'p narsalarni (baholar, xaridlar), lug'at esa bitta narsaning xususiyatlarini (talabaning ismi, yoshi, guruhi) saqlash uchun ideal. Ikkalasini birga ishlatib — masalan, lug'atlar ro'yxati — real ma'lumotlar bazasining kichik modelini qurasiz. Internetdagi API'lardan keladigan JSON ma'lumotlar ham Python'da aynan ro'yxat va lug'atga aylanadi.",
            how:
              "Ro'yxat metodlari: `append(x)` — oxiriga qo'shish, `insert(i, x)` — ma'lum joyga qo'shish, `remove(x)` — qiymat bo'yicha o'chirish, `pop()` — oxirgisini olib tashlash, `sort()` — saralash. `len()` uzunlikni, `in` operatori esa element bor-yo'qligini tekshiradi.\n\nLug'atda `d[\"kalit\"] = qiymat` yangi juftlik qo'shadi yoki mavjudini yangilaydi. Mavjud bo'lmagan kalitga `d[\"kalit\"]` bilan murojaat qilish `KeyError` beradi; xavfsiz usul — `d.get(\"kalit\", standart)`. `.items()` kalit va qiymatlarni juftlab beradi.",
            steps: [
              { title: "Ro'yxat yarating va o'qing", body: "Indeks 0 dan boshlanadi.", code: { language: "python", code: code("baholar = [5, 4, 5, 3]", "print(baholar[0])   # 5", "print(baholar[-1])  # 3", "print(len(baholar)) # 4") } },
              { title: "Ro'yxatni o'zgartiring", body: "Qo'shish, o'chirish va saralash.", code: { language: "python", code: code("baholar.append(4)", "baholar.remove(3)", "baholar.sort()", "print(baholar)  # [4, 4, 5, 5]") } },
              { title: "Lug'at yarating", body: "Bitta obyektning xususiyatlari.", code: { language: "python", code: code("talaba = {", '    "ism": "Kamola",', '    "guruh": "IT-21",', '    "ball": 88,', "}", 'talaba["ball"] = 92  # yangilash', 'print(talaba["ism"], talaba["ball"])') } },
              { title: "Lug'atlar ro'yxati", body: "Real ma'lumotlarning eng keng tarqalgan ko'rinishi.", code: { language: "python", code: code("guruh = [", '    {"ism": "Kamola", "ball": 92},', '    {"ism": "Javohir", "ball": 67},', "]", "for t in guruh:", '    holat = "o\'tdi" if t["ball"] >= 56 else "o\'tmadi"', '    print(f"{t[\'ism\']}: {holat}")') } },
            ],
            examples: [
              {
                title: "So'zlarni sanash",
                body: "Lug'at yordamida matndagi har bir so'z necha marta uchraganini hisoblash.",
                code: { language: "python", code: code('matn = "olma nok olma uzum olma nok"', "sanoq = {}", "for soz in matn.split():", "    sanoq[soz] = sanoq.get(soz, 0) + 1", "print(sanoq)  # {'olma': 3, 'nok': 2, 'uzum': 1}") },
              },
              {
                title: "Ro'yxat generatori (list comprehension)",
                body: "Yangi ro'yxat yaratishning qisqa va “python”cha usuli.",
                code: { language: "python", code: code("narxlar = [12000, 45000, 8000]", "chegirmali = [n * 0.9 for n in narxlar]", "qimmatlar = [n for n in narxlar if n > 10000]") },
              },
            ],
            mistakes: [
              { title: "IndexError: list index out of range", fix: "3 elementli ro'yxatda `[3]` mavjud emas — oxirgi indeks 2. `len()` bilan tekshiring." },
              { title: "KeyError", fix: "Lug'atda bo'lmagan kalitga murojaat. `get()` ishlating yoki avval `if \"kalit\" in d:` bilan tekshiring." },
              { title: "Ro'yxatni nusxalashda xato", fix: "`b = a` nusxa emas — ikkala nom bitta ro'yxatga ishora qiladi. Nusxa uchun `b = a.copy()`." },
            ],
            tips: [
              "Ma'lumotni tanlashda o'zingizga savol bering: “Tartib muhimmi?” — ro'yxat. “Nom bo'yicha topish kerakmi?” — lug'at.",
              "Lug'at kalitlari odatda satr bo'ladi va ular takrorlanmaydi.",
              "Murakkab tuzilmalarni ko'rish uchun `from pprint import pprint` va `pprint(malumot)` dan foydalaning.",
            ],
            exercise: {
              title: "Do'kon ombori",
              brief: "Mahsulotlar va ularning sonini lug'atda yuritadigan dastur yozing.",
              tasks: [
                "Kamida 4 ta mahsulot va qoldig'ini saqlovchi lug'at yarating.",
                "Foydalanuvchi mahsulot nomi va sotilgan sonni kiritsin; qoldiqni kamaytiring.",
                "Mahsulot topilmasa yoki qoldiq yetmasa, tushunarli xabar chiqaring.",
                "Qoldig'i 5 tadan kam bo'lgan mahsulotlar ro'yxatini “Buyurtma berish kerak” deb chiqaring.",
              ],
            },
            summary: [
              "Ro'yxat — tartiblangan to'plam; indeks 0 dan, `[-1]` — oxirgi element.",
              "Lug'at — kalit: qiymat juftliklari; `get()` xavfsiz o'qish usuli.",
              "`append`, `remove`, `sort`, `len`, `in` — asosiy amallar.",
              "Lug'atlar ro'yxati — real ma'lumotlarning tipik ko'rinishi.",
            ],
            keyTerms: [
              { term: "list", definition: "Tartiblangan, o'zgartiriladigan qiymatlar to'plami." },
              { term: "dict", definition: "Kalit orqali qiymat topiladigan to'plam." },
              { term: "List comprehension", definition: "Ro'yxatni bir qatorda yaratish sintaksisi: `[x * 2 for x in a]`." },
            ],
          },
        },
        {
          slug: "funksiyalar-python",
          title: "Funksiyalar",
          summary: "def, parametrlar, return, standart qiymatlar va kodni tartiblash.",
          durationMin: 20,
          interactive: [
            {
              type: "code-playground",
              title: "Funksiyalar bilan ishlash",
              config: {
                language: "python",
                code: code("def ortacha(sonlar):", '    """Ro\'yxatdagi sonlarning o\'rtacha qiymatini qaytaradi."""', "    if not sonlar:", "        return 0", "    return sum(sonlar) / len(sonlar)", "", "", 'def baho(ball, maksimal=100):', "    foiz = ball / maksimal * 100", '    return "a\'lo" if foiz >= 86 else "yaxshi" if foiz >= 71 else "qoniqarli" if foiz >= 56 else "qoniqarsiz"', "", "", "ballar = [78, 92, 65, 88]", 'print(f"O\'rtacha: {ortacha(ballar):.1f}")', "print(baho(92))", "print(baho(18, maksimal=20))"),
              },
            },
          ],
          content: {
            intro: "Dastur kattalashgan sari tartib zarur bo'ladi. Funksiyalar kodni nomlangan, qayta ishlatiladigan bo'laklarga ajratib, dasturni tushunarli qiladi.",
            concept:
              "**Funksiya** — `def` kalit so'zi bilan yaratiladigan nomlangan kod bloki. U **parametrlar** orqali ma'lumot oladi va **return** orqali natija qaytaradi.\n\nSiz allaqachon tayyor funksiyalardan foydalangansiz: `print()`, `len()`, `input()`. Endi o'zingiznikini yaratasiz. Funksiya ichidagi birinchi qatorga uch qo'shtirnoqli izoh — **docstring** yozish mumkin: u funksiya nima qilishini tushuntiradi.",
            why: "“O'zingizni takrorlamang” (DRY — Don't Repeat Yourself) — dasturlashning asosiy tamoyili. Bir xil hisob-kitob 5 joyda yozilgan bo'lsa, xatoni ham 5 joyda tuzatish kerak. Funksiyada esa bir marta. Bundan tashqari, kichik funksiyalarni alohida sinash oson.",
            how:
              "`def nom(parametrlar):` qatoridan keyin surilgan blok funksiya tanasi bo'ladi. Funksiya e'lon qilinganda hech narsa bajarilmaydi — u faqat **chaqirilganda** ishlaydi: `nom(argumentlar)`.\n\n`return` funksiyani to'xtatadi va qiymatni qaytaradi; u bo'lmasa, funksiya `None` qaytaradi. Parametrga **standart qiymat** berish mumkin (`maksimal=100`) — argument berilmasa, shu qiymat ishlatiladi. Argumentlarni nom bilan ham berish mumkin: `baho(18, maksimal=20)`. Funksiya ichida yaratilgan o'zgaruvchilar tashqarida ko'rinmaydi (**lokal** o'zgaruvchilar).",
            steps: [
              { title: "Funksiya yarating", body: "`def`, nom, qavslar, ikki nuqta va surilgan tana.", code: { language: "python", code: code("def salomlash(ism):", '    print(f"Salom, {ism}!")') } },
              { title: "Funksiyani chaqiring", body: "Turli argumentlar bilan qayta ishlating.", code: { language: "python", code: code('salomlash("Nilufar")', 'salomlash("Bekzod")') } },
              { title: "Natija qaytaring", body: "`return` bilan qaytarilgan qiymatni boshqa joyda ishlatish mumkin.", code: { language: "python", code: code("def kvadrat_yuzi(tomon):", "    return tomon * tomon", "", "jami = kvadrat_yuzi(4) + kvadrat_yuzi(3)", "print(jami)  # 25") } },
              { title: "Standart qiymat bering", body: "Ko'p hollarda bir xil bo'ladigan parametrlar uchun qulay.", code: { language: "python", code: code('def narx_bilan_qqs(narx, qqs=0.12):', "    return round(narx * (1 + qqs))", "", "print(narx_bilan_qqs(100000))       # 112000", "print(narx_bilan_qqs(100000, 0))    # 100000") } },
            ],
            examples: [
              {
                title: "Kodni funksiyalarga ajratish",
                body: "Har bir funksiya bitta vazifani bajaradi — dastur o'qilishi oson.",
                code: { language: "python", code: code("def son_sora(savol):", "    while True:", "        matn = input(savol)", "        if matn.isdigit():", "            return int(matn)", '        print("Iltimos, faqat raqam kiriting.")', "", "", "def asosiy():", '    yosh = son_sora("Yoshingiz: ")', '    print(f"10 yildan keyin {yosh + 10} yoshda bo\'lasiz")', "", "", "asosiy()") },
              },
            ],
            mistakes: [
              { title: "print va return ni adashtirish", fix: "`print` faqat ekranga chiqaradi, natijani qaytarmaydi. Natijani keyin ishlatish kerak bo'lsa — `return`." },
              { title: "Funksiyani e'lon qilishdan oldin chaqirish", fix: "Python faylni yuqoridan pastga o'qiydi. `def` chaqiriqdan oldin bo'lishi kerak." },
              { title: "Qavslarni unutish", fix: "`asosiy` — funksiyaning o'zi, `asosiy()` — uni ishga tushirish." },
            ],
            tips: [
              "Funksiya nomi u nima qilishini aytsin: `ortacha_hisobla`, `faylni_oqi`.",
              "Funksiya 20–30 qatordan uzun bo'lsa, uni kichikroqlarga bo'lish mumkinligini o'ylang.",
              "Docstring yozishni odat qiling — bir necha oydan so'ng o'zingiz minnatdor bo'lasiz.",
            ],
            exercise: {
              title: "Parol kuchini tekshiruvchi",
              brief: "Parolning ishonchliligini baholovchi funksiya yozing.",
              tasks: [
                "`parol_kuchi(parol)` funksiyasini yarating.",
                "Uzunlik 8+ belgi, kamida bitta raqam, bitta katta harf va bitta maxsus belgi (`!@#$%`) borligini tekshiring.",
                "Bajarilgan shartlar soniga qarab “Zaif”, “O'rtacha” yoki “Kuchli” qaytaring.",
                "Foydalanuvchidan parol so'rab, natijani chiqaring.",
              ],
              hint: "`any(belgi.isdigit() for belgi in parol)` — kamida bitta raqam borligini tekshiradi.",
            },
            summary: [
              "Funksiya `def` bilan yaratiladi va chaqirilganda ishlaydi.",
              "`return` natija qaytaradi; yo'q bo'lsa — `None`.",
              "Standart qiymatli va nomlangan argumentlar kodni moslashuvchan qiladi.",
              "DRY tamoyili: takrorlanadigan kodni funksiyaga chiqaring.",
            ],
            keyTerms: [
              { term: "def", definition: "Funksiya e'lon qilish kalit so'zi." },
              { term: "return", definition: "Funksiyadan qiymat qaytarish va uni tugatish." },
              { term: "Docstring", definition: "Funksiya vazifasini tushuntiruvchi uch qo'shtirnoqli izoh." },
              { term: "DRY", definition: "“O'zingizni takrorlamang” — kod takrorlanishidan qochish tamoyili." },
            ],
          },
        },
      ],
      quiz: {
        title: "2-modul testi: sikllar, ma'lumotlar, funksiyalar",
        description: "Sikllar, ro'yxat, lug'at va funksiyalar bo'yicha savollar.",
        questions: [
          { prompt: "`list(range(2, 6))` natijasi?", options: ["[2, 3, 4, 5, 6]", "[2, 3, 4, 5]", "[3, 4, 5, 6]", "[2, 6]"], correct: 1, explanation: "Yuqori chegara kirmaydi: 2, 3, 4, 5." },
          { prompt: "`[10, 20, 30][-1]` nimaga teng?", options: ["10", "20", "30", "Xato"], correct: 2, explanation: "Manfiy indeks oxiridan sanaydi: -1 — oxirgi element." },
          { prompt: "Lug'atda kalit bo'lmasa xato bermasdan qiymat olish usuli?", options: ["d[\"kalit\"]", "d.get(\"kalit\")", "d.find(\"kalit\")", "d.kalit"], correct: 1, explanation: "`get()` kalit bo'lmasa `None` yoki berilgan standart qiymatni qaytaradi." },
          { prompt: "`return` yo'q funksiya nima qaytaradi?", options: ["0", "\"\"", "None", "False"], correct: 2, explanation: "Python'da qiymat qaytarmagan funksiya `None` qaytaradi." },
          { prompt: "Ro'yxat oxiriga element qo'shuvchi metod?", options: ["add()", "push()", "append()", "insert()"], correct: 2, explanation: "`append()` elementni ro'yxat oxiriga qo'shadi." },
          { prompt: "`while True:` siklidan qanday chiqiladi?", options: ["exit", "break", "stop", "Chiqib bo'lmaydi"], correct: 1, explanation: "`break` siklni darhol tugatadi." },
        ],
      },
    },
  ],
  finalQuiz: {
    title: "Yakuniy imtihon: Python asoslari",
    description: "Kursni yakunlash va sertifikat olish uchun kamida 70% to'g'ri javob bering.",
    passingScore: 70,
    questions: [
      { prompt: "`int(\"7\") + 3` natijasi?", options: ["\"73\"", "10", "Xato", "7.3"], correct: 1, explanation: "`int()` satrni songa aylantiradi: 7 + 3 = 10." },
      { prompt: "Qaysi tur kasr sonni ifodalaydi?", options: ["int", "str", "float", "bool"], correct: 2, explanation: "`float` — o'nli kasrli sonlar turi." },
      { prompt: "`2 ** 3` natijasi?", options: ["6", "8", "9", "5"], correct: 1, explanation: "`**` — darajaga ko'tarish: 2³ = 8." },
      { prompt: "`for i in range(3): print(i)` nimani chiqaradi?", options: ["1 2 3", "0 1 2", "0 1 2 3", "3"], correct: 1, explanation: "`range(3)` — 0, 1, 2." },
      { prompt: "`len({\"a\": 1, \"b\": 2})` natijasi?", options: ["1", "2", "4", "Xato"], correct: 1, explanation: "Lug'atda ikkita kalit-qiymat juftligi bor." },
      { prompt: "Python'da bloklar qanday ajratiladi?", options: ["{ }", "begin/end", "Chekinish bilan", "( )"], correct: 2, explanation: "Python bloklarni chekinish (4 bo'sh joy) orqali aniqlaydi." },
      { prompt: "`b = a` yozilganda `a` ro'yxati nusxalanadimi?", options: ["Ha, to'liq nusxa yaratiladi", "Yo'q, ikkala nom bitta ro'yxatga ishora qiladi", "Faqat birinchi element nusxalanadi", "Xato beradi"], correct: 1, explanation: "Nusxa uchun `a.copy()` kerak; `b = a` faqat yangi nom beradi." },
      { prompt: "Funksiya natijasini keyin ishlatish uchun nima kerak?", options: ["print", "return", "input", "def"], correct: 1, explanation: "`return` qiymatni chaqirilgan joyga qaytaradi." },
    ],
  },
};
