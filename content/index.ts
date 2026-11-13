/* Platforma kontentining boshlang'ich (seed) to'plami.
   Bu ma'lumotlar birinchi ishga tushirishda bazaga yoziladi;
   keyin barcha o'zgarishlar admin panel orqali qilinadi. */
import type { CourseSeed } from "../src/lib/types.ts";
import { categories } from "./categories.ts";
import { paths } from "./paths.ts";
import { upcomingCourses } from "./courses/upcoming.ts";
import { webAsoslari } from "./courses/web-asoslari.ts";
import { javascriptAsoslari } from "./courses/javascript-asoslari.ts";
import { pythonNoldan } from "./courses/python-noldan.ts";
import { blenderBoshlangich } from "./courses/blender-boshlangich.ts";
import { videoMontajAsoslari } from "./courses/video-montaj-asoslari.ts";
import { uiDizaynAsoslari } from "./courses/ui-dizayn-asoslari.ts";

/** To'liq yozilgan kurslar (darslar, testlar, yakuniy imtihon bilan) */
export const publishedCourses: CourseSeed[] = [
  webAsoslari,
  javascriptAsoslari,
  pythonNoldan,
  blenderBoshlangich,
  videoMontajAsoslari,
  uiDizaynAsoslari,
];

export const courses: CourseSeed[] = [...publishedCourses, ...upcomingCourses];

export { categories, paths };
