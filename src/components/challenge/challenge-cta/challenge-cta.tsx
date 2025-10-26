/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import browserClient from "@/utils/supabase/client"
import styles from "./challenge-cta.module.css"

interface CTATypes {
  isLoggedIn: boolean
  isParticipating: boolean
  challengeId: string
  userId?: string | null
  loginHref: string
}

export default function ChallengeCTA({
  isLoggedIn,
  isParticipating,
  challengeId,
  userId,
  loginHref,
}: CTATypes) {
  const router = useRouter()
  const supabase = browserClient()
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const onJoin = async () => {
    if (!isLoggedIn || !userId) return
    setLoading(true)
    setErr(null)
    try {
      const { error } = await supabase.from("challenge_participants").upsert(
        [
          {
            user_id: userId,
            challenge_id: challengeId,
            completed_days: 0,
            is_successful: false,
            is_progress: true,
          },
        ],
        { onConflict: "challenge_id,user_id", ignoreDuplicates: true }
      )
      if (error) throw error

      router.refresh()
    } catch (e: any) {
      console.error(e)
      setErr(e?.message ?? "참여 처리 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <>
        <Link href={loginHref} className={styles.link}>
          참여하기
        </Link>
        {err && <p style={{ color: "crimson" }}>{err}</p>}
      </>
    )
  }

  if (!isParticipating) {
    return (
      <>
        <button
          className={styles.link}
          type="button"
          onClick={onJoin}
          disabled={loading}
          id="joinbutton"
        >
          {loading ? "참여 처리 중..." : "참여하기"}
        </button>
        {err && <p style={{ color: "crimson" }}>{err}</p>}
      </>
    )
  }

  return (
    <a href="#record-create" className={styles.link}>
      오늘의 챌린지를 인증해주세요
    </a>
  )
}
