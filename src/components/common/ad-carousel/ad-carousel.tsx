"use client"

import { Navigation, Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import styles from "./ad-carousel.module.css"

interface AdSlide {
  id: number
  backgroundImage: string
  topText: string
  mainText: string
  buttonText: string
  buttonLink: string
}

interface AdCarouselProps {
  slides?: AdSlide[]
}

const DEFAULT_SLIDES: AdSlide[] = [
  {
    id: 1,
    backgroundImage: "/images/banner-img1.png",
    topText: "작은 습관으로 시작된 성공",
    mainText: "mini + motivation",
    buttonText: "챌린지 만들기",
    buttonLink: "/challenges/create",
  },
  {
    id: 2,
    backgroundImage: "/images/banner-img1.png",
    topText: "함께 성장하는 커뮤니티",
    mainText: "challenge + community",
    buttonText: "챌린지 둘러보기",
    buttonLink: "/challenges",
  },
  {
    id: 3,
    backgroundImage: "/images/banner-img1.png",
    topText: "오늘부터 시작하는 변화",
    mainText: "today + tomorrow",
    buttonText: "지금 시작하기",
    buttonLink: "/challenges",
  },
]

export default function AdCarousel({
  slides = DEFAULT_SLIDES,
}: AdCarouselProps) {
  return (
    <section className={styles.adCarouselSection} aria-label="프로모션 배너">
      <div className={styles.swiperContainer}>
        <div className={styles.controlsContainer}>
          <div className={styles.customPagination} />
          <button
            type="button"
            className={`${styles.navButton} ${styles.prevButton}`}
            aria-label="이전 슬라이드"
          />
          <button
            type="button"
            className={`${styles.navButton} ${styles.nextButton}`}
            aria-label="다음 슬라이드"
          />
          <button
            type="button"
            className={styles.playPauseButton}
            aria-label="재생/정지"
            onClick={(e) => {
              const button = e.currentTarget
              const swiperEl = button.closest(`.${styles.swiperContainer}`)
              const swiperElement = swiperEl?.querySelector(".swiper")
              const swiperInstance = (
                swiperElement as HTMLElement & {
                  swiper?: {
                    autoplay: {
                      running: boolean
                      stop: () => void
                      start: () => void
                    }
                  }
                }
              )?.swiper
              if (swiperInstance) {
                if (swiperInstance.autoplay.running) {
                  swiperInstance.autoplay.stop()
                  button.classList.add(styles.paused)
                } else {
                  swiperInstance.autoplay.start()
                  button.classList.remove(styles.paused)
                }
              }
            }}
          >
            <span className={styles.pauseIcon} />
            <span className={styles.playIcon} />
          </button>
        </div>

        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            prevEl: `.${styles.prevButton}`,
            nextEl: `.${styles.nextButton}`,
          }}
          pagination={{
            el: `.${styles.customPagination}`,
            type: "progressbar",
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          className={styles.swiper}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className={styles.slide}>
              <div
                className={styles.slideContent}
                style={{ backgroundImage: `url(${slide.backgroundImage})` }}
              >
                <div className={styles.textContainer}>
                  <p className={styles.topText}>{slide.topText}</p>
                  <h2 className={styles.mainText}>{slide.mainText}</h2>
                  <a href={slide.buttonLink} className={styles.ctaButton}>
                    {slide.buttonText}
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
