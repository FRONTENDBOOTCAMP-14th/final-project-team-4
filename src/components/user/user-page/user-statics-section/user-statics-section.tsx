import Button from "@/components/common/button/button"
import BadgeList from "@/components/user/badge-list/badge-list"
import styles from "./user-statics-section.module.css"

const statics = {
  onGoingChallenges: 5,
  succeededChallenges: 12,
  achievedBadges: 8,
}

export default function UserStaticsSection() {
  return (
    <section className={styles.userStaticsSection}>
      <h3>나의 통계</h3>
      <ul className={styles.staticsList}>
        <li className={styles.staticsListItem}>
          진행 중인 챌린지<span>{statics.onGoingChallenges}</span>
        </li>
        <li className={styles.staticsListItem}>
          성공한 챌린지<span>{statics.succeededChallenges}</span>
        </li>
        <li className={styles.staticsListItem}>
          획득한 뱃지<span>{statics.achievedBadges}</span>
        </li>
      </ul>
      <div className={styles.badgeList}>
        <h4>획득한 뱃지</h4>
        <BadgeList />
        <div className={styles.viewMoreButton}>
          <Button className="primary" type="button">
            더보기
          </Button>
        </div>
      </div>
    </section>
  )
}
