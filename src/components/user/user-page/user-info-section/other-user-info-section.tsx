"use client"

import type { UserPageComponentsProps } from "@/app/user/[userId]/types"
import AvatarProfile from "@/components/user/avatar-profile/avatar-profile"
import styles from "./other-user-info-section.module.css"

export default function OtherUserInfoSection({
  pageUser,
  isMyPage,
}: UserPageComponentsProps) {
  return (
    <section className={styles.userInfoSection}>
      <div className={styles.userInfoBg}>
        <h3>회원정보</h3>
        <div className={styles.userInfoWrapper}>
          <div className={styles.userProfileImage}>
            <AvatarProfile userData={pageUser} isMyPage={isMyPage} />
          </div>
          <div className={styles.userInfoDetails}>
            <div className={styles.userInfoDetail}>
              <label className="sr-only">닉네임</label>
              <span className={styles.userInfoName}>{pageUser.username}</span>
            </div>
            <div className={styles.userInfoDetail}>
              <label className="sr-only">소개</label>
              <span className={styles.userInfoBio}>{pageUser.bio}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
