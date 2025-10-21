import CreateForm from "./create-form"
import styles from "./page.module.css"
export default function ChallengeCreate() {
  return (
    <div className={styles.pageWrapper}>
      <h1 className="sr-only">챌린지 리스트 생성하기</h1>
      <CreateForm />
    </div>
  )
}
