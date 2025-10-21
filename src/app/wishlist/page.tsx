"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import ChallengeCard from "@/components/common/challenge-card/challenge-card"
import FilterButton from "@/components/common/filter-button/filter-button"
import TwoSortButton from "@/components/common/two-sort-button/two-sort-button"
import type { TwoSortType } from "@/components/common/two-sort-button/two-sort-button"
import type { Challenge } from "@/types"
import styles from "./page.module.css"

const DUMMY_CHALLENGES: Challenge[] = Array.from({ length: 100 }, (_, i) => ({
  id: `challenge-${i + 1}`,
  category: ["건강 / 운동", "학습", "습관", "취미"][i % 4],
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

export default function Wishlist() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAuthTypes, setSelectedAuthTypes] = useState<string[]>([])
  const [sortType, setSortType] = useState<TwoSortType>("latest")
  const [displayedChallenges, setDisplayedChallenges] = useState<Challenge[]>(
    []
  )
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const observerTarget = useRef<HTMLDivElement>(null)

  const categories = ["전체", "건강 / 운동", "학습", "습관", "취미"]
  const authTypes = ["전체", "사진 인증", "글쓰기 인증", "출석 체크 인증"]

  function handleCategoryToggle(category: string) {
    if (category === "전체") {
      if (selectedCategories.includes("전체")) {
        setSelectedCategories([])
      } else {
        setSelectedCategories(["전체", "건강 / 운동", "학습", "습관", "취미"])
      }
    } else {
      setSelectedCategories((prev) => {
        const newSelection = prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]

        const withoutAll = newSelection.filter((c) => c !== "전체")

        const allIndividualSelected = [
          "건강 / 운동",
          "학습",
          "습관",
          "취미",
        ].every((cat) => withoutAll.includes(cat))

        return allIndividualSelected ? [...withoutAll, "전체"] : withoutAll
      })
    }
    setPage(1)
    setDisplayedChallenges([])
  }

  function handleAuthTypeToggle(authType: string) {
    if (authType === "전체") {
      if (selectedAuthTypes.includes("전체")) {
        setSelectedAuthTypes([])
      } else {
        setSelectedAuthTypes([
          "전체",
          "사진 인증",
          "글쓰기 인증",
          "출석 체크 인증",
        ])
      }
    } else {
      setSelectedAuthTypes((prev) => {
        const newSelection = prev.includes(authType)
          ? prev.filter((a) => a !== authType)
          : [...prev, authType]

        const withoutAll = newSelection.filter((a) => a !== "전체")

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

  function handleSortChange(newSort: TwoSortType) {
    setSortType(newSort)
    setPage(1)
    setDisplayedChallenges([])
  }

  const loadMoreChallenges = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    setTimeout(() => {
      let filteredChallenges = [...DUMMY_CHALLENGES]

      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes("전체")
      ) {
        filteredChallenges = filteredChallenges.filter((challenge) =>
          selectedCategories.includes(challenge.category)
        )
      }

      if (selectedAuthTypes.length > 0 && !selectedAuthTypes.includes("전체")) {
        filteredChallenges = filteredChallenges.filter((challenge) => {
          const uploadingTypeMap: Record<string, string> = {
            "사진 인증": "사진",
            "글쓰기 인증": "글쓰기",
            "출석 체크 인증": "출석체크",
          }
          return selectedAuthTypes.some(
            (filter) => uploadingTypeMap[filter] === challenge.uploading_type
          )
        })
      }

      if (sortType === "oldest") {
        filteredChallenges = [...filteredChallenges].reverse()
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
  }, [
    page,
    selectedCategories,
    selectedAuthTypes,
    sortType,
    isLoading,
    hasMore,
  ])

  useEffect(() => {
    setDisplayedChallenges([])
    setPage(1)
    setHasMore(true)
  }, [selectedCategories, selectedAuthTypes, sortType])

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

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.main}>
        <section className={styles.filterSection}>
          <h2 className={styles.sectionTitle}>찜한 챌린지</h2>

          <div className={styles.filterButtonGroup}>
            {categories.map((category) => (
              <FilterButton
                key={category}
                label={category}
                isSelected={selectedCategories.includes(category)}
                onClick={() => handleCategoryToggle(category)}
                isAllButton={category === "전체"}
              />
            ))}
          </div>

          <div className={styles.filterButtonGroup}>
            {authTypes.map((authType) => (
              <FilterButton
                key={authType}
                label={authType}
                isSelected={selectedAuthTypes.includes(authType)}
                onClick={() => handleAuthTypeToggle(authType)}
                isAllButton={authType === "전체"}
              />
            ))}
          </div>

          <div className={styles.sortButtonWrapper}>
            <TwoSortButton
              defaultSort="latest"
              onSortChange={handleSortChange}
            />
          </div>
        </section>

        {displayedChallenges.length > 0 ? (
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
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyContent}>
              <h3 className={styles.emptyTitle}>
                현재 찜한 챌린지가 없습니다!
              </h3>
              <p className={styles.emptyDescription}>
                마음에 드는 챌린지를 찾아서 찜해보세요.
              </p>
            </div>
          </div>
        )}

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
