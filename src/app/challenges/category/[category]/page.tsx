"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import RankedChallengeCard from "@/components/challenge/ranked-challenge-card/ranked-challenge-card"
import ChallengeCard from "@/components/common/challenge-card/challenge-card"
import ChallengeCardList from "@/components/common/challenge-card-list/challenge-card-list"
import FilterButton from "@/components/common/filter-button/filter-button"
import SortButton from "@/components/common/sort-button/sort-button"
import type { SortType } from "@/components/common/sort-button/sort-button"
import type { Challenge } from "@/types"
import styles from "./page.module.css"

const DUMMY_CHALLENGES: Challenge[] = Array.from({ length: 100 }, (_, i) => ({
  id: `challenge-${i + 1}`,
  category: "건강 / 운동",
  title: [
    "일주일 물만 먹기 챌린지 다 2L 마시기",
    "귀여운 햄스터 사진 찍고 공유하는 챌린지",
    "양치를 꾸준히 해요",
    "1일 10식 모임",
    "매일 아침 스트레칭 30분",
    "저녁 10시 이전 취침하기",
    "하루 만보 걷기 챌린지",
    "요가 30일 챌린지",
  ][i % 8],
  thumbnail: ["/test.png", "/images/banner-img1.png"][i % 2],
  description: `챌린지 ${i + 1} 설명입니다. 함께 목표를 달성해봐요!`,
  is_public: true,
  is_finished: false,
  tags: [
    ["1일 1회 인증", "건강"],
    ["매일 인증", "꾸준함"],
    ["운동", "건강"],
    ["생활습관", "건강"],
  ][i % 4],
  created_by_id: `user-${i + 1}`,
  end_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  success_threshold_percent: 80,
  uploading_type: ["사진", "글쓰기", "출석체크"][i % 3],
}))

const ITEMS_PER_PAGE = 12

export default function ChallengeCategory() {
  const params = useParams()
  const category = params.category as string

  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [sortType, setSortType] = useState<SortType>("latest")
  const [displayedChallenges, setDisplayedChallenges] = useState<Challenge[]>(
    []
  )
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const observerTarget = useRef<HTMLDivElement>(null)

  const authTypes = ["전체", "사진 인증", "글쓰기 인증", "출석 체크 인증"]

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
    setPage(1)
    setDisplayedChallenges([])
  }

  function handleSortChange(newSort: SortType) {
    setSortType(newSort)
    setPage(1)
    setDisplayedChallenges([])
  }

  const loadMoreChallenges = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    setTimeout(() => {
      let filteredChallenges = [...DUMMY_CHALLENGES]

      if (selectedFilters.length > 0 && !selectedFilters.includes("전체")) {
        filteredChallenges = filteredChallenges.filter((challenge) => {
          const uploadingTypeMap: Record<string, string> = {
            "사진 인증": "사진",
            "글쓰기 인증": "글쓰기",
            "출석 체크 인증": "출석체크",
          }
          return selectedFilters.some(
            (filter) => uploadingTypeMap[filter] === challenge.uploading_type
          )
        })
      }

      const startIndex = (page - 1) * ITEMS_PER_PAGE
      const endIndex = startIndex + ITEMS_PER_PAGE
      const newChallenges = filteredChallenges.slice(startIndex, endIndex)

      if (newChallenges.length === 0 || endIndex >= filteredChallenges.length) {
        setHasMore(false)
      }

      setDisplayedChallenges((prev) => [...prev, ...newChallenges])
      setPage((prev) => prev + 1)
      setIsLoading(false)
    }, 500)
  }, [page, selectedFilters, isLoading, hasMore])

  useEffect(() => {
    setDisplayedChallenges([])
    setPage(1)
    setHasMore(true)
  }, [selectedFilters, sortType])

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

  const topChallenges = DUMMY_CHALLENGES.slice(0, 10)

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.main}>
        <ChallengeCardList
          title={`인기 ${decodeURIComponent(category)} 챌린지 TOP 10`}
          challenges={topChallenges}
          renderCard={(challenge, index) => (
            <RankedChallengeCard
              challenge={challenge}
              rank={index + 1}
              participantCount={500 - index * 30}
              daysLeft={7}
            />
          )}
        />

        <section className={styles.filterSection}>
          <h2 className={styles.sectionTitle}>
            {decodeURIComponent(category)} 챌린지
          </h2>

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
          {displayedChallenges.map((challenge, index) => (
            <ChallengeCard
              key={`${challenge.id}-${index}`}
              challenge={challenge}
              participantCount={123 + index * 5}
              daysLeft={7}
            />
          ))}
        </section>

        {isLoading && (
          <div className={styles.loadingIndicator}>
            <div className={styles.spinner} />
            챌린지 정보를 불러오는 중..
          </div>
        )}

        <div ref={observerTarget} className={styles.observerTarget} />
      </main>
    </div>
  )
}
