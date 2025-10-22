// src/app/auth/callback/naver/route.ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  getNaverTokenServerSide,
  getNaverUserInfoServerSide,
} from "@/lib/auth/naver-auth"
import type { Database } from "@/types/supabase"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  // 1) 쿼리 파라미터에서 code/state 추출
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/auth/login?error=missing_params", request.url)
    )
  }

  try {
    // 2) state 검증
    const jar = await cookies()
    const savedState = jar.get("naverOAuthState")?.value
    if (state !== savedState) {
      return NextResponse.redirect(
        new URL("/auth/login?error=invalid_state", request.url)
      )
    }

    // 3) 토큰 교환 및 사용자 정보 조회
    const tokenData = await getNaverTokenServerSide(code, state)

    const userData = await getNaverUserInfoServerSide(tokenData.access_token)
    const naverUser = userData.response
    if (!naverUser?.email) {
      return NextResponse.redirect(
        new URL("/auth/login?error=no_email", request.url)
      )
    }

    // 4) 서버용 Supabase 클라이언트 (쿠키 연동)
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (name: string) => jar.get(name)?.value,
          set: (name: string, value: string, options: any) =>
            jar.set({ name, value, ...options }),
          remove: (name: string, options: any) =>
            jar.set({ name, value: "", ...options }),
        },
      }
    )

    // 5) 존재 여부 확인 후 가입/로그인
    const { data: existing } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", naverUser.email)
      .maybeSingle()

    let passwordForLogin = ""

    if (!existing) {
      // 신규 가입 (데모용 랜덤 비번 — 운영에선 해시)
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
          encrypted_password: passwordForLogin, // 운영은 해시로 저장
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

    // 6) 세션 발급
    const signInRes = await supabase.auth.signInWithPassword({
      email: naverUser.email,
      password: passwordForLogin,
    })
    if (signInRes.error) throw signInRes.error

    // 7) 정리 후 랜딩
    jar.delete("naverOAuthState")
    return NextResponse.redirect(new URL("/", request.url))
  } catch (err: any) {
    console.error("네이버 콜백 에러:", err)
    const msg =
      typeof err?.message === "string" ? err.message : "callback_failed"
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(msg)}`, request.url)
    )
  }
}
