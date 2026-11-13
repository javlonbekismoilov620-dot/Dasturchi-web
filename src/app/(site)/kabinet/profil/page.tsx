import { PasswordForm, ProfileForm } from "@/components/dashboard/profile-forms";
import { requireUser } from "@/lib/server/auth";
import { listCategories } from "@/lib/server/services/content";
import { levelName } from "@/lib/text";
import { ButtonLink } from "@/components/ui/button";

export default async function ProfilePage() {
  const user = await requireUser("/kabinet/profil");
  const categories = await listCategories();
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="space-y-10">
        <section>
          <h1 className="mb-6 text-[30px] font-semibold tracking-[-0.03em]">Profil sozlamalari</h1>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <ProfileForm
              user={{ name: user.name, email: user.email, bio: user.bio, goal: user.goal, weeklyGoal: user.weeklyGoal, interests: user.interests }}
              categories={categories.map((c) => ({ slug: c.slug, title: c.title }))}
            />
          </div>
        </section>
        <section>
          <h2 className="mb-4 text-[20px] font-semibold tracking-tight">Xavfsizlik</h2>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <PasswordForm />
          </div>
        </section>
      </div>
      <aside className="space-y-4">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="eyebrow mb-2">Darajangiz</p>
          <p className="text-[18px] font-semibold">{user.level ? `${user.level} · ${levelName(user.level)}` : "Aniqlanmagan"}</p>
          <ButtonLink href="/baholash" variant="secondary" size="sm" className="mt-4">
            {user.level ? "Qayta baholash" : "Darajani aniqlash"}
          </ButtonLink>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 text-[13.5px] text-fg-muted">
          <p className="eyebrow mb-2">Hisob</p>
          <p>Rol: <span className="text-fg">{user.role === "admin" ? "Administrator" : "Talaba"}</span></p>
          <p className="mt-1">Ro‘yxatdan o‘tgan: <span className="text-fg">{new Date(user.createdAt).toLocaleDateString("uz-UZ")}</span></p>
        </div>
      </aside>
    </div>
  );
}
