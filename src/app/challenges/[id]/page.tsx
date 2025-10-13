import Image from "next/image"
import Button from "@/components/common/button/button"
// import ChallengeCardList from "@/components/common/challenge-card-list/challenge-card-list"
import testImg from "./assets/test.avif"
import styles from "./page.module.css"

export default async function ChallengeDetail() {
  return (
    <main className={styles.main}>
      <figure>
        <Image src={testImg} alt="가나다라" fill priority />
        <div />
      </figure>
      <div className={styles.contentWrapper}>
        <div>습관</div>
        <h2>하루에 10페이지 책 읽기</h2>
        <section className={styles.description}>
          <h3>소개글</h3>
          <p>
            AI 코딩 도구를 활용하면 코드 생성 및 자동화, 개발 워크플로우와의
            통합 등이 가능하며 기존 개발 환경 대비 생산성을 높일 수 있습니다.
            그러나 개발자를 꿈꾸며 학습을하는 예비 개발자에게 AI 코딩 도구는
            양날의 검이 될 수 있습니다.
          </p>
          <div className={styles.tagWrapper}>
            <span>#독서</span>
            <span>#습관</span>
            <span>#자기개발</span>
          </div>
        </section>
        <section className={styles.infoWrapper}>
          <h3>챌린지 정보</h3>
          <div className={styles.info}>
            <span>10일 챌린지</span>
            <span>24명 참여중</span>
            <span> 성공 기준: 80%</span>
          </div>
          <div className={styles.avatar}>아바타</div>
          <div className={styles.buttonWrapper}>
            <Button className="primary">참여하기</Button>
            <Button className="like">찜하기</Button>
            <Button className="share">공유하기</Button>
          </div>
        </section>
        {/* <ChallengeCardList title="습관" challenges={} /> */}
      </div>
    </main>
  )
}
