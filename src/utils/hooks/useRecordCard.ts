"use client"
import useSWR from "swr"
import browserClient from "@/utils/supabase/client"
import useRecordCardStore from "store/useRecordCardStore"

interface DbUser {
  id: string
  username: string | null
  profile_image: string | null
}

interface RecordCardData {
  id: string
  content: string | null
  image_url: string | null
  image_urls: string[] | null
  created_at: string
  user: DbUser | null
  participant: { challenge_id: string; completed_days: number | null } | null
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
      .select(
        "id, content, image_urls, created_at, user_id, challenge_id, like_count, comment_count"
      )
      .eq("id", recordId)
      .maybeSingle()
    if (recErr) throw recErr
    if (!record) throw new Error("record not found")

    const { data: user } = await supabase
      .from("users")
      .select("id, username, profile_image")
      .eq("id", record.user_id)
      .maybeSingle()

    const { data: participant } = await supabase
      .from("challenge_participants")
      .select("challenge_id, completed_days")
      .eq("challenge_id", record.challenge_id)
      .eq("user_id", record.user_id)
      .maybeSingle()

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
          .eq("record_id", recordId)
          .eq("reporter_id", userId)
          .maybeSingle(),
      ])
      isLikedByMe = !!liked
      isReportedByMe = !!reported
    }

    const { count: likeCount } = await supabase
      .from("record_likes")
      .select("*", { count: "exact", head: true })
      .eq("record_id", recordId)

    const imgs = (record.image_urls as unknown as string[] | null) ?? null
    const firstImage = Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : null

    const shaped: RecordCardData = {
      id: record.id,
      content: record.content ?? null,
      image_url: firstImage,
      image_urls: imgs,
      created_at: record.created_at,
      user: user ?? null,
      participant: participant
        ? {
            challenge_id: participant.challenge_id,
            completed_days: participant.completed_days,
          }
        : null,
      likesCount: likeCount ?? 0,
      commentsCount:
        typeof record.comment_count === "number" ? record.comment_count : 0,
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
