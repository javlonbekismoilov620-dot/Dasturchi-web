import "server-only";
import { cache } from "react";
import { store } from "@/lib/server/store";
import type { Category, Course, LearningPath, Lesson, LessonMeta, Module, Quiz } from "@/lib/types";
import { levelName, searchKey } from "@/lib/text";
import type { SearchItem } from "@/lib/search";

export type { SearchItem } from "@/lib/search";

const LESSON_META_COLUMNS: (keyof Lesson)[] = [
  "id", "courseId", "moduleId", "slug", "title", "summary", "durationMin", "order", "status",
  "isPreview", "video", "resources", "interactive", "updatedAt",
];

function stripContent(l: Lesson): LessonMeta {
  const { content: _c, ...meta } = l;
  void _c;
  return meta;
}

export type QuizMeta = Omit<Quiz, "questions"> & { questionCount: number };

function quizMeta(q: Quiz): QuizMeta {
  const { questions, ...rest } = q;
  return { ...rest, questionCount: questions.length };
}

/* ── Yo‘nalishlar ────────────────────────────────────────── */

export const listCategories = cache(async (): Promise<Category[]> => {
  return store().select("categories", { orderBy: [{ field: "order" }] });
});

export async function getCategoryBySlug(slug: string) {
  return store().first("categories", { slug });
}

/* ── Kurslar ─────────────────────────────────────────────── */

export const listCourses = cache(async (includeDrafts = false): Promise<Course[]> => {
  const all = await store().select("courses", { orderBy: [{ field: "order" }] });
  return includeDrafts ? all : all.filter((c) => c.status !== "draft");
});

export async function getCourseBySlug(slug: string, includeDrafts = false): Promise<Course | null> {
  const course = await store().first("courses", { slug });
  if (!course || (!includeDrafts && course.status === "draft")) return null;
  return course;
}

export async function getCourseById(id: string) {
  return store().getById("courses", id);
}

/** Barcha darslarning yengil ko‘rinishi (kontentsiz) */
export const listAllLessonMeta = cache(async (): Promise<LessonMeta[]> => {
  const rows = await store().select("lessons", { columns: LESSON_META_COLUMNS, orderBy: [{ field: "order" }] });
  return rows.map(stripContent);
});

export async function listLessonMeta(courseId: string): Promise<LessonMeta[]> {
  const rows = await store().select("lessons", {
    where: { courseId },
    columns: LESSON_META_COLUMNS,
    orderBy: [{ field: "order" }],
  });
  return rows.map(stripContent);
}

export interface CourseStats {
  lessonCount: number;
  publishedCount: number;
  plannedCount: number;
  minutes: number;
  moduleCount: number;
  quizCount: number;
  enrollments: number;
  interactiveCount: number;
}

export const getCourseStatsMap = cache(async (): Promise<Map<string, CourseStats>> => {
  const [lessons, modules, quizzes, enrollments] = await Promise.all([
    listAllLessonMeta(),
    store().select("modules", { columns: ["id", "courseId"] }),
    store().select("quizzes", { columns: ["id", "courseId"] }),
    store().select("enrollments", { columns: ["id", "courseId"] }),
  ]);
  const map = new Map<string, CourseStats>();
  const get = (id: string) => {
    let s = map.get(id);
    if (!s) {
      s = { lessonCount: 0, publishedCount: 0, plannedCount: 0, minutes: 0, moduleCount: 0, quizCount: 0, enrollments: 0, interactiveCount: 0 };
      map.set(id, s);
    }
    return s;
  };
  for (const l of lessons) {
    if (l.status === "draft") continue;
    const s = get(l.courseId);
    s.lessonCount++;
    if (l.status === "published") {
      s.publishedCount++;
      s.minutes += l.durationMin;
      if (l.interactive?.length) s.interactiveCount++;
    } else s.plannedCount++;
  }
  for (const m of modules) get(m.courseId).moduleCount++;
  for (const q of quizzes) get(q.courseId).quizCount++;
  for (const e of enrollments) get(e.courseId).enrollments++;
  return map;
});

export function emptyStats(): CourseStats {
  return { lessonCount: 0, publishedCount: 0, plannedCount: 0, minutes: 0, moduleCount: 0, quizCount: 0, enrollments: 0, interactiveCount: 0 };
}

export interface CurriculumModule extends Module {
  lessons: LessonMeta[];
  quiz: QuizMeta | null;
  minutes: number;
}

export interface Curriculum {
  modules: CurriculumModule[];
  finalQuiz: QuizMeta | null;
  lessons: LessonMeta[];
  publishedLessons: LessonMeta[];
}

export async function getCurriculum(courseId: string, includeDrafts = false): Promise<Curriculum> {
  const [modules, lessons, quizzes] = await Promise.all([
    store().select("modules", { where: { courseId }, orderBy: [{ field: "order" }] }),
    listLessonMeta(courseId),
    store().select("quizzes", { where: { courseId } }),
  ]);
  const visible = includeDrafts ? lessons : lessons.filter((l) => l.status !== "draft");
  const result: CurriculumModule[] = modules.map((m) => {
    const ls = visible.filter((l) => l.moduleId === m.id).sort((a, b) => a.order - b.order);
    const q = quizzes.find((x) => x.moduleId === m.id);
    return { ...m, lessons: ls, quiz: q ? quizMeta(q) : null, minutes: ls.reduce((a, l) => a + l.durationMin, 0) };
  });
  const ordered = result.flatMap((m) => m.lessons);
  const final = quizzes.find((q) => q.moduleId === null);
  return {
    modules: result,
    finalQuiz: final ? quizMeta(final) : null,
    lessons: ordered,
    publishedLessons: ordered.filter((l) => l.status === "published"),
  };
}

export async function getLesson(courseId: string, slug: string): Promise<Lesson | null> {
  return store().first("lessons", { courseId, slug });
}

export async function getLessonById(id: string) {
  return store().getById("lessons", id);
}

export async function getQuiz(id: string) {
  return store().getById("quizzes", id);
}

export async function listQuizzes(courseId: string) {
  return store().select("quizzes", { where: { courseId } });
}

/* ── O‘quv yo‘llari ──────────────────────────────────────── */

export const listPaths = cache(async (): Promise<LearningPath[]> => {
  return store().select("paths", { orderBy: [{ field: "order" }] });
});

export async function getPathBySlug(slug: string) {
  return store().first("paths", { slug });
}

/* ── Platforma statistikasi (haqiqiy ma’lumotlardan) ──────── */

export const getPlatformStats = cache(async () => {
  const [categories, courses, stats] = await Promise.all([listCategories(), listCourses(), getCourseStatsMap()]);
  let lessons = 0;
  let minutes = 0;
  let interactive = 0;
  let quizzes = 0;
  let planned = 0;
  for (const c of courses) {
    const s = stats.get(c.id);
    if (!s) continue;
    lessons += s.publishedCount;
    minutes += s.minutes;
    interactive += s.interactiveCount;
    quizzes += s.quizCount;
    planned += s.plannedCount;
  }
  return {
    categories: categories.length,
    courses: courses.length,
    publishedCourses: courses.filter((c) => c.status === "published").length,
    lessons,
    plannedLessons: planned,
    hours: Math.round(minutes / 60),
    interactive,
    quizzes,
  };
});

/* ── Qidiruv indeksi ─────────────────────────────────────── */

export const buildSearchIndex = cache(async (): Promise<SearchItem[]> => {
  const [categories, courses, lessons, paths] = await Promise.all([
    listCategories(),
    listCourses(),
    listAllLessonMeta(),
    listPaths(),
  ]);
  const catById = new Map(categories.map((c) => [c.id, c]));
  const courseById = new Map(courses.map((c) => [c.id, c]));
  const items: SearchItem[] = [];

  for (const c of categories) {
    items.push({
      type: "category",
      title: c.title,
      subtitle: `Yo‘nalish · ${c.topics.slice(0, 4).join(", ")}`,
      href: `/yonalishlar/${c.slug}`,
      keywords: searchKey([c.title, c.description, ...c.topics].join(" ")),
      categorySlug: c.slug,
    });
  }

  const software = new Map<string, Set<string>>();
  const skills = new Map<string, string>();
  for (const c of courses) {
    const cat = catById.get(c.categoryId);
    items.push({
      type: "course",
      title: c.title,
      subtitle: `${cat?.title ?? "Kurs"} · ${levelName(c.level)}${c.status === "preparing" ? " · Tayyorlanmoqda" : ""}`,
      href: `/kurslar/${c.slug}`,
      keywords: searchKey([c.title, c.subtitle, c.description, ...c.tags, ...c.software, ...c.skills].join(" ")),
      level: c.level,
      categorySlug: cat?.slug,
      status: c.status,
    });
    for (const s of c.software) {
      if (!software.has(s)) software.set(s, new Set());
      software.get(s)!.add(c.slug);
    }
    for (const s of c.skills) if (!skills.has(s)) skills.set(s, c.slug);
  }

  for (const l of lessons) {
    if (l.status !== "published") continue;
    const c = courseById.get(l.courseId);
    if (!c) continue;
    items.push({
      type: "lesson",
      title: l.title,
      subtitle: `Dars · ${c.title}`,
      href: `/kurslar/${c.slug}/dars/${l.slug}`,
      keywords: searchKey(`${l.title} ${l.summary}`),
      level: c.level,
      categorySlug: catById.get(c.categoryId)?.slug,
    });
  }

  for (const p of paths) {
    items.push({
      type: "path",
      title: p.title,
      subtitle: `O‘quv yo‘li · ${p.steps.length} bosqich`,
      href: `/yollar/${p.slug}`,
      keywords: searchKey([p.title, p.subtitle, p.description, ...p.outcomes].join(" ")),
    });
  }

  for (const [name, slugs] of software) {
    items.push({
      type: "software",
      title: name,
      subtitle: `Dastur · ${slugs.size} ta kursda`,
      href: `/kurslar?q=${encodeURIComponent(name)}`,
      keywords: searchKey(name),
    });
  }
  for (const [name, slug] of skills) {
    items.push({
      type: "skill",
      title: name,
      subtitle: "Ko‘nikma",
      href: `/kurslar/${slug}`,
      keywords: searchKey(name),
    });
  }
  return items;
});
