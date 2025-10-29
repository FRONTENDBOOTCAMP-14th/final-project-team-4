import { createClient } from "../server"
import type { ChallengeWithParticipants } from ".."

export async function getHotChallenges(
  limit = 20
): Promise<ChallengeWithParticipants[]> {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("challenges")
    .select(
      `
      *,
      participants:challenge_participants(count)
    `
    )
    .eq("is_public", true)
    .eq("is_finished", false)
    .lte("start_at", now)
    .gte("end_at", now)
    .eq("challenge_participants.is_progress", true)
    .order("participants_count", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("지금 뜨는 챌린지 조회 실패:", error)
    return []
  }

  return data || []
}

export async function getNewChallenges(
  limit = 20
): Promise<ChallengeWithParticipants[]> {
  const supabase = await createClient()

  // start_at 필드를 기준으로 정렬 (챌린지 생성 시 설정되므로 생성 순서와 유사)
  const { data, error } = await supabase
    .from("challenges")
    .select(
      `
      *,
      participants:challenge_participants(count)
    `
    )
    .eq("is_public", true)
    .eq("is_finished", false)
    .eq("challenge_participants.is_progress", true)
    .order("start_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("새로 생긴 챌린지 조회 실패:", error)
    return []
  }

  return data || []
}

export async function getChallengesByType(
  uploadingType: "사진 인증" | "텍스트 인증" | "출석체크 인증",
  limit = 20
): Promise<ChallengeWithParticipants[]> {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("challenges")
    .select(
      `
      *,
      participants:challenge_participants(count)
    `
    )
    .eq("is_public", true)
    .eq("is_finished", false)
    .eq("uploading_type", uploadingType)
    .lte("start_at", now)
    .gte("end_at", now)
    .eq("challenge_participants.is_progress", true)
    .order("id", { ascending: false })
    .limit(limit)

  if (error) {
    console.error(`${uploadingType} 챌린지 조회 실패:`, error)
    return []
  }

  return data || []
}
