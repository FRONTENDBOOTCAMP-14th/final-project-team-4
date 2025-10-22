"use client"

import type { ReactNode } from "react"
import type { User } from "@/utils/supabase"
import useUserStore from "store/userStore"

interface UserProviderProps {
  children: ReactNode
  initialUser: User | null
}

export default function UserProvider({
  initialUser,
  children,
}: UserProviderProps) {
  useUserStore.setState({ loggedInUser: initialUser })

  return children
}
