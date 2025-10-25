import browserClient from "../client"
import { createClient } from "../server"
import requiredUser from "./required-user"
import type { ChallengeInsert, Challenge } from ".."

export const createChallenge = async (payload: ChallengeInsert) => {
  const supabase = browserClient()
  const user = await requiredUser()

  const { error, data: createdChallenge } = await supabase
    .from("challenges")
    .insert([{ ...payload, created_by_id: user.id }])
    .select("*")
    .single()

  if (error) {
    console.error("supabase insert error:", error)
    throw new Error("챌린지 생성 실패")
  }

  return createdChallenge
}

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
