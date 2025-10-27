"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import ChallengeCard from "@/components/common/challenge-card/challenge-card"
import FilterButton from "@/components/common/filter-button/filter-button"
import TwoSortButton from "@/components/common/two-sort-button/two-sort-button"
import type { TwoSortType } from "@/components/common/two-sort-button/two-sort-button"
import { useAuth } from "@/contexts/AuthContext"
import { useWishlist } from "@/utils/hooks/useWishlist"
import styles from "./page.module.css"

export default function Wishlist() {
  const { user, loading: authLoading } = useAuth()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAuthTypes, setSelectedAuthTypes] = useState<string[]>([])
  const [sortType, setSortType] = useState<TwoSortType>("latest")

  const observerTarget = useRef<HTMLDivElement>(null)

  const {
    challenges: displayedChallenges,
    isLoading,
    error,
    hasMore,
    loadMore,
  } = useWishlist({
    categories: selectedCategories,
    authTypes: selectedAuthTypes,
    sortType,
    limit: 12,
  })

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
  }

  function handleSortChange(newSort: TwoSortType) {
    setSortType(newSort)
  }

  const loadMoreChallenges = useCallback(() => {
    if (isLoading || !hasMore) return
    void loadMore()
  }, [isLoading, hasMore, loadMore])

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

  // 인증 상태 로딩 중일 때 처리
  if (authLoading) {
    return (
      <div className={styles.pageWrapper}>
        <main className={styles.main}>
          <div className={styles.loadingIndicator}>
            <div className={styles.spinner} />
            로딩 중...
          </div>
        </main>
      </div>
    )
  }

  // 유저가 없으면 로그인 필요 메시지 표시
  if (!user) {
    return (
      <div className={styles.pageWrapper}>
        <main className={styles.main}>
          <div className={styles.emptyState}>
            <div className={styles.emptyContent}>
              <h3 className={styles.emptyTitle}>로그인이 필요합니다</h3>
              <p className={styles.emptyDescription}>
                찜한 챌린지를 보려면 로그인해주세요.
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // 에러가 발생했을 때 처리 (유저가 있고 로딩이 완료된 경우만)
  if (error && user && !authLoading) {
    return (
      <div className={styles.pageWrapper}>
        <main className={styles.main}>
          <div className={styles.emptyState}>
            <div className={styles.emptyContent}>
              <h3 className={styles.emptyTitle}>오류가 발생했습니다</h3>
              <p className={styles.emptyDescription}>{error}</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

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
            {displayedChallenges.map((challenge, index) => {
              // 남은 일수 계산
              const now = new Date()
              const endDate = new Date(challenge.end_at)
              const daysLeft = Math.ceil(
                (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              )

              return (
                <ChallengeCard
                  key={`${challenge.id}-${index}`}
                  challenge={challenge}
                  participantCount={challenge.participants_count}
                  daysLeft={Math.max(0, daysLeft)}
                />
              )
            })}
          </section>
        ) : !isLoading ? (
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
        ) : null}

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
