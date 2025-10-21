"use client"
import useSWRMutation from "swr/mutation"
import browserClient from "@/utils/supabase/client"
import useRecordCardStore from "store/useRecordCardStore"

export function useRecordActions(recordId: string, userId?: string | null) {
  const supabase = browserClient()
  const { toggleLikeOptimistic, markReported } = useRecordCardStore()

  const likeMut = useSWRMutation(
    ["toggle-like", recordId, userId ?? "anon"],
    async () => {
      if (!userId) throw new Error("로그인이 필요합니다.")
      toggleLikeOptimistic()
      try {
        const { data: liked } = await supabase
          .from("record_likes")
          .select("record_id")
          .eq("record_id", recordId)
          .eq("user_id", userId)
          .maybeSingle()

        if (liked) {
          await supabase
            .from("record_likes")
            .delete()
            .eq("record_id", recordId)
            .eq("user_id", userId)
        } else {
          await supabase
            .from("record_likes")
            .upsert({ record_id: recordId, user_id: userId })
        }
      } catch (e) {
        toggleLikeOptimistic()
        throw e
      }
    }
  )

  const reportMut = useSWRMutation(
    ["report-record", recordId, userId ?? "anon"],
    async (_key, { arg }: { arg: { reason?: string } }) => {
      if (!userId) throw new Error("로그인이 필요합니다.")
      try {
        await supabase.from("reports").insert({
          target_type: "record",
          target_id: recordId,
          reporter_id: userId,
          reason: arg?.reason ?? null,
        })
        markReported()
      } catch (e: unknown) {
        throw e
      }
    }
  )

  return { likeMut, reportMut }
}
