"use client"

import { useEffect } from "react"
import type { ReactNode } from "react"
import useUserStore from "store/userStore"

interface UserProviderProps {
  children: ReactNode
}

export default function UserProvider({ children }: UserProviderProps) {
  const fetchLoggedInUser = useUserStore((state) => state.fetchLoggedInUser)

  useEffect(() => {
    fetchLoggedInUser().catch(console.error)
  }, [fetchLoggedInUser])

  return children
}
