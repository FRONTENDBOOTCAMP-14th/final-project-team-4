import LoadingSpinner from "@/components/common/loading-spinner/loading-spinner"
import styles from "./page.module.css"

export default function ChallengeDetailLoading() {
  return (
    <div className={styles.main}>
      <div className={styles.thumbnailWrapper}>
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "40%",
            backgroundColor: "var(--surface-bg-sub)",
            borderRadius: "1rem",
            overflow: "hidden",
          }}
        />
      </div>
      <div className={styles.contentWrapper}>
        <LoadingSpinner message="챌린지 정보를 불러오는 중..." fullScreen />
      </div>
    </div>
  )
}
