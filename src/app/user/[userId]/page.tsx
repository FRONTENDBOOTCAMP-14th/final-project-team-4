import {
  UserInfoSection,
  UserInfoCustomSection,
  UserStaticsSection,
  UserAccountSection,
} from "@/components/user/user-page/index"
import UserChallengesSectionWrapper from "@/components/user/user-page/user-challenges-section/user-challenges-section-wrapper"
import { createClient } from "@/utils/supabase/server"
import styles from "./page.module.css"

interface UserPageProps {
  params: Promise<{ userId: string }>
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
