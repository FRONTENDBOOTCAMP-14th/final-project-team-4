import browserClient from "../client"
import requiredUser from "./required-user"
import type { ChallengeInsert } from ".."

export const createChallenge = async (payload: ChallengeInsert) => {
  const user = await requiredUser()
  const { error, data: createdChallenge } = await browserClient
    .from("challenges")
    .insert([{ ...payload, created_by_id: user.id }])
    .select("*")
    .single()

  if (error) {
    console.log("supabase insert error:", error)
    throw new Error("챌린지 생성 실패")
  }

  return createdChallenge
}
