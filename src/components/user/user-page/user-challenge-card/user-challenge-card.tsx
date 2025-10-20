import Button from "@/components/common/button/button"
import CategoryTag from "@/components/common/category-tag/category-tag"
import styles from "./user-challenge-card.module.css"

const challengeTest = {
  id: "234l23kk23",
  category: "습관",
  title: "습관 만들기",
  thumbnail: "/public/test.png",
  description: "함께해요 습관 만들기!",
  is_public: true,
  is_finished: false,
  // is_finished: true,
  tags: ["습관", "함께해요"],
  created_by_id: "JONAS",
  start_at: "2025-10-10 07:00:00+00",
  end_at: "2025-12-31 14:59:59+00",
  success_threshold_percent: 80,
  uploading_type: "사진",
  participants_count: 4,
}

export default function UserChallengeCard() {
  return (
    <article className={styles.challengeCard}>
      <h4 className={styles.title}>{challengeTest.title}</h4>
      <div>
        <CategoryTag category="습관" />
      </div>
      {challengeTest.tags && challengeTest.tags.length > 0 && (
        <div className={styles.categoryHashtags}>
          {challengeTest.tags.map((tag, index) => (
            <span key={index} className={styles.categoryHashtag}>
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className={styles.userData}>
        <div className={styles.userDataTop}>
          <div className={styles.period} aria-label="총 3일 중 1일째">
            <span className={styles.startDate}>1일</span>
            <span role="separator" aria-hidden="true">
              {" "}
              /{" "}
            </span>
            <span className={styles.endDate}>3일</span>
          </div>
          <div className={styles.todaysCheck}>오늘 인증 완료!</div>
        </div>
        <div className={styles.progress}>
          <label htmlFor="progress" aria-label="챌린지 진행률" />
          <progress
            id="progress"
            className={styles.progressBar}
            value={1}
            max={3}
          >
            33%
          </progress>
        </div>
      </div>
      <div className={styles.buttons}>
        <Button type="button" className="primary">
          인증하기
        </Button>
        <Button type="button" className="showDetail">
          상세보기
        </Button>
      </div>
    </article>
  )
}
