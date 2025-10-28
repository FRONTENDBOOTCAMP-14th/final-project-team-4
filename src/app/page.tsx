import type { Metadata } from "next"
import AdCarousel from "@/components/common/ad-carousel/ad-carousel"
import HomeChallenges from "@/components/home/home-challenges"
import {
  getHotChallenges,
  getNewChallenges,
  getChallengesByType,
} from "@/utils/supabase/api/challenges-server"
import styles from "./page.module.css"

export const metadata: Metadata = {
  title: "Minimo - 작은 챌린지, 큰 변화를 만들어가요",
  description:
    "일상을 변화시키는 새로운 챌린지에 참여하고, 다양한 사람들과 함께 성장하세요. 사진 인증, 텍스트 인증, 출석체크로 매일 조금씩 달성하세요.",
  keywords: [
    "챌린지",
    "일상 습관",
    "습관 형성",
    "자기계발",
    "목표 달성",
    "건강",
    "학습",
    "성장",
  ],
  openGraph: {
    title: "Minimo - 작은 챌린지, 큰 변화",
    description:
      "일상을 변화시키는 새로운 챌린지에 참여하고, 다양한 사람들과 함께 성장하세요.",
    type: "website",
    siteName: "Minimo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Minimo - 작은 챌린지, 큰 변화",
    description:
      "일상을 변화시키는 새로운 챌린지에 참여하고, 다양한 사람들과 함께 성장하세요.",
  },
}

export default async function Home() {
  const [
    hotChallenges,
    newChallenges,
    photoChallenges,
    writingChallenges,
    attendanceChallenges,
  ] = await Promise.all([
    getHotChallenges(20),
    getNewChallenges(20),
    getChallengesByType("사진 인증", 20),
    getChallengesByType("텍스트 인증", 20),
    getChallengesByType("출석체크 인증", 20),
  ])

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.main}>
        <AdCarousel />
        <HomeChallenges
          initialHotChallenges={hotChallenges}
          initialNewChallenges={newChallenges}
          initialPhotoChallenges={photoChallenges}
          initialWritingChallenges={writingChallenges}
          initialAttendanceChallenges={attendanceChallenges}
        />
      </main>
    </div>
  )
}
