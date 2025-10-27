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

export default function UserChallengesSection({
  isMyPage,
  ongoingChallenges,
  pastChallenges,
  createdChallenges,
}: UserChallengesSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("ongoing")

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

  return (
    <section className={styles.userChallengesSection}>
      <h3>내 챌린지 보기</h3>
      <div className={styles.tabsContainer}>
        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "ongoing" ? styles.isSelected : ""}`}
            role="tab"
            aria-selected={activeTab === "ongoing"}
            onClick={() => setActiveTab("ongoing")}
            aria-controls="content-ongoing"
          >
            진행 중인 챌린지
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "past" ? styles.isSelected : ""}`}
            role="tab"
            aria-selected={activeTab === "past"}
            onClick={() => setActiveTab("past")}
            aria-controls="content-created"
          >
            지난 챌린지
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "created" ? styles.isSelected : ""}`}
            role="tab"
            aria-selected={activeTab === "created"}
            onClick={() => setActiveTab("created")}
            aria-controls="content3"
          >
            내가 만든 챌린지
          </button>
        </div>
        <div className={styles.contents}>
          {currentChallenges.length === 0 ? (
            <NoChallengesYet activeTab={activeTab} />
          ) : (
            <section
              id={`content-${activeTab}`}
              className={`${styles.tabContent} ${styles.isSelected}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
            >
              <ul className={styles.challengeList}>
                {currentChallenges.map(
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
      {currentChallenges.length > 6 && (
        <div className={styles.viewMoreButton}>
          <Button className="primary" type="button">
            더보기
          </Button>
        </div>
      )}
    </section>
  )
}
