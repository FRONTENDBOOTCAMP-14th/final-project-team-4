import UserChallengeCard from "@/components/user/user-page/user-challenge-card/user-challenge-card"
import styles from "./user-challenge-list.module.css"

export default function UserChallengeList(challenge) {
  return (
    <ul className={styles.challengeList}>
      <li key={challenge.id}>
        <UserChallengeCard />
      </li>
    </ul>
  )
}
