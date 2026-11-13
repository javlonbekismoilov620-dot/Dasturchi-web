import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { store } from "@/lib/server/store";
import { uploadsDir } from "@/lib/server/services/admin";

/* Lokal rejimda yuklangan fayllarni uzatish. Video uchun Range so‘rovlari
   qo‘llab-quvvatlanadi (oldinga/orqaga o‘tkazish ishlashi uchun). */
export async function GET(request: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params;
  if (!/^[0-9a-f-]{36}(\.[a-z0-9]{1,8})?$/.test(file)) return new Response("Topilmadi", { status: 404 });
  const id = file.split(".")[0];
  const asset = await store().getById("media", id);
  if (!asset) return new Response("Topilmadi", { status: 404 });
  const full = path.join(uploadsDir(), file);
  let stat;
  try {
    stat = await fs.stat(full);
  } catch {
    return new Response("Topilmadi", { status: 404 });
  }
  const headers: Record<string, string> = {
    "Content-Type": asset.mime,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
    // SVG ichidagi skriptlar ishga tushmasligi uchun
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
  };
  if (!/^(image|video|audio)\//.test(asset.mime) || asset.mime === "image/svg+xml") {
    headers["Content-Disposition"] = `attachment; filename*=UTF-8''${encodeURIComponent(asset.name)}`;
  }
  const range = request.headers.get("range");
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    const start = m?.[1] ? Number(m[1]) : 0;
    const end = m?.[2] ? Math.min(Number(m[2]), stat.size - 1) : stat.size - 1;
    if (start >= stat.size || start > end) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${stat.size}` } });
    }
    const stream = Readable.toWeb(createReadStream(full, { start, end })) as ReadableStream;
    return new Response(stream, {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${stat.size}`, "Content-Length": String(end - start + 1) },
    });
  }
  const stream = Readable.toWeb(createReadStream(full)) as ReadableStream;
  return new Response(stream, { headers: { ...headers, "Content-Length": String(stat.size) } });
}
