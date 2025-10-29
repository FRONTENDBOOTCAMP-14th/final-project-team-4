"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import browserClient from "@/utils/supabase/client"
import type { User, Session } from "@supabase/supabase-js"

export interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  signUp: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; session: Session | null }>
  signIn: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; session: Session | null }>
  signOut: () => Promise<void>
  signInWithNaver: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = browserClient()

    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
      if (error) console.error("세션 가져오기 오류:", error)
    }

    void getSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
        if (event === "SIGNED_IN" || event === "SIGNED_OUT") router.refresh()
      }
    )

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [router])

  const signUp = async (email: string, password: string) => {
    const supabase = browserClient()
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }

  const signIn = async (email: string, password: string) => {
    const supabase = browserClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const supabase = browserClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const signInWithNaver = () => {
    window.location.assign("/auth/login/naver")
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithNaver,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("AuthProvider 안에서만 useAuth 훅을 사용할 수 있습니다.")
  }
  return context
}
