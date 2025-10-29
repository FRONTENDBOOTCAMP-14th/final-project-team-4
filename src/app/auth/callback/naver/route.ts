import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import {
  getNaverTokenServerSide,
  getNaverUserInfoServerSide,
} from "@/lib/auth/naver-auth"
import type { Database } from "@/utils/supabase/database.types"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const nextParam = url.searchParams.get("next") || "/"

  const safeNext = nextParam.startsWith("/") ? nextParam : "/"
  const location = new URL(safeNext, request.url)

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/auth/login?error=missing_params", request.url)
    )
  }

  const jar = await cookies()

  const res = NextResponse.redirect(location)

  try {
    const savedState = jar.get("naverOAuthState")?.value
    if (state !== savedState) {
      return NextResponse.redirect(
        new URL("/auth/login?error=invalid_state", request.url)
      )
    }

    const tokenData = await getNaverTokenServerSide(code, state)
    if (!tokenData?.access_token) {
      return NextResponse.redirect(
        new URL("/auth/login?error=token_exchange_failed", request.url)
      )
    }

    const profile = await getNaverUserInfoServerSide(tokenData.access_token)
    const naverUser = profile?.response
    if (!naverUser?.email) {
      return NextResponse.redirect(
        new URL("/auth/login?error=no_email", request.url)
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceKey) {
      console.error("❌ ENV MISSING:", {
        NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
        SUPABASE_SERVICE_ROLE_KEY: !!serviceKey,
      })
      return NextResponse.redirect(
        new URL("/auth/login?error=supabase_env_missing", request.url)
      )
    }

    const supabase = createServerClient<Database>(supabaseUrl, serviceKey, {
      cookies: {
        get(name: string) {
          return jar.get(name)?.value ?? null
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: "", ...options, maxAge: 0 })
        },
      },
    })
    const { data: existing, error: existingError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", naverUser.email)
      .maybeSingle()
    if (existingError) {
      console.error("users select error:", existingError)
      return NextResponse.redirect(
        new URL("/auth/login?error=db_select_failed", request.url)
      )
    }

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
      if (signUpRes.error) {
        console.error("auth.signUp error:", signUpRes.error)
        return NextResponse.redirect(
          new URL("/auth/login?error=signup_failed", request.url)
        )
      }

      if (signUpRes.data.user) {
        const { error: credInsErr } = await supabase
          .from("user_credentials")
          .insert({
            user_id: signUpRes.data.user.id,
            provider: "naver",
            encrypted_password: passwordForLogin,
          })
        if (credInsErr) {
          console.error("user_credentials insert error:", credInsErr)
          return NextResponse.redirect(
            new URL("/auth/login?error=cred_insert_failed", request.url)
          )
        }
      }
    } else {
      const { data: cred, error: credError } = await supabase
        .from("user_credentials")
        .select("encrypted_password")
        .eq("user_id", existing.id)
        .eq("provider", "naver")
        .maybeSingle()
      if (credError) {
        console.error("credential select error:", credError)
        return NextResponse.redirect(
          new URL("/auth/login?error=cred_select_failed", request.url)
        )
      }

      if (!cred?.encrypted_password) {
        passwordForLogin = Math.random().toString(36).slice(-12)

        const { error: credInsertErr } = await supabase
          .from("user_credentials")
          .insert({
            user_id: existing.id,
            provider: "naver",
            encrypted_password: passwordForLogin,
          })
        if (credInsertErr) {
          console.error("credential insert error:", credInsertErr)
          return NextResponse.redirect(
            new URL("/auth/login?error=cred_insert_failed", request.url)
          )
        }

        const { error: pwErr } = await supabase.auth.admin.updateUserById(
          existing.id,
          { password: passwordForLogin }
        )
        if (pwErr) {
          console.error("admin.updateUserById error:", pwErr)
          return NextResponse.redirect(
            new URL("/auth/login?error=admin_pw_update_failed", request.url)
          )
        }
      } else {
        passwordForLogin = cred.encrypted_password
      }
    }

    const signInRes = await supabase.auth.signInWithPassword({
      email: naverUser.email,
      password: passwordForLogin,
    })
    if (signInRes.error) {
      console.error("signIn error:", signInRes.error)
      return NextResponse.redirect(
        new URL("/auth/login?error=invalid_credentials", request.url)
      )
    }

    res.cookies.set({
      name: "naverOAuthState",
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? ".minimo-project.vercel.app"
          : undefined,
      maxAge: 0,
    })

    return res
  } catch (error) {
    console.error("[NAVER CALLBACK ERROR]", error)
    return NextResponse.redirect(
      new URL("/auth/login?error=callback_failed", request.url)
    )
  }
}
