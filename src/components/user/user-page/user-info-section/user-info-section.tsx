"use client"

import { useState } from "react"
import Button from "@/components/common/button/button"
import AvatarProfile from "@/components/user/avatar-profile/avatar-profile"
import {
  removeProfileImageUrl,
  removeProfileStorage,
} from "@/utils/supabase/api/profiles"
import useUserStore from "store/userStore"
import styles from "./user-info-section.module.css"

const initialProfile = {
  nickname: "홍길동",
  bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, temporibus alias ullam a dicta molestiae expedita veritatis nostrum earum sapiente praesentium? Fugiat eum commodi pariatur fuga delectus at minus voluptate?",
  oauthCompany: "카카오",
}

export default function UserInfoSection() {
  const [isEditing, setIsEditing] = useState(false)
  // const [isEditing, setIsEditing] = useState(true)

  const updateProfileImageInStore = useUserStore(
    (state) => state.updateProfileImage
  )
  const loggedInUser = useUserStore((state) => state.loggedInUser)

  if (loggedInUser === undefined) {
    return <p>로딩 중</p>
  } else if (loggedInUser === null) {
    return <p>로그인 하세요</p>
  }

  const handleRemoveAvatar = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ): Promise<void> => {
    e.preventDefault()

    try {
      await removeProfileImageUrl(loggedInUser)
      await removeProfileStorage(loggedInUser)
      updateProfileImageInStore(null)
    } catch (error) {
      console.error("프로필 사진 삭제 실패: ", error)
    }
  }

  return (
    <section className={styles.userInfoSection}>
      <div className={styles.userInfoBg}>
        <h3>회원정보</h3>
        <div className={styles.userInfoWrapper}>
          <div className={styles.userProfileImage}>
            <AvatarProfile userData={loggedInUser} />
            <div className={styles.button}>
              <Button
                onClick={handleRemoveAvatar}
                className="imageUpload"
                type="button"
              >
                이미지 제거
              </Button>
            </div>
          </div>
          <div className={styles.userInfoContents}>
            <form action="">
              <div className={styles.userInfoDetails}>
                <div className={styles.userInfoDetail}>
                  <label htmlFor="nickname">닉네임:</label>
                  {isEditing ? (
                    <input
                      name="nickname"
                      id="nickname"
                      defaultValue={initialProfile.nickname}
                      minLength={1}
                      maxLength={14}
                      type="text"
                      autoFocus
                      required
                    />
                  ) : (
                    <span>{initialProfile.nickname}</span>
                  )}
                </div>
                <div className={styles.userInfoDetail}>
                  <label htmlFor="bio">소개:</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      id="bio"
                      defaultValue={initialProfile.bio}
                      maxLength={400}
                      rows={3}
                    />
                  ) : (
                    <span>{initialProfile.bio}</span>
                  )}
                </div>
                <div className={styles.userInfoDetail}>
                  <label>계정:</label>
                  <span>{initialProfile.oauthCompany}</span>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className={styles.button}>
          <Button className="primary" type="submit">
            {isEditing ? "프로필 저장" : "프로필 수정"}
          </Button>
        </div>
      </div>
    </section>
  )
}
