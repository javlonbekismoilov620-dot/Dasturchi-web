"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentUser } from "@/lib/server/auth";
import {
  createCourse,
  createLesson,
  createModule,
  deleteCategory,
  deleteCourse,
  deleteLesson,
  deleteMedia,
  deleteModule,
  deleteQuiz,
  moveLesson,
  moveModule,
  saveCategory,
  saveQuiz,
  saveUpload,
  setCertificateRevoked,
  setUserRole,
  updateCourse,
  updateLesson,
  updateModule,
} from "@/lib/server/services/admin";
import { store } from "@/lib/server/store";
import { normalizeDeep } from "@/lib/text";
import type { MediaAsset } from "@/lib/types";

type Result<T = unknown> = { ok: true; data?: T } | { ok: false; error: string };

async function admin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("Ruxsat yo‘q");
  return user;
}

function fail(e: unknown): { ok: false; error: string } {
  if (e instanceof z.ZodError) return { ok: false, error: e.issues.map((i) => `${i.path.join(".") || "maydon"}: ${i.message}`).slice(0, 3).join("; ") };
  return { ok: false, error: e instanceof Error ? e.message : "Noma’lum xato" };
}

function refreshAll() {
  revalidatePath("/", "layout");
}

const colorKey = z.enum(["azure", "teal", "gold", "coral", "violet", "rose", "lime"]);
const str = (max: number) => z.string().trim().max(max);
const strList = (max = 40, itemMax = 300) => z.array(str(itemMax).min(1)).max(max);
const safeUrl = z
  .string()
  .trim()
  .max(2000)
  .refine((u) => u === "" || u.startsWith("/") || /^https:\/\//.test(u), "Faqat https:// yoki ichki (/...) manzil");

/* ── Kurslar ──────────────────────────────────────────────── */

const courseSchema = z.object({
  title: str(160).min(3, "Sarlavha kamida 3 belgi"),
  slug: str(80).regex(/^[a-z0-9-]*$/, "Faqat kichik lotin harflari, raqam va chiziqcha").optional(),
  subtitle: str(240),
  description: str(8000),
  categoryId: str(100).min(1, "Yo‘nalishni tanlang"),
  level: z.coerce.number().int().min(1).max(5),
  status: z.enum(["published", "preparing", "draft"]),
  featured: z.boolean(),
  accent: colorKey,
  icon: str(40),
  coverUrl: safeUrl.nullable(),
  objectives: strList(),
  skills: strList(),
  requirements: strList(),
  audience: strList(),
  software: strList(),
  tags: strList(),
  estimatedHours: z.coerce.number().min(0).max(1000),
  instructor: z.object({ name: str(120).min(1), role: str(160), bio: str(2000), avatarUrl: safeUrl.nullable().optional() }),
  finalProject: z.object({ title: str(200).min(1), description: str(3000), deliverables: strList() }).nullable(),
});

export async function createCourseAction(input: { title: string; categoryId: string; level: number }): Promise<Result> {
  let id: string;
  try {
    await admin();
    const data = z.object({ title: str(160).min(3, "Sarlavha kamida 3 belgi"), categoryId: str(100).min(1, "Yo‘nalishni tanlang"), level: z.number().int().min(1).max(5) }).parse(input);
    const course = await createCourse({ ...data, level: data.level as 1 });
    id = course.id;
    refreshAll();
  } catch (e) {
    return fail(e);
  }
  redirect(`/admin/kurslar/${id}`);
}

export async function updateCourseAction(id: string, input: unknown): Promise<Result> {
  try {
    await admin();
    const data = normalizeDeep(courseSchema.parse(input));
    await updateCourse(id, { ...data, level: data.level as 1, coverUrl: data.coverUrl || null, instructor: { ...data.instructor, avatarUrl: data.instructor.avatarUrl || null } });
    refreshAll();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function quickCourseAction(id: string, patch: { featured?: boolean; status?: "published" | "preparing" | "draft" }): Promise<Result> {
  try {
    await admin();
    const data = z.object({ featured: z.boolean().optional(), status: z.enum(["published", "preparing", "draft"]).optional() }).parse(patch);
    await updateCourse(id, data);
    refreshAll();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteCourseAction(id: string): Promise<Result> {
  try {
    await admin();
    await deleteCourse(id);
    refreshAll();
  } catch (e) {
    return fail(e);
  }
  redirect("/admin/kurslar");
}

/* ── Modullar ─────────────────────────────────────────────── */

export async function createModuleAction(courseId: string, title: string): Promise<Result> {
  try {
    await admin();
    await createModule(courseId, normalizeDeep(str(200).min(2, "Modul nomi kamida 2 belgi").parse(title)));
    refreshAll();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function updateModuleAction(id: string, input: { title: string; description: string }): Promise<Result> {
  try {
    await admin();
    const data = normalizeDeep(z.object({ title: str(200).min(2), description: str(1000) }).parse(input));
    await updateModule(id, data);
    refreshAll();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteModuleAction(id: string): Promise<Result> {
  try {
    await admin();
    await deleteModule(id);
    refreshAll();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function moveModuleAction(id: string, dir: -1 | 1): Promise<Result> {
  try {
    await admin();
    await moveModule(id, dir === -1 ? -1 : 1);
    refreshAll();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ── Darslar ──────────────────────────────────────────────── */

export async function createLessonAction(moduleId: string, title: string): Promise<Result<{ id: string }>> {
  try {
    await admin();
    const lesson = await createLesson(moduleId, normalizeDeep(str(200).min(2, "Dars nomi kamida 2 belgi").parse(title)));
    refreshAll();
    return { ok: true, data: { id: lesson.id } };
  } catch (e) {
    return fail(e);
  }
}

const codeSchema = z.object({
  language: z.enum(["html", "css", "javascript", "typescript", "python", "bash", "json", "sql", "text"]),
  code: z.string().max(20000),
  runnable: z.boolean().optional(),
  filename: str(120).optional(),
});
const optionalCode = codeSchema.optional().nullable().transform((v) => (v && v.code.trim() ? v : undefined));

const lessonSchema = z.object({
  title: str(200).min(2),
  slug: str(80).regex(/^[a-z0-9-]+$/, "Manzil: faqat kichik lotin harflari, raqam va chiziqcha"),
  summary: str(400),
  durationMin: z.coerce.number().int().min(1).max(600),
  status: z.enum(["published", "planned", "draft"]),
  isPreview: z.boolean(),
  moduleId: str(100),
  video: z
    .object({ url: safeUrl.refine((u) => u.length > 0, "Video manzili bo‘sh"), provider: z.enum(["file", "youtube", "vimeo"]), poster: safeUrl.nullable().optional() })
    .nullable(),
  resources: z.array(z.object({ id: str(100), title: str(200).min(1), type: z.enum(["file", "link"]), url: safeUrl.refine((u) => u.length > 0), size: z.number().nullable().optional() })).max(30),
  interactive: z
    .array(
      z.object({
        type: z.enum(["code-playground", "mesh-viewer", "lighting-lab", "timeline", "color-grading", "typography", "contrast", "box-model"]),
        title: str(200).optional(),
        description: str(400).optional(),
        config: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .max(10),
  content: z.object({
    intro: str(3000),
    concept: str(10000),
    why: str(6000),
    how: str(10000),
    steps: z.array(z.object({ title: str(300).min(1), body: str(6000), code: optionalCode })).max(30),
    examples: z.array(z.object({ title: str(300).min(1), body: str(6000), code: optionalCode })).max(20),
    mistakes: z.array(z.object({ title: str(500).min(1), fix: str(3000) })).max(20),
    tips: strList(20, 1000),
    exercise: z.object({ title: str(300), brief: str(4000), tasks: strList(30, 1000), hint: str(2000).optional(), starter: optionalCode }),
    summary: strList(20, 1000),
    keyTerms: z.array(z.object({ term: str(120).min(1), definition: str(1000) })).max(30),
  }),
});

export async function updateLessonAction(id: string, input: unknown): Promise<Result> {
  try {
    await admin();
    const parsed = lessonSchema.parse(input);
    if (parsed.status === "published" && !parsed.content.concept.trim()) {
      throw new Error("E’lon qilish uchun kamida “Tushuncha nima?” bo‘limini to‘ldiring.");
    }
    const data = normalizeDeep(parsed);
    await updateLesson(id, data);
    refreshAll();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteLessonAction(id: string, courseId: string): Promise<Result> {
  try {
    await admin();
    await deleteLesson(id);
    refreshAll();
  } catch (e) {
    return fail(e);
  }
  redirect(`/admin/kurslar/${courseId}?tab=dastur`);
}

export async function moveLessonAction(id: string, dir: -1 | 1): Promise<Result> {
  try {
    await admin();
    await moveLesson(id, dir === -1 ? -1 : 1);
    refreshAll();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ── Testlar ──────────────────────────────────────────────── */

const quizSchema = z
  .object({
    id: str(100).optional(),
    courseId: str(100),
    moduleId: str(100).nullable(),
    title: str(200).min(2),
    description: str(1000),
    passingScore: z.coerce.number().int().min(1).max(100),
    questions: z
      .array(
        z.object({
          id: str(120),
          prompt: str(1000).min(3, "Savol matni bo‘sh"),
          options: z.array(str(500).min(1, "Variant bo‘sh")).min(2).max(6),
          correct: z.number().int().min(0),
          explanation: str(2000),
        }),
      )
      .min(1, "Kamida bitta savol kerak")
      .max(50),
  })
  .refine((q) => q.questions.every((x) => x.correct < x.options.length), "To‘g‘ri javob variantlar orasida bo‘lishi kerak");

export async function saveQuizAction(input: unknown): Promise<Result<{ id: string }>> {
  try {
    await admin();
    const data = normalizeDeep(quizSchema.parse(input));
    const quiz = await saveQuiz(data);
    refreshAll();
    return { ok: true, data: { id: quiz.id } };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteQuizAction(id: string): Promise<Result> {
  try {
    await admin();
    await deleteQuiz(id);
    refreshAll();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ── Yo‘nalishlar ─────────────────────────────────────────── */

export async function saveCategoryAction(input: unknown): Promise<Result> {
  try {
    await admin();
    const data = normalizeDeep(
      z
        .object({
          id: str(100).optional(),
          slug: str(80).regex(/^[a-z0-9-]*$/).optional(),
          title: str(120).min(2),
          description: str(1000),
          icon: str(40),
          color: colorKey,
          topics: strList(40, 80),
        })
        .parse(input),
    );
    await saveCategory(data);
    refreshAll();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteCategoryAction(id: string): Promise<Result> {
  try {
    await admin();
    await deleteCategory(id);
    refreshAll();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ── Talabalar va sertifikatlar ───────────────────────────── */

export async function setRoleAction(userId: string, role: "student" | "admin"): Promise<Result> {
  try {
    const me = await admin();
    if (me.id === userId && role !== "admin") throw new Error("O‘zingizni admin huquqidan mahrum qila olmaysiz");
    await setUserRole(userId, z.enum(["student", "admin"]).parse(role));
    refreshAll();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function setCertificateRevokedAction(id: string, revoked: boolean): Promise<Result> {
  try {
    await admin();
    await setCertificateRevoked(id, Boolean(revoked));
    refreshAll();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteQuestionAdminAction(id: string): Promise<Result> {
  try {
    await admin();
    await store().remove("question_replies", { questionId: id });
    await store().remove("questions", { id });
    refreshAll();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ── Media ────────────────────────────────────────────────── */

export async function uploadMediaAction(form: FormData): Promise<Result<MediaAsset>> {
  try {
    const user = await admin();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) throw new Error("Fayl tanlanmagan");
    const asset = await saveUpload(file, user.id);
    revalidatePath("/admin/media");
    return { ok: true, data: asset };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteMediaAction(id: string): Promise<Result> {
  try {
    await admin();
    await deleteMedia(id);
    revalidatePath("/admin/media");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
