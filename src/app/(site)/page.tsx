import { CourseCard } from "@/components/course/course-card";
import { Faq, InteractivePreview, LevelRoadmap, ProgressShowcase } from "@/components/landing/client-sections";
import { Hero } from "@/components/landing/hero";
import { IntroCurtain } from "@/components/landing/intro-curtain";
import { CategoriesSection, FeaturesSection, FinalCta, ProjectsSection, ToolsMarquee } from "@/components/landing/sections";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/primitives";
import { getCourseStatsMap, getPlatformStats, listCategories, listCourses } from "@/lib/server/services/content";

const FAQ = [
  {
    q: "Kurslar pullikmi?",
    a: "Hozirda platformadagi barcha kurslar bepul. Ro‘yxatdan o‘tsangiz, progressingiz, qaydlaringiz va sertifikatlaringiz hisobingizda saqlanadi.",
  },
  {
    q: "Hech qanday tajribam yo‘q. Boshlay olamanmi?",
    a: "Albatta. 1-daraja (“Mutlaqo boshlang‘ich”) kurslari hech qanday oldingi bilim talab qilmaydi: har bir atama sodda tilda tushuntiriladi. Qayerdan boshlashni bilmasangiz, “Darajani aniqlash” savolnomasidan o‘ting.",
  },
  {
    q: "Qanday kompyuter kerak?",
    a: "Dasturlash va dizayn kurslari uchun oddiy noutbuk yetarli. Blender, Unreal Engine va DaVinci Resolve kabi dasturlar uchun alohida videokartali kompyuter tavsiya etiladi — har bir kurs sahifasida talablar ko‘rsatilgan.",
  },
  {
    q: "Sertifikat beriladimi?",
    a: "Ha. Kursning barcha darslarini yakunlab, yakuniy testdan muvaffaqiyatli o‘tsangiz, platforma sertifikati avtomatik beriladi. Har bir sertifikatda noyob kod bor — uni istalgan kishi saytda tekshira oladi. Bu davlat diplomi emas, balki kursni tamomlaganingizni tasdiqlovchi hujjat.",
  },
  {
    q: "“Tayyorlanmoqda” belgisi nimani anglatadi?",
    a: "Bu kursning o‘quv dasturi (modullar va dars mavzulari) e’lon qilingan, lekin darslar hali yozilmoqda. Tayyor darslar bosqichma-bosqich qo‘shiladi. Biz to‘liq bo‘lmagan kursni to‘liq deb ko‘rsatmaymiz.",
  },
  {
    q: "Telefonda o‘qish mumkinmi?",
    a: "Ha. Platforma telefon va planshet uchun alohida moslashtirilgan: qulay navigatsiya, o‘qish uchun qulay shrift va sensorli boshqaruv. Progress barcha qurilmalarda bir xil saqlanadi.",
  },
  {
    q: "Darslarda video bormi?",
    a: "Har bir dars to‘liq matnli tushuntirish, kod misollari, mashq va ko‘plab darslarda interaktiv vositalardan iborat. Video yuklangan darslarda katta video pleyer ko‘rsatiladi va ko‘rish joyingiz eslab qolinadi.",
  },
];

export default async function HomePage() {
  const [stats, categories, courses, statsMap] = await Promise.all([
    getPlatformStats(),
    listCategories(),
    listCourses(),
    getCourseStatsMap(),
  ]);

  const counts: Record<string, { courses: number; lessons: number }> = {};
  const levelCounts: Record<number, number> = {};
  const tools = new Set<string>();
  for (const c of courses) {
    counts[c.categoryId] ??= { courses: 0, lessons: 0 };
    counts[c.categoryId].courses++;
    counts[c.categoryId].lessons += statsMap.get(c.id)?.publishedCount ?? 0;
    levelCounts[c.level] = (levelCounts[c.level] ?? 0) + 1;
    c.software.forEach((s) => tools.add(s));
  }
  // Avval to‘liq kurslar, so‘ng har bir yo‘nalishdan bittadan — xilma-xillik uchun
  const featured: typeof courses = courses.filter((c) => c.status === "published").sort((a, b) => Number(b.featured) - Number(a.featured));
  for (const cat of categories) {
    const pick = courses.find((c) => c.categoryId === cat.id && !featured.includes(c) && c.level <= 2);
    if (pick) featured.push(pick);
  }
  featured.splice(6);
  const catById = new Map(categories.map((c) => [c.id, c]));

  return (
    <>
      <IntroCurtain />
      <Hero
        stats={[
          { value: stats.publishedCourses, label: "ta to‘liq kurs" },
          { value: stats.lessons, label: "ta tayyor dars" },
          { value: stats.interactive, label: "ta interaktiv dars" },
          { value: stats.courses - stats.publishedCourses, label: "ta kurs tayyorlanmoqda" },
        ]}
      />
      <ToolsMarquee tools={[...tools].filter((t) => !["Brauzer", "Telefon kamerasi"].includes(t)).slice(0, 22)} />
      <CategoriesSection categories={categories} counts={counts} />

      <section className="container-page py-24 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Tavsiya etilgan kurslar"
            title={
              <>
                Bugun boshlash mumkin bo‘lgan <span className="font-display-italic text-fg-muted">kurslar</span>
              </>
            }
            description="Har bir kurs tuzilgan modullar, batafsil darslar, amaliy mashqlar va testlardan iborat."
            action={
              <ButtonLink href="/kurslar" variant="secondary" size="sm">
                Barcha kurslar
              </ButtonLink>
            }
          />
        </Reveal>
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => (
            <StaggerItem key={c.id}>
              <CourseCard course={c} stats={statsMap.get(c.id)} category={catById.get(c.categoryId)} className="h-full" />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <LevelRoadmap counts={levelCounts} />
      <FeaturesSection />
      <InteractivePreview />
      <ProgressShowcase />
      <ProjectsSection courses={courses} />
      <Faq items={FAQ} />
      <FinalCta />
    </>
  );
}
