"use client"

import { useState, useEffect } from "react"
import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import ChallengeCard from "@/components/common/challenge-card/challenge-card"
import type { ChallengeWithParticipants } from "@/utils/supabase"
import type { ChallengeWithOwner } from "@/utils/supabase/api/search"
import styles from "./hot-challenge-carousel.module.css"

interface HotChallengeCarouselProps {
  title: string
  challenges: (ChallengeWithParticipants | ChallengeWithOwner)[]
}

export default function HotChallengeCarousel({
  title,
  challenges,
}: HotChallengeCarouselProps) {
  const displayChallenges = challenges.slice(0, 20)
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  )

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth
      if (width <= 580) {
        setViewport("mobile")
      } else if (width <= 1200) {
        setViewport("tablet")
      } else {
        setViewport("desktop")
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const CARDS_PER_SLIDE =
    viewport === "desktop" ? 5 : viewport === "tablet" ? 3 : 1

  const slideGroups: (ChallengeWithParticipants | ChallengeWithOwner)[][] = []
  for (let i = 0; i < displayChallenges.length; i += CARDS_PER_SLIDE) {
    slideGroups.push(displayChallenges.slice(i, i + CARDS_PER_SLIDE))
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>

      <div className={styles.swiperContainer}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={true}
          className={styles.swiper}
        >
          {slideGroups.map((group, groupIndex) => (
            <SwiperSlide key={groupIndex} className={styles.slide}>
              <div className={styles.gridLayout}>
                {viewport === "mobile" ? (
                  // 모바일: 모든 카드를 큰카드로 하나씩
                  group.map((challenge) => (
                    <div key={challenge.id} className={styles.mainCard}>
                      <ChallengeCard
                        challenge={challenge}
                        participantCount={challenge.participants_count}
                        realParticipantCount={
                          "participants" in challenge &&
                          challenge.participants?.[0]?.count
                        }
                        daysLeft={Math.ceil(
                          (new Date(challenge.end_at).getTime() -
                            new Date(challenge.start_at).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}
                      />
                    </div>
                  ))
                ) : (
                  // 태블릿/데스크톱: 첫 번째 카드는 큰카드, 나머지는 작은카드
                  <>
                    {group[0] && (
                      <div className={styles.mainCard}>
                        <ChallengeCard
                          challenge={group[0]}
                          participantCount={group[0].participants_count}
                          realParticipantCount={
                            "participants" in group[0] &&
                            group[0].participants?.[0]?.count
                          }
                          daysLeft={Math.ceil(
                            (new Date(group[0].end_at).getTime() -
                              new Date(group[0].start_at).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}
                        />
                      </div>
                    )}

                    <div className={styles.subCardsContainer}>
                      {group.slice(1).map((challenge) => (
                        <div key={challenge.id} className={styles.subCard}>
                          <ChallengeCard
                            challenge={challenge}
                            participantCount={challenge.participants_count}
                            realParticipantCount={
                              "participants" in challenge &&
                              challenge.participants?.[0]?.count
                            }
                            daysLeft={Math.ceil(
                              (new Date(challenge.end_at).getTime() -
                                new Date(challenge.start_at).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
