import type { Metadata } from "next";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { requireUser } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Shaxsiy kabinet", robots: { index: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireUser("/kabinet");
  return (
    <div className="container-page pb-10 pt-8 sm:pt-10">
      <DashboardNav />
      <div className="pt-8">{children}</div>
    </div>
  );
}
