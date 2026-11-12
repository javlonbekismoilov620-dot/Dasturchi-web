import { CommandPalette } from "@/components/layout/command-palette";
import { MobileTabBar, SiteHeader, type NavUser } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getCurrentUser } from "@/lib/server/auth";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const nav: NavUser = user ? { name: user.name, email: user.email, role: user.role } : null;
  return (
    <>
      <SiteHeader user={nav} />
      <main id="asosiy" className="relative min-h-[70dvh] pt-16">
        {children}
      </main>
      <SiteFooter />
      <MobileTabBar user={nav} />
      <CommandPalette />
    </>
  );
}
