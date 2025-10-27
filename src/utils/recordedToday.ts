import { createClient } from "@/utils/supabase/server"

export default async function recordedToday(
  userId: string,
  challengeId: string
): Promise<boolean> {
  const supabase = await createClient()

  const now = new Date()
  const kstOffset = 9 * 60 * 60 * 1000

  const todayKST = new Date(now.getTime() + kstOffset)
  todayKST.setUTCHours(0, 0, 0, 0)
  const startUTC = new Date(todayKST.getTime() - kstOffset)
  const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000)

  const { data, error } = await supabase
    .from("challenge_records")
    .select("*")
    .eq("user_id", userId)
    .eq("challenge_id", challengeId)
    .gte("created_at", startUTC.toISOString())
    .lt("created_at", endUTC.toISOString())

  if (error) {
    console.error("조회 오류:", error)
    return false
  }

  return data.length > 0
}
