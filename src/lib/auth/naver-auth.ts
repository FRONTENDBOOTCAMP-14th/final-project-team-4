/* eslint-disable @typescript-eslint/no-explicit-any */
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID
const NAVER_REDIRECT_URI = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI

interface NaverTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

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

export const getNaverTokenServerSide = async (
  code: string,
  state: string
): Promise<NaverTokenResponse> => {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.NAVER_CLIENT_ID,
    client_secret: process.env.NAVER_CLIENT_SECRET,
    code,
    state,
  })

  const response = await fetch("https://nid.naver.com/oauth2.0/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })

  const text = await response.text()
  let json: any
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error(`네이버 토큰 응답 파싱 실패: ${text}`)
  }

  if (!response.ok || json.error) {
    throw new Error(
      `네이버 토큰 교환 실패: ${json.error ?? "unknown"} - ${json.error_description ?? ""}`
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
