import type { UserPageComponentsProps } from "@/app/user/[userId]/types"
import recordedToday from "@/utils/recordedToday"
import type { Database } from "@/utils/supabase/database.types"
import { createClient } from "@/utils/supabase/server"
import UserChallengesSection from "./user-challenges-section"
import UserStaticsSection from "../user-statics-section/user-statics-section"

type Challenge = Database["public"]["Tables"]["challenges"]["Row"]

export interface ChallengeWithStatus {
  challenge: Partial<Challenge>
  recorded: boolean
  isFinished?: boolean
  isMyPage?: boolean
}

export interface UserStatics {
  onGoingChallenges: number
  succeededChallenges: number
  totalChallenges: number
}

export default async function UserChallengesSectionData({
  pageUser,
  isMyPage,
}: UserPageComponentsProps) {
  const supabase = await createClient()

  // 1. 진행 중인 챌린지
  const { data: ongoingParticipants } = await supabase
    .from("challenge_participants")
    .select("*")
    .eq("user_id", pageUser.id)
    .eq("is_progress", true)

  const ongoingChallenges: ChallengeWithStatus[] = await Promise.all(
    (ongoingParticipants || []).map(async (p) => {
      const { data: challenge } = await supabase
        .from("challenges")
        .select("id, title, category, tags, start_at, end_at, is_finished")
        .eq("id", p.challenge_id)
        .single()

      const recorded = await recordedToday(p.user_id, p.challenge_id)

      return { challenge, recorded, isFinished: challenge.is_finished }
    })
  )

  // 2. 지난 챌린지
  const { data: pastParticipants } = await supabase
    .from("challenge_participants")
    .select("*")
    .eq("user_id", pageUser.id)
    .eq("is_progress", false)

  const pastChallenges: ChallengeWithStatus[] = await Promise.all(
    (pastParticipants || []).map(async (p) => {
      const { data: challenge } = await supabase
        .from("challenges")
        .select("id, title, category, tags, start_at, end_at, is_finished")
        .eq("id", p.challenge_id)
        .single()

      const recorded = false

      return { challenge, recorded, isFinished: challenge.is_finished }
    })
  )

  // 3. 내가 만든 챌린지
  const { data: createdChallengesData } = await supabase
    .from("challenges")
    .select("*")
    .eq("created_by_id", pageUser.id)

  const createdChallenges: ChallengeWithStatus[] = (
    createdChallengesData || []
  ).map((challenge) => ({
    challenge,
    recorded: false,
    isFinished: challenge.is_finished,
  }))

  // 통계 계산
  const statics: UserStatics = {
    onGoingChallenges: ongoingParticipants?.length || 0,

    succeededChallenges:
      pastParticipants?.filter((p) => p.is_successful === true).length || 0,

    totalChallenges:
      (ongoingParticipants?.length || 0) + (pastParticipants?.length || 0),
  }

  return (
    <>
      <UserStaticsSection statics={statics} />
      <UserChallengesSection
        pageUser={pageUser}
        isMyPage={isMyPage}
        ongoingChallenges={ongoingChallenges}
        pastChallenges={pastChallenges}
        createdChallenges={createdChallenges}
      />
    </>
  )
}
