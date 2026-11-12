"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { changePassword, getCurrentUser } from "@/lib/server/auth";
import { rateLimit } from "@/lib/server/rate-limit";
import { store } from "@/lib/server/store";
import { getCourseById, getCurriculum, getLessonById, getQuiz } from "@/lib/server/services/content";
import {
  askQuestion,
  deleteQuestion,
  enroll,
  getCourseProgress,
  replyQuestion,
  saveNote,
  saveVideoPosition,
  setLessonCompleted,
  submitQuiz,
  toggleBookmark,
  toggleSavedCourse,
} from "@/lib/server/services/learning";
import type { Level } from "@/lib/types";

async function mustUser(next?: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/kirish${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  return user;
}

const idSchema = z.string().min(1).max(200);

/** Kursga yozilish va birinchi (yoki oxirgi) darsga o‘tish */
export async function startCourseAction(courseId: string) {
  const course = await getCourseById(idSchema.parse(courseId));
  if (!course || course.status === "draft") redirect("/kurslar");
  const user = await mustUser(`/kurslar/${course.slug}`);
  await enroll(user.id, course);
  const progress = await getCourseProgress(user.id, course);
  const target = progress.nextLesson ?? (await getCurriculum(course.id)).publishedLessons[0];
  revalidatePath(`/kurslar/${course.slug}`);
  if (!target) redirect(`/kurslar/${course.slug}`);
  redirect(`/kurslar/${course.slug}/dars/${target.slug}`);
}

export async function toggleSaveCourseAction(courseId: string): Promise<{ saved: boolean } | { error: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "auth" };
  const course = await getCourseById(idSchema.parse(courseId));
  if (!course) return { error: "Kurs topilmadi" };
  const saved = await toggleSavedCourse(user.id, course.id);
  revalidatePath("/kabinet/saqlanganlar");
  return { saved };
}

export async function setLessonCompleteAction(lessonId: string, completed: boolean) {
  const user = await getCurrentUser();
  if (!user) return { error: "auth" as const };
  const lesson = await getLessonById(idSchema.parse(lessonId));
  if (!lesson || lesson.status !== "published") return { error: "Dars topilmadi" };
  const course = await getCourseById(lesson.courseId);
  if (!course) return { error: "Kurs topilmadi" };
  const certificate = await setLessonCompleted(user, course, lesson, Boolean(completed));
  const progress = await getCourseProgress(user.id, course);
  revalidatePath(`/kurslar/${course.slug}`);
  revalidatePath("/kabinet");
  return { ok: true as const, percent: progress.percent, certificateCode: certificate?.code ?? null };
}

export async function toggleBookmarkAction(lessonId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "auth" as const };
  const lesson = await getLessonById(idSchema.parse(lessonId));
  if (!lesson) return { error: "Dars topilmadi" };
  const bookmarked = await toggleBookmark(user.id, lesson);
  revalidatePath("/kabinet/saqlanganlar");
  return { bookmarked };
}

export async function saveNoteAction(lessonId: string, body: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "auth" as const };
  const lesson = await getLessonById(idSchema.parse(lessonId));
  if (!lesson) return { error: "Dars topilmadi" };
  const text = z.string().max(20000).parse(body);
  const note = await saveNote(user.id, lesson, text);
  return { ok: true as const, updatedAt: note?.updatedAt ?? null };
}

export async function saveVideoPositionAction(lessonId: string, seconds: number) {
  const user = await getCurrentUser();
  if (!user) return;
  const lesson = await getLessonById(idSchema.parse(lessonId));
  if (!lesson) return;
  await saveVideoPosition(user.id, lesson, z.number().finite().min(0).parse(seconds));
}

const questionSchema = z.string().trim().min(5, "Savol kamida 5 ta belgidan iborat bo‘lsin.").max(4000, "Savol juda uzun.");

export async function askQuestionAction(lessonId: string, body: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Savol berish uchun tizimga kiring." };
  const parsed = questionSchema.safeParse(body);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  if (!rateLimit(`ask:${user.id}`, 10, 60 * 60_000).ok) return { error: "Juda ko‘p savol yuborildi. Birozdan so‘ng urinib ko‘ring." };
  const lesson = await getLessonById(idSchema.parse(lessonId));
  if (!lesson) return { error: "Dars topilmadi" };
  await askQuestion(user, lesson, parsed.data);
  const course = await getCourseById(lesson.courseId);
  if (course) revalidatePath(`/kurslar/${course.slug}/dars/${lesson.slug}`);
  return { ok: true };
}

export async function replyQuestionAction(questionId: string, body: string, path: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Javob yozish uchun tizimga kiring." };
  const parsed = questionSchema.safeParse(body);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  if (!rateLimit(`reply:${user.id}`, 30, 60 * 60_000).ok) return { error: "Juda ko‘p javob yuborildi." };
  const reply = await replyQuestion(user, idSchema.parse(questionId), parsed.data);
  if (!reply) return { error: "Savol topilmadi" };
  if (path.startsWith("/")) revalidatePath(path);
  return { ok: true };
}

export async function deleteQuestionAction(questionId: string, path: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "auth" };
  const ok = await deleteQuestion(user, idSchema.parse(questionId));
  if (path.startsWith("/")) revalidatePath(path);
  return ok ? { ok: true } : { error: "Ruxsat yo‘q" };
}

export async function submitQuizAction(quizId: string, answers: number[]) {
  const user = await getCurrentUser();
  if (!user) return { error: "auth" as const };
  if (!rateLimit(`quiz:${user.id}`, 40, 60 * 60_000).ok) return { error: "Juda ko‘p urinish. Birozdan so‘ng qayta urinib ko‘ring." };
  const quiz = await getQuiz(idSchema.parse(quizId));
  if (!quiz) return { error: "Test topilmadi" };
  const course = await getCourseById(quiz.courseId);
  if (!course || course.status === "draft") return { error: "Kurs topilmadi" };
  const parsed = z.array(z.number().int().min(-1).max(20)).length(quiz.questions.length).safeParse(answers);
  if (!parsed.success) return { error: "Javoblar formati noto‘g‘ri" };
  const result = await submitQuiz(user, course, quiz, parsed.data);
  revalidatePath(`/kurslar/${course.slug}`);
  revalidatePath("/kabinet");
  return {
    ok: true as const,
    score: result.score,
    correct: result.correct,
    total: result.total,
    passed: result.passed,
    passingScore: quiz.passingScore,
    certificateCode: result.certificate?.code ?? null,
    review: quiz.questions.map((q, i) => ({ correct: q.correct, chosen: parsed.data[i], explanation: q.explanation })),
  };
}

/* ── Profil va baholash ─────────────────────────────────────── */

const profileSchema = z.object({
  name: z.string().trim().min(2, "Ism kamida 2 ta harfdan iborat bo‘lsin.").max(80),
  bio: z.string().trim().max(500, "Bio 500 belgidan oshmasin."),
  goal: z.string().trim().max(200),
  weeklyGoal: z.coerce.number().int().min(1).max(50),
});

export type ProfileState = { error?: string; ok?: boolean } | null;

export async function updateProfileAction(_prev: ProfileState, form: FormData): Promise<ProfileState> {
  const user = await mustUser("/kabinet/profil");
  const parsed = profileSchema.safeParse({
    name: form.get("name"),
    bio: form.get("bio") ?? "",
    goal: form.get("goal") ?? "",
    weeklyGoal: form.get("weeklyGoal"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const interests = form.getAll("interests").map(String).filter((s) => /^[a-z0-9-]{1,40}$/.test(s)).slice(0, 10);
  await store().update("profiles", user.id, { ...parsed.data, interests });
  revalidatePath("/kabinet", "layout");
  return { ok: true };
}

export async function changePasswordAction(_prev: ProfileState, form: FormData): Promise<ProfileState> {
  const user = await mustUser("/kabinet/profil");
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  if (next.length < 8 || !/[A-Za-z]/.test(next) || !/\d/.test(next)) return { error: "Yangi parol kamida 8 ta belgi, harf va raqamdan iborat bo‘lsin." };
  if (next !== String(form.get("confirm") ?? "")) return { error: "Parollar mos kelmadi." };
  const res = await changePassword(user.id, current, next);
  return res.ok ? { ok: true } : { error: res.error };
}

export async function saveAssessmentAction(input: { level: number; interests: string[]; goal: string; weeklyGoal: number }) {
  const user = await getCurrentUser();
  const parsed = z
    .object({
      level: z.number().int().min(1).max(5),
      interests: z.array(z.string().regex(/^[a-z0-9-]{1,40}$/)).max(10),
      goal: z.string().max(200),
      weeklyGoal: z.number().int().min(1).max(50),
    })
    .safeParse(input);
  if (!parsed.success) return { error: "Ma’lumotlar noto‘g‘ri" };
  if (!user) return { ok: true, saved: false };
  await store().update("profiles", user.id, {
    level: parsed.data.level as Level,
    interests: parsed.data.interests,
    goal: parsed.data.goal,
    weeklyGoal: parsed.data.weeklyGoal,
    onboarded: true,
  });
  revalidatePath("/kabinet");
  return { ok: true, saved: true };
}
