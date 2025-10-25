import browserClient from "@/utils/supabase/client"

export default async function handleKakaoLogin() {
  const supabase = browserClient()

  const redirectUrl =
    process.env.NODE_ENV === "production"
      ? "https://final-project-team-4-ruby.vercel.app/auth/callback"
      : "http://localhost:3000/auth/callback"

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      // 콜백 루트(OAuth 인증 후 돌아오는 주소)
      redirectTo: redirectUrl,
      queryParams: {
        scope: "profile_nickname profile_image",
      },
    },
  })

  if (error) {
    console.error("카카오 로그인 에러", error.message)
  }
}
