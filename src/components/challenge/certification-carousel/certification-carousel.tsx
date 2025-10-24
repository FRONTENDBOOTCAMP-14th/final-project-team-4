"use client"

import { Navigation, Pagination } from "swiper/modules"
// eslint-disable-next-line import/order
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

import CertificationPost from "../certification-post/certification-post"
import styles from "./certification-carousel.module.css"

interface Props {
  recordIds: string[]
  userId?: string | null
}

export default function CertificationCarousel({ recordIds, userId }: Props) {
  if (!recordIds?.length) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>오늘의 인증!</h2>

      <div className={styles.navigationWrapper}>
        <button
          className={`swiper-button-prev ${styles.navigationButton}`}
          aria-label="이전 슬라이드"
        >
          <svg
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 1L1 7L7 13"
              stroke="#201E1F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className={`swiper-button-next ${styles.navigationButton}`}
          aria-label="다음 슬라이드"
        >
          <svg
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 13L7 7L1 1"
              stroke="#201E1F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        slidesPerView={1}
        breakpoints={{
          518: { slidesPerView: 1.4, spaceBetween: 40 },
        }}
        className={styles.swiper}
      >
        {recordIds.slice(0, 20).map((id) => (
          <SwiperSlide key={id} className={styles.slide}>
            <div className={styles.cardWrap}>
              <CertificationPost recordId={id} userId={userId} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
