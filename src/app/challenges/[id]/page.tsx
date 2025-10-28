import type { Metadata } from "next"
import Image from "next/image"
import CertificationCarousel from "@/components/challenge/certification-carousel/certification-carousel"
import ChallengeCTA from "@/components/challenge/challenge-cta/challenge-cta"
import RecordCreateForm from "@/components/challenge/record-create-form/record-create-form"
import ShareButton from "@/components/challenge/share-button/share-button"
import WishlistButton from "@/components/challenge/wishlistButton/wishlistButton"
import CategoryTag from "@/components/common/category-tag/category-tag"
import ChallengeCardList from "@/components/common/challenge-card-list/challenge-card-list"
import AvatarLink from "@/components/user/avatar-link/avatar-link"
import { getTodaysPostISO } from "@/utils/getTodaysPost"
import type { Database } from "@/utils/supabase/database.types"
import { createClient } from "@/utils/supabase/server"
import styles from "./page.module.css"

export type Challenge = Database["public"]["Tables"]["challenges"]["Row"]
export type User = Database["public"]["Tables"]["users"]["Row"]

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: challenge } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", id)
    .single<Challenge>()

  if (!challenge) {
    return {
      title: "챌린지 | Minimo",
      description: "챌린지를 찾을 수 없습니다.",
    }
  }

  const description =
    challenge.description.length > 150
      ? `${challenge.description.substring(0, 150)}...`
      : challenge.description

  return {
    title: `${challenge.title} | Minimo`,
    description,
    keywords: [
      challenge.category,
      challenge.uploading_type,
      ...(challenge.tags || []),
      "챌린지",
      "습관 형성",
    ],
    openGraph: {
      title: `${challenge.title} - Minimo 챌린지`,
      description,
      type: "website",
      images: [
        {
          url: challenge.thumbnail,
          width: 1200,
          height: 630,
          alt: challenge.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${challenge.title} - Minimo 챌린지`,
      description,
      images: [challenge.thumbnail],
    },
  }
}

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
  const isLoggedIn = !!user

  const { data: users, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", challenge.created_by_id)
    .maybeSingle<User>()
  if (userError || !users) {
    console.error("유저 정보를 불러오지 못했습니다:", userError)
    return <p>유저 데이터를 불러올 수 없습니다 😢</p>
  }

  const { startISO, endISO } = getTodaysPostISO()
  const { data: recordData, error: recordError } = await supabase
    .from("challenge_records")
    .select("id")
    .eq("challenge_id", id)
    .gte("created_at", startISO)
    .lt("created_at", endISO)
    .order("created_at", { ascending: false })
    .limit(20)

  if (recordError) {
    console.error("인증 게시글 데이터를 불러오지 못했습니다:", recordError)
    return <p>인증 게시글 데이터를 불러올 수 없습니다 😢</p>
  }

  let isParticipating = false
  if (isLoggedIn) {
    const { data: participant } = await supabase
      .from("challenge_participants")
      .select("id,is_progress")
      .eq("challenge_id", id)
      .eq("user_id", user.id)
      .maybeSingle()
    isParticipating = !!participant && participant.is_progress === true
  }

  const loginHref = `/auth/login?redirect=${encodeURIComponent(`/challenges/${id}`)}`

  let isWishlisted = false
  if (isLoggedIn) {
    const { data: wish, error: wishErr } = await supabase
      .from("challenge_wishlist")
      .select("id")
      .eq("challenge_id", id)
      .eq("user_id", user.id)
      .maybeSingle()
    if (!wishErr && wish) isWishlisted = true
  }

  const getDateDiff = (
    startDate: string | number,
    endDate: string | number
  ) => {
    const date1 = new Date(startDate)
    const date2 = new Date(endDate)
    const diffDate = date2.getTime() - date1.getTime()
    return Math.floor(diffDate / (1000 * 60 * 60 * 24))
  }

  return (
    <main className={styles.main}>
      <div className={styles.thumbnailWrapper}>
        <figure className={styles.thumbnail}>
          <Image
            src={challenge.thumbnail}
            alt={challenge.title}
            className={styles.thumbnailImage}
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
              <span key={index}>{tag}</span>
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
            <ChallengeCTA
              isLoggedIn={isLoggedIn}
              isParticipating={isParticipating}
              challengeId={challenge.id}
              userId={user?.id ?? null}
              loginHref={loginHref}
              requiredSuccessRate={challenge.success_threshold_percent}
            />
            <WishlistButton
              challengeId={challenge.id}
              userId={user?.id ?? null}
              initialChecked={isWishlisted}
            />
            <ShareButton />
          </div>
        </section>
        <CertificationCarousel
          recordIds={recordData?.map((r) => r.id) ?? []}
          userId={user?.id ?? null}
        />
        {isLoggedIn && isParticipating ? (
          <div id="record-create">
            <RecordCreateForm challengeId={challenge.id} userId={user.id} />
          </div>
        ) : (
          <ChallengeCardList
            title={`${challenge.category}의 다른 챌린지`}
            challenges={[challenge]}
          />
        )}
      </div>
    </main>
  )
}
