import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { getCurrentUser } from "@/lib/server/auth";
import { env, isAiEnabled } from "@/lib/server/env";
import { rateLimit } from "@/lib/server/rate-limit";
import { getCourseById, getLessonById } from "@/lib/server/services/content";

/* AI ustoz — modulli integratsiya.
   ANTHROPIC_API_KEY berilmagan bo‘lsa, 503 qaytaradi va interfeys buni ochiq aytadi.
   Model AI_MODEL orqali almashtiriladi (standart: claude-opus-5-5). */

const SYSTEM = `Sen "Dasturchi" o‘zbek tilidagi ta’lim platformasining AI ustozisan.
Vazifang — talabaga joriy dars mavzusini chuqurroq tushunishga yordam berish.

Qoidalar:
- Faqat o‘zbek tilida (lotin yozuvida, o‘ va g‘ harflari bilan) javob ber. Texnik atamalarni o‘zbekcha tushuntirib, kerak bo‘lsa inglizcha nomini qavs ichida ber.
- Talaba yangi boshlovchi bo‘lishi mumkin: sodda, aniq va do‘stona tushuntir, kundalik hayotdan misollar keltir.
- Javoblar qisqa va tuzilgan bo‘lsin: odatda 3–8 gap yoki qisqa ro‘yxat. Kod kerak bo‘lsa, kichik va izohli misol ber.
- Mashq yoki test javobini to‘g‘ridan-to‘g‘ri aytib berma — avval yo‘naltiruvchi savol yoki maslahat ber, talaba o‘zi topishiga yordam ber.
- Bilmagan yoki ishonchsiz narsangni taxmin qilib aytma; "aniq bilmayman" deb ochiq ayt.
- Savol dars mavzusidan butunlay tashqarida bo‘lsa, muloyimlik bilan dars mavzusiga qaytar.`;

const bodySchema = z.object({
  lessonId: z.string().max(200),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(4000) }))
    .min(1)
    .max(20),
});

export async function GET() {
  return Response.json({ enabled: isAiEnabled() });
}

export async function POST(request: Request) {
  if (!isAiEnabled()) {
    return Response.json({ error: "AI yordamchi hali ulanmagan." }, { status: 503 });
  }
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Tizimga kiring." }, { status: 401 });
  const limit = rateLimit(`ai:${user.id}`, 30, 60 * 60_000);
  if (!limit.ok) return Response.json({ error: "Soatlik so‘rovlar chegarasiga yetdingiz. Birozdan so‘ng urinib ko‘ring." }, { status: 429 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || parsed.data.messages[0].role !== "user") {
    return Response.json({ error: "So‘rov formati noto‘g‘ri." }, { status: 400 });
  }
  const lesson = await getLessonById(parsed.data.lessonId);
  if (!lesson || lesson.status !== "published") return Response.json({ error: "Dars topilmadi." }, { status: 404 });
  const course = await getCourseById(lesson.courseId);

  // Dars konteksti — barqaror bo‘lgani uchun keshlanadi
  const c = lesson.content;
  const lessonContext = [
    `Kurs: ${course?.title ?? ""}`,
    `Dars: ${lesson.title} — ${lesson.summary}`,
    c.concept && `Tushuncha: ${c.concept}`,
    c.how && `Qanday ishlaydi: ${c.how}`,
    c.keyTerms.length ? `Atamalar: ${c.keyTerms.map((k) => `${k.term} — ${k.definition}`).join("; ")}` : "",
    c.summary.length ? `Xulosa: ${c.summary.join(" ")}` : "",
  ]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 12000);

  const client = new Anthropic({ apiKey: env.anthropicApiKey });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const s = client.beta.messages.stream({
          model: env.aiModel,
          max_tokens: 4000,
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          output_config: { effort: "low" },
          system: [
            { type: "text", text: SYSTEM },
            { type: "text", text: `Joriy dars materiali:\n\n${lessonContext}`, cache_control: { type: "ephemeral" } },
          ],
          messages: parsed.data.messages,
        });
        for await (const event of s) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await s.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("\n\nKechirasiz, bu savolga javob bera olmayman. Iltimos, savolni dars mavzusi doirasida qayta yozing."));
        } else if (final.stop_reason === "max_tokens") {
          controller.enqueue(encoder.encode("\n\n(Javob uzunlik chegarasiga yetdi.)"));
        }
      } catch (err) {
        let msg = "AI xizmatida xatolik yuz berdi. Birozdan so‘ng qayta urinib ko‘ring.";
        if (err instanceof Anthropic.AuthenticationError) msg = "AI kaliti noto‘g‘ri sozlangan. Administratorga murojaat qiling.";
        else if (err instanceof Anthropic.RateLimitError) msg = "AI xizmati hozir band. Bir daqiqadan so‘ng urinib ko‘ring.";
        else console.error("[ai/tutor]", err);
        controller.enqueue(encoder.encode(`\n\n⚠ ${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}
