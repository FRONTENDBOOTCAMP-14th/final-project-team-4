import styles from "./no-challenges-yet.module.css"
import type { TabType } from "../user-challenges-section/user-challenges-section"

interface NoChallengesYetProps {
  activeTab: TabType
  isMyPage: boolean
}

export default function NoChallengesYet({
  activeTab,
  isMyPage,
}: NoChallengesYetProps) {
  let message = ""

  if (activeTab === "ongoing") {
    message = "진행중인 챌린지가 없어요!"
  } else if (activeTab === "past") {
    message = "지난 챌린지가 없어요!"
  } else if (activeTab === "created") {
    message = "만든 챌린지가 없어요!"
  }

  return (
    <div className={styles.container}>
      <p className={styles.mainMessage}>{message}</p>
      {isMyPage ?? (
        <p className={styles.subMessage}>지금 바로! 챌린지에 도전해보세요!</p>
      )}
    </div>
  )
}
