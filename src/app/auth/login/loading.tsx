import LoadingSpinner from "@/components/common/loading-spinner/loading-spinner"
import styles from "./page.module.css"

export default function LoginLoading() {
  return (
    <main className={styles.loginPageContainer}>
      <section className={styles.loginSection}>
        <div className={styles.loginPageContents}>
          <LoadingSpinner message="로그인 페이지를 불러오는 중..." fullScreen />
        </div>
      </section>
    </main>
  )
}
