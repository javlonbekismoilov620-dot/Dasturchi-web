import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/motion";
import { colorVar, tint } from "@/lib/colors";
import { listCourses, listPaths } from "@/lib/server/services/content";

export const metadata: Metadata = { title: "O‘quv yo‘llari", description: "Kasb bo‘yicha tuzilgan bosqichma-bosqich o‘quv yo‘llari." };

export default async function PathsPage() {
  const [paths, courses] = await Promise.all([listPaths(), listCourses()]);
  const bySlug = new Map(courses.map((c) => [c.slug, c]));
  return (
    <div className="container-page pb-10 pt-12 sm:pt-16">
      <header className="max-w-3xl">
        <p className="eyebrow mb-3">O‘quv yo‘llari</p>
        <h1 className="text-balance text-[36px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[52px]">
          Kasbga olib boruvchi <span className="font-display-italic text-fg-muted">aniq yo‘l</span>
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-fg-muted">
          Har bir yo‘l — ma’lum kasb uchun to‘g‘ri tartibda joylashtirilgan kurslar ketma-ketligi. Qaysi kursdan keyin nimani o‘rganishni o‘ylab o‘tirishingiz shart emas.
        </p>
      </header>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {paths.map((p, i) => {
          const steps = p.steps.map((s) => bySlug.get(s.courseSlug)).filter(Boolean);
          const ready = steps.filter((c) => c!.status === "published").length;
          return (
            <Reveal key={p.id} delay={(i % 2) * 0.06}>
              <Link href={`/yollar/${p.slug}`} className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-strong sm:p-8">
                <span className="grid h-12 w-12 place-items-center rounded-xl border" style={{ color: colorVar[p.color], background: tint(p.color, 10), borderColor: tint(p.color, 25) }}>
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <h2 className="mt-6 text-[22px] font-semibold tracking-[-0.02em]">{p.title}</h2>
                <p className="mt-1 text-[14.5px] text-fg-muted">{p.subtitle}</p>
                <ol className="mt-6 flex flex-wrap items-center gap-1.5 text-[12px] text-fg-subtle">
                  {steps.map((c, si) => (
                    <li key={c!.id} className="flex items-center gap-1.5">
                      <span className={c!.status === "published" ? "rounded-md bg-fg/[0.07] px-2 py-0.5 text-fg" : "rounded-md border border-dashed border-border-strong px-2 py-0.5"}>
                        {c!.title.split(":")[0]}
                      </span>
                      {si < steps.length - 1 && <ArrowRight className="h-3 w-3" />}
                    </li>
                  ))}
                </ol>
                <p className="mt-auto pt-6 text-[12.5px] text-fg-subtle">
                  {steps.length} bosqich · {ready} tasi tayyor
                </p>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
