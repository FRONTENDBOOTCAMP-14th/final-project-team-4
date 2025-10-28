import LoadingSpinner from "@/components/common/loading-spinner/loading-spinner"
import styles from "./page.module.css"

export default function ChallengesLoading() {
  return (
    <div className={styles.pageWrapper}>
      <main className={styles.main}>
        <LoadingSpinner message="챌린지 목록을 불러오는 중..." fullScreen />
      </main>
    </div>
  )
}
