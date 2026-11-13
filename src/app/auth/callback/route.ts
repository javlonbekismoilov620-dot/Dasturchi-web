import { NextResponse, type NextRequest } from "next/server";
import { supabaseAuthClient } from "@/lib/server/auth/supabase-auth";
import { isSupabaseEnabled } from "@/lib/server/env";
import { safeNext } from "@/lib/safe-next";

/** Supabase OAuth (Google) va standart email tasdiqlash havolalari (PKCE `code`) uchun qaytish manzili */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  if (!isSupabaseEnabled() || !code) {
    // Supabase xatoni query'da qaytaradi (masalan, muddati o‘tgan havola)
    return NextResponse.redirect(new URL("/kirish?xato=callback", url.origin));
  }
  const sb = await supabaseAuthClient();
  const { error } = await sb.auth.exchangeCodeForSession(code);
  // Havola boshqa brauzerda ochilgan bo‘lsa, kod almashtirilmaydi, lekin pochta
  // Supabase tomonidan allaqachon tasdiqlangan — foydalanuvchi oddiy kirishi mumkin.
  if (error) return NextResponse.redirect(new URL("/kirish?xato=tasdiqlandi", url.origin));
  return NextResponse.redirect(new URL(next, url.origin));
}
