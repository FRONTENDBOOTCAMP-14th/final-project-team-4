"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import type { UserPageComponentsProps } from "@/app/user/[userId]/types"
import Button from "@/components/common/button/button"
import AvatarProfile from "@/components/user/avatar-profile/avatar-profile"
import {
  removeProfileImageUrl,
  removeProfileStorage,
  updateUserInfo,
} from "@/utils/supabase/api/profiles"
import useUserStore from "store/userStore"
import styles from "./user-info-section.module.css"

interface ProfileFormValues {
  username: string
  bio?: string
}

export default function UserInfoSection({
  pageUser,
  isMyPage,
  pageUserOauth,
}: UserPageComponentsProps) {
  const [isEditing, setIsEditing] = useState(false)

  const loggedInUser = useUserStore((state) => state.loggedInUser)
  const updateUserInStore = useUserStore((state) => state.updateUserInStore)

  const displayUser = isMyPage ? loggedInUser : pageUser

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({ defaultValues: displayUser ?? {} })

  if (loggedInUser === undefined) {
    return <p className={styles.myPage}>로딩 중</p>
  }

  switch (pageUserOauth) {
    case "kakao":
      pageUserOauth = "Kakao"
      break
    case "google":
      pageUserOauth = "Google"
      break
    case "email":
      pageUserOauth = "Naver"
      break
  }

  const handleRemoveAvatar = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ): Promise<void> => {
    e.preventDefault()

    try {
      await removeProfileImageUrl(pageUser)
      await removeProfileStorage(pageUser)
      updateUserInStore({ profile_image: null })
    } catch (error) {
      console.error("프로필 사진 삭제 실패: ", error)
    }
  }

  const onSubmit = async (data: ProfileFormValues) => {
    await updateUserInfo(pageUser, data.username, data.bio)
    updateUserInStore({ username: data.username, bio: data.bio })
    reset(data)
    setIsEditing(false)
  }

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditing(true)
    reset({
      username: displayUser?.username,
      bio: displayUser?.bio,
    })
  }

  const handleCancelEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditing(false)
  }

  return (
    <section className={styles.userInfoSection}>
      <div className={styles.userInfoBg}>
        <h3>회원정보</h3>
        <div className={styles.userInfoWrapper}>
          <div className={styles.userProfileImage}>
            <AvatarProfile userData={displayUser} isMyPage={isMyPage} />
            {isMyPage ? (
              <div className={styles.button}>
                <Button
                  onClick={handleRemoveAvatar}
                  className="imageUpload"
                  type="button"
                >
                  이미지 제거
                </Button>
              </div>
            ) : null}
          </div>
          <div className={styles.userInfoContents}>
            <form id="profileForm" onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.userInfoDetails}>
                <div className={styles.userInfoDetail}>
                  <label htmlFor={isEditing ? "username" : undefined}>
                    닉네임:
                  </label>
                  {isEditing ? (
                    <div className={styles.nicknameArea}>
                      <input
                        name="username"
                        id="username"
                        {...register("username", {
                          required: "닉네임을 입력해주세요.",
                          minLength: {
                            value: 1,
                            message: "1자 이상 입력해주세요.",
                          },
                          maxLength: {
                            value: 6,
                            message: "최대 6자까지 가능합니다.",
                          },
                        })}
                        type="text"
                        autoFocus
                      />
                      {errors.username && (
                        <p className={styles.formErrorMessage}>
                          {errors.username.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span>{displayUser.username}</span>
                  )}
                </div>
                <div className={styles.userInfoDetail}>
                  <label htmlFor={isEditing ? "bio" : undefined}>소개:</label>
                  {isEditing ? (
                    <div className={styles.bioArea}>
                      <textarea
                        name="bio"
                        id="bio"
                        {...register("bio", {
                          maxLength: {
                            value: 200,
                            message: "200자 내로 입력해주세요.",
                          },
                        })}
                        rows={3}
                      />
                      {errors.bio && (
                        <p className={styles.formErrorMessage}>
                          {errors.bio.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span>{displayUser.bio}</span>
                  )}
                </div>
                {isMyPage ? (
                  <div className={styles.userInfoDetail}>
                    <label>계정:</label>
                    <span>{pageUserOauth}</span>
                  </div>
                ) : null}
              </div>
            </form>
          </div>
        </div>
        {isMyPage &&
          (isEditing ? (
            <div className={styles.editButtonsWrapper}>
              <Button
                onClick={handleCancelEdit}
                className="imageUpload"
                type="button"
              >
                취소
              </Button>
              <Button
                className="primary"
                type="submit"
                form="profileForm"
                disabled={isSubmitting}
              >
                {isSubmitting ? "저장 중..." : "프로필 저장"}
              </Button>
            </div>
          ) : (
            <div className={styles.button}>
              <Button
                onClick={handleEditClick}
                className="primary"
                type="button"
              >
                프로필 수정
              </Button>
            </div>
          ))}
      </div>
    </section>
  )
}
