import "server-only";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { isSupabaseEnabled } from "@/lib/server/env";
import { store } from "@/lib/server/store";
import { dataDir } from "@/lib/server/store/local";
import { serviceClient } from "@/lib/server/store/supabase";
import { emptyContent, DEFAULT_INSTRUCTOR } from "@/lib/seed/build";
import type { Category, Course, Lesson, MediaAsset, Module, Quiz, Role, User } from "@/lib/types";
import { dayKey, slugify } from "@/lib/text";
import { getCourseProgress, listActivities } from "./learning";

const nowIso = () => new Date().toISOString();

/* ── Umumiy ko‘rinish ─────────────────────────────────────── */

export async function getAdminOverview() {
  const [profiles, enrollments, certificates, lessons, courses, questions, replies, activities] = await Promise.all([
    store().select("profiles", { orderBy: [{ field: "createdAt", asc: false }] }),
    store().select("enrollments", { columns: ["id", "courseId", "completedAt", "userId"] }),
    store().select("certificates", { columns: ["id", "revoked"] }),
    store().select("lessons", { columns: ["id", "status", "courseId"] }),
    store().select("courses", { columns: ["id", "title", "slug", "status"] }),
    store().select("questions", { orderBy: [{ field: "createdAt", asc: false }] }),
    store().select("question_replies", { columns: ["id", "questionId", "isStaff"] }),
    store().select("activities", { orderBy: [{ field: "createdAt", asc: false }], limit: 2000 }),
  ]);
  const answered = new Set(replies.filter((r) => r.isStaff).map((r) => r.questionId));
  const byCourse = new Map<string, number>();
  for (const e of enrollments) byCourse.set(e.courseId, (byCourse.get(e.courseId) ?? 0) + 1);
  const topCourses = courses
    .map((c) => ({ ...c, enrollments: byCourse.get(c.id) ?? 0 }))
    .sort((a, b) => b.enrollments - a.enrollments)
    .slice(0, 5);

  const days: { key: string; count: number }[] = [];
  const today = new Date(`${dayKey(new Date())}T00:00:00Z`);
  const counts = new Map<string, number>();
  for (const a of activities) if (a.type === "lesson_completed") counts.set(dayKey(a.createdAt), (counts.get(dayKey(a.createdAt)) ?? 0) + 1);
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const k = d.toISOString().slice(0, 10);
    days.push({ key: k, count: counts.get(k) ?? 0 });
  }
  const profileById = new Map(profiles.map((p) => [p.id, p]));

  return {
    users: profiles.length,
    students: profiles.filter((p) => p.role === "student").length,
    admins: profiles.filter((p) => p.role === "admin").length,
    newThisWeek: profiles.filter((p) => Date.now() - new Date(p.createdAt).getTime() < 7 * 86400_000).length,
    enrollments: enrollments.length,
    completions: enrollments.filter((e) => e.completedAt).length,
    certificates: certificates.filter((c) => !c.revoked).length,
    lessons: {
      published: lessons.filter((l) => l.status === "published").length,
      planned: lessons.filter((l) => l.status === "planned").length,
      draft: lessons.filter((l) => l.status === "draft").length,
    },
    courses: { total: courses.length, published: courses.filter((c) => c.status === "published").length, preparing: courses.filter((c) => c.status === "preparing").length },
    unanswered: questions.filter((q) => !answered.has(q.id)),
    recentUsers: profiles.slice(0, 6),
    recentActivity: activities.slice(0, 10).map((a) => ({ ...a, userName: profileById.get(a.userId)?.name ?? "—" })),
    topCourses,
    days,
  };
}

/* ── Kurslar ──────────────────────────────────────────────── */

export type CourseInput = Omit<Course, "id" | "createdAt" | "updatedAt" | "order" | "coverUrl" | "finalProject" | "instructor"> & {
  coverUrl: string | null;
  finalProject: Course["finalProject"];
  instructor: Course["instructor"];
};

async function uniqueSlug(table: "courses" | "categories", base: string, ignoreId?: string): Promise<string> {
  let slug = slugify(base) || "nomsiz";
  let n = 1;
  for (;;) {
    const existing = await store().first(table, { slug });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${slugify(base)}-${++n}`;
  }
}

export async function createCourse(input: Partial<CourseInput> & { title: string; categoryId: string }): Promise<Course> {
  const all = await store().select("courses", { columns: ["id", "order"] });
  const slug = await uniqueSlug("courses", input.slug || input.title);
  const course: Course = {
    id: `crs_${slug}`,
    slug,
    title: input.title,
    subtitle: input.subtitle ?? "",
    description: input.description ?? "",
    categoryId: input.categoryId,
    level: input.level ?? 1,
    status: "draft",
    featured: false,
    order: all.reduce((m, c) => Math.max(m, c.order), 0) + 1,
    coverUrl: null,
    accent: input.accent ?? "azure",
    icon: input.icon ?? "GraduationCap",
    instructor: input.instructor ?? DEFAULT_INSTRUCTOR,
    objectives: input.objectives ?? [],
    skills: input.skills ?? [],
    requirements: input.requirements ?? [],
    audience: input.audience ?? [],
    software: input.software ?? [],
    tags: input.tags ?? [],
    estimatedHours: input.estimatedHours ?? 1,
    finalProject: input.finalProject ?? null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  return store().insert("courses", course);
}

export async function updateCourse(id: string, patch: Partial<CourseInput>) {
  const course = await store().getById("courses", id);
  if (!course) throw new Error("Kurs topilmadi");
  const next: Partial<Course> = { ...patch, updatedAt: nowIso() };
  if (patch.slug && patch.slug !== course.slug) next.slug = await uniqueSlug("courses", patch.slug, id);
  return store().update("courses", id, next);
}

export async function deleteCourse(id: string) {
  // Bog‘liq yozuvlar (sertifikatlar bundan mustasno — ular kurs nomini saqlaydi)
  const questions = await store().select("questions", { where: { courseId: id }, columns: ["id"] });
  if (questions.length) await store().remove("question_replies", { questionId: { in: questions.map((q) => q.id) } });
  for (const t of ["questions", "notes", "bookmarks", "saved_courses", "quiz_attempts", "lesson_progress", "enrollments", "activities", "quizzes", "lessons"] as const) {
    await store().remove(t, { courseId: id } as never);
  }
  await store().remove("modules", { courseId: id });
  await store().remove("courses", { id });
}

/* ── Modullar ─────────────────────────────────────────────── */

async function renumberModules(courseId: string) {
  const mods = await store().select("modules", { where: { courseId }, orderBy: [{ field: "order" }] });
  await Promise.all(mods.map((m, i) => (m.order !== i ? store().update("modules", m.id, { order: i }) : null)));
  await renumberLessons(courseId);
}

async function renumberLessons(courseId: string) {
  const mods = await store().select("modules", { where: { courseId }, orderBy: [{ field: "order" }] });
  const lessons = await store().select("lessons", { where: { courseId }, columns: ["id", "moduleId", "order"], orderBy: [{ field: "order" }] });
  let n = 0;
  for (const m of mods) {
    for (const l of lessons.filter((x) => x.moduleId === m.id)) {
      if (l.order !== n) await store().update("lessons", l.id, { order: n });
      n++;
    }
  }
}

export async function createModule(courseId: string, title: string, description = ""): Promise<Module> {
  const mods = await store().select("modules", { where: { courseId } });
  return store().insert("modules", { id: `mod_${randomUUID().slice(0, 12)}`, courseId, title, description, order: mods.length });
}

export async function updateModule(id: string, patch: Partial<Pick<Module, "title" | "description">>) {
  return store().update("modules", id, patch);
}

export async function deleteModule(id: string) {
  const mod = await store().getById("modules", id);
  if (!mod) return;
  const lessons = await store().select("lessons", { where: { moduleId: id }, columns: ["id"] });
  for (const l of lessons) await deleteLesson(l.id, false);
  await store().remove("quizzes", { moduleId: id });
  await store().remove("modules", { id });
  await renumberModules(mod.courseId);
}

export async function moveModule(id: string, dir: -1 | 1) {
  const mod = await store().getById("modules", id);
  if (!mod) return;
  const mods = await store().select("modules", { where: { courseId: mod.courseId }, orderBy: [{ field: "order" }] });
  const i = mods.findIndex((m) => m.id === id);
  const j = i + dir;
  if (j < 0 || j >= mods.length) return;
  await store().update("modules", mods[i].id, { order: j });
  await store().update("modules", mods[j].id, { order: i });
  await renumberModules(mod.courseId);
}

/* ── Darslar ──────────────────────────────────────────────── */

export async function createLesson(moduleId: string, title: string): Promise<Lesson> {
  const mod = await store().getById("modules", moduleId);
  if (!mod) throw new Error("Modul topilmadi");
  let slug = slugify(title) || "dars";
  const base = slug;
  let n = 1;
  while (await store().first("lessons", { courseId: mod.courseId, slug })) slug = `${base}-${++n}`;
  const lessons = await store().select("lessons", { where: { courseId: mod.courseId }, columns: ["id", "order"] });
  const lesson: Lesson = {
    id: `les_${randomUUID().slice(0, 12)}`,
    courseId: mod.courseId,
    moduleId,
    slug,
    title,
    summary: "",
    durationMin: 10,
    order: lessons.length + 1000,
    status: "draft",
    isPreview: false,
    video: null,
    content: emptyContent(),
    resources: [],
    interactive: [],
    updatedAt: nowIso(),
  };
  await store().insert("lessons", lesson);
  await renumberLessons(mod.courseId);
  return lesson;
}

export async function updateLesson(id: string, patch: Partial<Omit<Lesson, "id" | "courseId">>) {
  const lesson = await store().getById("lessons", id);
  if (!lesson) throw new Error("Dars topilmadi");
  const next: Partial<Lesson> = { ...patch, updatedAt: nowIso() };
  if (patch.slug && patch.slug !== lesson.slug) {
    const slug = slugify(patch.slug) || lesson.slug;
    const clash = await store().first("lessons", { courseId: lesson.courseId, slug });
    if (clash && clash.id !== id) throw new Error("Bu kursda shunday manzilli dars allaqachon bor");
    next.slug = slug;
  }
  const updated = await store().update("lessons", id, next);
  if (patch.moduleId && patch.moduleId !== lesson.moduleId) await renumberLessons(lesson.courseId);
  return updated;
}

export async function deleteLesson(id: string, renumber = true) {
  const lesson = await store().getById("lessons", id);
  if (!lesson) return;
  const questions = await store().select("questions", { where: { lessonId: id }, columns: ["id"] });
  if (questions.length) await store().remove("question_replies", { questionId: { in: questions.map((q) => q.id) } });
  for (const t of ["questions", "notes", "bookmarks", "lesson_progress"] as const) await store().remove(t, { lessonId: id } as never);
  await store().remove("lessons", { id });
  if (renumber) await renumberLessons(lesson.courseId);
}

export async function moveLesson(id: string, dir: -1 | 1) {
  const lesson = await store().getById("lessons", id);
  if (!lesson) return;
  const siblings = await store().select("lessons", { where: { moduleId: lesson.moduleId }, columns: ["id", "order"], orderBy: [{ field: "order" }] });
  const i = siblings.findIndex((l) => l.id === id);
  const j = i + dir;
  if (j < 0 || j >= siblings.length) return;
  await store().update("lessons", siblings[i].id, { order: siblings[j].order });
  await store().update("lessons", siblings[j].id, { order: siblings[i].order });
  await renumberLessons(lesson.courseId);
}

/* ── Testlar ──────────────────────────────────────────────── */

export async function saveQuiz(input: Omit<Quiz, "id"> & { id?: string }): Promise<Quiz> {
  const id = input.id || `quiz_${randomUUID().slice(0, 12)}`;
  const quiz: Quiz = { ...input, id, questions: input.questions.map((q, i) => ({ ...q, id: q.id || `${id}_q${i + 1}_${randomUUID().slice(0, 4)}` })) };
  return store().upsert("quizzes", quiz);
}

export async function deleteQuiz(id: string) {
  await store().remove("quiz_attempts", { quizId: id });
  await store().remove("quizzes", { id });
}

/* ── Yo‘nalishlar ─────────────────────────────────────────── */

export async function saveCategory(input: Omit<Category, "id" | "order" | "slug"> & { id?: string; slug?: string }) {
  if (input.id) {
    const existing = await store().getById("categories", input.id);
    if (!existing) throw new Error("Yo‘nalish topilmadi");
    const slug = input.slug ? await uniqueSlug("categories", input.slug, input.id) : existing.slug;
    return store().update("categories", input.id, { ...input, slug });
  }
  const slug = await uniqueSlug("categories", input.slug || input.title);
  const count = await store().count("categories");
  return store().insert("categories", { ...input, id: `cat_${slug}`, slug, order: count });
}

export async function deleteCategory(id: string) {
  const used = await store().count("courses", { categoryId: id });
  if (used) throw new Error(`Bu yo‘nalishda ${used} ta kurs bor. Avval kurslarni boshqa yo‘nalishga o‘tkazing.`);
  await store().remove("categories", { id });
}

/* ── Talabalar ────────────────────────────────────────────── */

export async function listStudents(query = "") {
  const [profiles, enrollments, activities] = await Promise.all([
    store().select("profiles", { orderBy: [{ field: "createdAt", asc: false }] }),
    store().select("enrollments", { columns: ["id", "userId", "completedAt", "lastAccessAt"] }),
    store().select("activities", { columns: ["id", "userId", "type", "createdAt"] }),
  ]);
  const q = query.trim().toLowerCase();
  return profiles
    .filter((p) => !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q))
    .map((p) => {
      const en = enrollments.filter((e) => e.userId === p.id);
      const acts = activities.filter((a) => a.userId === p.id);
      const last = [...en.map((e) => e.lastAccessAt), ...acts.map((a) => a.createdAt)].sort().at(-1) ?? null;
      return {
        ...p,
        enrollments: en.length,
        completedCourses: en.filter((e) => e.completedAt).length,
        lessonsCompleted: acts.filter((a) => a.type === "lesson_completed").length,
        lastActive: last,
      };
    });
}

export async function getStudentDetail(id: string) {
  const user = await store().getById("profiles", id);
  if (!user) return null;
  const [enrollments, certificates, attempts, activities, courses] = await Promise.all([
    store().select("enrollments", { where: { userId: id } }),
    store().select("certificates", { where: { userId: id } }),
    store().select("quiz_attempts", { where: { userId: id }, orderBy: [{ field: "createdAt", asc: false }] }),
    listActivities(id, 30),
    store().select("courses"),
  ]);
  const progress = [];
  for (const e of enrollments) {
    const c = courses.find((x) => x.id === e.courseId);
    if (c) progress.push({ course: c, enrollment: e, progress: await getCourseProgress(id, c) });
  }
  const quizzes = await store().select("quizzes", { columns: ["id", "title"] });
  return { user, progress, certificates, attempts: attempts.map((a) => ({ ...a, quizTitle: quizzes.find((q) => q.id === a.quizId)?.title ?? a.quizId })), activities };
}

export async function setUserRole(id: string, role: Role): Promise<User | null> {
  return store().update("profiles", id, { role });
}

/* ── Sertifikatlar ────────────────────────────────────────── */

export async function listAllCertificates() {
  return store().select("certificates", { orderBy: [{ field: "issuedAt", asc: false }] });
}

export async function setCertificateRevoked(id: string, revoked: boolean) {
  return store().update("certificates", id, { revoked });
}

/* ── Media ────────────────────────────────────────────────── */

const ALLOWED_MIME = /^(image\/(png|jpe?g|webp|gif|svg\+xml|avif)|video\/(mp4|webm|quicktime)|audio\/(mpeg|wav|ogg|mp4)|application\/(pdf|zip|x-zip-compressed|json)|text\/(plain|csv|markdown)|model\/gltf-binary|application\/octet-stream)$/;
export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;

export function uploadsDir() {
  return path.join(dataDir(), "uploads");
}

export async function saveUpload(file: File, uploadedBy: string): Promise<MediaAsset> {
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Fayl hajmi 200 MB dan oshmasligi kerak");
  const mime = file.type || "application/octet-stream";
  if (!ALLOWED_MIME.test(mime)) throw new Error(`Bu turdagi fayl qabul qilinmaydi (${mime})`);
  const id = randomUUID();
  const ext = path.extname(file.name).toLowerCase().replace(/[^.a-z0-9]/g, "").slice(0, 8);
  const safeName = `${id}${ext}`;
  let url: string;
  if (isSupabaseEnabled()) {
    const { error } = await serviceClient().storage.from("media").upload(safeName, file, { contentType: mime, upsert: false });
    if (error) throw new Error(`Yuklashda xato: ${error.message}`);
    url = serviceClient().storage.from("media").getPublicUrl(safeName).data.publicUrl;
  } else {
    await fs.mkdir(uploadsDir(), { recursive: true });
    await fs.writeFile(path.join(uploadsDir(), safeName), Buffer.from(await file.arrayBuffer()));
    url = `/api/media/${safeName}`;
  }
  return store().insert("media", {
    id,
    name: file.name.slice(0, 200),
    url,
    mime,
    size: file.size,
    uploadedBy,
    createdAt: nowIso(),
  });
}

export async function listMedia() {
  return store().select("media", { orderBy: [{ field: "createdAt", asc: false }] });
}

export async function deleteMedia(id: string) {
  const m = await store().getById("media", id);
  if (!m) return;
  const file = m.url.split("/").pop()!;
  if (isSupabaseEnabled()) await serviceClient().storage.from("media").remove([file]);
  else await fs.rm(path.join(uploadsDir(), path.basename(file)), { force: true });
  await store().remove("media", { id });
}
