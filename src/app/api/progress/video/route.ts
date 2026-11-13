import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/server/auth";
import { getLessonById } from "@/lib/server/services/content";
import { saveVideoPosition } from "@/lib/server/services/learning";

/** sendBeacon orqali (sahifa yopilayotganda) video pozitsiyasini saqlash */
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = z.object({ lessonId: z.string().max(200), seconds: z.number().finite().min(0) }).safeParse(await request.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const lesson = await getLessonById(body.data.lessonId);
  if (!lesson) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await saveVideoPosition(user.id, lesson, body.data.seconds);
  return new NextResponse(null, { status: 204 });
}
