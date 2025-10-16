import type UserAuthData from "@/app/auth/types"

export default async function unlinkKakaoAuth(userAuthData: UserAuthData) {
  const adminKey = process.env.KAKAO_ADMIN_KEY

  const userAuthId = userAuthData.authId
  try {
    const response = await fetch("https://kapi.kakao.com/v1/user/unlink", {
      method: "POST",
      headers: {
        Authorization: `KakaoAK ${adminKey}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: new URLSearchParams({
        target_id_type: "user_id",
        target_id: userAuthId,
      }).toString(),
    })

    if (!response.ok) throw new Error("카카오 연결 해제 오류")
  } catch (error) {
    console.error("카카오 연결 해제 오류:", error)
    throw error
  }
}
