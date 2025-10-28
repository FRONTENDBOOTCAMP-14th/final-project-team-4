import browserClient from "../client"
import type { Challenge } from ".."

export async function getHotChallengesClient(limit = 20): Promise<Challenge[]> {
  const supabase = browserClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("is_public", true)
    .eq("is_finished", false)
    .lte("start_at", now)
    .gte("end_at", now)
    .order("participants_count", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("지금 뜨는 챌린지 조회 실패:", error)
    return []
  }

  return data || []
}

export async function getNewChallengesClient(limit = 20): Promise<Challenge[]> {
  const supabase = browserClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("is_public", true)
    .eq("is_finished", false)
    .lte("start_at", now)
    .gte("end_at", now)
    .order("id", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("새로 생긴 챌린지 조회 실패:", error)
    return []
  }

  return data || []
}

export async function getChallengesByTypeClient(
  uploadingType: "사진 인증" | "텍스트 인증" | "출석체크 인증",
  limit = 20
): Promise<Challenge[]> {
  const supabase = browserClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("is_public", true)
    .eq("is_finished", false)
    .eq("uploading_type", uploadingType)
    .lte("start_at", now)
    .gte("end_at", now)
    .order("id", { ascending: false })
    .limit(limit)

  if (error) {
    console.error(`${uploadingType} 챌린지 조회 실패:`, error)
    return []
  }

  return data || []
}
