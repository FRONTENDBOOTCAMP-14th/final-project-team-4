// import Button from "@/components/common/button/button"
// import BadgeList from "@/components/user/badge-list/badge-list"
import styles from "./user-statics-section.module.css"
import type { UserStatics } from "../user-challenges-section/user-challenges-section-wrapper"

interface UserStaticsSectionProps {
  statics: UserStatics
  isMyPage?: boolean
}

export default function UserStaticsSection({
  statics,
  isMyPage,
}: UserStaticsSectionProps) {
  return (
    <section className={styles.userStaticsSection}>
      <h3>{isMyPage ? "나" : "유저"}의 통계</h3>
      <ul className={styles.staticsList}>
        <li className={styles.staticsListItem}>
          진행 중인 챌린지<span>{statics.onGoingChallenges}</span>
        </li>
        <li className={styles.staticsListItem}>
          성공한 챌린지<span>{statics.succeededChallenges}</span>
        </li>
        <li className={styles.staticsListItem}>
          도전한 모든 챌린지<span>{statics.totalChallenges}</span>
        </li>
        {/* 뱃지 - 추후 기능 구현 */}
        {/* <li className={styles.staticsListItem}>
          획득한 뱃지<span>{statics.achievedBadges}</span>
        </li> */}
      </ul>
      {/* <div className={styles.badgeList}>
        <h4>획득한 뱃지</h4>
        <BadgeList />
        <div className={styles.viewMoreButton}>
          <Button className="primary" type="button">
            더보기
          </Button>
        </div>
      </div> */}
    </section>
  )
}
