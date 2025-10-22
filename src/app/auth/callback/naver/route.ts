import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  getNaverTokenServerSide,
  getNaverUserInfoServerSide,
} from "@/lib/auth/naver-auth"
import type { Database } from "@/utils/supabase/database.types"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const jar = cookies()

  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/auth/login?error=missing_params", request.url)
    )
  }

  try {
    const savedState = (await jar).get("naverOAuthState")?.value
    if (state !== savedState) {
      return NextResponse.redirect(
        new URL("/auth/login?error=invalid_state", request.url)
      )
    }

    const tokenData = await getNaverTokenServerSide(code, state)

    const userData = await getNaverUserInfoServerSide(tokenData.access_token)
    const naverUser = userData.response
    if (!naverUser?.email) {
      return NextResponse.redirect(
        new URL("/auth/login?error=no_email", request.url)
      )
    }

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          async get(name: string) {
            return (await jar).get(name)?.value ?? null
          },
          async set(name: string, value: string, options: CookieOptions) {
            try {
              ;(await jar).set({ name, value, ...options })
            } catch {}
          },
          async remove(name: string, options: CookieOptions) {
            try {
              ;(await jar).set({ name, value: "", ...options })
            } catch {}
          },
        },
      }
    )

    const { data: existing } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", naverUser.email)
      .maybeSingle()

    let passwordForLogin = ""

    if (!existing) {
      passwordForLogin = Math.random().toString(36).slice(-12)

      const signUpRes = await supabase.auth.signUp({
        email: naverUser.email,
        password: passwordForLogin,
        options: {
          data: {
            full_name: naverUser.name ?? null,
            avatar_url: naverUser.profile_image ?? null,
            provider: "naver",
            provider_id: naverUser.id,
          },
        },
      })
      if (signUpRes.error) throw signUpRes.error

      if (signUpRes.data.user) {
        await supabase.from("user_credentials").insert({
          user_id: signUpRes.data.user.id,
          provider: "naver",
          encrypted_password: passwordForLogin,
        })
      }
    } else {
      const { data: cred } = await supabase
        .from("user_credentials")
        .select("encrypted_password")
        .eq("user_id", existing.id)
        .eq("provider", "naver")
        .maybeSingle()

      if (!cred?.encrypted_password) {
        return NextResponse.redirect(
          new URL("/auth/login?error=credentials_missing", request.url)
        )
      }
      passwordForLogin = cred.encrypted_password
    }

    const signInRes = await supabase.auth.signInWithPassword({
      email: naverUser.email,
      password: passwordForLogin,
    })
    if (signInRes.error) throw signInRes.error
    ;(await jar).delete("naverOAuthState")
    return NextResponse.redirect(new URL("/", request.url))
  } catch (e) {
    console.error("네이버 콜백 에러:", e)
    return NextResponse.redirect(
      new URL("/auth/login?error=callback_failed", request.url)
    )
  }
}
