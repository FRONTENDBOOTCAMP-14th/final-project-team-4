import { NextResponse, type NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const origin = req.nextUrl.origin
    const redirectUri = `${origin}/auth/callback/naver`

    const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID
    if (!clientId) {
      return NextResponse.redirect(
        new URL("/auth/login?error=missing_client_id", req.url)
      )
    }

    const state = crypto.randomUUID()

    const authUrl = new URL("https://nid.naver.com/oauth2.0/authorize")
    authUrl.search = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
    }).toString()

    const res = NextResponse.redirect(authUrl.toString())

    res.cookies.set({
      name: "naverOAuthState",
      value: state,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? ".minimo-project.vercel.app"
          : undefined,
      maxAge: 60 * 5,
    })

    return res
  } catch (e) {
    console.error("[NAVER LOGIN START ERROR]", e)
    return NextResponse.redirect(
      new URL("/auth/login?error=start_failed", req.url)
    )
  }
}
