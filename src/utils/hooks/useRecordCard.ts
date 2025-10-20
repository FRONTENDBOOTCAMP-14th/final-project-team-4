"use client"
import useSWR from "swr"
import browserClient from "@/utils/supabase/client"
import useRecordCardStore from "store/useRecordCardStore"

interface RecordCardData {
  id: string
  content: string | null
  image_url: string | null
  created_at: string
  user: {
    id: string
    nickname: string | null
    avatar_url: string | null
  } | null
  participant: { challenge_id: string; streak_days: number | null } | null
  likesCount: number
  commentsCount: number
  isLikedByMe: boolean
  isReportedByMe: boolean
}

export function useRecordCard(recordId: string, userId?: string | null) {
  const setFromServer = useRecordCardStore((s) => s.setFromServer)

  const key = recordId ? ["record-card", recordId, userId ?? "anon"] : null

  const swr = useSWR<RecordCardData>(key, async () => {
    const supabase = browserClient()

    const { data, error } = await supabase
      .from("challenge_records")
      .select("*")
      .eq("id", recordId)
      .single()

    if (error || !data) throw error ?? new Error("record not found")

    const likesCount = Array.isArray(data.record_likes)
      ? (data.record_likes[0]?.count ?? 0)
      : 0
    const commentsCount = Array.isArray(data.record_comments)
      ? (data.record_comments[0]?.count ?? 0)
      : 0

    let isLikedByMe = false
    let isReportedByMe = false
    if (userId) {
      const [{ data: liked }, { data: reported }] = await Promise.all([
        supabase
          .from("record_likes")
          .select("record_id")
          .eq("record_id", recordId)
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("reports")
          .select("id")
          .eq("target_type", "record")
          .eq("target_id", recordId)
          .eq("reporter_id", userId)
          .maybeSingle(),
      ])
      isLikedByMe = !!liked
      isReportedByMe = !!reported
    }

    const shaped: RecordCardData = {
      id: data.id as string,
      content: data.content ?? null,
      image_url: data.image_url ?? null,
      created_at: data.created_at as string,
      user: data.user ?? null,
      participant: data.participant ?? null,
      likesCount,
      commentsCount,
      isLikedByMe,
      isReportedByMe,
    }

    setFromServer({
      likesCount: shaped.likesCount,
      commentsCount: shaped.commentsCount,
      isLiked: shaped.isLikedByMe,
    })

    return shaped
  })

  return swr
}
