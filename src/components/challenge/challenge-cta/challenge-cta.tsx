/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import browserClient from "@/utils/supabase/client"
import styles from "./challenge-cta.module.css"

interface CTATypes {
  isLoggedIn: boolean
  isParticipating: boolean
  challengeId: string
  userId?: string | null
  loginHref: string
  requiredSuccessRate: number
  startAt: string
  endAt: string
}

export default function ChallengeCTA({
  isLoggedIn,
  isParticipating,
  challengeId,
  userId,
  loginHref,
  requiredSuccessRate,
  startAt,
  endAt,
}: CTATypes) {
  const router = useRouter()
  const supabase = browserClient()
  const [loading, setLoading] = useState(false)

  const isExpired = useMemo(() => {
    const today = new Date()
    const endDate = new Date(endAt)
    return today > endDate
  }, [endAt])

  const isUpcoming = useMemo(() => {
    const today = new Date()
    const startDate = new Date(startAt)
    return today < startDate
  }, [startAt])

  const onJoin = async () => {
    if (!isLoggedIn || !userId) {
      toast.error("로그인이 필요합니다.")
      return
    }
    if (isExpired) {
      toast.error("이미 종료된 챌린지입니다.")
      return
    }
    if (isUpcoming) {
      toast.error("곧 시작하는 챌린지입니다!")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from("challenge_participants").upsert(
        [
          {
            user_id: userId,
            challenge_id: challengeId,
            completed_days: 0,
            required_success_rate: requiredSuccessRate,
            is_successful: false,
            is_progress: true,
          },
        ],
        { onConflict: "challenge_id,user_id", ignoreDuplicates: true }
      )
      if (error) throw error

      toast.success("챌린지에 참여했어요!")
      router.refresh()
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message ?? "참여 처리 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <Link href={loginHref} className={styles.link}>
        참여하기
      </Link>
    )
  }

  if (isExpired) {
    return (
      <button className={styles.link} type="button" disabled>
        종료된 챌린지입니다
      </button>
    )
  }

  if (isUpcoming) {
    return (
      <button className={styles.link} type="button" disabled>
        조금만 기다려주세요!
      </button>
    )
  }

  if (!isParticipating) {
    return (
      <button
        className={styles.link}
        type="button"
        onClick={onJoin}
        disabled={loading}
        id="joinbutton"
      >
        {loading ? "참여 처리 중..." : "참여하기"}
      </button>
    )
  }

  return (
    <a href="#record-create" className={styles.link}>
      오늘의 챌린지를 인증해주세요
    </a>
  )
}
