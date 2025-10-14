import ChallengeCard from "@/components/common/challenge-card/challenge-card"
import type { Challenge } from "@/types"
import styles from "./ranked-challenge-card.module.css"

interface RankedChallengeCardProps {
  challenge: Challenge
  rank: number
  participantCount?: number
  daysLeft?: number
}

export default function RankedChallengeCard({
  challenge,
  rank,
  participantCount = 0,
  daysLeft = 0,
}: RankedChallengeCardProps) {
  return (
    <div className={styles.cardWrapper}>
      <span className={styles.rankBadge}>{rank}</span>
      <div className={styles.cardContent}>
        <ChallengeCard
          challenge={challenge}
          participantCount={participantCount}
          daysLeft={daysLeft}
        />
      </div>
    </div>
  )
}
