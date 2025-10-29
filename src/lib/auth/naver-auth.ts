const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID
const NAVER_REDIRECT_URI = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI

interface NaverUserResponse {
  resultcode: string
  message: string
  response: {
    id: string
    email: string
    name: string
    profile_image?: string
  }
}

export const getNaverLoginUrl = (): string => {
  const state = Math.random().toString(36).substring(2, 15)

  if (typeof window !== "undefined") {
    sessionStorage.setItem("naverOAuthState", state)
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: NAVER_CLIENT_ID,
    redirect_uri: NAVER_REDIRECT_URI,
    state,
  })

  return `https://nid.naver.com/oauth2.0/authorize?${params.toString()}`
}

export async function getNaverTokenServerSide(code: string, state: string) {
  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID
  const clientSecret = process.env.NAVER_CLIENT_SECRET
  const redirectUri = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback/naver`
    : "http://localhost:3000/auth/callback/naver"

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    code,
    state,
    redirect_uri: redirectUri,
  })

  const response = await fetch(`https://nid.naver.com/oauth2.0/token?${params}`)
  const json = await response.json()

  if (!response.ok || json.error) {
    throw new Error(
      `네이버 토큰 교환 실패: ${json.error ?? "unknown"} - ${
        json.error_description ?? ""
      }`
    )
  }

  return json
}

export const getNaverUserInfoServerSide = async (
  accessToken: string
): Promise<NaverUserResponse> => {
  const response = await fetch("https://openapi.naver.com/v1/nid/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  const json = await response.json()

  if (!response.ok || json.resultcode !== "00") {
    throw new Error(
      `사용자 정보 가져오기에 실패했습니다. (HTTP ${response.status}) ${json.message ?? ""}`
    )
  }

  return json
}
