"use client"
import browserClient from "../client"
import type { User } from "@supabase/supabase-js"

const requiredUser = async (): Promise<User> => {
  const supabase = browserClient()
  const session = supabase.auth.getSession()
  const user = (await session).data?.session?.user
  if (!user) {
    throw new Error("로그인이 필요합니다.")
  }
  if (!supabase.auth) {
    throw new Error("supabase auth가 초기화 되지 않았습니다.")
  }
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error("로그인이 필요합니다.")
  return data.user
}

export default requiredUser
