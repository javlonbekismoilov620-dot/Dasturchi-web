import Link from "next/link";
import { Clock, Layers, PlayCircle } from "lucide-react";
import type { Category, Course } from "@/lib/types";
import type { CourseStats } from "@/lib/server/services/content";
import { cn } from "@/lib/cn";
import { LevelMeter, ProgressBar, StatusBadge } from "@/components/ui/primitives";
import { CourseCover } from "./course-cover";

export function CourseCard({
  course,
  stats,
  category,
  progress,
  className,
  priority,
}: {
  course: Course;
  stats?: CourseStats;
  category?: Category;
  progress?: number | null;
  className?: string;
  priority?: boolean;
}) {
  const published = stats?.publishedCount ?? 0;
  const total = stats?.lessonCount ?? 0;
  return (
    <Link
      href={`/kurslar/${course.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-[border-color,transform,box-shadow] duration-500 ease-[var(--ease-out-expo)]",
        "hover:-translate-y-1 hover:border-border-strong hover:shadow-[var(--shadow-lg)]",
        className,
      )}
      data-priority={priority ? "true" : undefined}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
        <CourseCover
          slug={course.slug}
          accent={course.accent}
          icon={course.icon}
          coverUrl={course.coverUrl}
          className="h-full w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <StatusBadge status={course.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {category && <p className="eyebrow mb-2.5 !text-[10.5px]">{category.title}</p>}
        <h3 className="text-balance text-[17px] font-semibold leading-snug tracking-[-0.015em]">{course.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[14px] leading-relaxed text-fg-muted">{course.subtitle}</p>
        <div className="mt-auto pt-5">
          {typeof progress === "number" ? (
            <div className="space-y-2">
              <div className="flex justify-between text-[12px] text-fg-muted">
                <span>Progress</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
              <ProgressBar value={progress} color={course.accent} />
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px] text-fg-muted">
              <LevelMeter level={course.level} />
              <span className="inline-flex items-center gap-1.5">
                <PlayCircle className="h-3.5 w-3.5" />
                {course.status === "preparing" ? `${published}/${total} dars tayyor` : `${published} dars`}
              </span>
              {course.status === "published" ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />~{course.estimatedHours} soat
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  {stats?.moduleCount ?? 0} modul
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
