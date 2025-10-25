"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import type { Challenge } from "@/utils/supabase"
import { getWishlistChallenges } from "@/utils/supabase/api/wishlist"

export interface UseWishlistParams {
  categories?: string[]
  authTypes?: string[]
  sortType?: "latest" | "oldest"
  limit?: number
}

export interface UseWishlistReturn {
  challenges: Challenge[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
  totalCount: number
}

export function useWishlist({
  categories = [],
  authTypes = [],
  sortType = "latest",
  limit = 12,
}: UseWishlistParams = {}): UseWishlistReturn {
  const { user, loading: authLoading } = useAuth()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const offsetRef = useRef(0)

  const loadChallenges = useCallback(
    async (reset = false) => {
      if (authLoading || !user) {
        setChallenges([])
        setTotalCount(0)
        setHasMore(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const currentOffset = reset ? 0 : offsetRef.current
        const result = await getWishlistChallenges({
          userId: user.id,
          categories,
          authTypes,
          sortType,
          limit,
          offset: currentOffset,
        })

        if (reset) {
          setChallenges(result.challenges)
          offsetRef.current = limit
        } else {
          setChallenges((prev) => [...prev, ...result.challenges])
          offsetRef.current += limit
        }

        setTotalCount(result.totalCount)
        setHasMore(result.hasMore)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "알 수 없는 오류"
        setError(errorMessage)
        console.error("찜한 챌린지 로드 실패:", err)
      } finally {
        setIsLoading(false)
      }
    },
    [user, authLoading, categories, authTypes, sortType, limit]
  )

  const loadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      await loadChallenges(false)
    }
  }, [isLoading, hasMore, loadChallenges])

  const refresh = useCallback(async () => {
    offsetRef.current = 0
    setChallenges([])
    setHasMore(true)
    await loadChallenges(true)
  }, [loadChallenges])

  // 필터나 정렬이 변경될 때 초기화
  useEffect(() => {
    offsetRef.current = 0
    setChallenges([])
    setHasMore(true)
    if (!authLoading && user) {
      void loadChallenges(true)
    }
  }, [user, authLoading, categories, authTypes, sortType, loadChallenges])

  return {
    challenges,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
    totalCount,
  }
}
