import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getNaverLoginUrl } from "@/lib/auth/naver-auth"

export async function GET() {
  try {
    let url = getNaverLoginUrl()

    const u = new URL(url)

    u.searchParams.set("scope", "name email profile_image")
    url = u.toString()

    const jar = cookies()
    const state = u.searchParams.get("state") || ""
    ;(await jar).set("naverOAuthState", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10,
    })

    return NextResponse.json({ url })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: "네이버 로그인 URL 생성 실패" },
      { status: 500 }
    )
  }
}
