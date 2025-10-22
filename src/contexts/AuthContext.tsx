"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import supabase from "@/utils/supabase"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithNaver: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  console.log("[AuthProvider] mounted")

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)

      if (error) {
        console.error("세션 가져오기 오류:", error)
      }
    }

    void getSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        setLoading(false)

        if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
          router.refresh()
        }
      }
    )

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [router])

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const signInWithNaver = async () => {
    const res = await fetch("/auth/login/naver", { cache: "no-store" })
    if (!res.ok) {
      const text = await res.text()
      console.error("login 실패:", res.status, text)
      throw new Error("네이버 로그인 URL 생성 실패")
    }
    const data = await res.json()
    if (!data?.url) throw new Error("네이버 로그인 URL이 없습니다.")
    window.location.href = data.url
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
    throw new Error(
      "AuthProvider 안에서만 useAuth 훅 함수를 사용할 수 있습니다."
    )
  }
  return context
}
