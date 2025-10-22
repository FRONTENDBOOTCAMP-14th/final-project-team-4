import HotChallengeCarousel from "@/components/challenge/hot-challenge-carousel/hot-challenge-carousel"
import AdCarousel from "@/components/common/ad-carousel/ad-carousel"
import ChallengeCardList from "@/components/common/challenge-card-list/challenge-card-list"
import type { Challenge } from "@/utils/supabase"
import styles from "./page.module.css"

// 더미 데이터
const DUMMY_CHALLENGES: Challenge[] = Array.from({ length: 20 }, (_, i) => ({
  id: `challenge-${i + 1}`,
  category: ["건강 / 운동", "학습", "습관", "취미"][i % 4],
  title: [
    "12시간 이상 자고 싶은 부엉이를 모이세요",
    "일주일 물만 먹기 챌린지 다 2L 마시기",
    "귀여운 햄스터 사진 찍고 공유하는 챌린지",
    "양치를 꾸준히 해요",
    "1일 10식 모임 챌린지",
  ][i % 5],
  thumbnail: ["/test.png", "/images/banner-img1.png"][i % 2],
  description: `챌린지 ${i + 1} 설명입니다. 함께 목표를 달성해봐요!`,
  is_public: true,
  is_finished: false,
  tags: ["1일 1회 인증", "건강"],
  created_by_id: `user-${i + 1}`,
  start_at: new Date().toISOString(),
  end_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  success_threshold_percent: 80,
  uploading_type: ["사진", "글쓰기", "출석체크"][i % 3],
  participants_count: 0,
  owner: null,
}))

export default function Home() {
  return (
    <div className={styles.pageWrapper}>
      <main className={styles.main}>
        <AdCarousel />
        <HotChallengeCarousel
          title="지금 뜨는 챌린지"
          challenges={DUMMY_CHALLENGES}
        />
        <ChallengeCardList
          title="새로 생긴 챌린지"
          challenges={DUMMY_CHALLENGES}
        />
        <ChallengeCardList
          title="사진 인증 챌린지"
          challenges={DUMMY_CHALLENGES.filter(
            (c) => c.uploading_type === "사진"
          )}
        />
        <ChallengeCardList
          title="글쓰기 인증 챌린지"
          challenges={DUMMY_CHALLENGES.filter(
            (c) => c.uploading_type === "글쓰기"
          )}
        />
        <ChallengeCardList
          title="출석체크 인증 챌린지"
          challenges={DUMMY_CHALLENGES.filter(
            (c) => c.uploading_type === "출석체크"
          )}
        />
      </main>
    </div>
  )
}
