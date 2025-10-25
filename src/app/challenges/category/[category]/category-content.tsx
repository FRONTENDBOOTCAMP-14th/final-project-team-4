"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import useSWR from "swr"
import RankedChallengeCard from "@/components/challenge/ranked-challenge-card/ranked-challenge-card"
import ChallengeCard from "@/components/common/challenge-card/challenge-card"
import ChallengeCardList from "@/components/common/challenge-card-list/challenge-card-list"
import FilterButton from "@/components/common/filter-button/filter-button"
import SortButton from "@/components/common/sort-button/sort-button"
import type { SortType } from "@/components/common/sort-button/sort-button"
import type { Challenge } from "@/utils/supabase"
import {
  getTopChallengesByCategoryClient,
  getChallengesByCategoryClient,
} from "@/utils/supabase/api/categories-client"
import useUserStore from "store/userStore"
import styles from "./page.module.css"

interface CategoryContentProps {
  category: string
  initialTopChallenges: Challenge[]
  initialChallenges: Challenge[]
}

const fetcher = async (key: string) => {
  const [type, category, uploadingType, sortType, limit] = key.split("|")

  if (type === "top") {
    return getTopChallengesByCategoryClient(category, parseInt(limit))
  }

  return getChallengesByCategoryClient(
    category,
    uploadingType === "all" ? undefined : uploadingType,
    sortType as "latest" | "popular",
    parseInt(limit)
  )
}

const ITEMS_PER_PAGE = 12

export default function CategoryContent({
  category,
  initialTopChallenges,
  initialChallenges,
}: CategoryContentProps) {
  const { fetchLoggedInUser } = useUserStore()
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["전체"])
  const [sortType, setSortType] = useState<SortType>("latest")
  const [displayedChallenges, setDisplayedChallenges] = useState<Challenge[]>(
    []
  )
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    void fetchLoggedInUser()
  }, [fetchLoggedInUser])

  const authTypes = ["전체", "사진 인증", "글쓰기 인증", "출석 체크 인증"]

  const uploadingTypeMap = useMemo(
    () => ({
      "사진 인증": "사진",
      "글쓰기 인증": "글쓰기",
      "출석 체크 인증": "출석체크",
    }),
    []
  )

  const uploadingTypeForQuery =
    selectedFilters.length === 0 || selectedFilters.includes("전체")
      ? "all"
      : uploadingTypeMap[selectedFilters[0]] || "all"

  const { data: topChallenges = initialTopChallenges } = useSWR(
    `top|${category}|||10`,
    fetcher,
    {
      fallbackData: initialTopChallenges,
    }
  )

  const { data: allChallenges = initialChallenges } = useSWR(
    `list|${category}|${uploadingTypeForQuery}|${sortType}|100`,
    fetcher,
    {
      fallbackData: initialChallenges,
    }
  )

  const filteredChallenges = useMemo(() => {
    if (selectedFilters.length === 0 || selectedFilters.includes("전체")) {
      return allChallenges
    }

    return allChallenges.filter((challenge) => {
      return selectedFilters.some(
        (filter) => uploadingTypeMap[filter] === challenge.uploading_type
      )
    })
  }, [allChallenges, selectedFilters, uploadingTypeMap])

  const loadMoreChallenges = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    setTimeout(() => {
      const startIndex = (page - 1) * ITEMS_PER_PAGE
      const endIndex = startIndex + ITEMS_PER_PAGE
      const newChallenges = filteredChallenges.slice(startIndex, endIndex)

      if (newChallenges.length === 0 || endIndex >= filteredChallenges.length) {
        setHasMore(false)
      }

      setDisplayedChallenges((prev) => {
        const existingIds = new Set(prev.map((challenge) => challenge.id))
        const uniqueNewChallenges = newChallenges.filter(
          (challenge) => !existingIds.has(challenge.id)
        )
        return [...prev, ...uniqueNewChallenges]
      })
      setPage((prev) => prev + 1)
      setIsLoading(false)
    }, 500)
  }, [page, filteredChallenges, isLoading, hasMore])

  useEffect(() => {
    setDisplayedChallenges([])
    setPage(1)
    setHasMore(true)
  }, [selectedFilters, sortType, filteredChallenges])

  useEffect(() => {
    if (displayedChallenges.length === 0) {
      loadMoreChallenges()
    }
  }, [displayedChallenges.length, loadMoreChallenges])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreChallenges()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, isLoading, loadMoreChallenges])

  function handleFilterToggle(filter: string) {
    if (filter === "전체") {
      if (selectedFilters.includes("전체")) {
        setSelectedFilters([])
      } else {
        setSelectedFilters([
          "전체",
          "사진 인증",
          "글쓰기 인증",
          "출석 체크 인증",
        ])
      }
    } else {
      setSelectedFilters((prev) => {
        const newSelection = prev.includes(filter)
          ? prev.filter((f) => f !== filter)
          : [...prev, filter]

        const withoutAll = newSelection.filter((f) => f !== "전체")

        const allIndividualSelected = [
          "사진 인증",
          "글쓰기 인증",
          "출석 체크 인증",
        ].every((auth) => withoutAll.includes(auth))

        return allIndividualSelected ? [...withoutAll, "전체"] : withoutAll
      })
    }
  }

  function handleSortChange(newSort: SortType) {
    setSortType(newSort)
  }

  return (
    <>
      <ChallengeCardList
        title={`인기 ${category} 챌린지 TOP 10`}
        challenges={topChallenges}
        renderCard={(challenge, index) => (
          <RankedChallengeCard
            challenge={challenge}
            rank={index + 1}
            participantCount={challenge.participants_count}
            daysLeft={Math.ceil(
              (new Date(challenge.end_at).getTime() -
                new Date(challenge.start_at).getTime()) /
                (1000 * 60 * 60 * 24)
            )}
          />
        )}
      />

      <section className={styles.filterSection}>
        <h2 className={styles.sectionTitle}>{category} 챌린지</h2>

        <div className={styles.filterButtonGroup}>
          {authTypes.map((authType) => (
            <FilterButton
              key={authType}
              label={authType}
              isSelected={selectedFilters.includes(authType)}
              onClick={() => handleFilterToggle(authType)}
              isAllButton={authType === "전체"}
            />
          ))}
        </div>

        <div className={styles.sortButtonWrapper}>
          <SortButton defaultSort="latest" onSortChange={handleSortChange} />
        </div>
      </section>

      <section className={styles.challengeGrid}>
        {displayedChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            participantCount={challenge.participants_count}
            daysLeft={Math.ceil(
              (new Date(challenge.end_at).getTime() -
                new Date(challenge.start_at).getTime()) /
                (1000 * 60 * 60 * 24)
            )}
          />
        ))}
      </section>

      {isLoading && (
        <div className={styles.loadingIndicator}>
          <div className={styles.spinner} />
          챌린지 정보를 불러오는 중..
        </div>
      )}

      {displayedChallenges.length === 0 && !isLoading && (
        <div className={styles.emptyState}>
          <p>해당 조건의 챌린지가 없습니다.</p>
        </div>
      )}

      <div ref={observerTarget} className={styles.observerTarget} />
    </>
  )
}
