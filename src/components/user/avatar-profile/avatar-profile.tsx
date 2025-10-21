"use client"

import { useState } from "react"
import { LucidePen } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import type { User } from "@/types/user"
import {
  updateProfileImage,
  uploadProfilePublicUrl,
  removeProfileStorage,
} from "@/utils/supabase/api/profiles"
import useUserStore from "store/userStore"
import Avatar from "../avatar/avatar"
import styles from "./avatar-profile.module.css"

interface AvatarProfileProps {
  userData: User
}

const userFallbackImage = "/fallback/fallback-user.png"

export default function AvatarProfile({ userData }: AvatarProfileProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const updateProfileImageInStore = useUserStore(
    (state) => state.updateProfileImage
  )
  const imageUrl = useUserStore((state) => state.loggedInUser?.profile_image)

  let safeImageUrl: string

  if (!imageUrl) {
    safeImageUrl = userFallbackImage
  } else if (imageUrl.startsWith("http:")) {
    safeImageUrl = imageUrl.replace(/^http:/, "https:")
  } else {
    safeImageUrl = imageUrl
  }

  const handleUploadAvatar = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (isSubmitting || !userData) return

    const file = e.target.files?.[0]
    if (!file) return

    if (userData.profile_image) {
      await removeProfileStorage(userData)
    }

    try {
      setIsSubmitting(true)
      const fileExt = file.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `${userData.id}/${fileName}`

      const publicUrl = await updateProfileImage(filePath, file)

      await uploadProfilePublicUrl(userData, publicUrl)

      updateProfileImageInStore(publicUrl)
    } catch (error) {
      console.error("프로필 사진 수정 실패: ", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.avatarImageContainer}>
      <Avatar imageUrl={safeImageUrl} responsive="profileSizes" altText="" />
      <label htmlFor="profilePicture" aria-label="프로필 사진 업데이트">
        <span className={styles.updateButton} tabIndex={0}>
          <LucidePen className={styles.editIcon} aria-hidden="true" />
        </span>
      </label>
      <input
        type="file"
        id="profilePicture"
        className={styles.input}
        onChange={handleUploadAvatar}
        accept="image/png, image/jpeg, image/jpg"
      />
    </div>
  )
}
