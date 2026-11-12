import { MediaManager } from "@/components/admin/misc-admin";
import { listMedia } from "@/lib/server/services/admin";

export const metadata = { title: "Media" };

export default async function AdminMedia() {
  const items = await listMedia();
  return (
    <div className="space-y-6">
      <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Media kutubxonasi</h1>
      <MediaManager items={items} />
    </div>
  );
}
