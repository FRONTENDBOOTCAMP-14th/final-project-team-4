import AdCarousel from "@/components/common/ad-carousel/ad-carousel"
import HomeChallenges from "@/components/home/home-challenges"
import {
  getHotChallenges,
  getNewChallenges,
  getChallengesByType,
} from "@/utils/supabase/api/challenges"
import styles from "./page.module.css"

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
    getChallengesByType("사진", 20),
    getChallengesByType("글쓰기", 20),
    getChallengesByType("출석체크", 20),
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
