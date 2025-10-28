"use client"

import { useEffect } from "react"
import Link from "next/link"
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

  if (isLoading) return <main>로딩중...</main>

  if (!loggedInUser)
    return (
      <main className={styles.pageWrapper}>
        <h1>로그인이 필요합니다.</h1>
        <Link href="/auth/login">로그인 하러 가기</Link>
      </main>
    )

  return (
    <main className={styles.pageWrapper}>
      <h1 className="sr-only">챌린지 생성하기</h1>
      <CreateForm />
    </main>
  )
}
