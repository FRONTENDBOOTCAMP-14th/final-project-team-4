"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import browserClient from "@/utils/supabase/client"
import CreateForm from "./create-form"
import styles from "./page.module.css"

export default function ChallengeCreatePage() {
  const [user, setUser] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const client = browserClient()
        const { data } = await client.auth.getUser()
        setUser(data.user)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    void fetchUser()
  }, [])

  if (loading) return <div>로딩중...</div>

  if (!user)
    return (
      <div className={styles.pageWrapper}>
        <h1>로그인이 필요합니다.</h1>
        <Link href="/auth/login">로그인 하러 가기</Link>
      </div>
    )

  return (
    <div className={styles.pageWrapper}>
      <h1 className="sr-only">챌린지 생성하기</h1>
      <CreateForm />
    </div>
  )
}
