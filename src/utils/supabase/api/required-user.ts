// required-user.ts
"use client"
import browserClient from "../client"
import type { User } from "@supabase/supabase-js"

const requiredUser = async (): Promise<User> => {
  const { data, error } = await browserClient.auth.getUser()
  if (error || !data.user) throw new Error("로그인이 필요합니다.")
  return data.user
}

export default requiredUser
