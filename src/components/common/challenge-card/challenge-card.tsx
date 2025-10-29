"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import type { Challenge } from "@/utils/supabase"
import {
  getUserParticipationStatus,
  type ParticipationStatus,
} from "@/utils/supabase/api/participation"
import type { ChallengeWithOwner } from "@/utils/supabase/api/search"
import styles from "./challenge-card.module.css"

interface ChallengeCardProps {
  challenge: Challenge | ChallengeWithOwner
  participantCount?: number
  daysLeft?: number
  realParticipantCount?: number
}

export default function ChallengeCard({
  challenge,
  participantCount = 0,
  daysLeft = 0,
  realParticipantCount,
}: ChallengeCardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [isJoining, setIsJoining] = useState(false)
  const [participationStatus, setParticipationStatus] =
    useState<ParticipationStatus>("not_participating")
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)

  // 사용자 참여 상태 확인
  useEffect(() => {
    async function checkParticipationStatus() {
      if (!user) {
        setParticipationStatus("not_participating")
        setIsLoadingStatus(false)
        return
      }

      try {
        const status = await getUserParticipationStatus(user.id, challenge.id)
        setParticipationStatus(status.status)
      } catch (error) {
        console.error("참여 상태 확인 실패:", error)
        setParticipationStatus("not_participating")
      } finally {
        setIsLoadingStatus(false)
      }
    }

    void checkParticipationStatus()
  }, [user, challenge.id])

  const getButtonText = () => {
    if (isLoadingStatus) return "로딩중..."
    if (isJoining) return "참여중..."

    switch (participationStatus) {
      case "participating":
        return "참여중"
      case "completed":
        return "참여완료"
      default:
        return "참여하기"
    }
  }

  const getButtonClassName = () => {
    if (
      participationStatus === "participating" ||
      participationStatus === "completed"
    ) {
      return `${styles.primaryButton} ${styles.disabledButton}`
    }
    return styles.primaryButton
  }

  const handleJoinClick = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!user) {
      alert("로그인이 필요합니다.")
      router.push("/auth/login")
      return
    }

    // 이미 참여 중이거나 완료된 경우
    if (participationStatus === "participating") {
      alert("이미 참여중인 챌린지입니다.")
      return
    }

    if (participationStatus === "completed") {
      alert("이미 참여완료한 챌린지입니다.")
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
    <Link href={`/challenges/${challenge.id}`} className={styles.cardLink}>
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
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className={styles.tags}>
            {(realParticipantCount ?? participantCount) > 0 && (
              <span className={styles.tag}>
                {realParticipantCount ?? participantCount}명 참여중
              </span>
            )}
            {daysLeft > 0 && (
              <span className={styles.tagDay}>{daysLeft}일</span>
            )}
          </div>
          <button
            className={getButtonClassName()}
            onClick={handleJoinClick}
            disabled={
              isJoining ||
              participationStatus === "participating" ||
              participationStatus === "completed"
            }
          >
            {getButtonText()}
          </button>
        </div>
      </article>
    </Link>
  )
}
