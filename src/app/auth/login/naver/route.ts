// app/api/auth/naver/login-url/route.ts
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getNaverLoginUrl } from "@/lib/auth/naver-auth"

export async function GET() {
  try {
    // 선생님 유틸로 로그인 URL 생성 (URL 안에 state 포함됨)
    const url = getNaverLoginUrl()

    // URL에서 state 추출
    const parsed = new URL(url)
    const state = parsed.searchParams.get("state") || ""

    // 쿠키에 동일한 state 저장 (콜백에서 검증용)
    const jar = await cookies()
    jar.set("naverOAuthState", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10, // 10분
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
