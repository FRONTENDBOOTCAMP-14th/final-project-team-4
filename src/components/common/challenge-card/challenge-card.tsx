import Image from "next/image"
import type { Challenge } from "@/types"
import styles from "./challenge-card.module.css"

interface ChallengeCardProps {
  challenge: Challenge
  participantCount?: number
  daysLeft?: number
}

export default function ChallengeCard({
  challenge,
  participantCount = 0,
  daysLeft = 0,
}: ChallengeCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={challenge.thumbnail}
          alt={challenge.title}
          fill
          className={styles.thumbnail}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className={styles.gradient} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{challenge.title}</h3>
        {challenge.tags && challenge.tags.length > 0 && (
          <div className={styles.categoryTags}>
            {challenge.tags.map((tag, index) => (
              <span key={index} className={styles.categoryTag}>
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className={styles.tags}>
          {participantCount > 0 && (
            <span className={styles.tag}>{participantCount}명 참여중</span>
          )}
          {daysLeft > 0 && <span className={styles.tagDay}>{daysLeft}일</span>}
        </div>
        <button className={styles.primaryButton}>참여하기</button>
      </div>
    </article>
  )
}
