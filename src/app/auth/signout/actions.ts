"use client"

import browserClient from "@/utils/supabase/client"
import { redirect } from "next/navigation"

export async function handleSignOut() {
  const supabase = browserClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("로그아웃 에러", error.message)
    return
  }

  redirect("/")
}
