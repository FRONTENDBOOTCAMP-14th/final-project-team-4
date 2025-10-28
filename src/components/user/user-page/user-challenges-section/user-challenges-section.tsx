"use client"

import { useState } from "react"
import type { UserPageComponentsProps } from "@/app/user/[userId]/types"
import Button from "@/components/common/button/button"
import NoChallengesYet from "../no-challenges-yet/no-challenges-yet"
import UserChallengeCard from "../user-challenge-card/user-challenge-card"
import styles from "./user-challenges-section.module.css"
import type { ChallengeWithStatus } from "./user-challenges-section-wrapper"

export type TabType = "ongoing" | "past" | "created"

interface UserChallengesSectionProps extends UserPageComponentsProps {
  ongoingChallenges: ChallengeWithStatus[]
  pastChallenges: ChallengeWithStatus[]
  createdChallenges: ChallengeWithStatus[]
}

const INITIAL_CHALLENGE_COUNT = 6
const LOAD_MORE_COUNT = 6

export default function UserChallengesSection({
  isMyPage,
  ongoingChallenges,
  pastChallenges,
  createdChallenges,
}: UserChallengesSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("ongoing")
  const [displayCount, setDisplayCount] = useState(INITIAL_CHALLENGE_COUNT)

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setDisplayCount(INITIAL_CHALLENGE_COUNT)
  }

  const getCurrentChallenges = () => {
    switch (activeTab) {
      case "ongoing":
        return ongoingChallenges
      case "past":
        return pastChallenges
      case "created":
        return createdChallenges
      default:
        return []
    }
  }

  const currentChallenges = getCurrentChallenges()

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + LOAD_MORE_COUNT)
  }

  const challengesToDisplay = currentChallenges.slice(0, displayCount)

  const shouldShowViewMore =
    currentChallenges.length > challengesToDisplay.length

  return (
    <section className={styles.userChallengesSection}>
      <h3>{isMyPage ? "내" : "유저"} 챌린지 보기</h3>
      <div className={styles.tabsContainer}>
        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "ongoing" ? styles.isSelected : ""}`}
            role="tab"
            aria-selected={activeTab === "ongoing"}
            onClick={() => handleTabChange("ongoing")}
          >
            진행 중인 챌린지
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "past" ? styles.isSelected : ""}`}
            role="tab"
            aria-selected={activeTab === "past"}
            onClick={() => handleTabChange("past")}
          >
            지난 챌린지
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "created" ? styles.isSelected : ""}`}
            role="tab"
            aria-selected={activeTab === "created"}
            onClick={() => handleTabChange("created")}
          >
            {isMyPage ? "내" : "유저"}가 만든 챌린지
          </button>
        </div>
        <div className={styles.contents}>
          {currentChallenges.length === 0 ? (
            <NoChallengesYet activeTab={activeTab} isMyPage={isMyPage} />
          ) : (
            <section
              id={`content-${activeTab}`}
              className={`${styles.tabContent} ${styles.isSelected}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
            >
              <ul className={styles.challengeList}>
                {challengesToDisplay.map(
                  ({ challenge, recorded, isFinished }) => (
                    <li className={styles.listItem} key={challenge.id}>
                      <UserChallengeCard
                        challenge={challenge}
                        recorded={recorded}
                        isFinished={isFinished}
                        isMyPage={isMyPage}
                      />
                    </li>
                  )
                )}
              </ul>
            </section>
          )}
        </div>
      </div>
      {shouldShowViewMore && (
        <div className={styles.viewMoreButton}>
          <Button className="primary" type="button" onClick={handleLoadMore}>
            더보기
          </Button>
        </div>
      )}
    </section>
  )
}
