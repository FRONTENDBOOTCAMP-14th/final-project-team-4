"use client"

import { useEffect } from "react"
import useSWR from "swr"
import HotChallengeCarousel from "@/components/challenge/hot-challenge-carousel/hot-challenge-carousel"
import ChallengeCardList from "@/components/common/challenge-card-list/challenge-card-list"
import type { ChallengeWithParticipants } from "@/utils/supabase"
import {
  getHotChallengesClient,
  getNewChallengesClient,
  getChallengesByTypeClient,
} from "@/utils/supabase/api/challenges-client"
import useUserStore from "store/userStore"

const fetcher = async (url: string) => {
  const [type, limit] = url.split(":")
  const limitNum = parseInt(limit)

  switch (type) {
    case "hot":
      return getHotChallengesClient(limitNum)
    case "new":
      return getNewChallengesClient(limitNum)
    case "photo":
      return getChallengesByTypeClient("사진 인증", limitNum)
    case "writing":
      return getChallengesByTypeClient("텍스트 인증", limitNum)
    case "attendance":
      return getChallengesByTypeClient("출석체크 인증", limitNum)
    default:
      return []
  }
}

interface HomeChallengesProps {
  initialHotChallenges: ChallengeWithParticipants[]
  initialNewChallenges: ChallengeWithParticipants[]
  initialPhotoChallenges: ChallengeWithParticipants[]
  initialWritingChallenges: ChallengeWithParticipants[]
  initialAttendanceChallenges: ChallengeWithParticipants[]
}

export default function HomeChallenges({
  initialHotChallenges,
  initialNewChallenges,
  initialPhotoChallenges,
  initialWritingChallenges,
  initialAttendanceChallenges,
}: HomeChallengesProps) {
  const { fetchLoggedInUser } = useUserStore()

  useEffect(() => {
    void fetchLoggedInUser()
  }, [fetchLoggedInUser])

  const { data: hotChallenges = initialHotChallenges } = useSWR(
    "hot:20",
    fetcher,
    {
      fallbackData: initialHotChallenges,
    }
  )
  const { data: newChallenges = initialNewChallenges } = useSWR(
    "new:20",
    fetcher,
    {
      fallbackData: initialNewChallenges,
    }
  )
  const { data: photoChallenges = initialPhotoChallenges } = useSWR(
    "photo:20",
    fetcher,
    {
      fallbackData: initialPhotoChallenges,
    }
  )
  const { data: writingChallenges = initialWritingChallenges } = useSWR(
    "writing:20",
    fetcher,
    {
      fallbackData: initialWritingChallenges,
    }
  )
  const { data: attendanceChallenges = initialAttendanceChallenges } = useSWR(
    "attendance:20",
    fetcher,
    {
      fallbackData: initialAttendanceChallenges,
    }
  )

  return (
    <>
      <HotChallengeCarousel
        title="지금 뜨는 챌린지"
        challenges={hotChallenges}
      />
      <ChallengeCardList title="새로 생긴 챌린지" challenges={newChallenges} />
      <ChallengeCardList
        title="사진 인증 챌린지"
        challenges={photoChallenges}
      />
      <ChallengeCardList
        title="텍스트 인증 챌린지"
        challenges={writingChallenges}
      />
      <ChallengeCardList
        title="출석체크 인증 챌린지"
        challenges={attendanceChallenges}
      />
    </>
  )
}
