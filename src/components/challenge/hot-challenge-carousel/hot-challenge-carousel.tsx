"use client"

import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import ChallengeCard from "@/components/common/challenge-card/challenge-card"
import type { Challenge } from "@/utils/supabase"
import type { ChallengeWithOwner } from "@/utils/supabase/api/search"
import styles from "./hot-challenge-carousel.module.css"

interface HotChallengeCarouselProps {
  title: string
  challenges: (Challenge | ChallengeWithOwner)[]
}

export default function HotChallengeCarousel({
  title,
  challenges,
}: HotChallengeCarouselProps) {
  const displayChallenges = challenges.slice(0, 20)

  const CARDS_PER_SLIDE = 5
  const slideGroups: (Challenge | ChallengeWithOwner)[][] = []
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
                {group[0] && (
                  <div className={styles.mainCard}>
                    <ChallengeCard
                      challenge={group[0]}
                      participantCount={group[0].participants_count}
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
                        daysLeft={Math.ceil(
                          (new Date(challenge.end_at).getTime() -
                            new Date(challenge.start_at).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}
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
