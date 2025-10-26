import Image from "next/image"
import CertificationCarousel from "@/components/challenge/certification-carousel/certification-carousel"
import RecordCreateForm from "@/components/challenge/record-create-form/record-create-form"
import Button from "@/components/common/button/button"
import CategoryTag from "@/components/common/category-tag/category-tag"
import ChallengeCardList from "@/components/common/challenge-card-list/challenge-card-list"
import AvatarLink from "@/components/user/avatar-link/avatar-link"
import type { Database } from "@/utils/supabase/database.types"
import { createClient } from "@/utils/supabase/server"
import styles from "./page.module.css"

export type Challenge = Database["public"]["Tables"]["challenges"]["Row"]
export type User = Database["public"]["Tables"]["users"]["Row"]

export default async function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: challenge, error: challengeError } = await supabase
    .from("challenges")
    .select(`*`)
    .eq("id", id)
    .single<Challenge>()

  if (challengeError || !challenge) {
    return <p>챌린지 정보를 불러오지 못했습니다 😢</p>
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: users, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", challenge.created_by_id)
    .single<User>()

  if (userError || !users) {
    console.error("유저 정보를 불러오지 못했습니다:", userError)
    return <p>유저 데이터를 불러올 수 없습니다 😢</p>
  }

  const { data: recordData, error: recordError } = await supabase
    .from("challenge_records")
    .select("id")
    .eq("challenge_id", id)
    .order("created_at", { ascending: false })
    .limit(20)

  if (recordError) {
    console.error("인증 게시글 데이터를 불러오지 못했습니다:", recordError)
    return <p>인증 게시글 데이터를 불러올 수 없습니다 😢</p>
  }

  const getDateDiff = (
    startDate: string | number,
    endDate: string | number
  ) => {
    const date1 = new Date(startDate)
    const date2 = new Date(endDate)

    const diffDate = date2.getTime() - date1.getTime()

    if (diffDate) {
    }
    return Math.floor(diffDate / (1000 * 60 * 60 * 24))
  }

  return (
    <div className={styles.main}>
      <div className={styles.thumbnailWrapper}>
        <figure className={styles.thumbnail}>
          <Image
            src={challenge.thumbnail}
            alt={challenge.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            priority
            aria-hidden
          />
          <div className={styles.thumbnailGradient} />
        </figure>
      </div>
      <div className={styles.contentWrapper}>
        <CategoryTag category={challenge.category} />
        <h1 className={styles.pageTitle}>{challenge.title}</h1>
        <section className={styles.descriptionSection}>
          <h2>소개글</h2>
          <p className={styles.description}>{challenge.description}</p>
          <div className={styles.tagWrapper}>
            {challenge.tags.map((tag, index) => (
              <span key={index}>#{tag}</span>
            ))}
          </div>
        </section>
        <section className={styles.infoSection}>
          <h2>챌린지 정보</h2>
          <div className={styles.info}>
            <span>{`${getDateDiff(challenge.start_at, challenge.end_at)}일 챌린지`}</span>
            <span>{`${challenge.participants_count}명 참여중`}</span>
            <span>{`성공 기준: ${challenge.success_threshold_percent}%`}</span>
          </div>
          <div className={styles.userAvatar}>
            <AvatarLink userData={users} />

            <span className={styles.userName}>{users.username}</span>
          </div>
          <div className={styles.buttonWrapper}>
            <Button className="primary" type="button">
              참여하기
            </Button>
            <Button className="like" type="button">
              찜하기
            </Button>
            <Button className="share" type="button">
              공유하기
            </Button>
          </div>
        </section>

        <CertificationCarousel
          recordIds={recordData?.map((r) => r.id) ?? []}
          userId={user?.id ?? null}
        />
        {user ? (
          <RecordCreateForm challengeId={challenge.id} userId={user.id} />
        ) : (
          <ChallengeCardList
            title={`${challenge.category}의 다른 챌린지`}
            challenges={[challenge]}
          />
        )}
      </div>
    </div>
  )
}
