import LoadingSpinner from "@/components/common/loading-spinner/loading-spinner"
import styles from "./page.module.css"

export default function RootLoading() {
  return (
    <div className={styles.pageWrapper}>
      <main className={styles.main}>
        <LoadingSpinner message="페이지를 불러오는 중..." fullScreen />
      </main>
    </div>
  )
}
