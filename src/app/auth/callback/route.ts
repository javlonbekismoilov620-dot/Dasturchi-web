import { NextResponse, type NextRequest } from "next/server";
import { supabaseAuthClient } from "@/lib/server/auth/supabase-auth";
import { isSupabaseEnabled } from "@/lib/server/env";

/** Supabase OAuth (Google) va email tasdiqlash havolalari uchun qaytish manzili */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next") ?? "/kabinet";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/kabinet";

  if (!isSupabaseEnabled() || !code) {
    return NextResponse.redirect(new URL("/kirish?xato=callback", url.origin));
  }
  const sb = await supabaseAuthClient();
  const { error } = await sb.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/kirish?xato=callback", url.origin));
  return NextResponse.redirect(new URL(next, url.origin));
}
