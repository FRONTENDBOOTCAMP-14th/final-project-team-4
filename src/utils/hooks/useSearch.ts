import { useCallback, useEffect } from "react"
import useSWR from "swr"
import type { ChallengeWithOwner } from "@/utils/supabase/api/search"
import {
  searchChallenges,
  searchChallengesByAuthType,
} from "@/utils/supabase/api/search"
import { useSearchStore } from "store/useSearchStore"

interface UseSearchOptions {
  query: string
  enabled?: boolean
}

interface UseSearchByAuthTypeOptions {
  query: string
  authType: "사진 인증" | "텍스트 인증" | "출석체크 인증"
  enabled?: boolean
}

export function useSearch({ query, enabled = true }: UseSearchOptions) {
  const {
    searchResults,
    setSearchResults,
    isLoading,
    setLoading,
    error,
    setError,
  } = useSearchStore()

  const {
    data,
    error: swrError,
    isLoading: swrLoading,
  } = useSWR(
    enabled && query?.trim() ? `search-${query}` : null,
    () => searchChallenges({ query, limit: 20 }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 10000,
      errorRetryCount: 1,
      errorRetryInterval: 5000,
    }
  )

  useEffect(() => {
    if (data) {
      setSearchResults(data.challenges)
    }
  }, [data, setSearchResults])

  useEffect(() => {
    setLoading(swrLoading)
  }, [swrLoading, setLoading])

  useEffect(() => {
    if (swrError) {
      setError(swrError.message)
    } else {
      setError(null)
    }
  }, [swrError, setError])

  return {
    searchResults,
    isLoading,
    error,
  }
}

export function useSearchByAuthType({
  query,
  authType,
  enabled = true,
}: UseSearchByAuthTypeOptions) {
  const {
    photoChallenges,
    writingChallenges,
    attendanceChallenges,
    setPhotoChallenges,
    setWritingChallenges,
    setAttendanceChallenges,
    isPhotoLoading,
    isWritingLoading,
    isAttendanceLoading,
    setPhotoLoading,
    setWritingLoading,
    setAttendanceLoading,
    error,
    setError,
  } = useSearchStore()

  const {
    data,
    error: swrError,
    isLoading: swrLoading,
  } = useSWR(
    enabled && query?.trim() ? `search-${authType}-${query}` : null,
    () => searchChallengesByAuthType({ query, authType, limit: 20 }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 10000,
      errorRetryCount: 1,
      errorRetryInterval: 5000,
    }
  )

  useEffect(() => {
    if (data) {
      switch (authType) {
        case "사진 인증":
          setPhotoChallenges(data.challenges)
          break
        case "텍스트 인증":
          setWritingChallenges(data.challenges)
          break
        case "출석체크 인증":
          setAttendanceChallenges(data.challenges)
          break
      }
    }
  }, [
    data,
    authType,
    setPhotoChallenges,
    setWritingChallenges,
    setAttendanceChallenges,
  ])

  useEffect(() => {
    switch (authType) {
      case "사진 인증":
        setPhotoLoading(swrLoading)
        break
      case "텍스트 인증":
        setWritingLoading(swrLoading)
        break
      case "출석체크 인증":
        setAttendanceLoading(swrLoading)
        break
    }
  }, [
    swrLoading,
    authType,
    setPhotoLoading,
    setWritingLoading,
    setAttendanceLoading,
  ])

  useEffect(() => {
    if (swrError) {
      setError(swrError.message)
    }
  }, [swrError, setError])

  const getChallenges = () => {
    switch (authType) {
      case "사진 인증":
        return photoChallenges
      case "텍스트 인증":
        return writingChallenges
      case "출석체크 인증":
        return attendanceChallenges
      default:
        return []
    }
  }

  const getLoading = () => {
    switch (authType) {
      case "사진 인증":
        return isPhotoLoading
      case "텍스트 인증":
        return isWritingLoading
      case "출석체크 인증":
        return isAttendanceLoading
      default:
        return false
    }
  }

  return {
    challenges: getChallenges(),
    isLoading: getLoading(),
    error,
  }
}

export function useSortedChallenges(
  challenges: ChallengeWithOwner[],
  sortType: "latest" | "popular" | "period-desc" | "period-asc"
) {
  return useCallback(() => {
    if (!challenges.length) return []

    const sortedChallenges = [...challenges]

    switch (sortType) {
      case "latest":
        return sortedChallenges.sort(
          (a, b) =>
            new Date(b.start_at).getTime() - new Date(a.start_at).getTime()
        )
      case "popular":
        return sortedChallenges.sort(
          (a, b) => (b.participants_count || 0) - (a.participants_count || 0)
        )
      case "period-desc":
        return sortedChallenges.sort(
          (a, b) => new Date(b.end_at).getTime() - new Date(a.end_at).getTime()
        )
      case "period-asc":
        return sortedChallenges.sort(
          (a, b) => new Date(a.end_at).getTime() - new Date(b.end_at).getTime()
        )
      default:
        return sortedChallenges
    }
  }, [challenges, sortType])
}
