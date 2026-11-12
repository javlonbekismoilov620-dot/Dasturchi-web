import "server-only";
import { randomBytes, randomUUID } from "node:crypto";
import { store } from "@/lib/server/store";
import type {
  Activity,
  ActivityType,
  Certificate,
  Course,
  Enrollment,
  LessonMeta,
  LessonProgress,
  Quiz,
  User,
} from "@/lib/types";
import { dayKey } from "@/lib/text";
import { getCourseStatsMap, getCurriculum, listCategories, listCourses, listPaths } from "./content";

const nowIso = () => new Date().toISOString();

async function logActivity(userId: string, type: ActivityType, courseId: string, refId: string | null, label: string) {
  await store().insert("activities", { id: randomUUID(), userId, type, courseId, refId, label, createdAt: nowIso() });
}

/* ── Kursga yozilish ─────────────────────────────────────── */

export async function getEnrollment(userId: string, courseId: string) {
  return store().first("enrollments", { userId, courseId });
}

export async function enroll(userId: string, course: Course): Promise<Enrollment> {
  const existing = await getEnrollment(userId, course.id);
  if (existing) return existing;
  const row: Enrollment = {
    id: randomUUID(),
    userId,
    courseId: course.id,
    enrolledAt: nowIso(),
    lastLessonId: null,
    lastAccessAt: nowIso(),
    completedAt: null,
  };
  await store().insert("enrollments", row);
  await logActivity(userId, "course_enrolled", course.id, null, course.title);
  return row;
}

export async function listEnrollments(userId: string) {
  return store().select("enrollments", { where: { userId }, orderBy: [{ field: "lastAccessAt", asc: false }] });
}

/** Talaba darsni ochganda: oxirgi dars eslab qolinadi */
export async function touchLesson(userId: string, course: Course, lessonId: string) {
  const e = await enroll(userId, course);
  await store().update("enrollments", e.id, { lastLessonId: lessonId, lastAccessAt: nowIso() });
}

/* ── Dars progressi ──────────────────────────────────────── */

export async function getProgressRows(userId: string, courseId?: string): Promise<LessonProgress[]> {
  return store().select("lesson_progress", { where: courseId ? { userId, courseId } : { userId } });
}

export async function getLessonProgress(userId: string, lessonId: string) {
  return store().first("lesson_progress", { userId, lessonId });
}

async function upsertProgress(userId: string, lesson: Pick<LessonMeta, "id" | "courseId">, patch: Partial<LessonProgress>) {
  const existing = await getLessonProgress(userId, lesson.id);
  if (existing) return store().update("lesson_progress", existing.id, { ...patch, updatedAt: nowIso() });
  return store().insert("lesson_progress", {
    id: randomUUID(),
    userId,
    lessonId: lesson.id,
    courseId: lesson.courseId,
    completed: false,
    completedAt: null,
    videoPosition: 0,
    updatedAt: nowIso(),
    ...patch,
  });
}

export async function setLessonCompleted(user: User, course: Course, lesson: LessonMeta, completed: boolean) {
  await enroll(user.id, course);
  const before = await getLessonProgress(user.id, lesson.id);
  await upsertProgress(user.id, lesson, { completed, completedAt: completed ? nowIso() : null });
  if (completed && !before?.completed) {
    await logActivity(user.id, "lesson_completed", course.id, lesson.id, lesson.title);
  }
  return checkCourseCompletion(user, course);
}

export async function saveVideoPosition(userId: string, lesson: Pick<LessonMeta, "id" | "courseId">, seconds: number) {
  const pos = Math.max(0, Math.min(Math.round(seconds), 60 * 60 * 12));
  await upsertProgress(userId, lesson, { videoPosition: pos });
}

/* ── Kurs progressi va yakunlash ─────────────────────────── */

export interface CourseProgress {
  enrolled: boolean;
  completedLessons: number;
  totalLessons: number;
  plannedLessons: number;
  percent: number;
  completedIds: Set<string>;
  passedQuizIds: Set<string>;
  finalQuizId: string | null;
  finalPassed: boolean;
  isComplete: boolean;
  nextLesson: LessonMeta | null;
  lastLessonId: string | null;
  certificate: Certificate | null;
}

export async function getCourseProgress(userId: string, course: Course): Promise<CourseProgress> {
  const [curriculum, progress, attempts, enrollment, certificate] = await Promise.all([
    getCurriculum(course.id),
    getProgressRows(userId, course.id),
    store().select("quiz_attempts", { where: { userId, courseId: course.id, passed: true } }),
    getEnrollment(userId, course.id),
    store().first("certificates", { userId, courseId: course.id, revoked: false }),
  ]);
  const published = curriculum.publishedLessons;
  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId));
  const completedLessons = published.filter((l) => completedIds.has(l.id)).length;
  const planned = curriculum.lessons.filter((l) => l.status === "planned").length;
  const passedQuizIds = new Set(attempts.map((a) => a.quizId));
  const finalQuizId = curriculum.finalQuiz?.id ?? null;
  const finalPassed = finalQuizId ? passedQuizIds.has(finalQuizId) : true;
  const allLessonsDone = published.length > 0 && completedLessons === published.length;
  const lastLessonId = enrollment?.lastLessonId ?? null;

  let nextLesson = published.find((l) => !completedIds.has(l.id)) ?? null;
  if (lastLessonId && !completedIds.has(lastLessonId)) {
    nextLesson = published.find((l) => l.id === lastLessonId) ?? nextLesson;
  }

  return {
    enrolled: Boolean(enrollment),
    completedLessons,
    totalLessons: published.length,
    plannedLessons: planned,
    percent: published.length ? Math.round((completedLessons / published.length) * 100) : 0,
    completedIds,
    passedQuizIds,
    finalQuizId,
    finalPassed,
    // Rejalashtirilgan darslari bor kurs to‘liq yakunlangan hisoblanmaydi
    isComplete: allLessonsDone && finalPassed && planned === 0,
    nextLesson,
    lastLessonId,
    certificate,
  };
}

function certificateCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(10);
  let s = "";
  for (let i = 0; i < 10; i++) s += alphabet[bytes[i] % alphabet.length];
  return `DCH-${s.slice(0, 5)}-${s.slice(5)}`;
}

/** Kurs yakunlangan bo‘lsa — sertifikat beriladi. Yangi sertifikat qaytariladi. */
export async function checkCourseCompletion(user: User, course: Course): Promise<Certificate | null> {
  const progress = await getCourseProgress(user.id, course);
  if (!progress.isComplete || course.status !== "published") return null;
  const enrollment = await getEnrollment(user.id, course.id);
  if (enrollment && !enrollment.completedAt) {
    await store().update("enrollments", enrollment.id, { completedAt: nowIso() });
    await logActivity(user.id, "course_completed", course.id, null, course.title);
  }
  if (progress.certificate) return null;
  const anyCert = await store().first("certificates", { userId: user.id, courseId: course.id });
  if (anyCert) return null; // bekor qilingan sertifikat avtomatik tiklanmaydi
  const cert: Certificate = {
    id: randomUUID(),
    code: certificateCode(),
    userId: user.id,
    courseId: course.id,
    userName: user.name,
    courseTitle: course.title,
    issuedAt: nowIso(),
    revoked: false,
  };
  await store().insert("certificates", cert);
  await logActivity(user.id, "certificate_issued", course.id, cert.id, course.title);
  return cert;
}

/* ── Testlar ─────────────────────────────────────────────── */

export async function submitQuiz(user: User, course: Course, quiz: Quiz, answers: number[]) {
  const correct = quiz.questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
  const score = quiz.questions.length ? Math.round((correct / quiz.questions.length) * 100) : 0;
  const passed = score >= quiz.passingScore;
  await enroll(user.id, course);
  const previouslyPassed = await store().first("quiz_attempts", { userId: user.id, quizId: quiz.id, passed: true });
  await store().insert("quiz_attempts", {
    id: randomUUID(),
    userId: user.id,
    quizId: quiz.id,
    courseId: course.id,
    score,
    passed,
    answers,
    createdAt: nowIso(),
  });
  if (passed && !previouslyPassed) await logActivity(user.id, "quiz_passed", course.id, quiz.id, quiz.title);
  const certificate = passed ? await checkCourseCompletion(user, course) : null;
  return { score, correct, total: quiz.questions.length, passed, certificate };
}

export async function listQuizAttempts(userId: string, quizId?: string) {
  return store().select("quiz_attempts", {
    where: quizId ? { userId, quizId } : { userId },
    orderBy: [{ field: "createdAt", asc: false }],
  });
}

/* ── Qaydlar, xatcho‘plar, saqlangan kurslar ─────────────── */

export async function getNote(userId: string, lessonId: string) {
  return store().first("notes", { userId, lessonId });
}

export async function saveNote(userId: string, lesson: Pick<LessonMeta, "id" | "courseId">, body: string) {
  const existing = await getNote(userId, lesson.id);
  const text = body.slice(0, 20000);
  if (existing) {
    if (!text.trim()) {
      await store().remove("notes", { id: existing.id });
      return null;
    }
    return store().update("notes", existing.id, { body: text, updatedAt: nowIso() });
  }
  if (!text.trim()) return null;
  return store().insert("notes", { id: randomUUID(), userId, lessonId: lesson.id, courseId: lesson.courseId, body: text, updatedAt: nowIso() });
}

export async function listNotes(userId: string) {
  return store().select("notes", { where: { userId }, orderBy: [{ field: "updatedAt", asc: false }] });
}

export async function isBookmarked(userId: string, lessonId: string) {
  return Boolean(await store().first("bookmarks", { userId, lessonId }));
}

export async function toggleBookmark(userId: string, lesson: Pick<LessonMeta, "id" | "courseId">): Promise<boolean> {
  const existing = await store().first("bookmarks", { userId, lessonId: lesson.id });
  if (existing) {
    await store().remove("bookmarks", { id: existing.id });
    return false;
  }
  await store().insert("bookmarks", { id: randomUUID(), userId, lessonId: lesson.id, courseId: lesson.courseId, createdAt: nowIso() });
  return true;
}

export async function listBookmarks(userId: string) {
  return store().select("bookmarks", { where: { userId }, orderBy: [{ field: "createdAt", asc: false }] });
}

export async function isCourseSaved(userId: string, courseId: string) {
  return Boolean(await store().first("saved_courses", { userId, courseId }));
}

export async function toggleSavedCourse(userId: string, courseId: string): Promise<boolean> {
  const existing = await store().first("saved_courses", { userId, courseId });
  if (existing) {
    await store().remove("saved_courses", { id: existing.id });
    return false;
  }
  await store().insert("saved_courses", { id: randomUUID(), userId, courseId, createdAt: nowIso() });
  return true;
}

export async function listSavedCourses(userId: string) {
  return store().select("saved_courses", { where: { userId }, orderBy: [{ field: "createdAt", asc: false }] });
}

/* ── Savol-javoblar ──────────────────────────────────────── */

export async function listQuestions(lessonId: string) {
  const questions = await store().select("questions", { where: { lessonId }, orderBy: [{ field: "createdAt", asc: false }] });
  if (!questions.length) return [];
  const replies = await store().select("question_replies", {
    where: { questionId: { in: questions.map((q) => q.id) } },
    orderBy: [{ field: "createdAt", asc: true }],
  });
  return questions.map((q) => ({ ...q, replies: replies.filter((r) => r.questionId === q.id) }));
}

export async function askQuestion(user: User, lesson: Pick<LessonMeta, "id" | "courseId">, body: string) {
  return store().insert("questions", {
    id: randomUUID(),
    lessonId: lesson.id,
    courseId: lesson.courseId,
    userId: user.id,
    authorName: user.name,
    body: body.trim().slice(0, 4000),
    createdAt: nowIso(),
  });
}

export async function replyQuestion(user: User, questionId: string, body: string) {
  const q = await store().getById("questions", questionId);
  if (!q) return null;
  return store().insert("question_replies", {
    id: randomUUID(),
    questionId,
    userId: user.id,
    authorName: user.name,
    isStaff: user.role === "admin",
    body: body.trim().slice(0, 4000),
    createdAt: nowIso(),
  });
}

export async function deleteQuestion(user: User, questionId: string) {
  const q = await store().getById("questions", questionId);
  if (!q || (q.userId !== user.id && user.role !== "admin")) return false;
  await store().remove("question_replies", { questionId });
  await store().remove("questions", { id: questionId });
  return true;
}

/* ── Sertifikatlar ───────────────────────────────────────── */

export async function listUserCertificates(userId: string) {
  return store().select("certificates", { where: { userId, revoked: false }, orderBy: [{ field: "issuedAt", asc: false }] });
}

export async function getCertificateByCode(code: string) {
  return store().first("certificates", { code: code.toUpperCase() });
}

/* ── Faollik, seriya, yutuqlar ───────────────────────────── */

export async function listActivities(userId: string, limit = 50): Promise<Activity[]> {
  return store().select("activities", { where: { userId }, orderBy: [{ field: "createdAt", asc: false }], limit });
}

const LEARNING_TYPES: ActivityType[] = ["lesson_completed", "quiz_passed"];

export function computeStreak(activities: Activity[]): { current: number; best: number; activeToday: boolean } {
  const days = new Set(activities.filter((a) => LEARNING_TYPES.includes(a.type)).map((a) => dayKey(a.createdAt)));
  const today = dayKey(new Date());
  const shift = (key: string, delta: number) => {
    const d = new Date(`${key}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + delta);
    return d.toISOString().slice(0, 10);
  };
  let current = 0;
  let cursor = days.has(today) ? today : shift(today, -1);
  while (days.has(cursor)) {
    current++;
    cursor = shift(cursor, -1);
  }
  let best = 0;
  for (const d of days) {
    if (days.has(shift(d, -1))) continue;
    let len = 0;
    let c = d;
    while (days.has(c)) {
      len++;
      c = shift(c, 1);
    }
    best = Math.max(best, len);
  }
  return { current, best, activeToday: days.has(today) };
}

/** Oxirgi N kun bo‘yicha faollik (darslar + testlar) */
export function activityByDay(activities: Activity[], days: number): { key: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const a of activities) {
    if (!LEARNING_TYPES.includes(a.type)) continue;
    const k = dayKey(a.createdAt);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const out: { key: string; count: number }[] = [];
  const today = new Date(`${dayKey(new Date())}T00:00:00Z`);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const k = d.toISOString().slice(0, 10);
    out.push({ key: k, count: counts.get(k) ?? 0 });
  }
  return out;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number;
  target: number;
}

export function computeAchievements(input: {
  lessonsCompleted: number;
  quizzesPassed: number;
  perfectQuizzes: number;
  bestStreak: number;
  certificates: number;
  categoriesTouched: number;
  notes: number;
}): Achievement[] {
  const a = (id: string, title: string, description: string, icon: string, progress: number, target: number): Achievement => ({
    id, title, description, icon, progress: Math.min(progress, target), target, earned: progress >= target,
  });
  return [
    a("first-step", "Birinchi qadam", "Birinchi darsni yakunlang", "Footprints", input.lessonsCompleted, 1),
    a("ten-lessons", "Barqaror o‘quvchi", "10 ta darsni yakunlang", "BookOpenCheck", input.lessonsCompleted, 10),
    a("fifty-lessons", "Bilim ishqibozi", "50 ta darsni yakunlang", "Library", input.lessonsCompleted, 50),
    a("first-quiz", "Sinovdan o‘tdi", "Birinchi testdan muvaffaqiyatli o‘ting", "BadgeCheck", input.quizzesPassed, 1),
    a("perfect", "A’lochi", "Testni 100% natija bilan topshiring", "Trophy", input.perfectQuizzes, 1),
    a("streak-3", "Uch kunlik seriya", "3 kun ketma-ket o‘qing", "Flame", input.bestStreak, 3),
    a("streak-7", "Bir haftalik intizom", "7 kun ketma-ket o‘qing", "CalendarCheck", input.bestStreak, 7),
    a("certificate", "Birinchi sertifikat", "Kursni to‘liq yakunlang", "Award", input.certificates, 1),
    a("polymath", "Ko‘p qirrali", "3 xil yo‘nalishda o‘qing", "Shapes", input.categoriesTouched, 3),
    a("notes", "Konspekt ustasi", "5 ta darsga qayd yozing", "NotebookPen", input.notes, 5),
  ];
}

/* ── Tavsiyalar ──────────────────────────────────────────── */

export async function recommendCourses(user: User | null, limit = 4): Promise<Course[]> {
  const [courses, categories, stats] = await Promise.all([listCourses(), listCategories(), getCourseStatsMap()]);
  const enrolledIds = new Set(user ? (await listEnrollments(user.id)).map((e) => e.courseId) : []);
  const interestCats = new Set(
    categories.filter((c) => user?.interests.includes(c.slug)).map((c) => c.id),
  );
  const targetLevel = user?.level ?? 1;
  const scored = courses
    .filter((c) => !enrolledIds.has(c.id))
    .map((c) => {
      let score = 0;
      if (interestCats.has(c.categoryId)) score += 10;
      score -= Math.abs(c.level - targetLevel) * 3;
      if (c.status === "published") score += 4;
      if (c.featured) score += 2;
      score += Math.min((stats.get(c.id)?.enrollments ?? 0) / 10, 3);
      return { c, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.c);
}

export async function recommendPaths(user: User | null) {
  const paths = await listPaths();
  if (!user?.interests.length) return paths.slice(0, 3);
  const courses = await listCourses();
  const categories = await listCategories();
  const catSlugById = new Map(categories.map((c) => [c.id, c.slug]));
  const courseCat = new Map(courses.map((c) => [c.slug, catSlugById.get(c.categoryId)]));
  return paths
    .map((p) => ({
      p,
      score: p.steps.filter((s) => user.interests.includes(courseCat.get(s.courseSlug) ?? "")).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.p);
}
