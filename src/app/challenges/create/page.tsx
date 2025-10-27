"use client"

import { useEffect } from "react"
import Link from "next/link"
import LoadingSpinner from "@/components/common/loading-spinner/loading-spinner"
import browserClient from "@/utils/supabase/client"
import useUserStore from "store/userStore"
import CreateForm from "./create-form"
import styles from "./page.module.css"

export default function ChallengeCreatePage() {
  const { loggedInUser, isLoading, fetchLoggedInUser } = useUserStore()

  useEffect(() => {
    const client = browserClient()

    const { data: listener } = client.auth.onAuthStateChange(() => {
      void fetchLoggedInUser()
    })

    void fetchLoggedInUser()

    return () => listener.subscription.unsubscribe()
  }, [fetchLoggedInUser])

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <LoadingSpinner message="정보를 불러오는 중..." fullScreen />
      </div>
    )
  }

  if (!loggedInUser) {
    return (
      <div className={styles.pageWrapper}>
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <h1 style={{ marginBlockEnd: "1rem" }}>로그인이 필요합니다</h1>
          <p style={{ marginBlockEnd: "2rem", color: "var(--text-color-sub)" }}>
            챌린지를 생성하려면 로그인이 필요합니다.
          </p>
          <Link
            href="/auth/login"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              backgroundColor: "var(--brand-main)",
              color: "var(--text-color-reverse)",
              borderRadius: "0.5rem",
              textDecoration: "none",
            }}
          >
            로그인 하러 가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageWrapper}>
      <h1 className="sr-only">챌린지 생성하기</h1>
      <CreateForm />
    </div>
  )
}
