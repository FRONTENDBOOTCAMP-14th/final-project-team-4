"use server"

import { redirect } from "next/navigation"
import unlinkKakaoAuth from "@/app/auth/delete/kakao/actions"
import { createClient } from "@/utils/supabase/server"

export async function handleDeleteAccount() {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error("사용자를 찾을 수 없습니다.")
    }

    const userAuthData = await findUserAuthData()
    try {
      const userAuthProvider = userAuthData.authProvider

      switch (userAuthProvider) {
        case "kakao":
          await unlinkKakaoAuth(userAuthData)
          break
        // 구글 auth 연결 해제 구현 후 사용
        // case "google":
        //   await unlinkGoogleAuth()
        //   break
        // 애플 auth 연결 해제 구현 후 사용
        // case "apple":
        //   await unlinkAppleAuth()
        //   break
      }
    } catch (error) {
      console.error("회원 Auth data 조회 오류:", error)
    }

    // ----------------------------------
    // 사용자 관련 데이터 삭제 코드 추후 추가
    // ----------------------------------

    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)

    if (deleteError) {
      throw new Error(`회원 계정 Supabse 삭제 오류: ${deleteError.message}`)
    }

    await supabase.auth.signOut()
  } catch (error) {
    console.error("회원 탈퇴 오류: ", error)
    return { success: false, error }
  }
  redirect("/auth/login")
}

export async function findUserAuthData() {
  const supabase = await createClient()
  try {
    const {
      data: { identities },
      error,
    } = await supabase.auth.getUserIdentities()

    if (error || !identities || identities.length === 0) {
      throw new Error("연동된 소셜 계정을 찾을 수 없습니다.")
    }

    if (identities && identities.length > 0) {
      for (const identity of identities) {
        const userAuthData = {
          authProvider: identity.provider,
          authId: identity.identity_data.sub,
        }
        return userAuthData
      }
    }
  } catch (error) {
    console.error("회원 연결 해제 오류:", error)
    throw error
  }
}
