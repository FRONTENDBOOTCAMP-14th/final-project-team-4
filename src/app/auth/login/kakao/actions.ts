import browserClient from "@/utils/supabase/client"

export default async function handleKakaoLogin() {
  const supabase = browserClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      // 콜백 루트(OAuth 인증 후 돌아오는 주소)
      redirectTo: `http://localhost:3000/auth/callback`,
      queryParams: {
        scope: "profile_nickname profile_image",
      },
    },
  })

  if (error) {
    console.error("카카오 로그인 에러", error.message)
  }

  return data
}
