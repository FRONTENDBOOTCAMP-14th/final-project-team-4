import browserClient from "../client"
import type { Challenge } from ".."

export async function getTopChallengesByCategoryClient(
  category: string,
  limit = 10
): Promise<Challenge[]> {
  const supabase = browserClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("category", category)
    .eq("is_public", true)
    .eq("is_finished", false)
    .lte("start_at", now)
    .gte("end_at", now)
    .order("participants_count", { ascending: false })
    .limit(limit)

  if (error) {
    console.error(`${category} 인기 챌린지 조회 실패:`, error)
    return []
  }

  return data || []
}

export async function getChallengesByCategoryClient(
  category: string,
  uploadingType?: string,
  sortType: "latest" | "popular" | "period-desc" | "period-asc" = "latest",
  limit = 100
): Promise<Challenge[]> {
  const supabase = browserClient()
  const now = new Date().toISOString()

  let query = supabase
    .from("challenges")
    .select("*")
    .eq("category", category)
    .eq("is_public", true)
    .eq("is_finished", false)
    .lte("start_at", now)
    .gte("end_at", now)

  if (uploadingType) {
    query = query.eq("uploading_type", uploadingType)
  }

  if (sortType === "popular") {
    query = query.order("participants_count", { ascending: false })
  } else if (sortType === "period-desc") {
    query = query.order("end_at", { ascending: false })
  } else if (sortType === "period-asc") {
    query = query.order("end_at", { ascending: true })
  } else {
    query = query.order("start_at", { ascending: false })
  }

  query = query.limit(limit)

  const { data, error } = await query

  if (error) {
    console.error(`${category} 챌린지 조회 실패:`, error)
    return []
  }

  let challenges = data || []

  if (sortType === "period-desc" || sortType === "period-asc") {
    challenges = challenges.sort((a, b) => {
      const aPeriod =
        new Date(a.end_at).getTime() - new Date(a.start_at).getTime()
      const bPeriod =
        new Date(b.end_at).getTime() - new Date(b.start_at).getTime()

      return sortType === "period-desc" ? bPeriod - aPeriod : aPeriod - bPeriod
    })
  }

  return challenges
}
