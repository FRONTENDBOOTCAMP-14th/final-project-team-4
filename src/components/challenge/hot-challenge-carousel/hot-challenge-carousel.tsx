"use client"

import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import ChallengeCard from "@/components/common/challenge-card/challenge-card"
import type { Challenge } from "@/types"
import styles from "./hot-challenge-carousel.module.css"

interface HotChallengeCarouselProps {
  title?: string
  challenges: Challenge[]
}

export default function HotChallengeCarousel({
  title,
  challenges,
}: HotChallengeCarouselProps) {
  const displayChallenges = challenges.slice(0, 20)

  const CARDS_PER_SLIDE = 5
  const slideGroups: Challenge[][] = []
  for (let i = 0; i < displayChallenges.length; i += CARDS_PER_SLIDE) {
    slideGroups.push(displayChallenges.slice(i, i + CARDS_PER_SLIDE))
  }

  return (
    <section className={styles.section}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}

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
                {group[0] && (
                  <div className={styles.mainCard}>
                    <ChallengeCard
                      challenge={group[0]}
                      participantCount={1523 + groupIndex * 100}
                      daysLeft={7}
                    />
                  </div>
                )}

                <div className={styles.subCardsContainer}>
                  {group.slice(1).map((challenge, index) => (
                    <div key={challenge.id} className={styles.subCard}>
                      <ChallengeCard
                        challenge={challenge}
                        participantCount={150 + index * 50}
                        daysLeft={14 - index * 2}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
