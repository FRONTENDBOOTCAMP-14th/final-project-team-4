"use client"

import { useState } from "react"
import { LucidePen } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import {
  updateProfileImage,
  uploadProfilePublicUrl,
  removeProfileStorage,
} from "@/utils/supabase/api/profiles"
import type { Database } from "@/utils/supabase/database.types"
import useUserStore from "store/userStore"
import Avatar from "../avatar/avatar"
import styles from "./avatar-profile.module.css"

export type User = Database["public"]["Tables"]["users"]["Row"]

interface AvatarProfileProps {
  userData: User
  isMyPage: boolean
}

export default function AvatarProfile({
  userData,
  isMyPage,
}: AvatarProfileProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const updateUserInStore = useUserStore((state) => state.updateUserInStore)
  const imageUrl = userData.profile_image

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

      updateUserInStore({ profile_image: publicUrl })
    } catch (error) {
      console.error("프로필 사진 수정 실패: ", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.avatarImageContainer}>
      <Avatar imageUrl={imageUrl} responsive="profileSizes" altText="" />
      {isMyPage ? (
        <>
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
        </>
      ) : null}
    </div>
  )
}
