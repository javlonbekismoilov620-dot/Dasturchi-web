import type { CourseSeed } from "../../src/lib/types.ts";

export const webAsoslari: CourseSeed = {
  slug: "web-asoslari",
  title: "Veb-sahifa yaratish: HTML va CSS",
  subtitle: "Birinchi saytingizni noldan quring",
  description:
    "Bu kurs dasturlashni hech qachon o'rganmagan odam uchun mo'ljallangan. Brauzer sahifani qanday ko'rsatishini tushunasiz, HTML bilan sahifa tuzilmasini yozasiz va CSS bilan uni chiroyli, telefonda ham qulay dizaynga aylantirasiz. Kurs oxirida o'zingizning shaxsiy portfolio sahifangizni yaratasiz.",
  category: "dasturlash",
  level: 1,
  status: "published",
  featured: true,
  order: 0,
  accent: "azure",
  icon: "Code2",
  objectives: [
    "Veb-sahifa brauzerda qanday paydo bo'lishini tushunish",
    "HTML teglari bilan to'g'ri va semantik tuzilma yozish",
    "Formalar yordamida foydalanuvchidan ma'lumot olish",
    "CSS selektorlari, ranglar va shriftlar bilan dizayn qilish",
    "Box model va Flexbox yordamida elementlarni joylashtirish",
    "Telefon, planshet va kompyuterda chiroyli ko'rinadigan moslashuvchan sahifa yaratish",
  ],
  skills: ["HTML5", "CSS3", "Semantik teglar", "Formalar", "Box model", "Flexbox", "Responsive dizayn"],
  requirements: [
    "Kompyuter (Windows, macOS yoki Linux)",
    "Bepul VS Code muharriri va istalgan zamonaviy brauzer",
    "Oldingi dasturlash tajribasi talab qilinmaydi",
  ],
  audience: [
    "Dasturlashni noldan boshlamoqchi bo'lganlar",
    "O'z saytini yaratmoqchi bo'lgan tadbirkor va ijodkorlar",
    "Frontend dasturchi bo'lishni maqsad qilganlar",
  ],
  software: ["HTML", "CSS", "VS Code", "Brauzer"],
  tags: ["html", "css", "veb", "sayt", "frontend", "boshlang'ich"],
  estimatedHours: 9,
  finalProject: {
    title: "Shaxsiy portfolio sahifasi",
    description:
      "O'zingiz haqingizda ma'lumot, ko'nikmalaringiz, ishlaringiz va aloqa formasi joylashgan bir sahifali sayt yarating. Sahifa telefon va kompyuterda birdek chiroyli ko'rinishi kerak.",
    deliverables: [
      "Semantik HTML tuzilmasi: header, main, section va footer",
      "Kamida uchta bo'lim: “Men haqimda”, “Ko'nikmalar”, “Ishlarim”",
      "Label'lari to'g'ri bog'langan aloqa formasi",
      "Flexbox yordamida joylashtirilgan kartochkalar",
      "Kamida bitta media query bilan mobil moslashuv",
    ],
  },
  modules: [
    /* ───────────────────────── 1-MODUL ───────────────────────── */
    {
      title: "Veb qanday ishlaydi va HTML asoslari",
      description: "Brauzer, server va HTML o'rtasidagi bog'liqlikni tushunib, birinchi sahifangizni yozasiz.",
      lessons: [
        {
          slug: "veb-qanday-ishlaydi",
          title: "Veb-sahifa qanday ishlaydi",
          summary: "Brauzer, server va HTML, CSS, JavaScript'ning vazifalari.",
          durationMin: 12,
          isPreview: true,
          content: {
            intro:
              "Har kuni o'nlab saytlarni ochasiz, lekin manzil satriga havola yozganingizda aslida nima sodir bo'ladi? Bu darsda sayt yaratishni o'rganishdan oldin uning qanday ishlashini oddiy tilda tushunib olamiz.",
            concept:
              "**Veb-sahifa** — brauzer o'qiy oladigan matnli fayllar to'plami. Bu fayllar odatda uch turdagi koddan iborat bo'ladi: **HTML** sahifaning tuzilmasini (sarlavha, matn, rasm, tugma), **CSS** uning tashqi ko'rinishini (rang, shrift, joylashuv), **JavaScript** esa xatti-harakatini (tugma bosilganda nima bo'lishi) belgilaydi.\n\n**Brauzer** (Chrome, Firefox, Safari, Edge) — shu fayllarni yuklab olib, ularni ko'rinadigan sahifaga aylantiruvchi dastur. **Server** esa fayllar saqlanadigan va so'rov kelganda ularni yuboradigan kompyuter.",
            why:
              "Bu bilim keyingi barcha darslarning poydevori. Sahifa nima uchun sekin ochilayotgani, rasm nega ko'rinmayotgani yoki dizayn nega buzilganini tushunish uchun brauzer va server o'rtasidagi jarayonni bilish kerak. Professional dasturchilar ham xatolarni aynan shu jarayonni tasavvur qilib topishadi.",
            how:
              "Siz brauzerga `https://example.uz` deb yozasiz. Brauzer avval **DNS** orqali bu nomga mos keluvchi server manzilini (IP manzil) topadi. Keyin serverga **HTTP so'rovi** yuboradi: “Menga bosh sahifani bering”. Server HTML faylini qaytaradi.\n\nBrauzer HTML'ni yuqoridan pastga o'qiydi. U CSS fayliga havola ko'rsa, uni ham yuklaydi; rasm ko'rsa, rasmni so'raydi. Shundan so'ng barcha qismlarni birlashtirib, sahifani ekranga “chizadi”. Bu jarayon odatda bir soniyadan kamroq vaqt oladi.",
            steps: [
              {
                title: "Istalgan saytni oching",
                body: "Brauzeringizda tanish saytni oching, masalan, yangiliklar sayti.",
              },
              {
                title: "Sahifa kodini ko'ring",
                body: "Sahifaning bo'sh joyida sichqonchaning o'ng tugmasini bosib, “Sahifa kodini ko'rish” (View Page Source) bandini tanlang yoki `Ctrl + U` (macOS'da `Cmd + Option + U`) tugmalarini bosing. Siz ko'rgan matn — brauzer serverdan olgan HTML.",
              },
              {
                title: "Dasturchi vositalarini oching",
                body: "`F12` tugmasini bosing (macOS'da `Cmd + Option + I`). “Elements” bo'limida sahifaning tuzilmasini, “Network” bo'limida esa qaysi fayllar yuklanganini ko'rasiz.",
              },
              {
                title: "Fayllar turini kuzating",
                body: "“Network” bo'limida sahifani yangilang (`F5`). Ro'yxatda `.html`, `.css`, `.js` va rasm fayllari paydo bo'ladi. Har biri alohida so'rov orqali yuklanadi.",
              },
            ],
            examples: [
              {
                title: "Uy qurilishi o'xshatmasi",
                body: "HTML — uyning g'isht va devorlari (tuzilma). CSS — bo'yoq, mebel va bezaklar (ko'rinish). JavaScript — elektr va suv tizimi (harakat: chiroqni yoqsangiz yonadi). Devorlarsiz bo'yoq qila olmaganingizdek, HTML'siz CSS ham ishlamaydi.",
              },
              {
                title: "Eng oddiy HTML sahifa",
                body: "Quyidagi kod brauzerda bitta sarlavha va bitta gap ko'rsatadi. Keyingi darsda uni o'zingiz yozasiz.",
                code: {
                  language: "html",
                  code: "<!DOCTYPE html>\n<html lang=\"uz\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <title>Mening sahifam</title>\n  </head>\n  <body>\n    <h1>Salom, dunyo!</h1>\n    <p>Bu mening birinchi veb-sahifam.</p>\n  </body>\n</html>",
                },
              },
            ],
            mistakes: [
              {
                title: "HTML'ni dasturlash tili deb o'ylash",
                fix: "HTML — belgilash tili (markup language). U hisob-kitob qilmaydi va qaror qabul qilmaydi, faqat mazmunni tasvirlaydi. Mantiq uchun JavaScript ishlatiladi.",
              },
              {
                title: "Internet va vebni bir narsa deb bilish",
                fix: "Internet — kompyuterlarni bog'laydigan global tarmoq. Veb esa shu tarmoq orqali ishlaydigan xizmatlardan biri (elektron pochta, messenjerlar ham internetdan foydalanadi).",
              },
              {
                title: "Sayt faqat bitta fayldan iborat deb o'ylash",
                fix: "Oddiy sahifa ham odatda HTML, bir nechta CSS, JavaScript, rasm va shrift fayllaridan tashkil topadi. Network bo'limida buni o'zingiz ko'rdingiz.",
              },
            ],
            tips: [
              "Dasturchi vositalari (DevTools) — sizning eng yaqin do'stingiz. Uni har kuni ochishga odatlaning.",
              "Yoqtirgan saytlaringiz kodini ko'rib turing: professionallar qanday tuzilma ishlatishini o'rganishning eng tez yo'li.",
              "Chrome yoki Firefox'dan foydalaning — ularning dasturchi vositalari eng qulay.",
            ],
            exercise: {
              title: "Saytni “ichidan” o'rganing",
              brief: "Istalgan uchta saytni tanlab, ularning tuzilmasini dasturchi vositalari orqali tekshiring.",
              tasks: [
                "Har bir saytning sahifa kodini oching va `<title>` tegi ichidagi matnni toping.",
                "Network bo'limida sahifa yuklanganda nechta so'rov yuborilganini yozib oling.",
                "Har bir saytda kamida bitta CSS va bitta rasm faylini toping.",
                "Natijalarni qisqa jadval ko'rinishida qaydlar bo'limiga yozing.",
              ],
              hint: "Network bo'limining pastki qismida umumiy so'rovlar soni (requests) ko'rsatiladi.",
            },
            summary: [
              "Veb-sahifa HTML (tuzilma), CSS (ko'rinish) va JavaScript (harakat) dan iborat.",
              "Brauzer serverdan fayllarni HTTP orqali so'raydi va ularni sahifaga aylantiradi.",
              "DNS sayt nomini server manziliga (IP) aylantiradi.",
              "Dasturchi vositalari (F12) sahifaning ichki tuzilmasini ko'rsatadi.",
            ],
            keyTerms: [
              { term: "Brauzer", definition: "Veb-sahifalarni yuklab, ekranda ko'rsatuvchi dastur." },
              { term: "Server", definition: "Sayt fayllari saqlanadigan va so'rovlarga javob beradigan kompyuter." },
              { term: "HTTP", definition: "Brauzer va server o'rtasidagi muloqot qoidalari (protokol)." },
              { term: "DNS", definition: "Sayt nomlarini IP manzillarga aylantiruvchi tizim — internetning “telefon kitobi”." },
            ],
          },
        },
        {
          slug: "birinchi-html-sahifa",
          title: "Birinchi HTML sahifa",
          summary: "VS Code'ni sozlash, HTML hujjat tuzilmasi, teglar va atributlar.",
          durationMin: 18,
          isPreview: true,
          interactive: [
            {
              type: "code-playground",
              title: "HTML'ni o'zingiz yozing",
              description: "Kodni o'zgartiring — natija o'ng tomonda darhol yangilanadi.",
              config: {
                language: "html",
                code: "<!DOCTYPE html>\n<html lang=\"uz\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <title>Birinchi sahifam</title>\n  </head>\n  <body>\n    <h1>Assalomu alaykum!</h1>\n    <p>Mening ismim <strong>Aziz</strong>. Men veb-dasturlashni o'rganyapman.</p>\n  </body>\n</html>",
              },
            },
          ],
          content: {
            intro:
              "Endi nazariyadan amaliyotga o'tamiz. Bu darsda kompyuteringizda birinchi HTML faylini yaratasiz va uni brauzerda ochasiz.",
            concept:
              "**HTML** (HyperText Markup Language) — sahifadagi har bir qismga “bu sarlavha”, “bu paragraf”, “bu rasm” deb belgi qo'yadigan til. Belgilar **teg** deb ataladi va burchakli qavslar ichida yoziladi: `<p>`.\n\nKo'pchilik teglar juft bo'ladi: ochuvchi `<p>` va yopuvchi `</p>`. Ular orasidagi matn — **kontent**. Ochuvchi teg, kontent va yopuvchi teg birgalikda **element** deyiladi. Teglar qo'shimcha ma'lumotni **atributlar** orqali oladi: `<html lang=\"uz\">` — bu yerda `lang` atribut, `\"uz\"` esa uning qiymati.",
            why:
              "Har qanday sayt — eng oddiy blogdan tortib katta onlayn do'kongacha — HTML asosida quriladi. React yoki Next.js kabi zamonaviy vositalar ham oxir-oqibat brauzerga HTML yuboradi. To'g'ri yozilgan HTML qidiruv tizimlarida (SEO) yaxshi ko'rinadi va ko'zi ojiz foydalanuvchilar uchun ekran o'quvchi dasturlar bilan qulay ishlaydi.",
            how:
              "Har bir HTML hujjat bir xil “skelet”ga ega. `<!DOCTYPE html>` brauzerga bu zamonaviy HTML5 hujjat ekanini aytadi. `<html>` — butun hujjatni o'raydigan ildiz element. Uning ichida ikki qism bor:\n\n**`<head>`** — sahifa haqidagi xizmat ma'lumotlari: belgilar kodirovkasi (`charset`), brauzer yorlig'idagi sarlavha (`<title>`), CSS fayllarga havolalar. Bu qism ekranda ko'rinmaydi.\n\n**`<body>`** — foydalanuvchi ko'radigan barcha kontent: matnlar, rasmlar, tugmalar.",
            steps: [
              {
                title: "VS Code'ni o'rnating",
                body: "code.visualstudio.com saytidan bepul VS Code muharririni yuklab o'rnating. Bu dunyodagi eng mashhur kod muharriri.",
              },
              {
                title: "Loyiha papkasini yarating",
                body: "Kompyuteringizda `mening-saytim` nomli papka yarating. VS Code'da **File → Open Folder** orqali shu papkani oching.",
              },
              {
                title: "index.html faylini yarating",
                body: "Chap paneldagi “New File” belgisini bosib, faylga `index.html` deb nom bering. `index` — saytning bosh sahifasi uchun an'anaviy nom.",
              },
              {
                title: "Skeletni yozing",
                body: "Faylga quyidagi kodni yozing. VS Code'da `!` belgisini yozib `Tab` bosish ham shunga o'xshash skeletni avtomatik yaratadi (bu Emmet qisqartmasi).",
                code: {
                  language: "html",
                  filename: "index.html",
                  code: "<!DOCTYPE html>\n<html lang=\"uz\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Mening saytim</title>\n  </head>\n  <body>\n    <h1>Salom, men veb-dasturchiman!</h1>\n    <p>Bu sahifani o'zim yozdim.</p>\n  </body>\n</html>",
                },
              },
              {
                title: "Faylni saqlang va brauzerda oching",
                body: "`Ctrl + S` bilan saqlang. So'ng papkadagi `index.html` faylini ikki marta bosing — u brauzerda ochiladi. Kodni o'zgartirib, saqlab, brauzerda `F5` bosing va natijani ko'ring.",
              },
            ],
            examples: [
              {
                title: "Atributli element",
                body: "`<a>` (havola) tegi `href` atributisiz ishlamaydi — atribut qayerga o'tishni ko'rsatadi. `title` atributi esa sichqoncha ustiga kelganda maslahat matnini chiqaradi.",
                code: {
                  language: "html",
                  code: "<a href=\"https://uz.wikipedia.org\" title=\"Bepul ensiklopediya\">Vikipediyaga o'tish</a>",
                },
              },
              {
                title: "Ichma-ich elementlar",
                body: "Elementlar bir-birining ichiga joylashishi mumkin. Muhim qoida: ichkaridagi teg birinchi yopiladi.",
                code: {
                  language: "html",
                  code: "<p>Bu gapdagi <strong>muhim so'z</strong> qalin ko'rinadi.</p>",
                },
              },
            ],
            mistakes: [
              {
                title: "Yopuvchi tegni unutish",
                fix: "`<p>Matn` deb qoldirsangiz, brauzer ba'zan o'zi tuzatadi, lekin natija kutilmagan bo'lishi mumkin. Har doim `</p>` bilan yoping. VS Code yopuvchi tegni avtomatik qo'shadi.",
              },
              {
                title: "Teglarni noto'g'ri tartibda yopish",
                fix: "`<p><strong>Matn</p></strong>` — xato. To'g'risi: `<p><strong>Matn</strong></p>`. Oxirgi ochilgan teg birinchi yopiladi.",
              },
              {
                title: "charset'ni ko'rsatmaslik",
                fix: "`<meta charset=\"UTF-8\">` bo'lmasa, o'zbekcha harflar (o', g', sh) buzilib ko'rinishi mumkin. Uni har doim `<head>` boshiga yozing.",
              },
              {
                title: "Faylni .txt sifatida saqlash",
                fix: "Fayl nomi aynan `.html` bilan tugashi kerak. Windows'da kengaytmalar yashirin bo'lsa, `index.html.txt` bo'lib qolishi mumkin — “Fayl kengaytmalarini ko'rsatish” sozlamasini yoqing.",
              },
            ],
            tips: [
              "Kodni chiroyli surilish (indentation) bilan yozing: ichki elementlar 2 bo'sh joy ichkariga suriladi. Bu o'qishni ancha osonlashtiradi.",
              "VS Code'ga “Live Server” kengaytmasini o'rnating — fayl saqlanishi bilan brauzer o'zi yangilanadi.",
              "Teg va atribut nomlarini har doim kichik harflarda yozing. Bu umumqabul qilingan uslub.",
            ],
            exercise: {
              title: "O'zingiz haqingizda sahifa",
              brief: "`index.html` faylida o'zingiz haqingizda kichik sahifa yarating.",
              tasks: [
                "`<title>` ga ismingizni yozing.",
                "`<h1>` ichida o'zingizni tanishtiring.",
                "Ikkita `<p>` paragrafida qayerdan ekaningiz va nimani o'rganayotganingizni yozing.",
                "Bitta muhim so'zni `<strong>` bilan ajrating.",
                "Faylni brauzerda ochib, natijani tekshiring.",
              ],
              hint: "Yuqoridagi interaktiv muharrirda avval sinab ko'rishingiz mumkin.",
            },
            summary: [
              "HTML elementi ochuvchi teg, kontent va yopuvchi tegdan iborat.",
              "Atributlar elementga qo'shimcha ma'lumot beradi: `href`, `lang`, `title`.",
              "Har bir hujjat `<!DOCTYPE html>`, `<html>`, `<head>` va `<body>` dan tashkil topadi.",
              "`<head>` — xizmat ma'lumotlari, `<body>` — ko'rinadigan kontent.",
            ],
            keyTerms: [
              { term: "Teg (tag)", definition: "Burchakli qavslardagi belgi: `<p>`, `</p>`." },
              { term: "Element", definition: "Ochuvchi teg, kontent va yopuvchi tegning birligi." },
              { term: "Atribut", definition: "Ochuvchi teg ichida yoziladigan qo'shimcha sozlama: `nom=\"qiymat\"`." },
              { term: "Emmet", definition: "VS Code'dagi qisqartmalar tizimi: `!` + Tab butun skeletni yaratadi." },
            ],
          },
        },
        {
          slug: "matn-havola-rasm",
          title: "Matn, havolalar va rasmlar",
          summary: "Sarlavhalar, paragraflar, ro'yxatlar, havolalar va rasmlar bilan ishlash.",
          durationMin: 20,
          interactive: [
            {
              type: "code-playground",
              title: "Kontent bilan tajriba",
              config: {
                language: "html",
                code: "<h1>Samarqand</h1>\n<p>Samarqand — <strong>dunyodagi eng qadimiy</strong> shaharlardan biri.</p>\n\n<h2>Mashhur joylar</h2>\n<ul>\n  <li>Registon maydoni</li>\n  <li>Shohi Zinda</li>\n  <li>Bibixonim masjidi</li>\n</ul>\n\n<p>Batafsil: <a href=\"https://uz.wikipedia.org/wiki/Samarqand\" target=\"_blank\">Vikipediya</a></p>",
              },
            },
          ],
          content: {
            intro:
              "Sahifaning asosiy vazifasi — ma'lumot berish. Bu darsda matnni tartibli yozish, boshqa sahifalarga havola qo'yish va rasm joylashtirishni o'rganasiz.",
            concept:
              "**Sarlavhalar** `<h1>` dan `<h6>` gacha bo'ladi: `<h1>` — eng muhim (sahifa sarlavhasi), `<h6>` — eng kichik. **Paragraf** `<p>` tegi bilan yoziladi. **Ro'yxatlar** ikki xil: tartibsiz `<ul>` (nuqtali) va tartibli `<ol>` (raqamli); ularning har bir bandi `<li>` bilan belgilanadi.\n\n**Havola** `<a href=\"...\">` foydalanuvchini boshqa sahifaga olib o'tadi. **Rasm** `<img>` tegi bilan qo'yiladi; u yopuvchi tegga ega emas va ikki asosiy atribut talab qiladi: `src` (fayl manzili) va `alt` (rasmning matnli tavsifi).",
            why:
              "Sarlavhalar ierarxiyasi faqat ko'rinish uchun emas: qidiruv tizimlari va ekran o'quvchi dasturlar sahifa tuzilmasini aynan sarlavhalar orqali tushunadi. `alt` matni rasm yuklanmaganda ko'rinadi va ko'zi ojiz foydalanuvchilarga rasm mazmunini aytib beradi. Havolalar esa vebni “veb” (o'rgimchak to'ri) qiladi — sahifalarni bir-biriga bog'laydi.",
            how:
              "Brauzer har bir tegga standart uslub beradi: `<h1>` katta va qalin, `<ul>` bandlari oldida nuqta, havola ko'k rangda va tagiga chizilgan. Keyinroq bu uslublarni CSS bilan o'zgartiramiz.\n\nHavola manzili ikki xil bo'ladi. **Mutlaq** manzil to'liq yoziladi: `https://example.com/sahifa.html`. **Nisbiy** manzil joriy faylga nisbatan yoziladi: `aloqa.html` (shu papkadagi fayl) yoki `rasmlar/logo.png` (ichki papkadagi fayl). O'z saytingiz ichidagi sahifalar uchun nisbiy manzil qulayroq.",
            steps: [
              {
                title: "Sarlavhalar ierarxiyasini tuzing",
                body: "Sahifada bitta `<h1>` bo'lsin. Bo'limlar uchun `<h2>`, ularning ichki qismlari uchun `<h3>` ishlating. Darajalarni sakrab o'tmang: `<h2>` dan keyin to'g'ridan-to'g'ri `<h4>` yozmang.",
              },
              {
                title: "Ro'yxat yarating",
                body: "Ketma-ketlik muhim bo'lsa (retsept qadamlari) `<ol>`, muhim bo'lmasa (xaridlar ro'yxati) `<ul>` ishlating.",
                code: {
                  language: "html",
                  code: "<h2>Choy damlash</h2>\n<ol>\n  <li>Suvni qaynating</li>\n  <li>Choynakni iliq suv bilan chayqang</li>\n  <li>Choy solib, ustidan qaynoq suv quying</li>\n</ol>",
                },
              },
              {
                title: "Havola qo'shing",
                body: "Tashqi saytga havola yangi oynada ochilishi uchun `target=\"_blank\"` qo'shing. Xavfsizlik uchun unga `rel=\"noopener\"` ham yozish tavsiya etiladi.",
                code: {
                  language: "html",
                  code: "<a href=\"https://kun.uz\" target=\"_blank\" rel=\"noopener\">Yangiliklarni o'qish</a>\n<a href=\"aloqa.html\">Biz bilan bog'lanish</a>",
                },
              },
              {
                title: "Rasm joylashtiring",
                body: "Loyiha papkangizda `rasmlar` papkasini yarating va unga rasm qo'ying. So'ng uni sahifaga ulang. `width` va `height` atributlari sahifa yuklanayotganda joy “sakrashining” oldini oladi.",
                code: {
                  language: "html",
                  code: "<img src=\"rasmlar/registon.jpg\" alt=\"Kechki yoritilgan Registon maydoni\" width=\"800\" height=\"533\">",
                },
              },
            ],
            examples: [
              {
                title: "Mazmunli matn teglari",
                body: "`<strong>` — muhim matn (qalin), `<em>` — urg'u (kursiv), `<br>` — qator ko'chirish, `<hr>` — mavzu o'zgarishini bildiruvchi chiziq.",
                code: {
                  language: "html",
                  code: "<p>Imtihon <strong>ertaga soat 9:00 da</strong> boshlanadi.</p>\n<p>Bu kitobni <em>albatta</em> o'qing.</p>\n<hr>\n<p>Manzil: Toshkent sh.,<br>Amir Temur ko'chasi, 1-uy</p>",
                },
              },
              {
                title: "Rasmning o'zi havola bo'lishi",
                body: "Elementlarni birlashtirish mumkin: rasmni `<a>` ichiga joylashtirsangiz, rasm bosiladigan bo'ladi.",
                code: {
                  language: "html",
                  code: "<a href=\"index.html\">\n  <img src=\"rasmlar/logo.png\" alt=\"Bosh sahifaga qaytish\" width=\"120\" height=\"40\">\n</a>",
                },
              },
            ],
            mistakes: [
              {
                title: "Matnni kattalashtirish uchun sarlavha ishlatish",
                fix: "`<h3>` ni faqat matn katta ko'rinsin deb ishlatmang. Sarlavha — mazmun ierarxiyasi. O'lchamni CSS bilan boshqarasiz.",
              },
              {
                title: "alt atributini bo'sh yoki ma'nosiz qoldirish",
                fix: "`alt=\"rasm\"` yoki `alt=\"IMG_2041\"` foydasiz. Rasmda nima borligini qisqa tasvirlang. Faqat bezak uchun bo'lgan rasmlarda `alt=\"\"` (bo'sh) qoldirish to'g'ri.",
              },
              {
                title: "Fayl yo'lini noto'g'ri yozish",
                fix: "Rasm ko'rinmasa, birinchi navbatda yo'lni tekshiring: papka nomi, harflar katta-kichikligi (`Logo.png` va `logo.png` serverda har xil fayl) va kengaytma (`.jpg` yoki `.jpeg`).",
              },
              {
                title: "Havola matniga “bu yerga bosing” deb yozish",
                fix: "Havola matni qayerga olib borishini aytishi kerak: “Kurs dasturini yuklab olish” — “bu yerga bosing” dan ancha yaxshi.",
              },
            ],
            tips: [
              "Fayl va papka nomlarida bo'sh joy va o'zbekcha maxsus belgilarni ishlatmang: `mening rasmim.jpg` emas, `mening-rasmim.jpg`.",
              "Internetga joylashtirishdan oldin rasmlarni siqing (masalan, squoosh.app orqali) — sahifa tezroq ochiladi.",
              "Uzun sahifada `<a href=\"#bolim\">` yordamida sahifa ichidagi bo'limlarga havola qilish mumkin (bo'limga `id=\"bolim\"` beriladi).",
            ],
            exercise: {
              title: "Sevimli shahringiz haqida sahifa",
              brief: "O'zbekistondagi sevimli shahringiz haqida ma'lumot sahifasi yarating.",
              tasks: [
                "Shahar nomi bilan `<h1>` sarlavha yozing.",
                "Shahar haqida ikki paragraf yozing; muhim faktni `<strong>` bilan ajrating.",
                "“Diqqatga sazovor joylar” `<h2>` bo'limida kamida 4 bandli `<ul>` ro'yxat tuzing.",
                "“Qanday borish mumkin” bo'limida qadamlarni `<ol>` bilan yozing.",
                "Shahar rasmini to'g'ri `alt` matni bilan qo'shing.",
                "Shahar haqidagi tashqi maqolaga yangi oynada ochiladigan havola qo'ying.",
              ],
            },
            summary: [
              "`<h1>`–`<h6>` sarlavhalar mazmun ierarxiyasini bildiradi; sahifada bitta `<h1>` bo'lsin.",
              "`<ul>` — tartibsiz, `<ol>` — tartibli ro'yxat; bandlar `<li>` bilan yoziladi.",
              "`<a href>` havola yaratadi; manzil mutlaq yoki nisbiy bo'lishi mumkin.",
              "`<img>` uchun `src` va mazmunli `alt` majburiy.",
            ],
            keyTerms: [
              { term: "Nisbiy manzil", definition: "Joriy faylga nisbatan yozilgan yo'l: `rasmlar/logo.png`." },
              { term: "Mutlaq manzil", definition: "Protokol va domen bilan to'liq yozilgan manzil: `https://...`." },
              { term: "alt matni", definition: "Rasmning matnli tavsifi — rasm ko'rinmaganda va ekran o'quvchilar uchun." },
              { term: "Bo'sh element", definition: "Yopuvchi tegga ega bo'lmagan element: `<img>`, `<br>`, `<hr>`." },
            ],
          },
        },
      ],
      quiz: {
        title: "1-modul testi: HTML asoslari",
        description: "Veb qanday ishlashi va HTML asoslari bo'yicha bilimingizni tekshiring.",
        questions: [
          {
            prompt: "Sahifaning tashqi ko'rinishini (rang, shrift, joylashuv) qaysi texnologiya belgilaydi?",
            options: ["HTML", "CSS", "HTTP", "DNS"],
            correct: 1,
            explanation: "CSS (Cascading Style Sheets) sahifaning ko'rinishi uchun javob beradi. HTML — tuzilma, JavaScript — xatti-harakat.",
          },
          {
            prompt: "DNS nima vazifani bajaradi?",
            options: [
              "Sahifani chiroyli qiladi",
              "Sayt nomini server IP manziliga aylantiradi",
              "Rasmlarni siqadi",
              "JavaScript kodini bajaradi",
            ],
            correct: 1,
            explanation: "DNS — internetning “telefon kitobi”: `example.uz` kabi nomni server manziliga aylantiradi.",
          },
          {
            prompt: "Quyidagilardan qaysi biri foydalanuvchiga ko'rinmaydi?",
            options: ["<body> ichidagi <p>", "<head> ichidagi <meta charset>", "<h1> sarlavha", "<img> rasm"],
            correct: 1,
            explanation: "`<head>` ichidagi ma'lumotlar — xizmat ma'lumotlari, ular sahifada ko'rinmaydi.",
          },
          {
            prompt: "Qaysi kod to'g'ri yozilgan?",
            options: [
              "<p><strong>Matn</p></strong>",
              "<p><strong>Matn</strong></p>",
              "<strong><p>Matn</strong></p>",
              "<p>Matn<strong></p>",
            ],
            correct: 1,
            explanation: "Oxirgi ochilgan teg birinchi yopiladi: avval `</strong>`, keyin `</p>`.",
          },
          {
            prompt: "Rasm uchun `alt` atributi nima uchun kerak?",
            options: [
              "Rasmni kattalashtirish uchun",
              "Rasmni havolaga aylantirish uchun",
              "Rasm mazmunini matn bilan tasvirlash uchun",
              "Rasmni tezroq yuklash uchun",
            ],
            correct: 2,
            explanation: "`alt` rasm yuklanmaganda ko'rinadi va ekran o'quvchi dasturlar uni o'qib beradi.",
          },
          {
            prompt: "Retsept qadamlari uchun qaysi ro'yxat mos?",
            options: ["<ul>", "<ol>", "<li>", "<dl>"],
            correct: 1,
            explanation: "Qadamlar tartibi muhim bo'lgani uchun tartibli ro'yxat — `<ol>` ishlatiladi.",
          },
        ],
      },
    },

    /* ───────────────────────── 2-MODUL ───────────────────────── */
    {
      title: "HTML tuzilmasi va formalar",
      description: "Sahifani mazmunli bo'limlarga ajratish va foydalanuvchidan ma'lumot olishni o'rganasiz.",
      lessons: [
        {
          slug: "semantik-html",
          title: "Semantik tuzilma",
          summary: "header, nav, main, section, article va footer bilan mazmunli sahifa.",
          durationMin: 16,
          interactive: [
            {
              type: "code-playground",
              title: "Semantik sahifa skeleti",
              config: {
                language: "html",
                code: "<header>\n  <h1>Kitobxon</h1>\n  <nav>\n    <a href=\"#yangi\">Yangi kitoblar</a> |\n    <a href=\"#aloqa\">Aloqa</a>\n  </nav>\n</header>\n\n<main>\n  <section id=\"yangi\">\n    <h2>Yangi kitoblar</h2>\n    <article>\n      <h3>O'tkan kunlar</h3>\n      <p>Abdulla Qodiriyning mashhur romani.</p>\n    </article>\n  </section>\n</main>\n\n<footer id=\"aloqa\">\n  <p>&copy; 2026 Kitobxon</p>\n</footer>",
              },
            },
          ],
          content: {
            intro:
              "Faqat `<div>` va `<p>` bilan ham sahifa yaratish mumkin, lekin bunday sahifa brauzer va qidiruv tizimlari uchun “nomsiz qutilar uyumi” bo'lib qoladi. Semantik teglar har bir qismning vazifasini aniq aytadi.",
            concept:
              "**Semantik** so'zi “ma'noli” degani. Semantik teglar nomining o'zidan vazifasi tushuniladi:\n\n- `<header>` — sahifa yoki bo'limning bosh qismi (logo, sarlavha)\n- `<nav>` — asosiy navigatsiya havolalari\n- `<main>` — sahifaning asosiy, takrorlanmas kontenti (sahifada bitta)\n- `<section>` — mavzu bo'yicha guruhlangan bo'lim (odatda sarlavhaga ega)\n- `<article>` — mustaqil ma'noga ega kontent: maqola, yangilik, mahsulot kartochkasi\n- `<aside>` — qo'shimcha ma'lumot: yon panel, reklama\n- `<footer>` — pastki qism: mualliflik, aloqa\n\n`<div>` esa hech qanday ma'noga ega bo'lmagan universal quti bo'lib, faqat dizayn uchun guruhlash kerak bo'lganda ishlatiladi.",
            why:
              "Ekran o'quvchi dasturlar foydalanuvchiga “asosiy kontentga o'tish” yoki “navigatsiyani ko'rsatish” imkonini aynan shu teglar orqali beradi. Qidiruv tizimlari `<main>` va `<article>` ichidagi matnga ko'proq ahamiyat beradi. Bundan tashqari, semantik kodni boshqa dasturchilar (va bir necha oydan keyin o'zingiz) ancha tez tushunadi.",
            how:
              "Semantik teglar ko'rinishda `<div>` dan farq qilmaydi — brauzer ularga deyarli hech qanday maxsus uslub bermaydi. Farq ko'zga ko'rinmas qatlamda: brauzer sahifadan **qulaylik daraxti** (accessibility tree) yaratadi va unda har bir semantik tegga rol beradi (`<nav>` → navigation, `<main>` → main). Yordamchi texnologiyalar sahifani shu daraxt orqali “ko'radi”.",
            steps: [
              {
                title: "Sahifani bloklarga ajrating",
                body: "Qog'ozda sahifangizni chizing va har bir blokka nom bering: yuqori qism, menyu, asosiy matn, yon panel, pastki qism.",
              },
              {
                title: "Har bir blokka mos teg tanlang",
                body: "O'zingizga savol bering: “Bu blok mustaqil ma'noga egami?” Ha bo'lsa — `<article>`. “Bu mavzuli bo'limmi?” — `<section>`. Faqat dizayn uchun o'rash kerakmi? — `<div>`.",
              },
              {
                title: "Skeletni yozing",
                body: "Tanlangan teglar bilan sahifaning umumiy tuzilmasini yozing.",
                code: {
                  language: "html",
                  code: "<body>\n  <header>\n    <a href=\"/\">Logo</a>\n    <nav aria-label=\"Asosiy menyu\">\n      <ul>\n        <li><a href=\"/\">Bosh sahifa</a></li>\n        <li><a href=\"/kurslar\">Kurslar</a></li>\n      </ul>\n    </nav>\n  </header>\n  <main>\n    <section>\n      <h2>Yangiliklar</h2>\n      <article>...</article>\n    </section>\n    <aside>...</aside>\n  </main>\n  <footer>...</footer>\n</body>",
                },
              },
              {
                title: "Natijani tekshiring",
                body: "Brauzer dasturchi vositalarida “Accessibility” bo'limini oching va sahifa daraxtida `navigation`, `main` kabi rollar paydo bo'lganini ko'ring.",
              },
            ],
            examples: [
              {
                title: "Blog maqolasi",
                body: "Har bir maqola `<article>` ichida o'z sarlavhasi, sanasi va matniga ega. `<time>` tegi sanani mashinalar ham tushunadigan formatda saqlaydi.",
                code: {
                  language: "html",
                  code: "<article>\n  <header>\n    <h2>HTML'ni qanday tez o'rganish mumkin</h2>\n    <p>Muallif: Dilnoza · <time datetime=\"2026-03-12\">12-mart, 2026</time></p>\n  </header>\n  <p>Eng yaxshi usul — har kuni kichik sahifa yaratish...</p>\n</article>",
                },
              },
            ],
            mistakes: [
              {
                title: "Hamma narsani <div> bilan yozish",
                fix: "“Div-sho'rva” deb ataluvchi bu uslub sahifani tushunarsiz qiladi. Avval semantik teg qidiring, mos keladigani bo'lmasa, keyin `<div>` ishlating.",
              },
              {
                title: "Bir sahifada bir nechta <main> ishlatish",
                fix: "`<main>` sahifada faqat bitta bo'lishi kerak — u sahifaning asosiy kontentini bildiradi.",
              },
              {
                title: "<section> ni sarlavhasiz ishlatish",
                fix: "Agar bo'limga sarlavha berib bo'lmasa, ehtimol u `<section>` emas, oddiy `<div>` bo'lishi kerak.",
              },
            ],
            tips: [
              "Bir nechta `<nav>` bo'lsa, ularni `aria-label` bilan farqlang: “Asosiy menyu”, “Pastki menyu”.",
              "Professional saytlarning kodini ko'rib, ular qaysi semantik teglarni qayerda ishlatishini o'rganing.",
            ],
            exercise: {
              title: "Yangiliklar sahifasi skeleti",
              brief: "Kichik yangiliklar sayti uchun to'liq semantik tuzilma yozing.",
              tasks: [
                "`<header>` ichida sayt nomi va 3 ta havolali `<nav>` yarating.",
                "`<main>` ichida “So'nggi yangiliklar” `<section>` ini yarating.",
                "Bo'lim ichida har biri sarlavha, sana (`<time>`) va paragrafdan iborat 3 ta `<article>` yozing.",
                "“Mashhur mavzular” uchun `<aside>` qo'shing.",
                "Mualliflik matni bilan `<footer>` yozing.",
              ],
            },
            summary: [
              "Semantik teglar sahifa qismlarining vazifasini bildiradi.",
              "`<main>` sahifada bitta; `<article>` — mustaqil kontent; `<section>` — mavzuli bo'lim.",
              "Semantika qulaylik (accessibility) va SEO uchun muhim.",
              "`<div>` faqat ma'nosiz, dizayn uchun guruhlashda ishlatiladi.",
            ],
            keyTerms: [
              { term: "Semantika", definition: "Kodning ma'nosi — teg nima ekanini emas, nimani bildirishini ko'rsatadi." },
              { term: "Accessibility (qulaylik)", definition: "Sahifadan imkoniyati cheklangan foydalanuvchilar ham to'liq foydalana olishi." },
              { term: "SEO", definition: "Qidiruv tizimlarida yuqori o'rin egallash uchun saytni optimallashtirish." },
            ],
          },
        },
        {
          slug: "html-formalar",
          title: "Formalar",
          summary: "form, label, input turlari, tanlash maydonlari va tekshiruv atributlari.",
          durationMin: 20,
          interactive: [
            {
              type: "code-playground",
              title: "Ro'yxatdan o'tish formasi",
              config: {
                language: "html",
                code: "<form>\n  <p>\n    <label for=\"ism\">Ismingiz</label><br>\n    <input id=\"ism\" name=\"ism\" type=\"text\" required>\n  </p>\n  <p>\n    <label for=\"email\">Elektron pochta</label><br>\n    <input id=\"email\" name=\"email\" type=\"email\" placeholder=\"siz@misol.uz\" required>\n  </p>\n  <p>\n    <label for=\"yonalish\">Yo'nalish</label><br>\n    <select id=\"yonalish\" name=\"yonalish\">\n      <option>Dasturlash</option>\n      <option>Dizayn</option>\n      <option>Video montaj</option>\n    </select>\n  </p>\n  <button type=\"submit\">Yuborish</button>\n</form>",
              },
            },
          ],
          content: {
            intro:
              "Ro'yxatdan o'tish, qidiruv, buyurtma, izoh qoldirish — bularning barchasi formalar orqali ishlaydi. Bu darsda foydalanuvchidan to'g'ri va qulay tarzda ma'lumot olishni o'rganasiz.",
            concept:
              "**Forma** (`<form>`) — foydalanuvchi ma'lumot kiritadigan maydonlar to'plami. Asosiy elementlar:\n\n- `<input>` — bir qatorli maydon; `type` atributi uning turini belgilaydi: `text`, `email`, `password`, `number`, `date`, `checkbox`, `radio`\n- `<textarea>` — ko'p qatorli matn\n- `<select>` va `<option>` — ochiladigan ro'yxat\n- `<label>` — maydon nomi; `for` atributi orqali maydonning `id` siga bog'lanadi\n- `<button>` — formani yuborish tugmasi\n\n`name` atributi esa ma'lumot serverga qaysi nom bilan yuborilishini belgilaydi.",
            why:
              "Forma — foydalanuvchi va sayt o'rtasidagi suhbat. Noqulay forma tufayli odamlar ro'yxatdan o'tmay ketib qoladi. To'g'ri `type` tanlansa, telefonda mos klaviatura chiqadi (`email` uchun `@` belgisi, `tel` uchun raqamlar). `<label>` bog'langan bo'lsa, nom ustiga bosish maydonni faollashtiradi — bu kichik ekranlarda juda qulay.",
            how:
              "Foydalanuvchi “Yuborish” tugmasini bosganda brauzer avval o'rnatilgan tekshiruvlarni bajaradi: `required` maydon bo'shmi, `email` maydonida `@` bormi, `minlength` bajarilganmi. Xato bo'lsa, forma yuborilmaydi va brauzer maslahat ko'rsatadi.\n\nHammasi to'g'ri bo'lsa, brauzer har bir maydonning `name` va qiymatini juftlik qilib, `action` atributida ko'rsatilgan manzilga `method` (odatda `GET` yoki `POST`) usulida yuboradi. Serverda bu ma'lumotni qayta ishlash — backend dasturlash mavzusi.",
            steps: [
              {
                title: "Forma konteynerini yarating",
                body: "`action` — ma'lumot yuboriladigan manzil, `method=\"post\"` — maxfiy yoki katta ma'lumotlar uchun.",
                code: { language: "html", code: "<form action=\"/royxatdan-otish\" method=\"post\">\n  <!-- maydonlar shu yerda -->\n</form>" },
              },
              {
                title: "Har bir maydonga label bog'lang",
                body: "`for` qiymati `id` bilan bir xil bo'lishi shart.",
                code: {
                  language: "html",
                  code: "<label for=\"telefon\">Telefon raqam</label>\n<input id=\"telefon\" name=\"telefon\" type=\"tel\" placeholder=\"+998 90 123 45 67\">",
                },
              },
              {
                title: "Tekshiruv atributlarini qo'shing",
                body: "`required` — majburiy, `minlength`/`maxlength` — matn uzunligi, `min`/`max` — son chegaralari.",
                code: {
                  language: "html",
                  code: "<input name=\"parol\" type=\"password\" minlength=\"8\" required>\n<input name=\"yosh\" type=\"number\" min=\"7\" max=\"99\">",
                },
              },
              {
                title: "Tanlov maydonlarini guruhlang",
                body: "Bir-biriga bog'liq radio tugmalar bir xil `name` ga ega bo'lishi kerak — shunda faqat bittasini tanlash mumkin. Guruhni `<fieldset>` va `<legend>` bilan o'rang.",
                code: {
                  language: "html",
                  code: "<fieldset>\n  <legend>Darajangiz</legend>\n  <label><input type=\"radio\" name=\"daraja\" value=\"yangi\"> Yangi boshlovchi</label>\n  <label><input type=\"radio\" name=\"daraja\" value=\"orta\"> O'rta</label>\n</fieldset>",
                },
              },
              {
                title: "Yuborish tugmasini qo'shing",
                body: "`<button type=\"submit\">` formani yuboradi. Tugma matni harakatni aniq aytishi kerak: “Ro'yxatdan o'tish”, “Buyurtma berish”.",
              },
            ],
            examples: [
              {
                title: "Izoh qoldirish formasi",
                body: "`<textarea>` ning `rows` atributi boshlang'ich balandlikni belgilaydi.",
                code: {
                  language: "html",
                  code: "<form action=\"/izoh\" method=\"post\">\n  <label for=\"izoh\">Fikringiz</label>\n  <textarea id=\"izoh\" name=\"izoh\" rows=\"4\" maxlength=\"500\" required></textarea>\n  <label><input type=\"checkbox\" name=\"obuna\"> Yangi izohlar haqida xabar berish</label>\n  <button type=\"submit\">Izohni yuborish</button>\n</form>",
                },
              },
            ],
            mistakes: [
              {
                title: "Label o'rniga faqat placeholder ishlatish",
                fix: "`placeholder` matn yozila boshlashi bilan yo'qoladi va foydalanuvchi nima yozayotganini unutadi. Har doim ko'rinib turadigan `<label>` qo'ying, `placeholder` esa faqat namuna uchun.",
              },
              {
                title: "name atributini unutish",
                fix: "`name` bo'lmagan maydon qiymati serverga umuman yuborilmaydi.",
              },
              {
                title: "Faqat brauzer tekshiruviga ishonish",
                fix: "HTML tekshiruvi foydalanuvchiga qulaylik uchun. Uni osongina chetlab o'tish mumkin, shuning uchun server ham ma'lumotni albatta qayta tekshirishi shart.",
              },
              {
                title: "Radio tugmalarga har xil name berish",
                fix: "Har xil `name` bo'lsa, foydalanuvchi bir vaqtda hammasini tanlay oladi. Bir guruh — bitta `name`.",
              },
            ],
            tips: [
              "`autocomplete` atributidan foydalaning (`autocomplete=\"email\"`, `\"name\"`, `\"tel\"`) — brauzer maydonlarni avtomatik to'ldiradi.",
              "Formani imkon qadar qisqa qiling: har bir ortiqcha maydon to'ldirish ehtimolini kamaytiradi.",
              "Xato xabarlari nima noto'g'ri ekanini va qanday tuzatishni aytsin: “Parol kamida 8 ta belgidan iborat bo'lishi kerak”.",
            ],
            exercise: {
              title: "Kursga yozilish formasi",
              brief: "O'quv markazi uchun kursga yozilish formasini yarating.",
              tasks: [
                "Ism (majburiy), telefon (`tel`) va elektron pochta (`email`, majburiy) maydonlarini qo'shing.",
                "Kurs yo'nalishini `<select>` bilan tanlash imkonini bering (kamida 4 ta variant).",
                "Dars vaqtini (ertalab / kunduzi / kechqurun) radio tugmalar bilan tanlatib, `<fieldset>` ga o'rang.",
                "“Qo'shimcha izoh” uchun `<textarea>` qo'shing.",
                "Har bir maydonga to'g'ri bog'langan `<label>` yozing va yuborish tugmasini qo'shing.",
                "Bo'sh forma yuborib, brauzer tekshiruvi ishlashini sinang.",
              ],
              hint: "Label to'g'ri bog'langanini tekshirish uchun label matni ustiga bosing — kursor maydonga o'tishi kerak.",
            },
            summary: [
              "Forma `<form>` ichidagi maydonlardan iborat; `action` va `method` yuborish manzili va usulini belgilaydi.",
              "`<input type>` maydon turini va telefondagi klaviaturani belgilaydi.",
              "Har bir maydonga `for`/`id` orqali bog'langan `<label>` kerak.",
              "`required`, `minlength`, `min` kabi atributlar asosiy tekshiruvni beradi, lekin server tekshiruvi o'rnini bosmaydi.",
            ],
            keyTerms: [
              { term: "name", definition: "Maydon qiymati serverga qaysi nom bilan yuborilishini belgilovchi atribut." },
              { term: "POST", definition: "Ma'lumotni so'rov tanasida yuboruvchi HTTP usuli — parollar va katta ma'lumotlar uchun." },
              { term: "Validatsiya", definition: "Kiritilgan ma'lumot to'g'riligini tekshirish." },
            ],
          },
        },
      ],
      quiz: {
        title: "2-modul testi: tuzilma va formalar",
        description: "Semantik teglar va formalar bo'yicha bilimingizni tekshiring.",
        questions: [
          {
            prompt: "Mustaqil ma'noga ega kontent (masalan, yangilik) uchun qaysi teg mos?",
            options: ["<div>", "<section>", "<article>", "<aside>"],
            correct: 2,
            explanation: "`<article>` alohida olinganda ham tushunarli bo'lgan mustaqil kontent uchun ishlatiladi.",
          },
          {
            prompt: "Bir sahifada nechta <main> elementi bo'lishi mumkin?",
            options: ["Cheksiz", "Faqat bitta", "Har bir section uchun bittadan", "Ikkita"],
            correct: 1,
            explanation: "`<main>` sahifaning asosiy kontentini bildiradi va u bitta bo'ladi.",
          },
          {
            prompt: "<label for=\"x\"> qaysi maydonga bog'lanadi?",
            options: ["name=\"x\" bo'lgan maydonga", "id=\"x\" bo'lgan maydonga", "class=\"x\" bo'lgan maydonga", "Birinchi maydonga"],
            correct: 1,
            explanation: "`for` atributi qiymati maydonning `id` siga mos kelishi kerak.",
          },
          {
            prompt: "Telefonda @ belgili klaviatura chiqishi uchun qaysi input turi kerak?",
            options: ["text", "email", "tel", "url"],
            correct: 1,
            explanation: "`type=\"email\"` mobil qurilmalarda elektron pochta uchun qulay klaviaturani ochadi.",
          },
          {
            prompt: "Nega serverda ham ma'lumotni tekshirish kerak?",
            options: [
              "Brauzer tekshiruvi sekin ishlaydi",
              "HTML tekshiruvini osongina chetlab o'tish mumkin",
              "Server tekshiruvi chiroyliroq",
              "Kerak emas",
            ],
            correct: 1,
            explanation: "Har qanday kishi brauzer tekshiruvini o'chirib yoki so'rovni to'g'ridan-to'g'ri yuborib, uni chetlab o'tishi mumkin.",
          },
        ],
      },
    },

    /* ───────────────────────── 3-MODUL ───────────────────────── */
    {
      title: "CSS: dizayn va joylashuv",
      description: "Sahifani ranglar, shriftlar va zamonaviy joylashuv usullari bilan chiroyli qilasiz.",
      lessons: [
        {
          slug: "css-bilan-tanishuv",
          title: "CSS bilan tanishuv: selektorlar va ranglar",
          summary: "CSS'ni ulash, selektorlar, xususiyatlar, ranglar va shriftlar.",
          durationMin: 20,
          interactive: [
            {
              type: "code-playground",
              title: "Uslublar bilan tajriba",
              config: {
                language: "html",
                code: "<style>\n  body {\n    font-family: system-ui, sans-serif;\n    background: #f5f3ee;\n    color: #1f2933;\n    padding: 24px;\n  }\n  h1 {\n    color: #2f5bff;\n    font-size: 40px;\n  }\n  .muhim {\n    background: #fff3c4;\n    padding: 4px 8px;\n    border-radius: 6px;\n  }\n</style>\n\n<h1>CSS sehrli!</h1>\n<p>Oddiy matn. <span class=\"muhim\">Bu esa ajratilgan matn.</span></p>",
              },
            },
          ],
          content: {
            intro:
              "HTML'da yozgan sahifangiz hozircha oq fonda qora matn. CSS yordamida unga rang, shrift va xarakter beramiz.",
            concept:
              "**CSS** (Cascading Style Sheets) — elementlar qanday ko'rinishini tasvirlovchi til. CSS **qoidalar**dan iborat. Har bir qoida ikki qismdan tuziladi: **selektor** (qaysi elementlarga) va **e'lonlar bloki** (qanday uslub).\n\nE'lon esa **xususiyat** va **qiymat** juftligidir: `color: navy;`. Masalan, `h1 { color: navy; }` qoidasi barcha `<h1>` sarlavhalarni to'q ko'k rangga bo'yaydi.",
            why:
              "Dizayn foydalanuvchining saytga bo'lgan ishonchini belgilaydi: odamlar bir necha soniya ichida sahifaning ko'rinishiga qarab unga baho beradi. CSS'ni alohida faylda saqlash esa bitta faylni o'zgartirib, butun saytning ko'rinishini yangilash imkonini beradi.",
            how:
              "CSS'ni ulashning uch usuli bor: `style` atributi (inline), `<style>` tegi va alohida `.css` fayl. Professional loyihalarda deyarli har doim alohida fayl ishlatiladi va u `<head>` ichida ulanadi.\n\n**Kaskad** (cascade) — bir elementga bir nechta qoida mos kelganda qaysi biri g'olib bo'lishini aniqlovchi tizim. Asosiy tamoyillar: aniqroq selektor umumiyroq selektordan kuchli (`id` > `class` > teg nomi), teng kuchli qoidalardan esa keyin yozilgani g'olib bo'ladi. Ba'zi xususiyatlar (masalan, `color`, `font-family`) ota elementdan farzandlarga **meros** o'tadi.",
            steps: [
              {
                title: "CSS faylini yarating va ulang",
                body: "Loyiha papkasida `style.css` faylini yarating va uni HTML `<head>` qismiga ulang.",
                code: { language: "html", code: "<head>\n  <meta charset=\"UTF-8\">\n  <title>Mening saytim</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>" },
              },
              {
                title: "Teg selektori bilan umumiy uslub bering",
                body: "`body` ga berilgan shrift va rang barcha ichki elementlarga meros o'tadi.",
                code: {
                  language: "css",
                  filename: "style.css",
                  code: "body {\n  font-family: \"Segoe UI\", system-ui, sans-serif;\n  font-size: 18px;\n  line-height: 1.6;\n  color: #1f2933;\n  background-color: #fafaf7;\n}",
                },
              },
              {
                title: "Klass selektorlaridan foydalaning",
                body: "HTML'da elementga `class` bering, CSS'da unga nuqta bilan murojaat qiling. Klassni ko'plab elementlarga qayta ishlatish mumkin.",
                code: {
                  language: "css",
                  code: "/* HTML: <p class=\"eslatma\">...</p> */\n.eslatma {\n  background-color: #eef3ff;\n  border-left: 4px solid #2f5bff;\n  padding: 12px 16px;\n}",
                },
              },
              {
                title: "Holat selektorlarini qo'shing",
                body: "`:hover` — sichqoncha ustiga kelganda, `:focus-visible` — klaviatura bilan tanlanganda.",
                code: {
                  language: "css",
                  code: "a {\n  color: #2f5bff;\n  text-decoration: none;\n}\na:hover {\n  text-decoration: underline;\n}",
                },
              },
            ],
            examples: [
              {
                title: "Rang yozish usullari",
                body: "Bir xil rangni turlicha yozish mumkin. HEX eng keng tarqalgan; `rgb()` va `hsl()` shaffoflik bilan ishlashda qulay.",
                code: {
                  language: "css",
                  code: ".a { color: #2f5bff; }               /* HEX */\n.b { color: rgb(47 91 255); }          /* RGB */\n.c { color: hsl(228 100% 59%); }       /* HSL: ton, to'yinganlik, yorug'lik */\n.d { color: rgb(47 91 255 / 0.5); }    /* 50% shaffof */",
                },
              },
              {
                title: "Kombinatsiyalangan selektorlar",
                body: "Bo'sh joy bilan yozilgan selektor ichki elementni tanlaydi. Vergul bilan bir nechta selektorga bir xil uslub beriladi.",
                code: {
                  language: "css",
                  code: "nav a { font-weight: 600; }       /* faqat nav ichidagi havolalar */\nh1, h2, h3 { font-family: Georgia, serif; }",
                },
              },
            ],
            mistakes: [
              {
                title: "Nuqta-vergulni unutish",
                fix: "`color: red background: blue;` — ikkala e'lon ham ishlamaydi. Har bir e'lon `;` bilan tugashi kerak.",
              },
              {
                title: "Hamma joyda id selektoridan foydalanish",
                fix: "`#sarlavha` juda kuchli selektor va uni keyin bekor qilish qiyin. Uslub uchun asosan klasslardan foydalaning.",
              },
              {
                title: "CSS fayl yo'lini noto'g'ri ko'rsatish",
                fix: "Uslublar ishlamasa, DevTools'ning Network bo'limida `style.css` yuklanganini (status 200) tekshiring. 404 bo'lsa — yo'l xato.",
              },
            ],
            tips: [
              "DevTools'da elementni tanlab, “Styles” panelida qiymatlarni jonli o'zgartiring — tajriba qilishning eng tez usuli.",
              "Saytingiz uchun 2–3 asosiy rang va 1–2 shrift tanlang. Kamroq — chiroyliroq.",
              "Matn va fon o'rtasidagi kontrast yetarli bo'lsin: och kulrang fonda och kulrang matn o'qilmaydi.",
            ],
            exercise: {
              title: "Shahar sahifasiga dizayn bering",
              brief: "Oldingi darslarda yaratgan sahifangizga alohida CSS fayl orqali uslub bering.",
              tasks: [
                "`style.css` yarating va uni `<link>` bilan ulang.",
                "`body` uchun shrift, matn rangi, fon rangi va `line-height` belgilang.",
                "Sarlavhalarga alohida shrift va rang bering.",
                "Muhim faktlar uchun `.fakt` klassini yarating va uni ikki joyda ishlating.",
                "Havolalarga `:hover` holatini qo'shing.",
              ],
            },
            summary: [
              "CSS qoidasi selektor va e'lonlar blokidan iborat: `selektor { xususiyat: qiymat; }`.",
              "CSS alohida faylda saqlanadi va `<link rel=\"stylesheet\">` bilan ulanadi.",
              "Asosiy selektorlar: teg nomi, `.klass`, `#id` va holatlar (`:hover`).",
              "Kaskad va meros qaysi uslub qo'llanishini belgilaydi.",
            ],
            keyTerms: [
              { term: "Selektor", definition: "Uslub qaysi elementlarga qo'llanishini ko'rsatuvchi qism." },
              { term: "Kaskad", definition: "Bir nechta qoida to'qnashganda g'olibni aniqlash tizimi." },
              { term: "Meros (inheritance)", definition: "Ba'zi uslublarning ota elementdan farzandlarga o'tishi." },
              { term: "Psevdoklass", definition: "Element holatini bildiruvchi selektor: `:hover`, `:focus`." },
            ],
          },
        },
        {
          slug: "box-model",
          title: "Box model: margin, border, padding",
          summary: "Har bir element — quti. O'lcham va oraliqlarni boshqarish.",
          durationMin: 16,
          interactive: [
            {
              type: "box-model",
              title: "Box model laboratoriyasi",
              description: "Slayderlarni suring va qutining har bir qatlami qanday o'zgarishini kuzating.",
            },
          ],
          content: {
            intro:
              "Dizayndagi elementlar orasidagi “havo” — professional va havaskor sahifa o'rtasidagi asosiy farqlardan biri. Bu oraliqlarni box model boshqaradi.",
            concept:
              "Brauzer har bir elementni to'rtburchak **quti** sifatida ko'radi. Quti ichkaridan tashqariga to'rt qatlamdan iborat:\n\n- **Content** — matn yoki rasmning o'zi (`width`, `height`)\n- **Padding** — kontent va chegara orasidagi ichki bo'shliq\n- **Border** — quti chegarasi (chiziq)\n- **Margin** — boshqa elementlar bilan tashqi masofa\n\nPadding elementning fon rangini oladi, margin esa har doim shaffof.",
            why:
              "Tugma nima uchun juda katta yoki kichik, kartochkalar nega bir-biriga yopishib qolgan, element nega kutilganidan kengroq — bu savollarning deyarli barchasiga javob box model'da. Uni tushunsangiz, “nega bu joyidan siljidi?” degan savollar kamayadi.",
            how:
              "Standart holatda (`box-sizing: content-box`) `width` faqat kontent kengligini bildiradi. Ya'ni `width: 200px; padding: 20px; border: 2px` bo'lsa, quti ekranda 200 + 20×2 + 2×2 = **244px** joy egallaydi. Bu ko'pincha chalkashlikka sabab bo'ladi.\n\n`box-sizing: border-box` qo'llansa, `width` padding va border'ni ham o'z ichiga oladi: quti aynan 200px bo'ladi, kontent esa qolgan joyga moslashadi. Shuning uchun zamonaviy loyihalarda bu qoida barcha elementlarga beriladi.\n\nYana bir xususiyat: vertikal joylashgan ikki blok elementning margin'lari qo'shilmaydi, balki kattasi qoladi — bu **margin collapse** deb ataladi.",
            steps: [
              {
                title: "border-box'ni yoqing",
                body: "CSS faylingiz boshiga quyidagi qoidani yozing. Bu deyarli barcha professional loyihalarda bor.",
                code: { language: "css", code: "*, *::before, *::after {\n  box-sizing: border-box;\n}" },
              },
              {
                title: "Padding bilan ichki bo'shliq bering",
                body: "Qiymatlar soat yo'nalishi bo'yicha: yuqori, o'ng, past, chap. Ikki qiymat — vertikal va gorizontal.",
                code: {
                  language: "css",
                  code: ".karta {\n  padding: 24px;          /* hamma tomondan */\n  padding: 16px 24px;     /* vertikal 16, gorizontal 24 */\n  padding: 8px 16px 24px 16px; /* yuqori o'ng past chap */\n}",
                },
              },
              {
                title: "Border qo'shing",
                body: "Border uch qismdan iborat: qalinlik, uslub, rang. `border-radius` burchaklarni yumaloqlaydi.",
                code: { language: "css", code: ".karta {\n  border: 1px solid #e3e3e8;\n  border-radius: 12px;\n}" },
              },
              {
                title: "Margin bilan masofa bering",
                body: "`margin: 0 auto` qat'iy kenglikka ega blokni gorizontal markazga joylashtiradi.",
                code: { language: "css", code: ".konteyner {\n  max-width: 960px;\n  margin: 0 auto;\n  padding: 0 16px;\n}" },
              },
            ],
            examples: [
              {
                title: "Chiroyli tugma",
                body: "Tugmaning qulayligi asosan padding'ga bog'liq: barmoq bilan bosish uchun balandlik kamida 44px bo'lgani ma'qul.",
                code: {
                  language: "css",
                  code: ".tugma {\n  display: inline-block;\n  padding: 12px 20px;\n  border: none;\n  border-radius: 10px;\n  background: #2f5bff;\n  color: white;\n  font-weight: 600;\n}",
                },
              },
            ],
            mistakes: [
              {
                title: "Element kengligini noto'g'ri hisoblash",
                fix: "`box-sizing: border-box` ni yoqing — shunda `width` qutining haqiqiy kengligi bo'ladi.",
              },
              {
                title: "Bo'shliqni bo'sh qatorlar yoki &nbsp; bilan yaratish",
                fix: "Oraliqlar uchun har doim `margin` va `padding` ishlating. `<br><br><br>` bilan joy tashlash — eskirgan va beqaror usul.",
              },
              {
                title: "Margin collapse'dan hayron qolish",
                fix: "Ikki paragraf orasidagi masofa 20+20 emas, 20px bo'lsa — bu xato emas, margin collapse. Kerak bo'lsa, masofani faqat bir tomondan bering.",
              },
            ],
            tips: [
              "Oraliqlar uchun tizim tanlang, masalan 4 ga karrali qiymatlar: 4, 8, 12, 16, 24, 32, 48. Bu dizaynni yaxlit qiladi.",
              "DevTools'da elementni tanlaganda “Computed” bo'limida box model diagrammasi ko'rinadi.",
              "Kartochka ichida padding, kartochkalar orasida esa margin (yoki keyingi darsdagi `gap`) ishlating.",
            ],
            exercise: {
              title: "Profil kartochkasi",
              brief: "O'zingiz haqingizda kichik profil kartochkasini yarating.",
              tasks: [
                "`border-box` qoidasini yozing.",
                "Kartochkaga 320px kenglik, 24px padding, 1px chegara va 16px radius bering.",
                "Kartochkani `margin: 40px auto` bilan sahifa markaziga joylashtiring.",
                "Ichiga ism (`<h2>`), qisqa tavsif va tugma qo'shing.",
                "Tugmaga qulay padding bering va DevTools'da uning box model'ini tekshiring.",
              ],
            },
            summary: [
              "Har bir element: content → padding → border → margin.",
              "`box-sizing: border-box` bilan `width` qutining to'liq kengligini bildiradi.",
              "Padding fon rangini oladi, margin shaffof.",
              "Vertikal margin'lar qo'shilmaydi — kattasi qoladi (margin collapse).",
            ],
            keyTerms: [
              { term: "Padding", definition: "Kontent va chegara orasidagi ichki bo'shliq." },
              { term: "Margin", definition: "Elementning tashqi masofasi." },
              { term: "border-box", definition: "Kenglikka padding va border'ni ham kirituvchi o'lchash usuli." },
            ],
          },
        },
        {
          slug: "flexbox",
          title: "Flexbox bilan joylashuv",
          summary: "Elementlarni qator va ustunlarga oson joylashtirish.",
          durationMin: 22,
          interactive: [
            {
              type: "code-playground",
              title: "Flexbox o'yingohi",
              description: "justify-content va align-items qiymatlarini o'zgartirib ko'ring.",
              config: {
                language: "html",
                code: "<style>\n  .qator {\n    display: flex;\n    justify-content: space-between; /* flex-start, center, space-around */\n    align-items: center;            /* flex-start, flex-end, stretch */\n    gap: 12px;\n    height: 160px;\n    padding: 12px;\n    background: #eef1f6;\n    border-radius: 12px;\n  }\n  .quti {\n    padding: 16px 20px;\n    background: #2f5bff;\n    color: white;\n    border-radius: 8px;\n    font: 600 16px system-ui;\n  }\n</style>\n\n<div class=\"qator\">\n  <div class=\"quti\">1</div>\n  <div class=\"quti\">2</div>\n  <div class=\"quti\">3</div>\n</div>",
              },
            },
          ],
          content: {
            intro:
              "Menyuni bir qatorga terish, tugmani markazga qo'yish, kartochkalarni teng taqsimlash — bularni bir necha qator CSS bilan Flexbox hal qiladi.",
            concept:
              "**Flexbox** (Flexible Box Layout) — elementlarni bir o'q bo'ylab (qator yoki ustun) joylashtirish tizimi. U ikki ishtirokchidan iborat:\n\n- **Flex konteyner** — `display: flex` berilgan ota element\n- **Flex elementlar** — uning bevosita farzandlari\n\nFlexbox'da ikki o'q bor: **asosiy o'q** (main axis, odatda gorizontal) va **ko'ndalang o'q** (cross axis). `justify-content` elementlarni asosiy o'q bo'ylab, `align-items` esa ko'ndalang o'q bo'ylab tekislaydi.",
            why:
              "Flexbox'dan oldin elementlarni yonma-yon qo'yish uchun `float` kabi noqulay usullar ishlatilardi va vertikal markazlash haqiqiy muammo edi. Bugun Flexbox navigatsiya panellari, tugmalar guruhi, kartochkalar qatori va formalar uchun standart vosita. Har qanday frontend suhbatida Flexbox haqida so'rashadi.",
            how:
              "Konteynerga `display: flex` berilishi bilan farzandlar bir qatorga tiziladi. `flex-direction: column` o'qni vertikalga aylantiradi — shunda `justify-content` vertikal, `align-items` gorizontal ishlaydi.\n\nElementlar o'lchami ham moslashuvchan: `flex-grow` bo'sh joyni qanday taqsimlashni, `flex-shrink` joy yetmasa qanchalik qisqarishni, `flex-basis` esa boshlang'ich o'lchamni belgilaydi. Qisqa yozuv `flex: 1` — “bo'sh joyni teng bo'lib ol” degani. `flex-wrap: wrap` esa joy yetmaganda elementlarni keyingi qatorga ko'chiradi.",
            steps: [
              {
                title: "Konteynerni flex qiling",
                body: "Ota elementga `display: flex` va elementlar orasidagi masofa uchun `gap` bering.",
                code: { language: "css", code: ".menyu {\n  display: flex;\n  gap: 24px;\n}" },
              },
              {
                title: "Asosiy o'q bo'ylab tekislang",
                body: "`justify-content` qiymatlari: `flex-start`, `center`, `flex-end`, `space-between` (chetlarga yopishib, oraliq teng), `space-around`.",
                code: {
                  language: "css",
                  code: ".header {\n  display: flex;\n  justify-content: space-between; /* logo chapda, menyu o'ngda */\n  align-items: center;\n}",
                },
              },
              {
                title: "Elementni to'liq markazlang",
                body: "Mashhur muammoning eng qisqa yechimi:",
                code: { language: "css", code: ".markaz {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}" },
              },
              {
                title: "Kartochkalarni moslashuvchan qiling",
                body: "`flex-wrap` va `flex` bilan kartochkalar ekran kengligiga qarab qatorlarga taqsimlanadi.",
                code: {
                  language: "css",
                  code: ".kartalar {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n.kartalar > .karta {\n  flex: 1 1 260px; /* o'sadi, qisqaradi, boshlang'ich 260px */\n}",
                },
              },
            ],
            examples: [
              {
                title: "Sayt sarlavhasi",
                body: "Logo chapda, menyu havolalari o'ngda, hammasi vertikal markazda.",
                code: {
                  language: "html",
                  code: "<header class=\"header\">\n  <a class=\"logo\" href=\"/\">Kitobxon</a>\n  <nav class=\"menyu\">\n    <a href=\"/kitoblar\">Kitoblar</a>\n    <a href=\"/mualliflar\">Mualliflar</a>\n    <a href=\"/aloqa\">Aloqa</a>\n  </nav>\n</header>",
                },
              },
            ],
            mistakes: [
              {
                title: "display: flex ni farzand elementga berish",
                fix: "Flex xususiyati konteynerga beriladi. Elementlar yonma-yon turishi uchun ularning **otasiga** `display: flex` yozing.",
              },
              {
                title: "justify-content va align-items'ni adashtirish",
                fix: "Eslab qoling: `justify` — asosiy o'q (qator yo'nalishi), `align` — unga perpendikulyar o'q. `flex-direction: column` bo'lsa, ular o'rin almashganday ko'rinadi.",
              },
              {
                title: "Oraliq uchun har bir elementga margin berish",
                fix: "Zamonaviy usul — konteynerga `gap`. Bu chetdagi elementlarda ortiqcha masofa qoldirmaydi.",
              },
            ],
            tips: [
              "Flexbox — bir o'lchamli joylashuv (qator yoki ustun) uchun. Ikki o'lchamli murakkab tarmoqlar uchun keyinchalik CSS Grid'ni o'rganasiz.",
              "DevTools'da flex konteyner yonida “flex” belgisi chiqadi — uni bosib, o'qlarni vizual ko'rishingiz mumkin.",
              "“Flexbox Froggy” nomli bepul o'yin Flexbox'ni mustahkamlashga juda yordam beradi.",
            ],
            exercise: {
              title: "Ko'nikmalar bo'limi",
              brief: "Portfolio sahifangiz uchun ko'nikmalar kartochkalari qatorini yarating.",
              tasks: [
                "Logo va menyudan iborat `<header>` ni `space-between` bilan joylashtiring.",
                "6 ta ko'nikma kartochkasini `flex-wrap` bilan qatorlarga taqsimlang.",
                "Har bir kartochka kamida 220px kenglikda bo'lsin va qolgan joyni teng bo'lsin.",
                "Kartochka ichida ikonka va matnni vertikal markazlang.",
                "Brauzer oynasini toraytirib, kartochkalar qanday ko'chishini kuzating.",
              ],
            },
            summary: [
              "`display: flex` farzand elementlarni bir o'q bo'ylab joylashtiradi.",
              "`justify-content` — asosiy o'q, `align-items` — ko'ndalang o'q bo'yicha tekislash.",
              "`gap` elementlar orasidagi masofani beradi.",
              "`flex-wrap` va `flex: 1 1 260px` moslashuvchan kartochkalar yaratadi.",
            ],
            keyTerms: [
              { term: "Flex konteyner", definition: "`display: flex` berilgan ota element." },
              { term: "Asosiy o'q", definition: "Elementlar tiziladigan yo'nalish (`flex-direction`)." },
              { term: "gap", definition: "Flex yoki grid elementlari orasidagi masofa." },
            ],
          },
        },
        {
          slug: "responsive-dizayn",
          title: "Moslashuvchan dizayn (responsive)",
          summary: "Viewport, nisbiy birliklar, media query va mobile-first yondashuv.",
          durationMin: 20,
          interactive: [
            {
              type: "code-playground",
              title: "Media query'ni sinab ko'ring",
              description: "Natija oynasi kengligi 500px dan kichik bo'lsa, kartochkalar ustunga aylanadi.",
              config: {
                language: "html",
                code: "<style>\n  body { font-family: system-ui; margin: 0; padding: 16px; }\n  .kartalar { display: flex; flex-direction: column; gap: 12px; }\n  .karta { padding: 16px; border-radius: 10px; background: #eef3ff; }\n\n  /* 500px va undan keng ekranlar uchun */\n  @media (min-width: 500px) {\n    .kartalar { flex-direction: row; }\n    .karta { flex: 1; }\n  }\n</style>\n\n<div class=\"kartalar\">\n  <div class=\"karta\">HTML</div>\n  <div class=\"karta\">CSS</div>\n  <div class=\"karta\">Flexbox</div>\n</div>",
              },
            },
          ],
          content: {
            intro:
              "O'zbekistonda internet foydalanuvchilarining katta qismi saytlarni telefondan ochadi. Shuning uchun sahifa avvalo kichik ekranda qulay bo'lishi kerak.",
            concept:
              "**Moslashuvchan (responsive) dizayn** — bitta sahifaning turli ekran o'lchamlariga avtomatik moslashishi. U uchta asosiy vositaga tayanadi:\n\n1. **Viewport meta tegi** — telefonga sahifani o'z kengligida ko'rsatishni aytadi\n2. **Nisbiy birliklar** — `%`, `rem`, `vw`, `fr`, shuningdek `max-width` va `min()` kabi funksiyalar\n3. **Media query** — ekran kengligiga qarab turli qoidalarni qo'llash: `@media (min-width: 768px) { ... }`",
            why:
              "Telefonda kichrayib, “mayda shrift” bo'lib ko'rinadigan sayt foydalanuvchini darhol qochiradi. Qidiruv tizimlari ham saytlarni avvalo mobil versiyasi bo'yicha baholaydi. Responsive dizayn — bugun majburiy standart.",
            how:
              "Viewport tegisiz telefon brauzeri sahifani taxminan 980px kenglikdagi kompyuter ekrani deb hisoblab, kichraytirib ko'rsatadi. `width=device-width` qurilmaning haqiqiy kengligidan foydalanishni buyuradi.\n\n**Mobile-first** yondashuvida avval kichik ekran uchun oddiy uslub yoziladi, so'ng `min-width` media query'lar bilan katta ekranlar uchun qo'shimchalar qilinadi. Bu kodni soddaroq qiladi: kichik ekranda odatda hamma narsa bir ustunda turadi, bu esa brauzerning standart holati.\n\n`rem` birligi ildiz element shrift o'lchamiga (odatda 16px) nisbatan hisoblanadi. Foydalanuvchi brauzerda shriftni kattalashtirsa, `rem` bilan yozilgan dizayn ham birga kattalashadi.",
            steps: [
              {
                title: "Viewport tegini tekshiring",
                body: "U `<head>` ichida bo'lishi shart.",
                code: { language: "html", code: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" },
              },
              {
                title: "Rasmlarni moslashuvchan qiling",
                body: "Rasm o'z konteyneridan kengayib ketmasligi uchun:",
                code: { language: "css", code: "img {\n  max-width: 100%;\n  height: auto;\n}" },
              },
              {
                title: "Mobil uslubni birinchi yozing",
                body: "Asosiy qoidalarni media query'siz, kichik ekran uchun yozing.",
                code: {
                  language: "css",
                  code: ".kartalar {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\nh1 { font-size: 2rem; }",
                },
              },
              {
                title: "Katta ekranlar uchun qo'shimcha qiling",
                body: "Breakpoint'larni qurilma nomlari emas, dizayningiz “buziladigan” joyga qarab tanlang. Keng tarqalgan qiymatlar: 640px, 768px, 1024px.",
                code: {
                  language: "css",
                  code: "@media (min-width: 768px) {\n  .kartalar { flex-direction: row; }\n  h1 { font-size: 3rem; }\n}",
                },
              },
              {
                title: "Telefon rejimida tekshiring",
                body: "DevTools'da “Toggle device toolbar” (`Ctrl + Shift + M`) tugmasini bosib, turli qurilmalarda sahifani ko'ring.",
              },
            ],
            examples: [
              {
                title: "Moslashuvchan sarlavha o'lchami",
                body: "`clamp(min, ideal, max)` shrift o'lchamini ekran kengligiga qarab silliq o'zgartiradi — alohida media query'siz.",
                code: { language: "css", code: "h1 {\n  font-size: clamp(2rem, 5vw + 1rem, 4rem);\n}" },
              },
              {
                title: "Kontent kengligini cheklash",
                body: "Juda keng ekranlarda matn qatorlari haddan tashqari uzun bo'lmasligi uchun:",
                code: { language: "css", code: ".maqola {\n  max-width: 70ch; /* taxminan 70 ta belgi */\n  margin-inline: auto;\n  padding-inline: 16px;\n}" },
              },
            ],
            mistakes: [
              {
                title: "Qat'iy piksel kengliklari",
                fix: "`width: 1200px` telefonda gorizontal aylantirishni keltirib chiqaradi. `max-width: 1200px; width: 100%` ishlating.",
              },
              {
                title: "Faqat kompyuterda tekshirish",
                fix: "Har bir o'zgarishdan keyin DevTools qurilma rejimida va imkon bo'lsa haqiqiy telefonda tekshiring.",
              },
              {
                title: "Mobil uchun juda kichik tugma va havolalar",
                fix: "Barmoq bilan bosiladigan elementlar kamida 44×44px bo'lsin va bir-biriga juda yaqin turmasin.",
              },
            ],
            tips: [
              "Avval eng kichik ekranni (360px) loyihalang — keyin kengaytirish torroq qilishdan osonroq.",
              "Shrift o'lchamlarini `rem` da yozing, chegaralar uchun esa `px` qoldirish mumkin.",
              "Breakpoint'lar sonini kam tuting: ko'pincha 2–3 ta yetarli.",
            ],
            exercise: {
              title: "Portfolio'ni moslashuvchan qiling",
              brief: "Kurs davomida yaratgan sahifangizni barcha ekranlar uchun moslang.",
              tasks: [
                "Viewport tegi borligiga ishonch hosil qiling.",
                "Barcha rasmlarga `max-width: 100%` bering.",
                "Mobil ekranda ko'nikma kartochkalari bir ustunda tursin.",
                "768px dan keng ekranlarda kartochkalar qatorga tizilsin.",
                "Asosiy sarlavhaga `clamp()` bilan moslashuvchan o'lcham bering.",
                "Sahifani 360px, 768px va 1280px kengliklarda tekshiring va gorizontal aylantirish yo'qligiga ishonch hosil qiling.",
              ],
              hint: "Gorizontal aylantirishning sababini topish uchun DevTools'da elementlarni birma-bir yashirib ko'ring.",
            },
            summary: [
              "Viewport meta tegi telefonda to'g'ri o'lchamni ta'minlaydi.",
              "Mobile-first: avval kichik ekran, so'ng `min-width` media query'lar.",
              "Nisbiy birliklar (`rem`, `%`, `vw`) va `max-width` moslashuvchanlik asosi.",
              "`clamp()` o'lchamlarni silliq moslashtiradi.",
            ],
            keyTerms: [
              { term: "Viewport", definition: "Brauzerda sahifa ko'rinadigan maydon." },
              { term: "Media query", definition: "Ekran sharoitiga qarab CSS qoidalarini qo'llash usuli." },
              { term: "Breakpoint", definition: "Dizayn o'zgaradigan ekran kengligi." },
              { term: "rem", definition: "Ildiz shrift o'lchamiga nisbatan birlik (odatda 1rem = 16px)." },
            ],
          },
        },
      ],
      quiz: {
        title: "3-modul testi: CSS",
        description: "Selektorlar, box model, Flexbox va moslashuvchan dizayn bo'yicha savollar.",
        questions: [
          {
            prompt: "class=\"karta\" bo'lgan elementlarni qaysi selektor tanlaydi?",
            options: ["#karta", ".karta", "karta", "*karta"],
            correct: 1,
            explanation: "Klass selektori nuqta bilan yoziladi: `.karta`.",
          },
          {
            prompt: "width: 200px; padding: 20px; border: 2px. box-sizing: content-box bo'lsa, quti umumiy kengligi qancha?",
            options: ["200px", "220px", "244px", "242px"],
            correct: 2,
            explanation: "200 + 20×2 (padding) + 2×2 (border) = 244px.",
          },
          {
            prompt: "Flex elementlarini asosiy o'q bo'ylab markazga qo'yish uchun nima yoziladi?",
            options: ["align-items: center", "justify-content: center", "text-align: center", "margin: center"],
            correct: 1,
            explanation: "`justify-content` asosiy o'q bo'yicha tekislaydi.",
          },
          {
            prompt: "Mobile-first yondashuvida qaysi media query ishlatiladi?",
            options: ["max-width", "min-width", "orientation", "print"],
            correct: 1,
            explanation: "Avval kichik ekran uchun yoziladi, keyin `min-width` bilan katta ekranlarga qo'shimchalar qilinadi.",
          },
          {
            prompt: "Viewport meta tegi bo'lmasa, telefonda nima bo'ladi?",
            options: [
              "Sahifa umuman ochilmaydi",
              "Sahifa kompyuter kengligida chizilib, kichraytirilgan holda ko'rinadi",
              "CSS ishlamaydi",
              "Hech narsa o'zgarmaydi",
            ],
            correct: 1,
            explanation: "Brauzer sahifani taxminan 980px kenglikda chizib, ekranga sig'dirish uchun kichraytiradi.",
          },
          {
            prompt: "Qaysi xususiyat flex elementlar orasidagi masofani beradi?",
            options: ["space", "gap", "padding-between", "margin-flex"],
            correct: 1,
            explanation: "`gap` konteynerga beriladi va elementlar orasidagi masofani belgilaydi.",
          },
        ],
      },
    },
  ],
  finalQuiz: {
    title: "Yakuniy imtihon: HTML va CSS",
    description: "Kursni yakunlash va sertifikat olish uchun kamida 70% to'g'ri javob bering.",
    passingScore: 70,
    questions: [
      {
        prompt: "HTML hujjatining qaysi qismida sahifa sarlavhasi (brauzer yorlig'idagi matn) yoziladi?",
        options: ["<body> ichidagi <h1>", "<head> ichidagi <title>", "<header>", "<meta name>"],
        correct: 1,
        explanation: "Brauzer yorlig'idagi matn `<head>` ichidagi `<title>` tegidan olinadi.",
      },
      {
        prompt: "Qaysi teg sahifaning asosiy navigatsiyasi uchun mo'ljallangan?",
        options: ["<menu>", "<nav>", "<links>", "<header>"],
        correct: 1,
        explanation: "`<nav>` asosiy navigatsiya havolalari guruhini bildiradi.",
      },
      {
        prompt: "Forma maydoni qiymati serverga yuborilishi uchun qaysi atribut zarur?",
        options: ["id", "class", "name", "for"],
        correct: 2,
        explanation: "Brauzer faqat `name` atributiga ega maydonlarni yuboradi.",
      },
      {
        prompt: "Qaysi CSS qoidasi barcha havolalarni sichqoncha ustiga kelganda tagiga chizadi?",
        options: ["a:hover { text-decoration: underline; }", "a { hover: underline; }", "a:focus { underline: true; }", "hover a { line: under; }"],
        correct: 0,
        explanation: "`:hover` psevdoklassi sichqoncha element ustida turgan holatni tanlaydi.",
      },
      {
        prompt: "padding va margin o'rtasidagi asosiy farq nima?",
        options: [
          "Ular bir xil",
          "Padding — ichki bo'shliq (fon rangini oladi), margin — tashqi masofa (shaffof)",
          "Margin faqat matnga ta'sir qiladi",
          "Padding faqat rasmlarga qo'llanadi",
        ],
        correct: 1,
        explanation: "Padding kontent va chegara orasida, margin esa chegaradan tashqarida joylashadi.",
      },
      {
        prompt: "Qaysi juftlik elementni ham gorizontal, ham vertikal markazlaydi (display: flex bilan)?",
        options: [
          "justify-content: center; align-items: center;",
          "text-align: center; vertical-align: middle;",
          "margin: auto; float: center;",
          "align-content: middle;",
        ],
        correct: 0,
        explanation: "Ikki o'q bo'yicha ham `center` qiymati beriladi.",
      },
      {
        prompt: "Rasm konteynerdan kengayib ketmasligi uchun qaysi qoida yoziladi?",
        options: ["img { width: 100vw; }", "img { max-width: 100%; height: auto; }", "img { overflow: hidden; }", "img { flex: 1; }"],
        correct: 1,
        explanation: "`max-width: 100%` rasmni konteyner kengligi bilan cheklaydi, `height: auto` nisbatni saqlaydi.",
      },
      {
        prompt: "Bir xil kuchdagi ikki CSS qoidasi to'qnashsa, qaysi biri qo'llanadi?",
        options: ["Birinchi yozilgani", "Keyin yozilgani", "Qisqarog'i", "Hech biri"],
        correct: 1,
        explanation: "Kaskad qoidasiga ko'ra, teng aniqlikdagi qoidalardan keyin yozilgani g'olib bo'ladi.",
      },
    ],
  },
};
