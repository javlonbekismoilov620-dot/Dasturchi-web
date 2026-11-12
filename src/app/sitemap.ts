import type { MetadataRoute } from "next";
import { listAllLessonMeta, listCategories, listCourses, listPaths } from "@/lib/server/services/content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [courses, categories, paths, lessons] = await Promise.all([listCourses(), listCategories(), listPaths(), listAllLessonMeta()]);
  const slugById = new Map(courses.map((c) => [c.id, c.slug]));
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/kurslar`, lastModified: now, priority: 0.9 },
    { url: `${base}/yonalishlar`, lastModified: now, priority: 0.7 },
    { url: `${base}/yollar`, lastModified: now, priority: 0.7 },
    { url: `${base}/baholash`, lastModified: now, priority: 0.6 },
    ...courses.map((c) => ({ url: `${base}/kurslar/${c.slug}`, lastModified: new Date(c.updatedAt), priority: 0.8 })),
    ...categories.map((c) => ({ url: `${base}/yonalishlar/${c.slug}`, lastModified: now, priority: 0.6 })),
    ...paths.map((p) => ({ url: `${base}/yollar/${p.slug}`, lastModified: now, priority: 0.6 })),
    // Faqat ochiq (namuna) darslar indekslanadi
    ...lessons
      .filter((l) => l.status === "published" && l.isPreview && slugById.has(l.courseId))
      .map((l) => ({ url: `${base}/kurslar/${slugById.get(l.courseId)}/dars/${l.slug}`, lastModified: new Date(l.updatedAt), priority: 0.5 })),
  ];
}
