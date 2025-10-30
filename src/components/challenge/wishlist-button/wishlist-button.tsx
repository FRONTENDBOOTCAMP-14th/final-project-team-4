/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import Button from "@/components/common/button/button"
import browserClient from "@/utils/supabase/client"
import styles from "./wishlist-button.module.css"

interface WishlistButton {
  userId: string | null
  challengeId: string
  initialChecked: boolean
}

export default function WishlistButton({
  userId,
  challengeId,
  initialChecked,
}: WishlistButton) {
  const supabase = browserClient()
  const [checked, setChecked] = useState(initialChecked)
  const [loading, setLoading] = useState(false)

  if (!userId) {
    return (
      <Link
        href={`/auth/login?redirect=/challenges/${challengeId}`}
        className={styles.link}
      >
        찜하기
      </Link>
    )
  }

  const onToggle = async () => {
    setLoading(true)
    try {
      if (checked) {
        const { error: delErr } = await supabase
          .from("challenge_wishlist")
          .delete()
          .eq("user_id", userId)
          .eq("challenge_id", challengeId)
        if (delErr) throw delErr

        setChecked(false)
        toast.success("찜을 해제했어요.")
      } else {
        const { error: upErr } = await supabase
          .from("challenge_wishlist")
          .upsert([{ user_id: userId, challenge_id: challengeId }], {
            onConflict: "user_id,challenge_id",
            ignoreDuplicates: true,
          })
        if (upErr) throw upErr

        setChecked(true)
        toast.success("찜목록에 추가했어요!")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message ?? "처리 중 오류가 발생했어요.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      className="like"
      type="button"
      onClick={onToggle}
      disabled={loading}
    >
      {loading ? "처리 중..." : checked ? "찜 해제" : "찜하기"}
    </Button>
  )
}
