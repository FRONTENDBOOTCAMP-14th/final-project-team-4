import type { Database } from "@/utils/supabase/database.types"
import browserClient from "../client"

export type User = Database["public"]["Tables"]["users"]["Row"]

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
    const errorMessage = `프로필 이미지 업로드 실패: ${updateProfileImageError.message}`
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

// Profiles 스토리지의 기존 프로필 사진 삭제
export const removeProfileStorage = async (userData: User): Promise<void> => {
  const supabase = browserClient()
  const oldProfileImage = userData.profile_image

  if (oldProfileImage) {
    const oldFileName = oldProfileImage.split("/").pop()
    if (oldFileName) {
      const oldFilePath = `${userData.id}/${oldFileName}`
      const { error: removeProfileStorageError } = await supabase.storage
        .from("profiles")
        .remove([oldFilePath])
      if (removeProfileStorageError) {
        const errorMessage = `스토리지 프로필 이미지 삭제 오류: ${removeProfileStorageError.message}`
        throw new Error(errorMessage)
      }
    }
  }
}

// Users 테이블의 profile_image URL 삭제
export const removeProfileImageUrl = async (userData: User): Promise<void> => {
  const supabase = browserClient()
  const { error: removeProfileImageUrlError } = await supabase
    .from("users")
    .update({ profile_image: null })
    .eq("id", userData.id)

  if (removeProfileImageUrlError) {
    const errorMessage = `스토리지에서 이미지 삭제 오류: ${removeProfileImageUrlError.message}`
    throw new Error(errorMessage)
  }
}

// Users 테이블의 username, bio 업데이트
export const updateUserInfo = async (
  userData: User,
  newNickname: User["username"],
  newBio?: User["bio"]
): Promise<void> => {
  const supabase = browserClient()

  const { error: updateUserProfileError } = await supabase
    .from("users")
    .update({ username: newNickname, bio: newBio })
    .eq("id", userData.id)

  if (updateUserProfileError) {
    const errorMessage = `프로필 정보 저장 실패 :${updateUserProfileError.message}`
    throw new Error(errorMessage)
  }
}

// Users 테이블의 is_public 업데이트
export const updateUserPublicStatus = async (
  userData: User,
  isPublic: boolean
): Promise<void> => {
  const supabase = browserClient()

  const { error: updateUserPublicStatusError } = await supabase
    .from("users")
    .update({ is_public: isPublic })
    .eq("id", userData.id)

  if (updateUserPublicStatusError) {
    const errorMessage = `계정 공개 상태 DB 업데이트 실패 :${updateUserPublicStatusError.message}`
    throw new Error(errorMessage)
  }
}
