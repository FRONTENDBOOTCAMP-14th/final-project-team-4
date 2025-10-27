import clsx from "clsx"
import Link from "next/link"
import linkStyles from "@/components/common/button/button.module.css"
import CategoryTag from "@/components/common/category-tag/category-tag"
import calcChallengeDuration from "@/utils/calcChallengeDuration"
import getDaysElapsed from "@/utils/getDaysElapsed"
import styles from "./user-challenge-card.module.css"
import type { ChallengeWithStatus } from "../user-challenges-section/user-challenges-section-wrapper"

export default function UserChallengeCard({
  challenge,
  recorded,
  isFinished,
  isMyPage,
}: ChallengeWithStatus) {
  const challengeDuration = calcChallengeDuration(
    challenge.start_at,
    challenge.end_at
  )
  const daysElapsed = getDaysElapsed(challenge.start_at)

  const titleLength = challenge.title.length
  const bigTitleMinLength = 14
  const isBigTitle = titleLength >= bigTitleMinLength

  return (
    <article className={styles.challengeCard}>
      <h4 className={clsx(styles.title, { [styles.smallTitle]: isBigTitle })}>
        {challenge.title}
      </h4>
      <div>
        <CategoryTag category={challenge.category} />
      </div>
      {challenge.tags && challenge.tags.length > 0 && (
        <div className={styles.categoryHashtags}>
          {challenge.tags.map((tag, index) => (
            <span key={index} className={styles.categoryHashtag}>
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className={styles.userData}>
        <div className={styles.userDataTop}>
          {isFinished ? (
            <div>챌린지 기간 : {challengeDuration}일</div>
          ) : (
            <div
              className={styles.period}
              aria-label={`총 ${challengeDuration}일 중 ${daysElapsed}일째`}
            >
              <span className={styles.startDate}>{daysElapsed}일</span>
              <span role="separator" aria-hidden="true">
                {" "}
                /{" "}
              </span>
              <span className={styles.endDate}>{challengeDuration}일</span>
            </div>
          )}
          {isFinished ? null : recorded ? (
            <div className={clsx(styles.todaysCheck, styles.todaysCheckDone)}>
              오늘 인증 완료!
            </div>
          ) : (
            <div
              className={clsx(styles.todaysCheck, styles.todaysCheckNotDone)}
            >
              오늘 인증 미완료
            </div>
          )}
        </div>
        <div className={styles.progress}>
          <label htmlFor="progress" aria-label="챌린지 진행률" />
          <progress
            id="progress"
            className={styles.progressBar}
            value={daysElapsed}
            max={challengeDuration}
          />
        </div>
      </div>
      <div className={styles.links}>
        {recorded || isFinished || !isMyPage ? null : (
          <Link
            href={`/challenges/${challenge.id}#recordCreate`}
            className={clsx(styles.link, linkStyles.primary, linkStyles.button)}
          >
            인증하기
          </Link>
        )}
        <Link
          href={`/challenges/${challenge.id}`}
          className={clsx(
            styles.link,
            linkStyles.showDetail,
            linkStyles.button
          )}
        >
          상세보기
        </Link>
      </div>
    </article>
  )
}
