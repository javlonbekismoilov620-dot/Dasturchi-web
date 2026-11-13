import type {
  Activity,
  Bookmark,
  Category,
  Certificate,
  Course,
  Enrollment,
  LearningPath,
  Lesson,
  LessonProgress,
  MediaAsset,
  Module,
  Note,
  Question,
  QuestionReply,
  Quiz,
  QuizAttempt,
  SavedCourse,
  User,
} from "@/lib/types";

/** Lokal rejimdagi sessiya (Supabase rejimida Supabase Auth ishlatiladi) */
export interface SessionRow {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
}

/** Lokal rejimdagi parol xeshi — profillardan alohida saqlanadi */
export interface CredentialRow {
  id: string;
  userId: string;
  passwordHash: string;
  updatedAt: string;
}

export interface Tables {
  categories: Category;
  courses: Course;
  modules: Module;
  lessons: Lesson;
  quizzes: Quiz;
  paths: LearningPath;
  profiles: User;
  enrollments: Enrollment;
  lesson_progress: LessonProgress;
  quiz_attempts: QuizAttempt;
  notes: Note;
  bookmarks: Bookmark;
  saved_courses: SavedCourse;
  questions: Question;
  question_replies: QuestionReply;
  certificates: Certificate;
  activities: Activity;
  media: MediaAsset;
  sessions: SessionRow;
  credentials: CredentialRow;
}

export type TableName = keyof Tables;

export const CONTENT_TABLES = ["categories", "courses", "modules", "lessons", "quizzes", "paths"] as const;
export type ContentTable = (typeof CONTENT_TABLES)[number];

type FilterValue<V> = V | { in: V[] };
export type Filter<T> = { [K in keyof T]?: FilterValue<T[K]> };

export interface SelectOptions<T> {
  where?: Filter<T>;
  orderBy?: { field: keyof T; asc?: boolean }[];
  limit?: number;
  /** Supabase rejimida faqat shu ustunlar olinadi (masalan, katta kontentni chetlab o‘tish uchun) */
  columns?: (keyof T)[];
}

export interface Store {
  readonly kind: "local" | "supabase";
  select<N extends TableName>(table: N, opts?: SelectOptions<Tables[N]>): Promise<Tables[N][]>;
  first<N extends TableName>(table: N, where: Filter<Tables[N]>): Promise<Tables[N] | null>;
  getById<N extends TableName>(table: N, id: string): Promise<Tables[N] | null>;
  insert<N extends TableName>(table: N, row: Tables[N]): Promise<Tables[N]>;
  update<N extends TableName>(table: N, id: string, patch: Partial<Tables[N]>): Promise<Tables[N] | null>;
  /** Berilgan id bo‘yicha yozuvni qo‘shadi yoki to‘liq almashtiradi */
  upsert<N extends TableName>(table: N, row: Tables[N]): Promise<Tables[N]>;
  remove<N extends TableName>(table: N, where: Filter<Tables[N]>): Promise<number>;
  count<N extends TableName>(table: N, where?: Filter<Tables[N]>): Promise<number>;
}

export function matches<T>(row: T, where?: Filter<T>): boolean {
  if (!where) return true;
  for (const key in where) {
    const cond = where[key];
    if (cond === undefined) continue;
    const value = row[key as keyof T];
    if (cond !== null && typeof cond === "object" && "in" in (cond as object)) {
      if (!(cond as { in: unknown[] }).in.includes(value)) return false;
    } else if (value !== cond) {
      return false;
    }
  }
  return true;
}
