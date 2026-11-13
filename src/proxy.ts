import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publicSupabaseKey, secretSupabaseKey, supabaseFetch } from "@/lib/supabase-shared";

/* Supabase rejimida sessiya cookie'larini har so‘rovda yangilab turadi.
   Lokal rejimda hech narsa qilmaydi. */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = publicSupabaseKey();
  if (!url || !anon || !secretSupabaseKey()) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anon, {
    global: { fetch: supabaseFetch(anon) },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(list) {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|api/media|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|mp4|woff2?)$).*)"],
};
