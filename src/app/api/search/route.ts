import { NextResponse } from "next/server";
import { buildSearchIndex } from "@/lib/server/services/content";
import { rankSearch } from "@/lib/search";

/** Qidiruv indeksi (q bo‘lmasa) yoki tartiblangan natijalar (q bo‘lsa) */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q");
  const items = await buildSearchIndex();
  if (q) return NextResponse.json({ items: rankSearch(items, q.slice(0, 120), 30) });
  return NextResponse.json({ items }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=600" } });
}
