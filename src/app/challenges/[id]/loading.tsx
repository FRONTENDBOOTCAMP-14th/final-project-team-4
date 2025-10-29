import LoadingSpinner from "@/components/common/loading-spinner/loading-spinner"
import styles from "./page.module.css"

export default function ChallengeDetailLoading() {
  return (
    <div className={styles.main}>
      <div className={styles.loading}>
        <LoadingSpinner message="챌린지 정보를 불러오는 중..." fullScreen />
      </div>
    </div>
  )
}
