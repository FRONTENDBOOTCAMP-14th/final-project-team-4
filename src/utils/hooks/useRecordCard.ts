"use client"
import useSWR from "swr"
import browserClient from "@/utils/supabase/client"
import useRecordCardStore from "store/useRecordCardStore"

interface DbUser {
  id: string
  nickname: string | null
  avatar_url: string | null
}

interface RecordCardData {
  id: string
  content: string | null
  image_url: string | null
  created_at: string
  user: DbUser | null
  participant: { challenge_id: string; streak_days: number | null } | null
  likesCount: number
  commentsCount: number
  isLikedByMe: boolean
  isReportedByMe: boolean
}

export function useRecordCard(recordId: string, userId?: string | null) {
  const setFromServer = useRecordCardStore((s) => s.setFromServer)
  const key = recordId ? ["record-card", recordId, userId ?? "anon"] : null

  return useSWR<RecordCardData>(key, async () => {
    const supabase = browserClient()

    const { data: record, error: recErr } = await supabase
      .from("challenge_records")
      .select("id, content, image_urls, created_at, user_id, challenge_id")
      .eq("id", recordId)
      .maybeSingle()
    if (recErr) throw recErr
    if (!record) throw new Error("record not found")

    const { data: user } = await supabase
      .from("users")
      .select("id, nickname, avatar_url")
      .eq("id", record.user_id)
      .maybeSingle()

    const { data: participant } = await supabase
      .from("challenge_participants")
      .select("challenge_id, streak_days")
      .eq("challenge_id", record.challenge_id)
      .eq("user_id", record.user_id)
      .maybeSingle()

    const { count: likesCount = 0 } = await supabase
      .from("record_likes")
      .select("*", { head: true, count: "exact" })
      .eq("record_id", recordId)

    const { count: commentsCount = 0 } = await supabase
      .from("record_comments")
      .select("*", { head: true, count: "exact" })
      .eq("record_id", recordId)

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
      id: record.id,
      content: record.content ?? null,
      image_url: record.image_urls ?? null,
      created_at: record.created_at,
      user: user ?? null,
      participant: participant
        ? {
            challenge_id: participant.challenge_id,
            streak_days: participant.streak_days,
          }
        : null,
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
}
