/* Platforma kontentining boshlang'ich (seed) to'plami.
   Bu ma'lumotlar birinchi ishga tushirishda bazaga yoziladi;
   keyin barcha o'zgarishlar admin panel orqali qilinadi. */
import type { CourseSeed } from "../src/lib/types.ts";
import { categories } from "./categories.ts";
import { paths } from "./paths.ts";
import { upcomingCourses } from "./courses/upcoming.ts";
import { webAsoslari } from "./courses/web-asoslari.ts";

export const courses: CourseSeed[] = [webAsoslari, ...upcomingCourses];

export { categories, paths };
