"use client"

import { useEffect, useState } from "react"
import type { UserPageComponentsProps } from "@/app/user/[userId]/types"
import ToggleSwitch from "@/components/common/toggle-switch/toggle-switch"
import { updateUserPublicStatus } from "@/utils/supabase/api/profiles"
import useUserStore from "store/userStore"
import styles from "./user-info-custom-section.module.css"

export default function UserInfoCustomSection({
  pageUser,
  isMyPage,
}: UserPageComponentsProps) {
  const updateUserInStore = useUserStore((state) => state.updateUserInStore)

  const [isPublic, setIsPublic] = useState(pageUser.is_public)
  const [isLightTheme, setIsLightTheme] = useState(true)

  const handleUserPublicStatus = async (checked: boolean) => {
    if (!isMyPage) return

    try {
      await updateUserPublicStatus(pageUser, checked)
      updateUserInStore({ is_public: isPublic })
      setIsPublic(checked)
    } catch (error) {
      console.error("계정 공개 상태 변경 실패: ", error)
    }
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme === "light" || savedTheme === "dark") {
      setIsLightTheme(savedTheme === "light")
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
      setIsLightTheme(!prefersDark)
    }
  }, [])

  const handleThemeChange = (checked: boolean) => {
    if (!isMyPage) return
    const theme = checked ? "light" : "dark"
    setIsLightTheme(checked)
    document.documentElement.style.colorScheme = theme
    localStorage.setItem("theme", theme)
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
            name="theme"
            onLabel="라이트 모드"
            offLabel="다크 모드"
            checked={isLightTheme}
            onChange={handleThemeChange}
          />
        </div>
      </div>
    </section>
  )
}
