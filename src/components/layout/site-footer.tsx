import Link from "next/link";
import { listCategories } from "@/lib/server/services/content";
import { Logo } from "./logo";

export async function SiteFooter() {
  const categories = await listCategories();
  const year = new Date().getFullYear();
  const cols = [
    {
      title: "Yo‘nalishlar",
      links: categories.map((c) => ({ href: `/yonalishlar/${c.slug}`, label: c.title })),
    },
    {
      title: "Platforma",
      links: [
        { href: "/kurslar", label: "Barcha kurslar" },
        { href: "/yollar", label: "O‘quv yo‘llari" },
        { href: "/baholash", label: "Darajani aniqlash" },
        { href: "/qidiruv", label: "Qidiruv" },
      ],
    },
    {
      title: "Hisob",
      links: [
        { href: "/kabinet", label: "Shaxsiy kabinet" },
        { href: "/kabinet/sertifikatlar", label: "Sertifikatlar" },
        { href: "/sertifikat", label: "Sertifikatni tekshirish" },
        { href: "/royxatdan-otish", label: "Ro‘yxatdan o‘tish" },
      ],
    },
  ];
  return (
    <footer className="relative mt-32 border-t border-border pb-[calc(84px+env(safe-area-inset-bottom))] md:pb-0">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-5 text-[14px] leading-relaxed text-fg-muted">
            IT, dizayn, 3D, video montaj va zamonaviy texnologiyalarni o‘zbek tilida, mutlaqo noldan professional darajagacha o‘rganing.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="eyebrow mb-4">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[14px] text-fg-muted transition-colors hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-page flex flex-col gap-3 border-t border-border py-6 text-[13px] text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} Dasturchi. Barcha huquqlar himoyalangan.</p>
        <p>O‘zbekistonda, o‘zbek tilida so‘zlashuvchi o‘quvchilar uchun yaratilgan.</p>
      </div>
    </footer>
  );
}
