import CreateForm from "./create-form"
import styles from "./page.module.css"

export default function ChallengeCreatePage() {
  return (
    <main className={styles.pageWrapper}>
      <h1 className="sr-only">챌린지 생성하기</h1>
      <CreateForm />
    </main>
  )
}
