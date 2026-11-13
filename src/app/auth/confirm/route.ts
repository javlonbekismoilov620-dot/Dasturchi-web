import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseAuthClient } from "@/lib/server/auth/supabase-auth";
import { isSupabaseEnabled } from "@/lib/server/env";
import { safeNext } from "@/lib/safe-next";

const TYPES: EmailOtpType[] = ["signup", "email", "invite", "magiclink", "recovery", "email_change"];

/**
 * token_hash asosidagi email havolalari (Supabase email shablonlari custom SMTP bilan
 * sozlanganda ishlatiladi — docs/supabase.md). PKCE'dan farqli ravishda havola boshqa
 * brauzer yoki qurilmada ochilganda ham ishlaydi.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(url.searchParams.get("next"));

  if (!isSupabaseEnabled() || !tokenHash || !type || !TYPES.includes(type) || tokenHash.length > 512) {
    return NextResponse.redirect(new URL("/kirish?xato=callback", url.origin));
  }
  const sb = await supabaseAuthClient();
  const { error } = await sb.auth.verifyOtp({ type, token_hash: tokenHash });
  if (error) return NextResponse.redirect(new URL("/kirish?xato=callback", url.origin));
  return NextResponse.redirect(new URL(next, url.origin));
}
