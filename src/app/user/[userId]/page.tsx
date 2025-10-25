"use client"

import {
  UserInfoSection,
  UserInfoCustomSection,
  UserStaticsSection,
  UserChallengesSection,
  UserAccountSection,
} from "@/components/user/user-page/index"
import useUserStore from "store/userStore"
import styles from "./page.module.css"

export default function UserPage() {
  const loggedInUser = useUserStore((state) => state.loggedInUser)

  if (loggedInUser === undefined) {
    return <main className={styles.myPage}>로딩 중</main>
  } else if (loggedInUser === null) {
    return <main className={styles.myPage}>로그인 하세요</main>
  }

  // let userPublicStatus = loggedInUser.is_public
  // 추후 본인 페이지/다른 유저 페이지 로직 추가 예정

  return (
    <main className={styles.myPage}>
      <h2 className="sr-only">{} 페이지</h2>
      <UserInfoSection />
      <UserInfoCustomSection />
      <UserStaticsSection />
      <UserChallengesSection />
      <UserAccountSection />
    </main>
  )
}
