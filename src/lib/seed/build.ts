/* Kontent seed fayllarini (content/) ma’lumotlar bazasi qatorlariga aylantiradi.
   Next.js serveri va `npm run seed` skripti tomonidan ishlatiladi,
   shuning uchun faqat nisbiy importlar ishlatilgan. */
import type {
  Category,
  Course,
  CourseSeed,
  LearningPath,
  Lesson,
  LessonContent,
  Module,
  Quiz,
  QuizSeed,
} from "../types.ts";
import { normalizeDeep } from "../text.ts";

export type CategorySeed = Omit<Category, "id">;
export type PathSeed = Omit<LearningPath, "id">;

export const DEFAULT_INSTRUCTOR = {
  name: "Dasturchi o‘quv jamoasi",
  role: "Kurs mualliflari va metodistlar",
  bio: "Kurslar amaliyotchi dasturchilar, dizaynerlar va montaj ustalari tajribasi asosida tayyorlanadi. Har bir dars noldan boshlovchi o‘quvchi uchun tushunarli bo‘lishi uchun bir necha bor tekshiriladi.",
  avatarUrl: null,
};

export function emptyContent(): LessonContent {
  return {
    intro: "",
    concept: "",
    why: "",
    how: "",
    steps: [],
    examples: [],
    mistakes: [],
    tips: [],
    exercise: { title: "", brief: "", tasks: [] },
    summary: [],
    keyTerms: [],
  };
}

function quizRow(seed: QuizSeed, id: string, courseId: string, moduleId: string | null): Quiz {
  return {
    id,
    courseId,
    moduleId,
    title: seed.title,
    description: seed.description,
    passingScore: seed.passingScore ?? 70,
    questions: seed.questions.map((q, i) => ({ ...q, id: `${id}_q${i + 1}` })),
  };
}

export interface SeedRows {
  categories: Category[];
  courses: Course[];
  modules: Module[];
  lessons: Lesson[];
  quizzes: Quiz[];
  paths: LearningPath[];
}

export function buildSeedRows(
  courseSeeds: CourseSeed[],
  categorySeeds: CategorySeed[],
  pathSeeds: PathSeed[],
): SeedRows {
  const now = new Date().toISOString();
  const rows: SeedRows = { categories: [], courses: [], modules: [], lessons: [], quizzes: [], paths: [] };

  for (const c of categorySeeds) rows.categories.push(normalizeDeep({ ...c, id: `cat_${c.slug}` }));

  courseSeeds.forEach((raw, courseIndex) => {
    const seed = normalizeDeep(raw);
    const courseId = `crs_${seed.slug}`;
    const { modules, finalQuiz, category, ...rest } = seed;
    rows.courses.push({
      ...rest,
      id: courseId,
      categoryId: `cat_${category}`,
      featured: seed.featured ?? false,
      order: seed.order ?? courseIndex,
      coverUrl: null,
      instructor: seed.instructor ?? DEFAULT_INSTRUCTOR,
      finalProject: seed.finalProject ?? null,
      createdAt: now,
      updatedAt: now,
    });

    let lessonOrder = 0;
    modules.forEach((m, mi) => {
      const moduleId = `mod_${seed.slug}_${mi + 1}`;
      rows.modules.push({ id: moduleId, courseId, title: m.title, description: m.description, order: mi });
      for (const l of m.lessons) {
        rows.lessons.push({
          id: `les_${seed.slug}__${l.slug}`,
          courseId,
          moduleId,
          slug: l.slug,
          title: l.title,
          summary: l.summary,
          durationMin: l.durationMin,
          order: lessonOrder++,
          status: l.content ? (l.status ?? "published") : "planned",
          isPreview: l.isPreview ?? false,
          video: null,
          content: l.content ?? emptyContent(),
          resources: (l.resources ?? []).map((r, ri) => ({ ...r, id: `res_${seed.slug}_${l.slug}_${ri + 1}` })),
          interactive: l.interactive ?? [],
          updatedAt: now,
        });
      }
      if (m.quiz) rows.quizzes.push(quizRow(m.quiz, `quiz_${seed.slug}_m${mi + 1}`, courseId, moduleId));
    });
    if (finalQuiz) rows.quizzes.push(quizRow(finalQuiz, `quiz_${seed.slug}_final`, courseId, null));
  });

  for (const p of pathSeeds) rows.paths.push(normalizeDeep({ ...p, id: `path_${p.slug}` }));
  return rows;
}
