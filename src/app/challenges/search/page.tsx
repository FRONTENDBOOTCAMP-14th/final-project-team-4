"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import EmptyChallenge from "@/components/challenge/empty-challenge/empty-challenge"
import NoSearchResult from "@/components/challenge/no-search-result/no-search-result"
import ChallengeCardList from "@/components/common/challenge-card-list/challenge-card-list"
import SortButton from "@/components/common/sort-button/sort-button"
import {
  useSearch,
  useSearchByAuthType,
  useSortedChallenges,
} from "@/utils/hooks/useSearch"
import { useSearchStore } from "store/useSearchStore"
import styles from "./page.module.css"

export default function ChallengeSearch() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const keyword = searchParams.get("q") || ""

  const {
    photoSort,
    writingSort,
    attendanceSort,
    setPhotoSort,
    setWritingSort,
    setAttendanceSort,
    resetSearch,
  } = useSearchStore()

  const handleCreateClick = () => {
    router.push("/challenges/create")
  }

  const shouldSearch = keyword?.trim().length > 0

  const {
    searchResults,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearch({
    query: keyword,
    enabled: shouldSearch,
  })

  const { challenges: photoChallenges, isLoading: isPhotoLoading } =
    useSearchByAuthType({
      query: keyword,
      authType: "사진",
      enabled: shouldSearch,
    })

  const { challenges: writingChallenges, isLoading: isWritingLoading } =
    useSearchByAuthType({
      query: keyword,
      authType: "글쓰기",
      enabled: shouldSearch,
    })

  const { challenges: attendanceChallenges, isLoading: isAttendanceLoading } =
    useSearchByAuthType({
      query: keyword,
      authType: "출석체크",
      enabled: shouldSearch,
    })

  const sortedPhotoChallenges = useSortedChallenges(photoChallenges, photoSort)
  const sortedWritingChallenges = useSortedChallenges(
    writingChallenges,
    writingSort
  )
  const sortedAttendanceChallenges = useSortedChallenges(
    attendanceChallenges,
    attendanceSort
  )

  useEffect(() => {
    if (!shouldSearch) {
      resetSearch()
    }
  }, [keyword, shouldSearch, resetSearch])

  if (!shouldSearch) {
    return (
      <div className={styles.pageWrapper}>
        <main className={styles.main}>
          <div className={styles.noSearchWrapper}>
            <div className={styles.emptyState}>
              <h2>검색어를 입력해주세요</h2>
              <p>챌린지를 검색하려면 검색어를 입력하세요.</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (isSearchLoading) {
    return (
      <div className={styles.pageWrapper}>
        <main className={styles.main}>
          <div className={styles.loadingWrapper}>
            <p>검색 중...</p>
          </div>
        </main>
      </div>
    )
  }

  if (searchError) {
    return (
      <div className={styles.pageWrapper}>
        <main className={styles.main}>
          <div className={styles.errorWrapper}>
            <p>검색 중 오류가 발생했습니다: {searchError}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.main}>
        {searchResults.length > 0 ? (
          <ChallengeCardList
            title={`"${keyword}"의 검색 결과`}
            challenges={searchResults}
          />
        ) : (
          <div className={styles.noSearchWrapper}>
            <NoSearchResult keyword={keyword} />
          </div>
        )}

        <section className={styles.authSection}>
          <div className={styles.authHeader}>
            <h2 className={styles.sectionTitle}>사진 인증</h2>
            <hr className={styles.divider} />
            <div className={styles.sortButtonWrapper}>
              <SortButton
                defaultSort={photoSort}
                onSortChange={(sort) => setPhotoSort(sort)}
              />
            </div>
          </div>

          {isPhotoLoading ? (
            <div className={styles.loadingWrapper}>
              <p>사진 인증 챌린지를 불러오는 중...</p>
            </div>
          ) : sortedPhotoChallenges().length > 0 ? (
            <div className={styles.swiperContainer}>
              <ChallengeCardList challenges={sortedPhotoChallenges()} />
            </div>
          ) : (
            <div className={styles.emptyChallengeWrapper}>
              <EmptyChallenge
                keyword={keyword}
                challengeType="사진 인증"
                onCreateClick={handleCreateClick}
              />
            </div>
          )}
        </section>

        <section className={styles.authSection}>
          <div className={styles.authHeader}>
            <h2 className={styles.sectionTitle}>글쓰기 인증</h2>
            <hr className={styles.divider} />
            <div className={styles.sortButtonWrapper}>
              <SortButton
                defaultSort={writingSort}
                onSortChange={(sort) => setWritingSort(sort)}
              />
            </div>
          </div>

          {isWritingLoading ? (
            <div className={styles.loadingWrapper}>
              <p>글쓰기 인증 챌린지를 불러오는 중...</p>
            </div>
          ) : sortedWritingChallenges().length > 0 ? (
            <div className={styles.swiperContainer}>
              <ChallengeCardList challenges={sortedWritingChallenges()} />
            </div>
          ) : (
            <div className={styles.emptyChallengeWrapper}>
              <EmptyChallenge
                keyword={keyword}
                challengeType="글쓰기 인증"
                onCreateClick={handleCreateClick}
              />
            </div>
          )}
        </section>

        <section className={styles.authSection}>
          <div className={styles.authHeader}>
            <h2 className={styles.sectionTitle}>출석체크 인증</h2>
            <hr className={styles.divider} />
            <div className={styles.sortButtonWrapper}>
              <SortButton
                defaultSort={attendanceSort}
                onSortChange={(sort) => setAttendanceSort(sort)}
              />
            </div>
          </div>

          {isAttendanceLoading ? (
            <div className={styles.loadingWrapper}>
              <p>출석체크 인증 챌린지를 불러오는 중...</p>
            </div>
          ) : sortedAttendanceChallenges().length > 0 ? (
            <div className={styles.swiperContainer}>
              <ChallengeCardList challenges={sortedAttendanceChallenges()} />
            </div>
          ) : (
            <div className={styles.emptyChallengeWrapper}>
              <EmptyChallenge
                keyword={keyword}
                challengeType="출석체크 인증"
                onCreateClick={handleCreateClick}
              />
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
