import Button from "@/components/common/button/button"
import UserChallengeList from "../user-challenge-list/user-challenge-list"
import styles from "./user-challenges-section.module.css"

export default function UserChallengesSection() {
  return (
    <section className={styles.userChallengesSection}>
      <h3>내 챌린지 보기</h3>
      <div className={styles.tabsContainer}>
        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            id="tab1"
            className={`${styles.tab} ${styles.isSelected}`}
            role="tab"
            aria-selected="true"
            aria-controls="content1"
            data-primary-type="ongoingChallenges"
          >
            진행 중인 챌린지
          </button>
          <button
            type="button"
            id="tab2"
            className={styles.tab}
            role="tab"
            aria-selected="false"
            aria-controls="content2"
            data-primary-type="pastChallenges"
          >
            지난 챌린지
          </button>
          <button
            type="button"
            id="tab3"
            className={styles.tab}
            role="tab"
            aria-selected="false"
            aria-controls="content3"
            data-primary-type="challengesICreated"
          >
            내가 만든 챌린지
          </button>
        </div>
        <div className={styles.contents}>
          <section
            id="content1"
            className={`${styles.tabContent} ${styles.isSelected}`}
            role="tabpanel"
            aria-labelledby="tab1"
            data-primary-type="tourist_attraction"
          >
            <UserChallengeList />
          </section>
          <section
            id="content2"
            className={styles.tabContent}
            role="tabpanel"
            aria-labelledby="tab2"
            data-primary-type="restaurant"
          >
            <UserChallengeList />
          </section>
          <section
            id="content3"
            className={styles.tabContent}
            role="tabpanel"
            aria-labelledby="tab3"
            data-primary-type="cafe"
          >
            <UserChallengeList />
          </section>
        </div>
      </div>
      <div className={styles.viewMoreButton}>
        <Button className="primary" type="button">
          더보기
        </Button>
      </div>
    </section>
  )
}
