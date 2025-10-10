"use client"

import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Challenge } from "@/types"
import "swiper/css"
import "swiper/css/navigation"
import ChallengeCard from "../challenge-card/challenge-card"
import styles from "./challenge-card-list.module.css"

interface ChallengeCardListProps {
  title?: string
  challenges: Challenge[]
}

export default function ChallengeCardList({
  title,
  challenges,
}: ChallengeCardListProps) {
  const displayChallenges = challenges.slice(0, 20)

  return (
    <section className={styles.section}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}

      <div className={styles.swiperContainer}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={12}
          slidesPerView={2}
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
          className={styles.swiper}
        >
          {displayChallenges.map((challenge, index) => (
            <SwiperSlide key={challenge.id} className={styles.slide}>
              <ChallengeCard
                challenge={challenge}
                participantCount={123 + index * 10}
                daysLeft={7}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
