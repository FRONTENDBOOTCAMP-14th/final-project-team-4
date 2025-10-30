"use client"

import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import type { ChallengeWithParticipants } from "@/utils/supabase"
import "swiper/css"
import "swiper/css/navigation"
import ChallengeCard from "../challenge-card/challenge-card"
import styles from "./challenge-card-list.module.css"

interface ChallengeCardListProps {
  title?: string
  challenges: ChallengeWithParticipants[]
  className?: string
  renderCard?: (
    challenge: ChallengeWithParticipants,
    index: number
  ) => React.ReactNode
}

export default function ChallengeCardList({
  title,
  challenges,
  className,
  renderCard,
}: ChallengeCardListProps) {
  const displayChallenges = challenges.slice(0, 20)

  return (
    <section className={`${styles.section} ${className || ""}`}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}

      <div className={styles.swiperContainer}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={12}
          slidesPerView="auto"
          navigation={true}
          centeredSlides={false}
          className={styles.swiper}
        >
          {displayChallenges.map((challenge, index) => (
            <SwiperSlide key={challenge.id} className={styles.slide}>
              {renderCard ? (
                renderCard(challenge, index)
              ) : (
                <ChallengeCard
                  challenge={challenge}
                  participantCount={challenge.participants_count}
                  realParticipantCount={challenge.participants?.[0]?.count}
                  daysLeft={Math.ceil(
                    (new Date(challenge.end_at).getTime() -
                      new Date(challenge.start_at).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
