"use client"

import { useState } from "react"
import ToggleSwitch from "@/components/common/toggle-switch/toggle-switch"
import { updateUserPublicStatus } from "@/utils/supabase/api/profiles"
import useUserStore from "store/userStore"
import styles from "./user-info-custom-section.module.css"

export default function UserInfoCustomSection() {
  const loggedInUser = useUserStore((state) => state.loggedInUser)
  const updateUserInStore = useUserStore((state) => state.updateUserInStore)

  const [isPublic, setIsPublic] = useState(loggedInUser.is_public)

  const handleUserPublicStatus = async (checked: boolean) => {
    try {
      await updateUserPublicStatus(loggedInUser, checked)
      updateUserInStore({ is_public: isPublic })
      setIsPublic(checked)
    } catch (error) {
      console.error("계정 공개 상태 변경 실패: ", error)
    }
  }

  return (
    <section className={styles.userInfoCustomSection}>
      <h3>개인 맞춤 설정</h3>
      <div className={styles.toggleContainer}>
        <div className={styles.toggle}>
          <span>계정 공개</span>
          <ToggleSwitch
            name="private"
            onLabel="공개"
            offLabel="비공개"
            checked={isPublic}
            onChange={handleUserPublicStatus}
          />
        </div>
        <div className={styles.toggle}>
          <span>테마 설정</span>
          <ToggleSwitch
            name="private"
            onLabel="라이트 모드"
            offLabel="다크 모드"
          />
        </div>
      </div>
    </section>
  )
}
