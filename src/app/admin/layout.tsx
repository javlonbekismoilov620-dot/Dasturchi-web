import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/server/auth";
import { store } from "@/lib/server/store";
import { localPersistError } from "@/lib/server/store/local";

export const metadata: Metadata = { title: { default: "Admin panel", template: "%s · Admin" }, robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const kind = store().kind;
  return (
    <div className="lg:flex">
      <AdminNav name={user.name} storeKind={kind} persistError={kind === "local" ? localPersistError() : null} />
      <main id="asosiy" className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-8 lg:pt-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
