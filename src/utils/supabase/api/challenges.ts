import useUserStore from "store/userStore"
import browserClient from "../client"
import type { ChallengeInsert } from ".."

export const createChallenge = async (payload: ChallengeInsert) => {
  const supabase = browserClient()
  const user = useUserStore.getState().loggedInUser

  if (!user) throw new Error("로그인 필요")

  const { error, data: createdChallenge } = await supabase
    .from("challenges")
    .insert([{ ...payload, created_by_id: user.id }])
    .select("*")
    .single()

  if (error) throw new Error("챌린지 생성 실패")

  return createdChallenge
}
