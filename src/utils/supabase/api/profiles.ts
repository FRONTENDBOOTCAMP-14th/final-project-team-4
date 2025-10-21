import type { User } from "@/types/user"
import browserClient from "../client"

// Profiles 스토리지에 이미지 저장
export const updateProfileImage = async (
  filePath: string,
  selectedFile: File
): Promise<string> => {
  const supabase = browserClient()

  const { error: updateProfileImageError } = await supabase.storage
    .from("profiles")
    .upload(filePath, selectedFile, {
      upsert: true,
    })

  const { data } = supabase.storage.from("profiles").getPublicUrl(filePath)
  const { publicUrl } = data

  if (updateProfileImageError) {
    const errorMessage = `프로필 이미지 업로드 실패 :${updateProfileImage}`
    throw new Error(errorMessage)
  }

  return publicUrl
}

// Users 테이블 profile_image에 URL 저장
export const uploadProfilePublicUrl = async (
  userData: User,
  publicUrl: User["profile_image"]
): Promise<void> => {
  const supabase = browserClient()

  const { error: uploadProfilePublicUrlError } = await supabase
    .from("users")
    .update({ profile_image: publicUrl })
    .eq("id", userData.id)

  if (uploadProfilePublicUrlError) {
    const errorMessage = `프로필 이미지 URL 저장 실패 :${uploadProfilePublicUrlError.message}`
    throw new Error(errorMessage)
  }
}
