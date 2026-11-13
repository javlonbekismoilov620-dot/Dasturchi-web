/* Platformaning asosiy ma’lumot modeli.
   Bu turlar lokal JSON drayveri va Supabase drayveri uchun umumiy. */

export type Level = 1 | 2 | 3 | 4 | 5;
export type ColorKey = "azure" | "teal" | "gold" | "coral" | "violet" | "rose" | "lime";

/** published — to‘liq e’lon qilingan; preparing — dastur e’lon qilingan, darslar bosqichma-bosqich qo‘shilmoqda; draft — faqat admin ko‘radi */
export type CourseStatus = "published" | "preparing" | "draft";
/** published — o‘qish mumkin; planned — dasturda e’lon qilingan, hali yozilmoqda; draft — yashirin */
export type LessonStatus = "published" | "planned" | "draft";
export type Role = "student" | "admin";

export type CodeLanguage =
  | "html"
  | "css"
  | "javascript"
  | "typescript"
  | "python"
  | "bash"
  | "json"
  | "sql"
  | "text";

export interface CodeSnippet {
  language: CodeLanguage;
  code: string;
  /** true bo‘lsa, kod interaktiv muharrirda ishga tushiriladi */
  runnable?: boolean;
  filename?: string;
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: ColorKey;
  order: number;
  /** Ushbu yo‘nalishdagi asosiy dasturlar va mavzular (qidiruv uchun) */
  topics: string[];
}

export interface Instructor {
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string | null;
}

export interface FinalProject {
  title: string;
  description: string;
  deliverables: string[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  categoryId: string;
  level: Level;
  status: CourseStatus;
  featured: boolean;
  order: number;
  coverUrl: string | null;
  accent: ColorKey;
  icon: string;
  instructor: Instructor;
  objectives: string[];
  skills: string[];
  requirements: string[];
  audience: string[];
  software: string[];
  tags: string[];
  estimatedHours: number;
  finalProject: FinalProject | null;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
}

export interface LessonStep {
  title: string;
  body: string;
  code?: CodeSnippet;
}

export interface LessonExample {
  title: string;
  body: string;
  code?: CodeSnippet;
}

export interface LessonMistake {
  title: string;
  fix: string;
}

export interface LessonExercise {
  title: string;
  brief: string;
  tasks: string[];
  hint?: string;
  starter?: CodeSnippet;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

/** Har bir dars 9 qismli tuzilmaga ega */
export interface LessonContent {
  intro: string;
  /** 1. Tushuncha nima? */
  concept: string;
  /** 2. Nima uchun muhim? */
  why: string;
  /** 3. Qanday ishlaydi? */
  how: string;
  /** 4. Qadamma-qadam */
  steps: LessonStep[];
  /** 5. Amaliy misollar */
  examples: LessonExample[];
  /** 6. Yangi boshlovchilarning keng tarqalgan xatolari */
  mistakes: LessonMistake[];
  /** 7. Professional maslahatlar */
  tips: string[];
  /** 8. Amaliy mashq */
  exercise: LessonExercise;
  /** 9. Xulosa */
  summary: string[];
  keyTerms: KeyTerm[];
}

export type InteractiveType =
  | "code-playground"
  | "mesh-viewer"
  | "lighting-lab"
  | "timeline"
  | "color-grading"
  | "typography"
  | "contrast"
  | "box-model";

export interface InteractiveBlock {
  type: InteractiveType;
  title?: string;
  description?: string;
  config?: Record<string, unknown>;
}

export interface Resource {
  id: string;
  title: string;
  type: "file" | "link";
  url: string;
  size?: number | null;
}

export type VideoProvider = "file" | "youtube" | "vimeo";

export interface LessonVideo {
  url: string;
  provider: VideoProvider;
  poster?: string | null;
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  slug: string;
  title: string;
  summary: string;
  durationMin: number;
  order: number;
  status: LessonStatus;
  isPreview: boolean;
  video: LessonVideo | null;
  content: LessonContent;
  resources: Resource[];
  interactive: InteractiveBlock[];
  updatedAt: string;
}

/** Ro‘yxatlar uchun yengil dars ko‘rinishi (kontentsiz) */
export type LessonMeta = Omit<Lesson, "content">;

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  /** null — kursning yakuniy testi */
  moduleId: string | null;
  title: string;
  description: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface PathStep {
  courseSlug: string;
  note: string;
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: ColorKey;
  outcomes: string[];
  steps: PathStep[];
  order: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  bio: string;
  goal: string;
  weeklyGoal: number;
  level: Level | null;
  interests: string[];
  onboarded: boolean;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  lastLessonId: string | null;
  lastAccessAt: string;
  completedAt: string | null;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  completed: boolean;
  completedAt: string | null;
  videoPosition: number;
  updatedAt: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  courseId: string;
  score: number;
  passed: boolean;
  answers: number[];
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  body: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  createdAt: string;
}

export interface SavedCourse {
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
}

export interface Question {
  id: string;
  lessonId: string;
  courseId: string;
  userId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface QuestionReply {
  id: string;
  questionId: string;
  userId: string;
  authorName: string;
  isStaff: boolean;
  body: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  code: string;
  userId: string;
  courseId: string;
  userName: string;
  courseTitle: string;
  issuedAt: string;
  revoked: boolean;
}

export type ActivityType =
  | "lesson_completed"
  | "quiz_passed"
  | "course_enrolled"
  | "course_completed"
  | "certificate_issued";

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  courseId: string;
  refId: string | null;
  label: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  mime: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
}

/* ── Kontent seed formati (content/ papkasidagi fayllar) ── */
export interface LessonSeed {
  slug: string;
  title: string;
  summary: string;
  durationMin: number;
  isPreview?: boolean;
  status?: LessonStatus;
  content?: LessonContent;
  interactive?: InteractiveBlock[];
  resources?: Omit<Resource, "id">[];
}

export interface QuizSeed {
  title: string;
  description: string;
  passingScore?: number;
  questions: Omit<QuizQuestion, "id">[];
}

export interface ModuleSeed {
  title: string;
  description: string;
  lessons: LessonSeed[];
  quiz?: QuizSeed;
}

export interface CourseSeed {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: Level;
  status: CourseStatus;
  featured?: boolean;
  order?: number;
  accent: ColorKey;
  icon: string;
  instructor?: Instructor;
  objectives: string[];
  skills: string[];
  requirements: string[];
  audience: string[];
  software: string[];
  tags: string[];
  estimatedHours: number;
  finalProject?: FinalProject;
  modules: ModuleSeed[];
  finalQuiz?: QuizSeed;
}
