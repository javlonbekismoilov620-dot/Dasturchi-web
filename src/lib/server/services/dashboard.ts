import "server-only";
import { store } from "@/lib/server/store";
import type { Course, User } from "@/lib/types";
import { dayKey } from "@/lib/text";
import { getCurriculum, listCategories, listCourses } from "./content";
import {
  activityByDay,
  computeAchievements,
  computeStreak,
  getCourseProgress,
  listActivities,
  listEnrollments,
  listNotes,
  listUserCertificates,
  recommendCourses,
  recommendPaths,
  type CourseProgress,
} from "./learning";

export interface DailyTask {
  id: string;
  label: string;
  href: string | null;
  done: boolean;
}

export async function getDashboard(user: User) {
  const [enrollments, courses, activities, certificates, notes, categories, attempts] = await Promise.all([
    listEnrollments(user.id),
    listCourses(true),
    listActivities(user.id, 1000),
    listUserCertificates(user.id),
    listNotes(user.id),
    listCategories(),
    store().select("quiz_attempts", { where: { userId: user.id } }),
  ]);
  const courseById = new Map(courses.map((c) => [c.id, c]));

  const active: { course: Course; progress: CourseProgress; lastAccessAt: string }[] = [];
  for (const e of enrollments) {
    const c = courseById.get(e.courseId);
    if (!c) continue;
    active.push({ course: c, progress: await getCourseProgress(user.id, c), lastAccessAt: e.lastAccessAt });
  }
  const inProgress = active.filter((a) => !a.progress.isComplete);
  const completed = active.filter((a) => a.progress.isComplete);
  const resume = inProgress.find((a) => a.progress.nextLesson) ?? null;

  const streak = computeStreak(activities);
  const week = activityByDay(activities, 7);
  const heatmap = activityByDay(activities, 7 * 15);
  const today = dayKey(new Date());
  const lessonsTotal = activities.filter((a) => a.type === "lesson_completed").length;

  // Haftalik maqsad: dushanbadan boshlab (Toshkent vaqti)
  const now = new Date(`${today}T00:00:00Z`);
  const dow = (now.getUTCDay() + 6) % 7;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - dow);
  const mondayKey = monday.toISOString().slice(0, 10);
  const lessonsThisWeek = activities.filter((a) => a.type === "lesson_completed" && dayKey(a.createdAt) >= mondayKey).length;

  const categoriesTouched = new Set(active.map((a) => a.course.categoryId)).size;
  const achievements = computeAchievements({
    lessonsCompleted: lessonsTotal,
    quizzesPassed: new Set(attempts.filter((a) => a.passed).map((a) => a.quizId)).size,
    perfectQuizzes: attempts.filter((a) => a.score === 100).length,
    bestStreak: streak.best,
    certificates: certificates.length,
    categoriesTouched,
    notes: notes.length,
  });

  // Kunlik vazifalar — haqiqiy holatdan kelib chiqadi
  const tasks: DailyTask[] = [];
  const doneToday = activities.some((a) => a.type === "lesson_completed" && dayKey(a.createdAt) === today);
  if (resume?.progress.nextLesson) {
    tasks.push({
      id: "lesson",
      label: doneToday ? "Bugun kamida bitta dars yakunlandi" : `Keyingi darsni yakunlang: ${resume.progress.nextLesson.title}`,
      href: `/kurslar/${resume.course.slug}/dars/${resume.progress.nextLesson.slug}`,
      done: doneToday,
    });
  } else {
    tasks.push({ id: "lesson", label: "Bugun kamida bitta darsni yakunlang", href: "/kurslar", done: doneToday });
  }
  // Barcha darslari tugagan, lekin o‘tilmagan modul testi
  for (const a of inProgress) {
    const cur = await getCurriculum(a.course.id);
    const pendingQuiz = cur.modules.find(
      (m) => m.quiz && m.lessons.length > 0 && m.lessons.every((l) => l.status !== "published" || a.progress.completedIds.has(l.id)) && !a.progress.passedQuizIds.has(m.quiz.id),
    )?.quiz;
    if (pendingQuiz) {
      tasks.push({ id: "quiz", label: `Testdan o‘ting: ${pendingQuiz.title}`, href: `/kurslar/${a.course.slug}/test/${pendingQuiz.id}`, done: false });
      break;
    }
  }
  tasks.push({
    id: "note",
    label: "O‘rganganlaringizni o‘z so‘zlaringiz bilan qaydga yozing",
    href: resume?.progress.nextLesson ? `/kurslar/${resume.course.slug}/dars/${resume.progress.nextLesson.slug}` : null,
    done: notes.some((n) => dayKey(n.updatedAt) === today),
  });
  tasks.push({
    id: "goal",
    label: `Haftalik maqsad: ${Math.min(lessonsThisWeek, user.weeklyGoal)}/${user.weeklyGoal} dars`,
    href: null,
    done: lessonsThisWeek >= user.weeklyGoal,
  });

  const [recommended, paths] = await Promise.all([recommendCourses(user, 3), recommendPaths(user)]);

  return {
    active,
    inProgress,
    completed,
    resume,
    streak,
    week,
    heatmap,
    lessonsTotal,
    lessonsThisWeek,
    certificates,
    achievements,
    tasks,
    recommended,
    paths,
    activities: activities.slice(0, 8),
    categories,
    courseById,
  };
}
