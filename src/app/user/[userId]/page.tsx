import {
  UserInfoSection,
  UserInfoCustomSection,
  UserStaticsSection,
  UserChallengesSection,
  UserAccountSection,
} from "@/components/user/user-page/index"
import styles from "./page.module.css"

export default function UserPage() {
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
