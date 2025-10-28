import LoadingSpinner from "@/components/common/loading-spinner/loading-spinner"
import styles from "./page.module.css"

export default function SearchLoading() {
  return (
    <div className={styles.pageWrapper}>
      <main className={styles.main}>
        <LoadingSpinner message="검색 결과를 불러오는 중..." fullScreen />
      </main>
    </div>
  )
}
