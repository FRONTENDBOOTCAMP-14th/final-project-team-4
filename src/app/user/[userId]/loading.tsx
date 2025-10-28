import LoadingSpinner from "@/components/common/loading-spinner/loading-spinner"
import styles from "./page.module.css"

export default function UserPageLoading() {
  return (
    <main className={styles.myPage}>
      <LoadingSpinner message="사용자 정보를 불러오는 중..." fullScreen />
    </main>
  )
}
