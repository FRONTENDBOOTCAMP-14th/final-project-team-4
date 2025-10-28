import browserClient from "../client"

export type ParticipationStatus =
  | "not_participating"
  | "participating"
  | "completed"

export interface ParticipationInfo {
  status: ParticipationStatus
  isProgress: boolean
  isSuccessful: boolean | null
  completedDays: number
}

/**
 * 사용자의 챌린지 참여 상태를 확인합니다.
 * @param userId 사용자 ID
 * @param challengeId 챌린지 ID
 * @returns 참여 상태 정보
 */
export async function getUserParticipationStatus(
  userId: string,
  challengeId: string
): Promise<ParticipationInfo> {
  const supabase = browserClient()

  try {
    const { data: participant, error } = await supabase
      .from("challenge_participants")
      .select("is_progress, is_successful, completed_days")
      .eq("user_id", userId)
      .eq("challenge_id", challengeId)
      .maybeSingle()

    if (error) {
      console.error("참여 상태 조회 실패:", error)
      return {
        status: "not_participating",
        isProgress: false,
        isSuccessful: null,
        completedDays: 0,
      }
    }

    if (!participant) {
      return {
        status: "not_participating",
        isProgress: false,
        isSuccessful: null,
        completedDays: 0,
      }
    }

    // 참여 완료된 경우 (is_progress가 false)
    if (!participant.is_progress) {
      return {
        status: "completed",
        isProgress: false,
        isSuccessful: participant.is_successful,
        completedDays: participant.completed_days,
      }
    }

    // 현재 참여 중인 경우 (is_progress가 true)
    return {
      status: "participating",
      isProgress: true,
      isSuccessful: participant.is_successful,
      completedDays: participant.completed_days,
    }
  } catch (error) {
    console.error("참여 상태 확인 중 오류:", error)
    return {
      status: "not_participating",
      isProgress: false,
      isSuccessful: null,
      completedDays: 0,
    }
  }
}

/**
 * 여러 챌린지에 대한 사용자 참여 상태를 한 번에 확인합니다.
 * @param userId 사용자 ID
 * @param challengeIds 챌린지 ID 배열
 * @returns 챌린지 ID를 키로 하는 참여 상태 맵
 */
export async function getUserParticipationStatusBatch(
  userId: string,
  challengeIds: string[]
): Promise<Record<string, ParticipationInfo>> {
  const supabase = browserClient()

  try {
    const { data: participants, error } = await supabase
      .from("challenge_participants")
      .select("challenge_id, is_progress, is_successful, completed_days")
      .eq("user_id", userId)
      .in("challenge_id", challengeIds)

    if (error) {
      console.error("참여 상태 일괄 조회 실패:", error)
      return {}
    }

    const result: Record<string, ParticipationInfo> = {}

    // 참여하지 않은 챌린지들에 대한 기본값 설정
    challengeIds.forEach((challengeId) => {
      result[challengeId] = {
        status: "not_participating",
        isProgress: false,
        isSuccessful: null,
        completedDays: 0,
      }
    })

    // 실제 참여 정보로 업데이트
    participants?.forEach((participant) => {
      const status: ParticipationStatus = participant.is_progress
        ? "participating"
        : "completed"

      result[participant.challenge_id] = {
        status,
        isProgress: participant.is_progress,
        isSuccessful: participant.is_successful,
        completedDays: participant.completed_days,
      }
    })

    return result
  } catch (error) {
    console.error("참여 상태 일괄 확인 중 오류:", error)
    return {}
  }
}
