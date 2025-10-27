import type { Metadata } from "next"
import {
  UserInfoSection,
  UserInfoCustomSection,
  UserAccountSection,
} from "@/components/user/user-page/index"
import UserChallengesSectionWrapper from "@/components/user/user-page/user-challenges-section/user-challenges-section-wrapper"
import { createClient } from "@/utils/supabase/server"
import styles from "./page.module.css"

interface UserPageProps {
  params: Promise<{ userId: string }>
}

export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  const { userId: pageUserId } = await params
  const supabase = await createClient()

  const { data: pageUser } = await supabase
    .from("users")
    .select()
    .eq("id", pageUserId)
    .single()

  if (!pageUser) {
    return {
      title: "사용자를 찾을 수 없습니다 | Minimo",
      description: "요청하신 사용자를 찾을 수 없습니다.",
    }
  }

  const bio = pageUser.bio || `${pageUser.username}님의 프로필입니다.`

  return {
    title: `${pageUser.username}의 프로필 | Minimo`,
    description: bio,
    openGraph: {
      title: `${pageUser.username} - Minimo`,
      description: bio,
      type: "profile",
      images: pageUser.profile_image
        ? [
            {
              url: pageUser.profile_image,
              width: 400,
              height: 400,
              alt: `${pageUser.username}의 프로필 이미지`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary",
      title: `${pageUser.username} - Minimo`,
      description: bio,
    },
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const { userId: pageUserId } = await params

  const supabase = await createClient()

  const { data: currentUserData } = await supabase.auth.getUser()

  const currentUserId = currentUserData.user?.id || null
  const pageUserOauth = currentUserData.user?.app_metadata.provider

  const { data: pageUser } = await supabase
    .from("users")
    .select()
    .eq("id", pageUserId)
    .single()

  if (pageUser === null) {
    return <p className={styles.errorMessage}>회원을 찾을 수 없습니다.</p>
  }

  const isMyPage = !!currentUserId && currentUserId === pageUserId

  const isUserPublic = pageUser.is_public

  const renderPrivateSections = isMyPage || isUserPublic

  return (
    <main className={styles.myPage}>
      <h2 className="sr-only">{pageUser.username}의 페이지</h2>
      <UserInfoSection
        pageUser={pageUser}
        isMyPage={isMyPage}
        pageUserOauth={pageUserOauth}
      />
      {isMyPage ? (
        <UserInfoCustomSection pageUser={pageUser} isMyPage={isMyPage} />
      ) : null}
      {renderPrivateSections ? (
        <UserChallengesSectionWrapper pageUser={pageUser} isMyPage={isMyPage} />
      ) : (
        <p>비공개 회원입니다.</p>
      )}

      <UserAccountSection isMyPage={isMyPage} />
    </main>
  )
}
