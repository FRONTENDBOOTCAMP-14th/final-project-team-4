"use client"

import { useState } from "react"
import Button from "@/components/common/button/button"
import browserClient from "@/utils/supabase/client"

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

  const onToggle = async () => {
    if (!userId) {
      window.location.href = `/login?redirect=/challenges/${challengeId}`
      return
    }

    setLoading(true)
    try {
      if (checked) {
        const { data: row, error: selErr } = await supabase
          .from("challenge_wishlist")
          .select("id")
          .eq("challenge_id", challengeId)
          .eq("user_id", userId)
          .maybeSingle()
        if (selErr) throw selErr

        if (row) {
          const { error: delErr } = await supabase
            .from("challenge_wishlist")
            .delete()
            .eq("id", row.id)
          if (delErr) throw delErr
        }
        setChecked(false)
      } else {
        const { error } = await supabase
          .from("challenge_wishlist")
          .insert({ user_id: userId, challenge_id: challengeId })
        if (error) throw error
        setChecked(true)
      }
    } catch (error) {
      console.error(error)
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
