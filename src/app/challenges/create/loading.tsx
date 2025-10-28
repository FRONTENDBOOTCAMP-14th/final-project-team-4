import LoadingSpinner from "@/components/common/loading-spinner/loading-spinner"
import styles from "./page.module.css"

export default function CreateLoading() {
  return (
    <main className={styles.pageWrapper}>
      <LoadingSpinner
        message="챌린지 생성 페이지를 불러오는 중..."
        fullScreen
      />
    </main>
  )
}
