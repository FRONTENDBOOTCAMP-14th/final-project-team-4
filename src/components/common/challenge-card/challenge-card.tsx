"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { Challenge } from "@/utils/supabase"
import type { ChallengeWithOwner } from "@/utils/supabase/api/search"
import useUserStore from "store/userStore"
import styles from "./challenge-card.module.css"

interface ChallengeCardProps {
  challenge: Challenge | ChallengeWithOwner
  participantCount?: number
  daysLeft?: number
}

export default function ChallengeCard({
  challenge,
  participantCount = 0,
  daysLeft = 0,
}: ChallengeCardProps) {
  const router = useRouter()
  const { loggedInUser } = useUserStore()
  const [isJoining, setIsJoining] = useState(false)

  const handleCardClick = () => {
    router.push(`/challenges/${challenge.id}`)
  }

  const handleJoinClick = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!loggedInUser) {
      alert("로그인이 필요합니다.")
      router.push("/auth/login")
      return
    }

    if (isJoining) return

    setIsJoining(true)
    try {
      // TODO: 챌린지 참여 API 호출
      // await joinChallenge(challenge.id)
      router.push(`/challenges/${challenge.id}`)
    } catch (error) {
      console.error("챌린지 참여 실패:", error)
      alert("챌린지 참여에 실패했습니다.")
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <article className={styles.card} onClick={handleCardClick}>
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
                {tag}
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
        <button
          className={styles.primaryButton}
          onClick={handleJoinClick}
          disabled={isJoining}
        >
          {isJoining ? "참여중..." : "참여하기"}
        </button>
      </div>
    </article>
  )
}
