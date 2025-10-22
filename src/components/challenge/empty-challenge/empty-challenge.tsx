import styles from "./empty-challenge.module.css"

interface EmptyChallengeProps {
  keyword?: string
  challengeType?: string
  onCreateClick?: () => void
}

export default function EmptyChallenge({
  keyword,
  challengeType = "글쓰기 인증",
  onCreateClick,
}: EmptyChallengeProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          아직 {keyword ? `"${keyword}"와` : ""} 관련된 {challengeType} 챌린지는
          없어요!
        </h2>
        <p className={styles.description}>
          생성하기를 눌러 지금 바로 챌린지에 도전해보세요!
        </p>
        <button
          type="button"
          className={styles.createButton}
          onClick={onCreateClick}
        >
          생성하기
        </button>
      </div>
    </div>
  )
}
