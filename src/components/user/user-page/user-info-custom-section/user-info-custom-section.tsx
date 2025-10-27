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

    // DOM의 color-scheme 속성 설정
    document.documentElement.style.colorScheme = theme
    // localStorage에 테마 저장
    localStorage.setItem("theme", theme)

    // CSS 변수 강제 업데이트를 위한 클래스 토글
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(theme)

    // CSS 변수를 직접 설정 (더 확실한 방법)
    const root = document.documentElement
    if (theme === "dark") {
      root.style.setProperty("--surface-bg-main", "#171717")
      root.style.setProperty("--surface-bg-sub", "#3a3a3a")
      root.style.setProperty("--myPage-info-bg", "#232323")
      root.style.setProperty("--shadow-color", "rgba(255 255 255 / 30%)")
      root.style.setProperty("--divider", "#666666")
      root.style.setProperty("--text-color-main", "#f5f5f5")
      root.style.setProperty("--text-color-sub", "#fafafa")
      root.style.setProperty("--text-color-sub2", "#eaeaea")
      root.style.setProperty("--text-color-reverse", "#201e1f")
    } else {
      root.style.setProperty("--surface-bg-main", "#fafafa")
      root.style.setProperty("--surface-bg-sub", "#f5f5f5")
      root.style.setProperty("--myPage-info-bg", "#fff8ec")
      root.style.setProperty("--shadow-color", "rgba(0 0 0 / 10%)")
      root.style.setProperty("--divider", "#d3d3d3")
      root.style.setProperty("--text-color-main", "#201e1f")
      root.style.setProperty("--text-color-sub", "#3a3a3a")
      root.style.setProperty("--text-color-sub2", "#afafaf")
      root.style.setProperty("--text-color-reverse", "#f5f5f5")
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
