import { createClient } from "../server"
import type { Challenge } from ".."

export async function getHotChallenges(limit = 20): Promise<Challenge[]> {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("is_public", true)
    .eq("is_finished", false)
    .lte("start_at", now)
    .gte("end_at", now)
    .order("participants_count", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("지금 뜨는 챌린지 조회 실패:", error)
    return []
  }

  return data || []
}

export async function getNewChallenges(limit = 20): Promise<Challenge[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("is_public", true)
    .order("start_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("새로 생긴 챌린지 조회 실패:", error)
    return []
  }

  return data || []
}

export async function getChallengesByType(
  uploadingType: "사진" | "글쓰기" | "출석체크",
  limit = 20
): Promise<Challenge[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("is_public", true)
    .eq("uploading_type", uploadingType)
    .order("start_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error(`${uploadingType} 챌린지 조회 실패:`, error)
    return []
  }

  return data || []
}
