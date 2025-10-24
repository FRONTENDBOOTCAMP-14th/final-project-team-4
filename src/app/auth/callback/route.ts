import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  let next = searchParams.get("next") ?? "/"
  if (!next.startsWith("/")) {
    next = "/"
  }

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const userData = data.user

      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", userData.id)
        .single()

      if (!existingUser) {
        const { error: userDataInsertError } = await supabase
          .from("users")
          .insert({
            id: userData.id,
            username: userData.user_metadata.full_name,
            profile_image: userData.user_metadata.avatar_url ?? null,
          })
          .select()
          .single()

        if (userDataInsertError) {
          console.error("Users 테이블 INSERT 오류: ", userDataInsertError)
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
