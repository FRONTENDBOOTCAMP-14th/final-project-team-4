"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import EmptyChallenge from "@/components/challenge/empty-challenge/empty-challenge"
import NoSearchResult from "@/components/challenge/no-search-result/no-search-result"
import ChallengeCardList from "@/components/common/challenge-card-list/challenge-card-list"
import SortButton from "@/components/common/sort-button/sort-button"
import type { SortType } from "@/components/common/sort-button/sort-button"
import type { Challenge } from "@/utils/supabase"
import styles from "./page.module.css"

const DUMMY_CHALLENGES: Challenge[] = [
  // 햄스터 관련 챌린지들
  {
    id: "hamster-1",
    category: "취미",
    title: "귀여운 햄스터 사진 찍고 공유하는 챌린지",
    thumbnail: "/test.png",
    description: "매일 귀여운 햄스터 사진을 찍어서 공유해보세요!",
    is_public: true,
    is_finished: false,
    tags: ["매일 인증", "꾸준함"],
    created_by_id: "user-1",
    start_at: new Date().toISOString(),
    end_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    success_threshold_percent: 80,
    uploading_type: "사진",
    participants_count: 0,
    owner: null,
  },
  {
    id: "hamster-2",
    category: "취미",
    title: "웃는 햄스터만 찍어요",
    thumbnail: "/images/banner-img1.png",
    description: "웃고 있는 햄스터의 모습을 담아보세요!",
    is_public: true,
    is_finished: false,
    tags: ["1일 1회 인증", "건강"],
    created_by_id: "user-2",
    start_at: new Date().toISOString(),
    end_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    success_threshold_percent: 70,
    uploading_type: "출석체크",
    participants_count: 0,
    owner: null,
  },
  {
    id: "hamster-3",
    category: "취미",
    title: "햄스터 일기 쓰기 챌린지",
    thumbnail: "/test.png",
    description: "햄스터와 함께한 하루를 일기로 남겨보세요!",
    is_public: true,
    is_finished: false,
    tags: ["매일 인증", "꾸준함"],
    created_by_id: "user-3",
    start_at: new Date().toISOString(),
    end_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    success_threshold_percent: 75,
    uploading_type: "글쓰기",
    participants_count: 0,
    owner: null,
  },
  // 운동 관련 챌린지들
  {
    id: "exercise-1",
    category: "건강 / 운동",
    title: "일주일 물만 먹기 챌린지 다 2L 마시기",
    thumbnail: "/images/banner-img1.png",
    description: "매일 2L의 물을 마시는 습관을 만들어보세요!",
    is_public: true,
    is_finished: false,
    tags: ["1일 1회 인증", "건강"],
    created_by_id: "user-4",
    start_at: new Date().toISOString(),
    end_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    success_threshold_percent: 85,
    uploading_type: "사진",
    participants_count: 0,
    owner: null,
  },
  {
    id: "exercise-2",
    category: "건강 / 운동",
    title: "매일 아침 스트레칭 30분",
    thumbnail: "/test.png",
    description: "아침에 30분씩 스트레칭으로 하루를 시작해보세요!",
    is_public: true,
    is_finished: false,
    tags: ["매일 인증", "건강"],
    created_by_id: "user-5",
    start_at: new Date().toISOString(),
    end_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    success_threshold_percent: 80,
    uploading_type: "사진",
    participants_count: 0,
    owner: null,
  },
  {
    id: "exercise-3",
    category: "건강 / 운동",
    title: "하루 만보 걷기 챌린지",
    thumbnail: "/images/banner-img1.png",
    description: "매일 만보를 걸어서 건강한 생활을 만들어보세요!",
    is_public: true,
    is_finished: false,
    tags: ["1일 1회 인증", "건강"],
    created_by_id: "user-6",
    start_at: new Date().toISOString(),
    end_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    success_threshold_percent: 90,
    uploading_type: "출석체크",
    participants_count: 0,
    owner: null,
  },
  {
    id: "exercise-4",
    category: "건강 / 운동",
    title: "요가 30일 챌린지",
    thumbnail: "/test.png",
    description: "30일 동안 매일 요가를 통해 몸과 마음을 정화해보세요!",
    is_public: true,
    is_finished: false,
    tags: ["매일 인증", "건강"],
    created_by_id: "user-7",
    start_at: new Date().toISOString(),
    end_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    success_threshold_percent: 80,
    uploading_type: "글쓰기",
    participants_count: 0,
    owner: null,
  },
  // 학습 관련 챌린지들
  {
    id: "study-1",
    category: "학습",
    title: "매일 영어 단어 10개 외우기",
    thumbnail: "/images/banner-img1.png",
    description: "매일 10개의 영어 단어를 외워서 어휘력을 늘려보세요!",
    is_public: true,
    is_finished: false,
    tags: ["매일 인증", "꾸준함"],
    created_by_id: "user-8",
    start_at: new Date().toISOString(),
    end_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    success_threshold_percent: 85,
    uploading_type: "사진",
    participants_count: 0,
    owner: null,
  },
  {
    id: "study-2",
    category: "학습",
    title: "독서 감상문 쓰기",
    thumbnail: "/test.png",
    description: "읽은 책에 대한 감상문을 써서 독서 습관을 만들어보세요!",
    is_public: true,
    is_finished: false,
    tags: ["1일 1회 인증", "건강"],
    created_by_id: "user-9",
    start_at: new Date().toISOString(),
    end_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    success_threshold_percent: 75,
    uploading_type: "글쓰기",
    participants_count: 0,
    owner: null,
  },
  {
    id: "study-3",
    category: "학습",
    title: "코딩 공부 출석체크",
    thumbnail: "/images/banner-img1.png",
    description: "매일 코딩 공부를 하고 출석체크를 해보세요!",
    is_public: true,
    is_finished: false,
    tags: ["매일 인증", "꾸준함"],
    created_by_id: "user-10",
    start_at: new Date().toISOString(),
    end_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    success_threshold_percent: 80,
    uploading_type: "출석체크",
    participants_count: 0,
    owner: null,
  },
  // 습관 관련 챌린지들
  {
    id: "habit-1",
    category: "습관",
    title: "양치를 꾸준히 해요",
    thumbnail: "/test.png",
    description: "매일 아침, 저녁으로 양치질을 하는 습관을 만들어보세요!",
    is_public: true,
    is_finished: false,
    tags: ["1일 1회 인증", "건강"],
    created_by_id: "user-11",
    start_at: new Date().toISOString(),
    end_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    success_threshold_percent: 90,
    uploading_type: "사진",
    participants_count: 0,
    owner: null,
  },
  {
    id: "habit-2",
    category: "습관",
    title: "저녁 10시 이전 취침하기",
    thumbnail: "/images/banner-img1.png",
    description: "규칙적인 수면 습관을 위해 10시 이전에 잠자리에 들어보세요!",
    is_public: true,
    is_finished: false,
    tags: ["매일 인증", "건강"],
    created_by_id: "user-12",
    start_at: new Date().toISOString(),
    end_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    success_threshold_percent: 85,
    uploading_type: "출석체크",
    participants_count: 0,
    owner: null,
  },
  {
    id: "habit-3",
    category: "습관",
    title: "일기 쓰기 습관 만들기",
    thumbnail: "/test.png",
    description: "매일 하루를 정리하는 일기 쓰기 습관을 만들어보세요!",
    is_public: true,
    is_finished: false,
    tags: ["1일 1회 인증", "건강"],
    created_by_id: "user-13",
    start_at: new Date().toISOString(),
    end_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    success_threshold_percent: 80,
    uploading_type: "글쓰기",
    participants_count: 0,
    owner: null,
  },
]

export default function ChallengeSearch() {
  const searchParams = useSearchParams()
  const keyword = searchParams.get("q") || ""

  const [_photoSort, setPhotoSort] = useState<SortType>("latest")
  const [_writingSort, setWritingSort] = useState<SortType>("latest")
  const [_attendanceSort, setAttendanceSort] = useState<SortType>("latest")

  const searchResults = DUMMY_CHALLENGES.filter((challenge) =>
    challenge.title.includes(keyword)
  )

  const photoChallenges = searchResults.filter(
    (c) => c.uploading_type === "사진"
  )
  const writingChallenges = searchResults.filter(
    (c) => c.uploading_type === "글쓰기"
  )
  const attendanceChallenges = searchResults.filter(
    (c) => c.uploading_type === "출석체크"
  )

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
                defaultSort="latest"
                onSortChange={(sort) => setPhotoSort(sort)}
              />
            </div>
          </div>

          {photoChallenges.length > 0 ? (
            <div className={styles.swiperContainer}>
              <ChallengeCardList challenges={photoChallenges} />
            </div>
          ) : (
            <div className={styles.emptyChallengeWrapper}>
              <EmptyChallenge keyword={keyword} challengeType="사진 인증" />
            </div>
          )}
        </section>

        <section className={styles.authSection}>
          <div className={styles.authHeader}>
            <h2 className={styles.sectionTitle}>글쓰기 인증</h2>
            <hr className={styles.divider} />
            <div className={styles.sortButtonWrapper}>
              <SortButton
                defaultSort="latest"
                onSortChange={(sort) => setWritingSort(sort)}
              />
            </div>
          </div>

          {writingChallenges.length > 0 ? (
            <div className={styles.swiperContainer}>
              <ChallengeCardList challenges={writingChallenges} />
            </div>
          ) : (
            <div className={styles.emptyChallengeWrapper}>
              <EmptyChallenge keyword={keyword} challengeType="글쓰기 인증" />
            </div>
          )}
        </section>

        <section className={styles.authSection}>
          <div className={styles.authHeader}>
            <h2 className={styles.sectionTitle}>출석체크 인증</h2>
            <hr className={styles.divider} />
            <div className={styles.sortButtonWrapper}>
              <SortButton
                defaultSort="latest"
                onSortChange={(sort) => setAttendanceSort(sort)}
              />
            </div>
          </div>

          {attendanceChallenges.length > 0 ? (
            <div className={styles.swiperContainer}>
              <ChallengeCardList challenges={attendanceChallenges} />
            </div>
          ) : (
            <div className={styles.emptyChallengeWrapper}>
              <EmptyChallenge keyword={keyword} challengeType="출석체크 인증" />
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
