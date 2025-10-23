"use client"

import { useEffect, type ReactNode } from "react"
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
  useEffect(() => {
    useUserStore.setState({ loggedInUser: initialUser })
  }, [initialUser])

  return children
}
