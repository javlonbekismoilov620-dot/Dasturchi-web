import type { CourseSeed } from "../../src/lib/types.ts";

const code = (...lines: string[]) => lines.join("\n");

export const javascriptAsoslari: CourseSeed = {
  slug: "javascript-asoslari",
  title: "JavaScript: dasturlash asoslari",
  subtitle: "Dasturlash tafakkurini noldan shakllantiring",
  description:
    "JavaScript — brauzerda ishlaydigan yagona dasturlash tili va dunyodagi eng ko'p ishlatiladigan tillardan biri. Bu kursda o'zgaruvchilar, shartlar, sikllar, funksiyalar, massiv va obyektlarni o'rganasiz, so'ng sahifadagi elementlarni JavaScript bilan boshqarishni boshlaysiz. Har bir darsda kodni to'g'ridan-to'g'ri brauzerda yozib, natijasini darhol ko'rasiz.",
  category: "dasturlash",
  level: 1,
  status: "published",
  featured: true,
  order: 1,
  accent: "gold",
  icon: "FileCode2",
  objectives: [
    "Dasturlash nima ekanini va kompyuter kodni qanday bajarishini tushunish",
    "O'zgaruvchilar va ma'lumot turlari bilan ishlash",
    "Shartlar va sikllar yordamida dastur mantig'ini qurish",
    "Qayta ishlatiladigan funksiyalar yozish",
    "Massiv va obyektlarda ma'lumotlarni saqlash va qayta ishlash",
    "DOM orqali sahifa elementlarini o'zgartirish va hodisalarga javob berish",
  ],
  skills: ["JavaScript", "O'zgaruvchilar", "Shartlar", "Sikllar", "Funksiyalar", "Massivlar", "Obyektlar", "DOM", "Hodisalar"],
  requirements: ["HTML asoslarini bilish tavsiya etiladi", "Brauzer va VS Code", "Oldingi dasturlash tajribasi shart emas"],
  audience: ["Birinchi dasturlash tilini o'rganmoqchi bo'lganlar", "Saytlarini interaktiv qilmoqchi bo'lgan HTML/CSS bilimiga ega o'quvchilar"],
  software: ["JavaScript", "Brauzer", "VS Code"],
  tags: ["javascript", "js", "dasturlash", "frontend", "boshlang'ich"],
  estimatedHours: 10,
  finalProject: {
    title: "Vazifalar ro'yxati (to-do) ilovasi",
    description:
      "Foydalanuvchi vazifa qo'shishi, bajarilgan deb belgilashi va o'chirishi mumkin bo'lgan kichik veb-ilova yarating. Ilova HTML, CSS va JavaScript'dan iborat bo'ladi.",
    deliverables: [
      "Vazifa qo'shish uchun forma va ro'yxat",
      "Vazifalar massivda obyekt ko'rinishida saqlanadi",
      "Har bir vazifani bajarilgan deb belgilash va o'chirish",
      "Bo'sh vazifa qo'shishning oldini oluvchi tekshiruv",
      "Qolgan vazifalar sonini ko'rsatuvchi hisoblagich",
    ],
  },
  modules: [
    {
      title: "Dasturlash tafakkuri va o'zgaruvchilar",
      description: "Kompyuterga buyruq berishni, ma'lumotlarni saqlashni va qaror qabul qiladigan kod yozishni o'rganasiz.",
      lessons: [
        {
          slug: "javascript-nima",
          title: "JavaScript nima va u qayerda ishlaydi",
          summary: "Dastur, til, brauzer konsoli va birinchi console.log().",
          durationMin: 14,
          isPreview: true,
          interactive: [
            {
              type: "code-playground",
              title: "Birinchi JavaScript kodingiz",
              description: "“Ishga tushirish” tugmasini bosing, so'ng matnlarni o'zgartirib qayta sinab ko'ring.",
              config: {
                language: "javascript",
                code: code(
                  "// Bu izoh — kompyuter uni e'tiborsiz qoldiradi",
                  'console.log("Assalomu alaykum!");',
                  'console.log("Men JavaScript o\'rganyapman.");',
                  "console.log(2 + 3);",
                  "console.log(10 * 12);",
                ),
              },
            },
          ],
          content: {
            intro:
              "Siz tugma bosganingizda menyu ochiladi, forma xatoni ko'rsatadi, xarita kattalashadi — bularning ortida JavaScript turadi. Bu darsda dasturlash nima ekanini tushunib, birinchi buyruqlaringizni yozasiz.",
            concept:
              "**Dastur** — kompyuter bajarishi kerak bo'lgan buyruqlar ketma-ketligi. Kompyuter juda tez, lekin “aqlsiz”: u faqat aniq yozilgan ko'rsatmalarni bajaradi. **Dasturlash tili** esa shu ko'rsatmalarni odam ham, kompyuter ham tushunadigan shaklda yozish usuli.\n\n**JavaScript** (qisqacha JS) — dastlab brauzer uchun yaratilgan til. Bugun u brauzerda (sahifalarni interaktiv qilish), serverda (Node.js orqali), mobil va hatto desktop ilovalarda ishlatiladi. Muhim: JavaScript va Java — butunlay boshqa tillar, nomlari o'xshashi tarixiy tasodif.",
            why:
              "JavaScript'ni bilish sizga uchta katta eshikni ochadi: frontend (foydalanuvchi ko'radigan qism), backend (server) va mobil ilovalar. Har bir zamonaviy brauzerda JavaScript allaqachon o'rnatilgan — hech narsa yuklab olmasdan dasturlashni boshlash mumkin. Bundan tashqari, bu yerda o'rganadigan tushunchalar (o'zgaruvchi, shart, sikl, funksiya) deyarli barcha dasturlash tillarida bir xil.",
            how:
              "Brauzer sahifani yuklayotganda `<script>` tegini uchratsa, ichidagi kodni yuqoridan pastga, qatorma-qator bajaradi. Bu ishni brauzerning **JavaScript dvigateli** (Chrome'da V8) amalga oshiradi.\n\n`console.log()` — natijani **konsolga** chiqaruvchi buyruq. Konsol — dasturchining “qoralama daftari”: u yerda kod nima qilayotganini ko'rasiz. Oddiy foydalanuvchi konsolni ko'rmaydi, u faqat dasturchilar uchun. Qavslar ichiga yozilgan qiymat ekranga chiqariladi; matn qo'shtirnoq ichida yoziladi, sonlar esa qo'shtirnoqsiz.",
            steps: [
              {
                title: "Brauzer konsolini oching",
                body: "Istalgan sahifada `F12` (macOS'da `Cmd + Option + J`) ni bosing va “Console” bo'limiga o'ting. Bu yerga JavaScript yozib, `Enter` bilan bajarish mumkin.",
              },
              {
                title: "Birinchi buyruqni yozing",
                body: "Konsolga quyidagini yozing va `Enter` bosing. Ostida sizning matningiz paydo bo'ladi.",
                code: { language: "javascript", code: 'console.log("Salom, dunyo!");' },
              },
              {
                title: "Hisob-kitob qiling",
                body: "JavaScript kalkulyator vazifasini ham bajaradi: `+`, `-`, `*` (ko'paytirish), `/` (bo'lish).",
                code: { language: "javascript", code: code("console.log(15 + 27);", "console.log(100 / 4);") },
              },
              {
                title: "Kodni HTML faylga ulang",
                body: "Haqiqiy loyihalarda kod alohida `.js` faylda yoziladi va HTML'ga ulanadi. `defer` atributi skript sahifa tuzilmasi yuklangandan keyin ishlashini ta'minlaydi.",
                code: {
                  language: "html",
                  filename: "index.html",
                  code: code("<!DOCTYPE html>", '<html lang="uz">', "  <head>", '    <meta charset="UTF-8">', "    <title>JS darsi</title>", '    <script src="app.js" defer></script>', "  </head>", "  <body>", "    <h1>Konsolni oching (F12)</h1>", "  </body>", "</html>"),
                },
              },
            ],
            examples: [
              {
                title: "Izohlar (comments)",
                body: "Izoh — kodga yozilgan, lekin bajarilmaydigan tushuntirish. Bir qatorli izoh `//` bilan, ko'p qatorli izoh `/* ... */` bilan yoziladi. Yaxshi izoh kod **nima uchun** shunday yozilganini tushuntiradi.",
                code: { language: "javascript", code: code("// Foydalanuvchiga salom berish", 'console.log("Xush kelibsiz!");', "", "/*", "  Bu yerda bir nechta qatorli", "  izoh yozish mumkin", "*/") },
              },
            ],
            mistakes: [
              { title: "Qo'shtirnoqni yopmaslik", fix: "`console.log(\"Salom);` — xato, chunki matn yopilmagan. Brauzer “SyntaxError” deb xabar beradi. Har bir ochilgan qo'shtirnoq yopilishi kerak." },
              { title: "Katta-kichik harflarni aralashtirish", fix: "JavaScript harflarning katta-kichikligiga sezgir: `Console.log` ishlamaydi, faqat `console.log` to'g'ri." },
              { title: "Xato xabaridan qo'rqish", fix: "Qizil xato xabari — dushman emas, yordamchi. Unda xato turi va qator raqami yoziladi. Xabarni diqqat bilan o'qish — dasturchining eng muhim ko'nikmalaridan biri." },
            ],
            tips: [
              "Har bir yangi tushunchani darhol konsolda sinab ko'ring — o'qib tushunish bilan qo'lda yozib ko'rishning farqi juda katta.",
              "Kod qatorlarini nuqta-vergul (`;`) bilan tugatishni odat qiling. JavaScript ko'p hollarda ularsiz ham ishlaydi, lekin aniq yozish xatolarning oldini oladi.",
              "Xato xabarini tushunmasangiz, uni so'zma-so'z internetda qidiring — deyarli har bir xato haqida tayyor tushuntirishlar bor.",
            ],
            exercise: {
              title: "Konsolda o'zingizni tanishtiring",
              brief: "Yuqoridagi interaktiv muharrirda yoki brauzer konsolida kichik dastur yozing.",
              tasks: [
                "Ismingizni konsolga chiqaring.",
                "Yashayotgan shahringizni alohida qatorda chiqaring.",
                "Tug'ilgan yilingizni joriy yildan ayirib, yoshingizni hisoblang va natijani chiqaring.",
                "Har bir qator ustiga u nima qilishini tushuntiruvchi izoh yozing.",
              ],
              hint: "Masalan: `console.log(2026 - 2005);`",
            },
            summary: [
              "Dastur — kompyuter bajaradigan aniq buyruqlar ketma-ketligi.",
              "JavaScript brauzerda, serverda va ilovalarda ishlaydi; Java bilan aloqasi yo'q.",
              "`console.log()` natijani dasturchi konsoliga chiqaradi.",
              "Kod odatda alohida `.js` faylda yoziladi va `<script src defer>` bilan ulanadi.",
            ],
            keyTerms: [
              { term: "Dastur", definition: "Kompyuter bajaradigan buyruqlar ketma-ketligi." },
              { term: "Konsol", definition: "Dasturchi kod natijalari va xatolarni ko'radigan oyna." },
              { term: "Sintaksis", definition: "Tilning yozilish qoidalari: qavslar, qo'shtirnoqlar, tartib." },
              { term: "Izoh (comment)", definition: "Kod ichidagi, bajarilmaydigan tushuntirish matni." },
            ],
          },
        },
        {
          slug: "ozgaruvchilar-va-turlar",
          title: "O'zgaruvchilar va ma'lumot turlari",
          summary: "let va const, matn, son, mantiqiy qiymat va shablon satrlar.",
          durationMin: 18,
          interactive: [
            {
              type: "code-playground",
              title: "O'zgaruvchilar bilan tajriba",
              config: {
                language: "javascript",
                code: code(
                  'const ism = "Dilnoza";',
                  "let yosh = 19;",
                  "const talabami = true;",
                  "",
                  "console.log(ism, yosh, talabami);",
                  "console.log(typeof ism, typeof yosh, typeof talabami);",
                  "",
                  "yosh = yosh + 1; // let qiymatini o'zgartirish mumkin",
                  'console.log(`Keyingi yil ${ism} ${yosh} yoshda bo\'ladi.`);',
                ),
              },
            },
          ],
          content: {
            intro: "Dasturlar ma'lumotlar bilan ishlaydi: foydalanuvchi ismi, savatchadagi mahsulotlar soni, tugma bosilganmi yoki yo'qmi. Bu ma'lumotlarni saqlash uchun o'zgaruvchilar kerak.",
            concept:
              "**O'zgaruvchi** — qiymatni saqlaydigan nomlangan “quti”. Uni yaratish uchun ikki kalit so'z ishlatiladi:\n\n- `const` — qiymati keyin o'zgarmaydigan o'zgaruvchi (constant — doimiy)\n- `let` — qiymati keyinroq o'zgarishi mumkin bo'lgan o'zgaruvchi\n\nHar bir qiymatning **turi** bor. Asosiy turlar: `string` (matn: `\"Toshkent\"`), `number` (son: `42`, `3.14`), `boolean` (mantiqiy: `true` yoki `false`), `undefined` (qiymat berilmagan) va `null` (ataylab “bo'sh” deb belgilangan qiymat).",
            why:
              "O'zgaruvchilarsiz dastur hech narsani “eslab qola olmaydi”. Ular kodni o'qiladigan qiladi: `narx * soni` yozuvi `25000 * 3` dan ancha tushunarli. Turlarni bilish esa ko'plab xatolarning oldini oladi: masalan, `\"5\" + 3` natijasi `8` emas, balki `\"53\"` bo'ladi — chunki matnga son qo'shilganda ular yonma-yon yopishtiriladi.",
            how:
              "`const narx = 25000;` yozilganda JavaScript xotiradan joy ajratadi, unga `narx` nomini beradi va ichiga `25000` ni joylaydi. Keyin `narx` deb yozsangiz, dastur shu qiymatni oladi.\n\n`typeof` operatori qiymat turini aytadi: `typeof 25000` → `\"number\"`. **Shablon satr** (template literal) teskari qo'shtirnoqlar ichida yoziladi va `${...}` orqali matn ichiga qiymat qo'yish imkonini beradi: `` `Narxi: ${narx} so'm` ``.\n\nO'zgaruvchi nomlari harf, `_` yoki `$` bilan boshlanadi, bo'sh joy bo'lmaydi. Bir nechta so'zdan iborat nomlar **camelCase** uslubida yoziladi: `foydalanuvchiIsmi`, `umumiyNarx`.",
            steps: [
              { title: "Doimiy qiymat yarating", body: "Agar qiymat o'zgarmasa, har doim `const` dan boshlang.", code: { language: "javascript", code: code('const shahar = "Samarqand";', "const aholisi = 573200;") } },
              { title: "O'zgaruvchan qiymat yarating", body: "Hisoblagich, ball yoki savatcha kabi o'zgaradigan qiymatlar uchun `let` ishlating.", code: { language: "javascript", code: code("let ball = 0;", "ball = ball + 10;", "ball += 5; // qisqa yozuv: ball = ball + 5", "console.log(ball); // 15") } },
              { title: "Turni tekshiring", body: "Shubha tug'ilsa, `typeof` bilan qiymat turini tekshiring.", code: { language: "javascript", code: code('console.log(typeof "salom"); // "string"', 'console.log(typeof 7);       // "number"', 'console.log(typeof false);   // "boolean"') } },
              { title: "Shablon satr bilan matn yasang", body: "Matnlarni `+` bilan ulash o'rniga shablon satr ancha qulay va o'qilishi oson.", code: { language: "javascript", code: code('const mahsulot = "Non";', "const soni = 3;", 'console.log(`${mahsulot}: ${soni} dona`);') } },
            ],
            examples: [
              {
                title: "Xarid hisoblagichi",
                body: "O'zgaruvchilar bilan oddiy hisob-kitob. `toLocaleString()` sonni o'qish oson formatda chiqaradi.",
                code: { language: "javascript", code: code("const narx = 12500;", "const soni = 4;", "const jami = narx * soni;", 'console.log(`Jami: ${jami.toLocaleString()} so\'m`);') },
              },
              {
                title: "Matn va son farqi",
                body: "Formadan kelgan qiymatlar odatda matn bo'ladi. Ularni songa aylantirish uchun `Number()` ishlatiladi.",
                code: { language: "javascript", code: code('const kiritilgan = "5";', "console.log(kiritilgan + 3);         // \"53\"", "console.log(Number(kiritilgan) + 3); // 8") },
              },
            ],
            mistakes: [
              { title: "const qiymatini o'zgartirishga urinish", fix: "`const a = 1; a = 2;` — xato beradi (“Assignment to constant variable”). O'zgaradigan qiymat uchun `let` ishlating." },
              { title: "var'dan foydalanish", fix: "Eski darsliklarda `var` uchraydi. Uning ko'rinish doirasi bilan bog'liq kutilmagan xatti-harakatlari bor. Zamonaviy kodda faqat `let` va `const` ishlatiladi." },
              { title: "Ma'nosiz nomlar", fix: "`a`, `x1`, `qiymat` kabi nomlar o'qiganda hech narsa aytmaydi. `talabalarSoni`, `chegirmaFoizi` kabi aniq nomlar bering." },
            ],
            tips: [
              "Qoidani eslab qoling: avval `const`, faqat zarur bo'lsa `let`.",
              "O'zgaruvchi nomlarini ingliz yoki o'zbek tilida yozish mumkin, lekin loyiha bo'ylab bir xil tilni ushlang.",
              "Pul bilan ishlaganda kasr sonlardagi kichik xatoliklarga ehtiyot bo'ling: `0.1 + 0.2` aniq `0.3` bermaydi. Narxlarni butun sonlarda (tiyinlarda) saqlash xavfsizroq.",
            ],
            exercise: {
              title: "Talaba kartasi",
              brief: "O'zgaruvchilar yordamida talaba haqidagi ma'lumotni chiqaruvchi dastur yozing.",
              tasks: [
                "`ism`, `familiya`, `kurs` (son) va `stipendiyami` (boolean) o'zgaruvchilarini yarating.",
                "Shablon satr yordamida “Aziz Karimov — 2-kurs talabasi” ko'rinishidagi matnni chiqaring.",
                "Har bir o'zgaruvchining turini `typeof` bilan chiqaring.",
                "`kurs` qiymatini bittaga oshiring va yangilangan matnni qayta chiqaring.",
              ],
            },
            summary: [
              "O'zgaruvchi — qiymatni saqlaydigan nomlangan joy.",
              "`const` — o'zgarmas, `let` — o'zgaruvchan qiymatlar uchun; `var` ishlatilmaydi.",
              "Asosiy turlar: string, number, boolean, undefined, null.",
              "Shablon satr: `` `Matn ${qiymat}` ``.",
            ],
            keyTerms: [
              { term: "O'zgaruvchi (variable)", definition: "Qiymat saqlanadigan nomlangan xotira joyi." },
              { term: "Ma'lumot turi", definition: "Qiymatning tabiati: matn, son, mantiqiy qiymat va boshqalar." },
              { term: "camelCase", definition: "Nomlash uslubi: birinchi so'z kichik, keyingilari katta harf bilan: `umumiyNarx`." },
              { term: "Shablon satr", definition: "Teskari qo'shtirnoqdagi, ichiga `${}` orqali qiymat qo'yiladigan matn." },
            ],
          },
        },
        {
          slug: "shartlar",
          title: "Operatorlar va shartlar",
          summary: "Taqqoslash, mantiqiy operatorlar, if/else va qaror qabul qilish.",
          durationMin: 18,
          interactive: [
            {
              type: "code-playground",
              title: "Baho hisoblagich",
              description: "`ball` qiymatini o'zgartirib, natija qanday o'zgarishini kuzating.",
              config: {
                language: "javascript",
                code: code(
                  "const ball = 78;",
                  "",
                  "if (ball >= 86) {",
                  '  console.log("A\'lo (5)");',
                  "} else if (ball >= 71) {",
                  '  console.log("Yaxshi (4)");',
                  "} else if (ball >= 56) {",
                  '  console.log("Qoniqarli (3)");',
                  "} else {",
                  '  console.log("Qayta topshirish kerak");',
                  "}",
                ),
              },
            },
          ],
          content: {
            intro: "Dasturlar har doim bir xil ish qilmaydi: parol to'g'ri bo'lsa kiritadi, noto'g'ri bo'lsa xato chiqaradi. Bunday qarorlarni shartlar yordamida yozamiz.",
            concept:
              "**Shart** — qiymati `true` yoki `false` bo'ladigan ifoda. `if` operatori shart rost (`true`) bo'lsa, figurali qavslar ichidagi kodni bajaradi; aks holda `else` qismiga o'tadi.\n\nShartlar **taqqoslash operatorlari** bilan tuziladi: `>` (katta), `<` (kichik), `>=`, `<=`, `===` (teng) va `!==` (teng emas). Bir nechta shartni birlashtirish uchun **mantiqiy operatorlar** ishlatiladi: `&&` (va), `||` (yoki), `!` (inkor).",
            why: "Har qanday real dastur qaror qabul qiladi: chegirma beriladimi, foydalanuvchi tizimga kirganmi, savatcha bo'shmi. Shartlarsiz dastur faqat bitta, oldindan belgilangan yo'ldan yura oladi.",
            how:
              "JavaScript `if (shart)` ni ko'rganda avval qavs ichidagi ifodani hisoblaydi. Natija `true` bo'lsa — blok bajariladi. `else if` zanjirida shartlar yuqoridan pastga tekshiriladi va **birinchi** rost shartning bloki bajariladi, qolganlari o'tkazib yuboriladi. Shuning uchun shartlar tartibi muhim.\n\n`===` (qat'iy tenglik) qiymatni ham, turni ham taqqoslaydi: `5 === \"5\"` → `false`. Eski `==` operatori turlarni avtomatik o'zgartiradi va `5 == \"5\"` → `true` beradi — bu kutilmagan xatolarga olib keladi, shuning uchun har doim `===` ishlating.",
            steps: [
              { title: "Oddiy shart yozing", body: "Qavs ichida shart, figurali qavslar ichida bajariladigan kod.", code: { language: "javascript", code: code("const harorat = 32;", "if (harorat > 30) {", '  console.log("Bugun issiq, suv iching!");', "}") } },
              { title: "Muqobil yo'l qo'shing", body: "`else` shart yolg'on bo'lganda bajariladi.", code: { language: "javascript", code: code("const yosh = 16;", "if (yosh >= 18) {", '  console.log("Ovoz berish mumkin");', "} else {", '  console.log("Hali erta");', "}") } },
              { title: "Shartlarni birlashtiring", body: "`&&` — ikkala shart ham rost bo'lishi kerak, `||` — kamida bittasi yetarli.", code: { language: "javascript", code: code("const bilet = true;", "const pasport = false;", "if (bilet && pasport) {", '  console.log("Samolyotga chiqishingiz mumkin");', "} else {", '  console.log("Hujjatlar to\'liq emas");', "}") } },
              { title: "Qisqa shart — ternar operator", body: "Ikki variantdan birini tanlash uchun qisqa yozuv: `shart ? agarRost : agarYolgon`.", code: { language: "javascript", code: code("const soat = 20;", 'const salom = soat < 18 ? "Xayrli kun" : "Xayrli kech";', "console.log(salom);") } },
            ],
            examples: [
              {
                title: "Chegirma tizimi",
                body: "Bir nechta shart asosida narxni hisoblash.",
                code: { language: "javascript", code: code("const summa = 450000;", "const doimiyMijoz = true;", "let chegirma = 0;", "", "if (summa >= 500000) {", "  chegirma = 10;", "} else if (summa >= 300000 || doimiyMijoz) {", "  chegirma = 5;", "}", "", "const tolov = summa - (summa * chegirma) / 100;", 'console.log(`Chegirma: ${chegirma}%, to\'lov: ${tolov} so\'m`);') },
              },
            ],
            mistakes: [
              { title: "Taqqoslash o'rniga tenglashtirish", fix: "`if (x = 5)` — bu taqqoslash emas, `x` ga 5 qiymatini berish. To'g'risi: `if (x === 5)`." },
              { title: "== ishlatish", fix: "`==` turlarni yashirincha o'zgartiradi. Har doim `===` va `!==` dan foydalaning." },
              { title: "Noto'g'ri tartibdagi else if", fix: "`ball >= 56` shartini `ball >= 86` dan oldin yozsangiz, 90 ball ham “Qoniqarli” bo'lib qoladi. Eng qat'iy shartni birinchi yozing." },
            ],
            tips: [
              "Murakkab shartlarni nomli o'zgaruvchilarga ajrating: `const kattaBuyurtma = summa > 500000;` — keyin `if (kattaBuyurtma)` o'qilishi oson.",
              "Figurali qavslarni bitta qatorli `if` uchun ham tushirib qoldirmang — keyinroq kod qo'shilganda xato chiqishining oldi olinadi.",
              "Shartni tekshirishda chegaraviy qiymatlarni (aynan 18, aynan 0) albatta sinab ko'ring — xatolar ko'pincha shu yerda yashiringan.",
            ],
            exercise: {
              title: "Yo'l harakati svetofori",
              brief: "Svetofor rangiga qarab haydovchiga ko'rsatma beruvchi dastur yozing.",
              tasks: [
                "`rang` o'zgaruvchisini yarating (`\"qizil\"`, `\"sariq\"` yoki `\"yashil\"`).",
                "Har bir rang uchun mos xabar chiqaring: “To'xtang”, “Tayyorlaning”, “Harakatlaning”.",
                "Noma'lum rang kiritilsa, “Svetofor ishlamayapti” xabarini chiqaring.",
                "Qo'shimcha: `piyoda` (boolean) o'zgaruvchisini qo'shing va yashil chiroqda piyoda bo'lsa “Piyodani o'tkazib yuboring” deb ogohlantiring.",
              ],
              hint: "Matnlarni ham `===` bilan taqqoslaysiz: `if (rang === \"qizil\")`.",
            },
            summary: [
              "`if / else if / else` dastur qaysi yo'ldan borishini belgilaydi.",
              "Taqqoslash: `>`, `<`, `>=`, `<=`, `===`, `!==`; mantiq: `&&`, `||`, `!`.",
              "Har doim `===` ishlating, `==` dan qoching.",
              "`else if` zanjirida birinchi rost shart g'olib bo'ladi — tartib muhim.",
            ],
            keyTerms: [
              { term: "Shart", definition: "`true` yoki `false` qiymat beruvchi ifoda." },
              { term: "Boolean", definition: "Faqat ikki qiymatli tur: `true` (rost) va `false` (yolg'on)." },
              { term: "Ternar operator", definition: "`shart ? a : b` — ikki qiymatdan birini tanlashning qisqa usuli." },
            ],
          },
        },
      ],
      quiz: {
        title: "1-modul testi: o'zgaruvchilar va shartlar",
        description: "JavaScript asoslari, o'zgaruvchilar va shartlar bo'yicha bilimingizni tekshiring.",
        questions: [
          { prompt: "Qiymati keyinchalik o'zgarmaydigan o'zgaruvchi qaysi kalit so'z bilan yaratiladi?", options: ["let", "const", "var", "static"], correct: 1, explanation: "`const` doimiy qiymatlar uchun ishlatiladi; unga qayta qiymat berib bo'lmaydi." },
          { prompt: "`\"5\" + 3` ifodasining natijasi nima?", options: ["8", "\"53\"", "Xato", "undefined"], correct: 1, explanation: "Matnga son qo'shilganda ular matn sifatida yopishtiriladi: \"53\"." },
          { prompt: "`typeof true` nimani qaytaradi?", options: ["\"true\"", "\"string\"", "\"boolean\"", "\"number\""], correct: 2, explanation: "`true` va `false` mantiqiy (boolean) turga tegishli." },
          { prompt: "`5 === \"5\"` qanday natija beradi?", options: ["true", "false", "Xato", "5"], correct: 1, explanation: "Qat'iy tenglik turni ham tekshiradi: son va matn teng emas." },
          { prompt: "Ikkala shart ham rost bo'lishini talab qiluvchi operator?", options: ["||", "!", "&&", "??"], correct: 2, explanation: "`&&` (va) — barcha shartlar rost bo'lsagina natija rost." },
          { prompt: "`ball` 90 bo'lsa, `if (ball >= 56) ... else if (ball >= 86) ...` zanjirida qaysi blok bajariladi?", options: ["Birinchi (>= 56)", "Ikkinchi (>= 86)", "Ikkalasi ham", "Hech biri"], correct: 0, explanation: "Zanjirda birinchi rost shart g'olib bo'ladi. Shuning uchun qat'iyroq shartni birinchi yozish kerak." },
        ],
      },
    },
    {
      title: "Takrorlash, funksiyalar va ma'lumotlar",
      description: "Bir xil ishni takrorlash, kodni funksiyalarga ajratish va ko'plab ma'lumotlarni saqlashni o'rganasiz.",
      lessons: [
        {
          slug: "sikllar",
          title: "Sikllar: for va while",
          summary: "Kodni takrorlash, sanash va cheksiz sikldan saqlanish.",
          durationMin: 18,
          interactive: [
            {
              type: "code-playground",
              title: "Ko'paytirish jadvali",
              config: {
                language: "javascript",
                code: code("const son = 7;", "", "for (let i = 1; i <= 10; i++) {", "  console.log(`${son} x ${i} = ${son * i}`);", "}"),
              },
            },
          ],
          content: {
            intro: "Agar 100 ta talabaga xabar yuborish kerak bo'lsa, 100 qator kod yozmaysiz. Sikl bitta kodni kerakli marta takrorlaydi.",
            concept:
              "**Sikl** (loop) — kod blokini shart bajarilguncha qayta-qayta bajaruvchi tuzilma. JavaScript'da eng ko'p ishlatiladiganlari:\n\n- `for` — takrorlar soni oldindan ma'lum bo'lganda\n- `while` — takrorlash qachon tugashi oldindan noma'lum bo'lganda\n- `for...of` — massivning har bir elementini birma-bir olish uchun\n\nSiklning har bir aylanishi **iteratsiya** deb ataladi.",
            why: "Sikllar avtomatlashtirishning asosi: ro'yxatdagi barcha mahsulotlarni chiqarish, jadval qurish, ma'lumotlarni tekshirish. Ular kodni qisqa qiladi va o'zgartirishni oson qiladi — 10 ni 1000 ga almashtirish uchun bitta raqamni o'zgartirish kifoya.",
            how:
              "`for (let i = 1; i <= 5; i++)` uch qismdan iborat: **boshlanish** (`let i = 1` — hisoblagich yaratiladi), **shart** (`i <= 5` — har aylanishdan oldin tekshiriladi) va **qadam** (`i++` — har aylanishdan keyin hisoblagich bittaga oshadi). Shart `false` bo'lishi bilan sikl to'xtaydi.\n\n`while (shart)` esa faqat shartni tekshiradi; hisoblagichni o'zgartirish sizning zimmangizda. Agar shart hech qachon `false` bo'lmasa, **cheksiz sikl** paydo bo'ladi va sahifa qotib qoladi. `break` siklni darhol to'xtatadi, `continue` esa joriy aylanishni o'tkazib, keyingisiga o'tadi.",
            steps: [
              { title: "1 dan 5 gacha sanang", body: "Klassik `for` sikli.", code: { language: "javascript", code: code("for (let i = 1; i <= 5; i++) {", "  console.log(i);", "}") } },
              { title: "Yig'indini hisoblang", body: "Sikl ichida natijani bosqichma-bosqich to'plash — juda keng tarqalgan usul.", code: { language: "javascript", code: code("let yigindi = 0;", "for (let i = 1; i <= 100; i++) {", "  yigindi += i;", "}", "console.log(yigindi); // 5050") } },
              { title: "while bilan shartli takrorlang", body: "Balans yetguncha tejash: necha oy kerakligini oldindan bilmaymiz.", code: { language: "javascript", code: code("let balans = 0;", "let oy = 0;", "while (balans < 1000000) {", "  balans += 150000;", "  oy++;", "}", "console.log(`${oy} oyda maqsadga yetiladi`);") } },
              { title: "Ro'yxatni aylanib chiqing", body: "`for...of` massiv elementlarini indekssiz, birma-bir beradi.", code: { language: "javascript", code: code('const shaharlar = ["Toshkent", "Buxoro", "Xiva"];', "for (const shahar of shaharlar) {", '  console.log(`Sayohat: ${shahar}`);', "}") } },
            ],
            examples: [
              {
                title: "break va continue",
                body: "Juft sonlarni o'tkazib yuborib, 7 ga yetganda to'xtash.",
                code: { language: "javascript", code: code("for (let i = 1; i <= 10; i++) {", "  if (i % 2 === 0) continue; // juft sonni o'tkazib yuborish", "  if (i > 7) break;           // 7 dan keyin to'xtash", "  console.log(i);", "}", "// 1, 3, 5, 7") },
              },
            ],
            mistakes: [
              { title: "Cheksiz sikl", fix: "`while (i < 10) { console.log(i); }` — `i` hech qachon o'zgarmaydi, sikl abadiy davom etadi. Har doim shartga ta'sir qiluvchi qiymat o'zgarishini tekshiring." },
              { title: "Bitta ortiq yoki kam aylanish", fix: "`i < 10` va `i <= 10` farqi bitta aylanishga teng. Chegarani qog'ozda kichik son bilan sinab ko'ring." },
              { title: "Hisoblagichni sikldan tashqarida ishlatish", fix: "`let i` sikl ichida e'lon qilinadi va undan tashqarida ko'rinmaydi. Natija kerak bo'lsa, uni alohida o'zgaruvchida saqlang." },
            ],
            tips: [
              "Massivlar bilan ishlaganda `for...of` odatda klassik `for` dan aniqroq va xavfsizroq.",
              "Sikl ichida juda og'ir ishni (masalan, serverga so'rov) qilishdan oldin o'ylang — 1000 marta takrorlansa nima bo'ladi?",
              "Ichma-ich sikllar (sikl ichida sikl) tez sekinlashadi: 1000 × 1000 = 1 000 000 marta bajariladi.",
            ],
            exercise: {
              title: "FizzBuzz — dasturchilarning klassik masalasi",
              brief: "Bu masala ko'plab ish suhbatlarida so'raladi.",
              tasks: [
                "1 dan 30 gacha sonlarni chiqaring.",
                "3 ga bo'linadigan sonlar o'rniga “Fizz” chiqaring.",
                "5 ga bo'linadigan sonlar o'rniga “Buzz” chiqaring.",
                "Ham 3 ga, ham 5 ga bo'linadiganlar o'rniga “FizzBuzz” chiqaring.",
              ],
              hint: "Bo'linishni qoldiq operatori bilan tekshiring: `i % 3 === 0`. 15 ga bo'linishni birinchi tekshiring.",
            },
            summary: [
              "`for` — takrorlar soni ma'lum bo'lganda, `while` — noma'lum bo'lganda.",
              "`for...of` massiv elementlarini birma-bir beradi.",
              "`break` siklni to'xtatadi, `continue` keyingi aylanishga o'tadi.",
              "Shart hech qachon `false` bo'lmasa — cheksiz sikl.",
            ],
            keyTerms: [
              { term: "Sikl (loop)", definition: "Kodni shart bajarilguncha takrorlovchi tuzilma." },
              { term: "Iteratsiya", definition: "Siklning bitta aylanishi." },
              { term: "Qoldiq operatori (%)", definition: "Bo'lishdan qolgan qoldiqni beradi: `10 % 3` → 1." },
            ],
          },
        },
        {
          slug: "funksiyalar",
          title: "Funksiyalar",
          summary: "Kodni nomlangan bloklarga ajratish, parametrlar va qaytariladigan qiymat.",
          durationMin: 20,
          interactive: [
            {
              type: "code-playground",
              title: "Funksiya yarating",
              config: {
                language: "javascript",
                code: code(
                  "function salomlash(ism) {",
                  "  return `Assalomu alaykum, ${ism}!`;",
                  "}",
                  "",
                  "const maydon = (eni, boyi) => eni * boyi;",
                  "",
                  'console.log(salomlash("Jasur"));',
                  'console.log(salomlash("Madina"));',
                  "console.log(`Xona maydoni: ${maydon(4, 5)} m²`);",
                ),
              },
            },
          ],
          content: {
            intro: "Bir xil kodni dasturning turli joylarida qayta-qayta yozish — xatolar manbai. Funksiya bu kodni bir marta yozib, istalgancha chaqirish imkonini beradi.",
            concept:
              "**Funksiya** — nom berilgan, qayta ishlatiladigan kod bloki. U kirishda **parametrlar** oladi, ish bajaradi va `return` orqali natija **qaytaradi**.\n\nFunksiya yaratish (e'lon qilish) va uni ishga tushirish (**chaqirish**) — ikki xil narsa. `function narxHisobla(...)` — e'lon; `narxHisobla(5000, 3)` — chaqiriq. Chaqiriqda berilgan aniq qiymatlar **argumentlar** deyiladi.",
            why: "Funksiyalar katta dasturni kichik, tushunarli bo'laklarga ajratadi. Xato topilsa, uni bitta joyda tuzatasiz. Yaxshi nomlangan funksiyalar kodni hikoyaga aylantiradi: `buyurtmaniTekshir()`, `chegirmaniHisobla()`, `chekniChiqar()`.",
            how:
              "Funksiya chaqirilganda JavaScript argumentlarni parametrlarga joylaydi va funksiya tanasini bajaradi. `return` ga yetganda funksiya darhol tugaydi va qiymatni chaqirilgan joyga qaytaradi. `return` bo'lmasa, funksiya `undefined` qaytaradi.\n\nFunksiya ichida e'lon qilingan o'zgaruvchilar faqat shu funksiya ichida ko'rinadi — bu **ko'rinish doirasi** (scope) deyiladi. Zamonaviy JavaScript'da qisqa **arrow funksiyalar** ham keng ishlatiladi: `const kv = (x) => x * x;`.",
            steps: [
              { title: "Funksiyani e'lon qiling", body: "`function` kalit so'zi, nom, qavs ichida parametrlar va tana.", code: { language: "javascript", code: code("function kvadrat(son) {", "  return son * son;", "}") } },
              { title: "Funksiyani chaqiring", body: "Natijani o'zgaruvchiga saqlash yoki darhol ishlatish mumkin.", code: { language: "javascript", code: code("const natija = kvadrat(9);", "console.log(natija);      // 81", "console.log(kvadrat(12)); // 144") } },
              { title: "Standart qiymat bering", body: "Argument berilmasa ishlatiladigan qiymat.", code: { language: "javascript", code: code('function narxFormat(summa, valyuta = "so\'m") {', "  return `${summa.toLocaleString()} ${valyuta}`;", "}", "console.log(narxFormat(150000));", 'console.log(narxFormat(25, "USD"));') } },
              { title: "Arrow funksiyaga aylantiring", body: "Bitta ifodali funksiyalar uchun qisqa yozuv — `return` ham yashirin.", code: { language: "javascript", code: code("const juftmi = (n) => n % 2 === 0;", "console.log(juftmi(10)); // true") } },
            ],
            examples: [
              {
                title: "Funksiyalar birgalikda ishlaydi",
                body: "Kichik funksiyalardan kattaroq mantiq yig'iladi.",
                code: { language: "javascript", code: code("const qqs = (summa) => summa * 0.12;", "const chegirma = (summa, foiz) => summa * (foiz / 100);", "", "function yakuniyNarx(summa, foiz) {", "  const chegirmali = summa - chegirma(summa, foiz);", "  return chegirmali + qqs(chegirmali);", "}", "", "console.log(yakuniyNarx(100000, 10)); // 100800") },
              },
            ],
            mistakes: [
              { title: "return'ni unutish", fix: "Funksiya hisoblaydi, lekin natija `undefined` chiqadi — sabab `return` yo'q. Natija kerak bo'lsa, uni albatta qaytaring." },
              { title: "Funksiyani chaqirmaslik", fix: "`kvadrat` (qavssiz) — bu funksiyaning o'zi, `kvadrat(4)` — chaqiriq. Qavslarni unutmang." },
              { title: "Juda ko'p ish qiladigan funksiya", fix: "Bitta funksiya bitta vazifani bajarsin. Agar nomini “va” so'zisiz aytib bo'lmasa (`hisoblaVaChiqar`), uni ikkiga bo'ling." },
            ],
            tips: [
              "Funksiya nomini fe'l bilan boshlang: `hisobla`, `tekshir`, `yarat`, `ol`.",
              "Parametrlar soni uchtadan oshsa, ularni bitta obyektga jamlashni o'ylab ko'ring.",
              "Funksiyani yozgandan keyin uni turli qiymatlar, jumladan chegaraviy qiymatlar (0, manfiy son, bo'sh matn) bilan sinang.",
            ],
            exercise: {
              title: "Harorat konvertori",
              brief: "Selsiy va Farengeyt o'rtasida o'tkazuvchi funksiyalar yozing.",
              tasks: [
                "`selsiydanFarengeytga(c)` funksiyasini yozing: F = C × 9/5 + 32.",
                "`farengeytdanSelsiyga(f)` funksiyasini yozing: C = (F − 32) × 5/9.",
                "Natijani bir xonali kasrgacha yaxlitlang (`toFixed(1)`).",
                "Toshkentning yozgi (40 °C) va qishki (−5 °C) haroratini Farengeytga o'tkazib chiqaring.",
              ],
            },
            summary: [
              "Funksiya — nomlangan, qayta ishlatiladigan kod bloki.",
              "Parametrlar — kirish, `return` — chiqish.",
              "Funksiya ichidagi o'zgaruvchilar tashqarida ko'rinmaydi (scope).",
              "Arrow funksiya: `(x) => x * 2`.",
            ],
            keyTerms: [
              { term: "Parametr", definition: "Funksiya e'lonidagi kirish nomi." },
              { term: "Argument", definition: "Funksiya chaqirilganda beriladigan aniq qiymat." },
              { term: "Scope (ko'rinish doirasi)", definition: "O'zgaruvchi ko'rinadigan va ishlatilishi mumkin bo'lgan kod sohasi." },
            ],
          },
        },
        {
          slug: "massivlar-va-obyektlar",
          title: "Massivlar va obyektlar",
          summary: "Ro'yxatlar, kalit-qiymat juftliklari, map va filter.",
          durationMin: 22,
          interactive: [
            {
              type: "code-playground",
              title: "Mahsulotlar katalogi",
              config: {
                language: "javascript",
                code: code(
                  "const mahsulotlar = [",
                  '  { nom: "Noutbuk", narx: 8500000, bor: true },',
                  '  { nom: "Sichqoncha", narx: 120000, bor: true },',
                  '  { nom: "Monitor", narx: 2900000, bor: false },',
                  "];",
                  "",
                  "const mavjudlar = mahsulotlar.filter((m) => m.bor);",
                  "const nomlar = mavjudlar.map((m) => m.nom);",
                  "",
                  "console.log(nomlar);",
                  "console.log(`Birinchi mahsulot: ${mahsulotlar[0].nom}`);",
                  "console.log(`Jami: ${mahsulotlar.length} ta`);",
                ),
              },
            },
          ],
          content: {
            intro: "Real dasturlar yuzlab ma'lumotlar bilan ishlaydi: talabalar ro'yxati, mahsulotlar, xabarlar. Ularni tartibli saqlash uchun massiv va obyektlar kerak.",
            concept:
              "**Massiv** (array) — tartiblangan qiymatlar ro'yxati, kvadrat qavslarda yoziladi: `[\"olma\", \"nok\", \"uzum\"]`. Har bir elementning **indeksi** bor va hisoblash **0 dan** boshlanadi: birinchi element `meva[0]`.\n\n**Obyekt** (object) — nomlangan xususiyatlar to'plami, figurali qavslarda yoziladi: `{ ism: \"Aziz\", yosh: 21 }`. Har bir xususiyat **kalit** va **qiymat** juftligidan iborat va nuqta orqali olinadi: `talaba.ism`.\n\nAmaliyotda ular birga ishlatiladi: obyektlar massivi — masalan, har bir mahsulot obyekt, katalog esa massiv.",
            why: "Deyarli har qanday ilova ma'lumotlarni shu ikki tuzilmada saqlaydi. Serverdan keladigan JSON ma'lumotlar ham aynan massiv va obyektlardan iborat. Ular bilan erkin ishlash — frontend va backend dasturlashning asosiy ko'nikmasi.",
            how:
              "Massivning `length` xususiyati elementlar sonini beradi. `push()` oxiriga element qo'shadi, `pop()` oxirgisini olib tashlaydi, `includes()` element bor-yo'qligini tekshiradi.\n\nEng kuchli vositalar — massiv **metodlari**: `map()` har bir elementni o'zgartirib, yangi massiv qaytaradi; `filter()` shartga mos elementlarni tanlaydi; `find()` birinchi mos elementni topadi. Ular asl massivni o'zgartirmaydi — bu xatolarning oldini oladi.\n\nObyekt xususiyatini o'zgartirish yoki qo'shish uchun unga qiymat beriladi: `talaba.kurs = 2`.",
            steps: [
              { title: "Massiv yarating va o'qing", body: "Indeks 0 dan boshlanadi, oxirgi element indeksi — `length - 1`.", code: { language: "javascript", code: code('const kunlar = ["Dushanba", "Seshanba", "Chorshanba"];', "console.log(kunlar[0]);                 // Dushanba", "console.log(kunlar[kunlar.length - 1]); // Chorshanba") } },
              { title: "Element qo'shing", body: "`const` massivning o'zini almashtirishni taqiqlaydi, lekin ichiga element qo'shish mumkin.", code: { language: "javascript", code: code('kunlar.push("Payshanba");', "console.log(kunlar.length); // 4") } },
              { title: "Obyekt yarating", body: "Bitta narsaning bir nechta xususiyatini birga saqlang.", code: { language: "javascript", code: code("const kitob = {", '  nomi: "O\'tkan kunlar",', '  muallif: "Abdulla Qodiriy",', "  yil: 1926,", "};", "console.log(`${kitob.nomi} — ${kitob.muallif}`);") } },
              { title: "map va filter bilan ishlang", body: "Ballar ro'yxatidan o'tganlarni tanlab, ularga bonus qo'shamiz.", code: { language: "javascript", code: code("const ballar = [45, 78, 92, 60, 30];", "const otganlar = ballar.filter((b) => b >= 56);", "const bonusli = otganlar.map((b) => b + 5);", "console.log(bonusli); // [83, 97, 65]") } },
            ],
            examples: [
              {
                title: "Obyektlar massivida qidiruv",
                body: "`find()` mos keladigan birinchi obyektni qaytaradi, topilmasa — `undefined`.",
                code: { language: "javascript", code: code("const talabalar = [", '  { id: 1, ism: "Nodira", ball: 91 },', '  { id: 2, ism: "Sardor", ball: 74 },', "];", "const topilgan = talabalar.find((t) => t.id === 2);", "console.log(topilgan?.ism ?? \"Topilmadi\"); // Sardor") },
              },
            ],
            mistakes: [
              { title: "Indeksni 1 dan boshlash", fix: "Birinchi element `[0]` da. `massiv[massiv.length]` har doim `undefined` beradi." },
              { title: "map natijasini saqlamaslik", fix: "`ballar.map(...)` yangi massiv qaytaradi, asl massiv o'zgarmaydi. Natijani o'zgaruvchiga saqlang." },
              { title: "Mavjud bo'lmagan xususiyatga murojaat", fix: "`undefined.ism` xato beradi. Shubhali joylarda ixtiyoriy zanjir `?.` ishlating: `topilgan?.ism`." },
            ],
            tips: [
              "Massivga ko'plikdagi nom bering (`talabalar`), uning elementiga — birlikdagi nom (`talaba`).",
              "Ma'lumotni ko'rish uchun `console.table(massiv)` — obyektlar massivini chiroyli jadval ko'rinishida chiqaradi (brauzer konsolida).",
              "`map`, `filter`, `find` — har kungi asosiy vositalaringiz. Ularni sikl o'rniga ishlatishni odat qiling.",
            ],
            exercise: {
              title: "Imtihon natijalari tahlili",
              brief: "Talabalar obyektlari massivi bilan ishlovchi dastur yozing.",
              tasks: [
                "Kamida 5 ta talaba obyektidan (`ism`, `ball`) iborat massiv yarating.",
                "`filter` yordamida 56 va undan yuqori ball olganlarni ajrating.",
                "`map` yordamida faqat o'tganlar ismlarining ro'yxatini chiqaring.",
                "Sikl yoki `reduce` yordamida o'rtacha ballni hisoblang.",
                "Eng yuqori ball olgan talabani toping va chiqaring.",
              ],
            },
            summary: [
              "Massiv — tartiblangan ro'yxat, indeks 0 dan boshlanadi.",
              "Obyekt — kalit-qiymat juftliklari to'plami, nuqta orqali o'qiladi.",
              "`map` o'zgartiradi, `filter` tanlaydi, `find` topadi — asl massivga tegmaydi.",
              "Amaliyotda obyektlar massivi eng keng tarqalgan tuzilma.",
            ],
            keyTerms: [
              { term: "Massiv (array)", definition: "Tartiblangan qiymatlar ro'yxati." },
              { term: "Indeks", definition: "Elementning massivdagi tartib raqami (0 dan)." },
              { term: "Obyekt (object)", definition: "Kalit-qiymat juftliklaridan iborat tuzilma." },
              { term: "JSON", definition: "Obyekt va massivlarni matn ko'rinishida uzatish formati." },
            ],
          },
        },
      ],
      quiz: {
        title: "2-modul testi: sikllar, funksiyalar, massivlar",
        description: "Takrorlash, funksiyalar va ma'lumot tuzilmalari bo'yicha savollar.",
        questions: [
          { prompt: "`for (let i = 0; i < 5; i++)` sikli necha marta aylanadi?", options: ["4", "5", "6", "Cheksiz"], correct: 1, explanation: "i qiymatlari: 0, 1, 2, 3, 4 — jami 5 marta." },
          { prompt: "Siklni darhol to'xtatuvchi kalit so'z?", options: ["stop", "continue", "break", "return"], correct: 2, explanation: "`break` siklni tugatadi, `continue` esa faqat joriy aylanishni o'tkazib yuboradi." },
          { prompt: "`return` yo'q funksiya nima qaytaradi?", options: ["0", "null", "undefined", "Xato beradi"], correct: 2, explanation: "Qiymat qaytarilmasa, funksiya natijasi `undefined` bo'ladi." },
          { prompt: "`[\"a\", \"b\", \"c\"][1]` nimaga teng?", options: ["\"a\"", "\"b\"", "\"c\"", "undefined"], correct: 1, explanation: "Indeks 0 dan boshlanadi: 0 → \"a\", 1 → \"b\"." },
          { prompt: "Shartga mos elementlardan yangi massiv qaytaruvchi metod?", options: ["map", "filter", "push", "find"], correct: 1, explanation: "`filter` shartga mos barcha elementlarni yangi massivda qaytaradi." },
          { prompt: "`const talaba = { ism: \"Ali\" }` dan ismni qanday olinadi?", options: ["talaba[ism]", "talaba->ism", "talaba.ism", "ism.talaba"], correct: 2, explanation: "Obyekt xususiyati nuqta orqali olinadi: `talaba.ism`." },
        ],
      },
    },
    {
      title: "Brauzerda JavaScript",
      description: "Sahifa elementlarini topish, o'zgartirish va foydalanuvchi harakatlariga javob berishni o'rganasiz.",
      lessons: [
        {
          slug: "dom-va-hodisalar",
          title: "DOM bilan ishlash va hodisalar",
          summary: "querySelector, textContent, classList va addEventListener.",
          durationMin: 24,
          interactive: [
            {
              type: "code-playground",
              title: "Hisoblagich ilovasi",
              description: "Tugmalarni bosib ko'ring, so'ng kodni o'zgartirib, yangi imkoniyat qo'shing.",
              config: {
                language: "html",
                code: code(
                  "<style>",
                  "  body { font-family: system-ui; text-align: center; padding: 24px; }",
                  "  #son { font-size: 64px; font-weight: 700; margin: 12px 0; }",
                  "  button { font-size: 18px; padding: 8px 18px; margin: 4px; border-radius: 10px; border: 1px solid #ccc; cursor: pointer; }",
                  "  .manfiy { color: #d23c3c; }",
                  "</style>",
                  "",
                  "<h2>Hisoblagich</h2>",
                  '<div id="son">0</div>',
                  '<button id="kamaytir">−</button>',
                  '<button id="nol">0</button>',
                  '<button id="oshir">+</button>',
                  "",
                  "<script>",
                  "  let qiymat = 0;",
                  '  const sonEl = document.querySelector("#son");',
                  "",
                  "  function yangila() {",
                  "    sonEl.textContent = qiymat;",
                  '    sonEl.classList.toggle("manfiy", qiymat < 0);',
                  "  }",
                  "",
                  '  document.querySelector("#oshir").addEventListener("click", () => { qiymat++; yangila(); });',
                  '  document.querySelector("#kamaytir").addEventListener("click", () => { qiymat--; yangila(); });',
                  '  document.querySelector("#nol").addEventListener("click", () => { qiymat = 0; yangila(); });',
                  "</script>",
                ),
              },
            },
          ],
          content: {
            intro: "Hozirgacha natijalarni faqat konsolda ko'rdik. Endi JavaScript'ni sahifaga ulab, foydalanuvchi bosganda haqiqatan o'zgaradigan interfeys yaratamiz.",
            concept:
              "**DOM** (Document Object Model) — brauzer HTML'dan yaratadigan obyektlar daraxti. Har bir teg — daraxtdagi **tugun** (node). JavaScript shu daraxt orqali sahifani o'qiydi va o'zgartiradi: matnni almashtiradi, klass qo'shadi, yangi element yaratadi.\n\n**Hodisa** (event) — sahifada sodir bo'lgan voqea: tugma bosilishi (`click`), matn kiritilishi (`input`), forma yuborilishi (`submit`). `addEventListener` hodisa sodir bo'lganda chaqiriladigan funksiyani biriktiradi.",
            why: "Aynan DOM va hodisalar sahifani “jonli” qiladi: menyu ochilishi, forma tekshiruvi, rasm galereyasi, tungi rejim tugmasi. React kabi freymvorklar ham ichkarida shu mexanizmdan foydalanadi — asosni tushunish ularni o'rganishni ancha osonlashtiradi.",
            how:
              "`document.querySelector(\"#son\")` CSS selektori bo'yicha birinchi mos elementni qaytaradi (`#` — id, `.` — klass). Topilgan elementning `textContent` xususiyati ichidagi matnni o'qiydi yoki o'zgartiradi. `classList.add`, `remove` va `toggle` klasslarni boshqaradi — dizayn CSS'da qoladi, JavaScript faqat klassni almashtiradi.\n\n`element.addEventListener(\"click\", funksiya)` — brauzerga “shu element bosilganda funksiyani chaqir” deydi. Funksiya darhol emas, faqat hodisa sodir bo'lganda bajariladi. Formalar uchun `submit` hodisasida `event.preventDefault()` chaqiriladi — aks holda brauzer sahifani qayta yuklaydi.",
            steps: [
              { title: "Elementni toping", body: "Selektor CSS'dagi bilan bir xil.", code: { language: "javascript", code: code('const sarlavha = document.querySelector("h1");', 'const tugmalar = document.querySelectorAll(".tugma"); // hammasi') } },
              { title: "Matnni o'zgartiring", body: "Foydalanuvchi kiritgan matn uchun doim `textContent` ishlating — u HTML'ni bajarmaydi va xavfsiz.", code: { language: "javascript", code: code('sarlavha.textContent = "Yangi sarlavha";') } },
              { title: "Klass bilan dizaynni almashtiring", body: "Uslub CSS'da, JavaScript faqat klassni yoqib-o'chiradi.", code: { language: "javascript", code: code('document.body.classList.toggle("tungi-rejim");') } },
              { title: "Hodisaga javob bering", body: "Tugma bosilganda funksiya ishga tushadi.", code: { language: "javascript", code: code('const tugma = document.querySelector("#salom");', 'tugma.addEventListener("click", () => {', '  alert("Salom!");', "});") } },
              { title: "Formani qayta ishlang", body: "`preventDefault()` sahifa qayta yuklanishining oldini oladi.", code: { language: "javascript", code: code('const forma = document.querySelector("form");', 'forma.addEventListener("submit", (e) => {', "  e.preventDefault();", '  const ism = forma.querySelector("input").value.trim();', '  if (!ism) return alert("Ismni kiriting");', "  console.log(`Yuborildi: ${ism}`);", "});") } },
            ],
            examples: [
              {
                title: "Ro'yxatga element qo'shish",
                body: "`createElement` yangi element yaratadi, `append` uni sahifaga qo'shadi.",
                code: { language: "javascript", code: code('const royxat = document.querySelector("#vazifalar");', "function qosh(matn) {", '  const li = document.createElement("li");', "  li.textContent = matn;", "  royxat.append(li);", "}", 'qosh("JavaScript darsini tugatish");') },
              },
            ],
            mistakes: [
              { title: "Skript HTML'dan oldin ishlashi", fix: "`<head>` dagi skript element hali yaratilmagan paytda ishlaydi va `null` qaytaradi. `<script defer>` ishlating yoki skriptni `</body>` oldiga qo'ying." },
              { title: "innerHTML'ga foydalanuvchi matnini qo'yish", fix: "`el.innerHTML = kiritilgan` — xavfli: matn ichidagi kod bajarilishi mumkin (XSS hujumi). Matn uchun `textContent` ishlating." },
              { title: "Funksiyani darhol chaqirib yuborish", fix: "`addEventListener(\"click\", yangila())` — noto'g'ri, funksiya darhol bajariladi. To'g'risi: `addEventListener(\"click\", yangila)`." },
            ],
            tips: [
              "Holatni (masalan, `qiymat`) o'zgaruvchida saqlang va sahifani bitta `yangila()` funksiyasi orqali chizing — kod tartibli bo'ladi.",
              "DevTools'da “Elements” bo'limida JavaScript qilgan o'zgarishlarni jonli kuzatishingiz mumkin.",
              "`querySelector` `null` qaytarsa, selektorda xato bor yoki element hali yaratilmagan.",
            ],
            exercise: {
              title: "Kichik vazifalar ro'yxati",
              brief: "Kurs yakuniy loyihasiga birinchi qadam: kiritish maydoni va ro'yxatdan iborat sahifa yarating.",
              tasks: [
                "HTML'da `input`, “Qo'shish” tugmasi va bo'sh `ul` yarating.",
                "Tugma bosilganda kiritilgan matn ro'yxatga yangi `li` bo'lib qo'shilsin.",
                "Bo'sh matn qo'shilmasin va qo'shilgandan keyin maydon tozalansin.",
                "Har bir `li` bosilganda unga `bajarildi` klassi qo'shilib, matn ustidan chiziq tortilsin.",
                "Qo'shimcha: ro'yxat ostida jami vazifalar sonini ko'rsating.",
              ],
              hint: "Ustidan chiziq uchun CSS: `.bajarildi { text-decoration: line-through; }`.",
            },
            summary: [
              "DOM — brauzer HTML'dan yaratadigan obyektlar daraxti.",
              "`querySelector` element topadi, `textContent` matnni o'zgartiradi, `classList` klasslarni boshqaradi.",
              "`addEventListener` hodisalarga javob beradi; formalarda `preventDefault()`.",
              "Foydalanuvchi matni uchun `textContent` — xavfsiz, `innerHTML` — xavfli.",
            ],
            keyTerms: [
              { term: "DOM", definition: "Sahifaning JavaScript orqali boshqariladigan obyekt ko'rinishi." },
              { term: "Hodisa (event)", definition: "Sahifada sodir bo'lgan voqea: bosish, kiritish, yuborish." },
              { term: "XSS", definition: "Sahifaga zararli skript kiritish hujumi; `textContent` undan himoya qiladi." },
            ],
          },
        },
      ],
      quiz: {
        title: "3-modul testi: DOM va hodisalar",
        description: "Brauzerda JavaScript bilan ishlash bo'yicha savollar.",
        questions: [
          { prompt: "`document.querySelector(\".karta\")` nima qaytaradi?", options: ["Barcha .karta elementlarini", "Birinchi .karta elementini", "Faqat id'si karta bo'lgan elementni", "Har doim null"], correct: 1, explanation: "`querySelector` birinchi mos elementni, `querySelectorAll` esa hammasini qaytaradi." },
          { prompt: "Foydalanuvchi kiritgan matnni sahifaga xavfsiz chiqarish uchun nima ishlatiladi?", options: ["innerHTML", "textContent", "document.write", "eval"], correct: 1, explanation: "`textContent` matnni HTML sifatida talqin qilmaydi, shuning uchun XSS'dan himoya qiladi." },
          { prompt: "Forma yuborilganda sahifa qayta yuklanmasligi uchun nima chaqiriladi?", options: ["e.stop()", "e.preventDefault()", "return false()", "form.reset()"], correct: 1, explanation: "`preventDefault()` brauzerning standart harakatini bekor qiladi." },
          { prompt: "`btn.addEventListener(\"click\", yangila())` kodidagi xato nima?", options: ["Xato yo'q", "yangila darhol chaqiriladi", "click hodisasi mavjud emas", "addEventListener noto'g'ri yozilgan"], correct: 1, explanation: "Qavslar funksiyani darhol chaqiradi. Funksiyaning o'zini uzatish kerak: `yangila`." },
        ],
      },
    },
  ],
  finalQuiz: {
    title: "Yakuniy imtihon: JavaScript asoslari",
    description: "Kursni yakunlash va sertifikat olish uchun kamida 70% to'g'ri javob bering.",
    passingScore: 70,
    questions: [
      { prompt: "Qaysi e'lon qiymatni keyinchalik o'zgartirishga ruxsat beradi?", options: ["const narx = 10", "let narx = 10", "Ikkalasi ham", "Hech biri"], correct: 1, explanation: "`let` qayta qiymat berishga ruxsat beradi, `const` — yo'q." },
      { prompt: "`Number(\"7\") + 3` natijasi?", options: ["\"73\"", "10", "NaN", "Xato"], correct: 1, explanation: "`Number()` matnni songa aylantiradi: 7 + 3 = 10." },
      { prompt: "Qaysi operator qiymat bilan birga turni ham taqqoslaydi?", options: ["=", "==", "===", "=>"], correct: 2, explanation: "`===` qat'iy tenglik operatori." },
      { prompt: "`while` siklida cheksiz siklning asosiy sababi?", options: ["break ishlatilgani", "Shartga ta'sir qiluvchi qiymat o'zgarmasligi", "console.log ishlatilgani", "let o'rniga const"], correct: 1, explanation: "Shart hech qachon `false` bo'lmasa, sikl to'xtamaydi." },
      { prompt: "`const kv = (x) => x * x; kv(6)` natijasi?", options: ["12", "36", "66", "undefined"], correct: 1, explanation: "Arrow funksiya 6 × 6 = 36 ni qaytaradi." },
      { prompt: "`[10, 20, 30].map((n) => n / 10)` natijasi?", options: ["[1, 2, 3]", "6", "[10, 20, 30]", "[100, 200, 300]"], correct: 0, explanation: "`map` har bir elementni o'zgartirib, yangi massiv qaytaradi." },
      { prompt: "Obyektlar massividan id bo'yicha bitta elementni topish uchun eng mos metod?", options: ["filter", "find", "push", "includes"], correct: 1, explanation: "`find` birinchi mos elementni qaytaradi." },
      { prompt: "Skript HTML elementlari yaratilgandan keyin ishlashi uchun nima qilinadi?", options: ["<script async>", "<script defer> yoki </body> oldiga qo'yish", "<script type=\"module\" async>", "Hech narsa"], correct: 1, explanation: "`defer` skriptni HTML tahlil qilingandan keyin bajaradi." },
    ],
  },
};
