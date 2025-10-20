"use client"
import useSWR from "swr"
import browserClient from "@/utils/supabase/client"

export function useRecordComments(recordId: string) {
  const supabase = browserClient()

  const key = recordId ? ["record-comments", recordId] : null
  return useSWR(key, async () => {
    const { data, error } = await supabase
      .from("record_comments")
      .select(
        `
        id, record_id, content, created_at,
        author:users ( id, nickname, avatar_url )
      `
      )
      .eq("record_id", recordId)
      .order("created_at", { ascending: true })

    if (error) throw error
    return data ?? []
  })
}
