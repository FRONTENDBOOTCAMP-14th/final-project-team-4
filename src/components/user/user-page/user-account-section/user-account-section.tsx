import type { UserPageComponentsProps } from "@/app/user/[userId]/types"
import DeleteAccountButton from "@/components/user/user-page/delete-account-button/delete-account-button"
import ReportAccountButton from "@/components/user/user-page/report-account-button/report-account-button"
import SignOutButton from "@/components/user/user-page/sign-out-button/sign-out-button"
import styles from "./user-account-section.module.css"

export default function UserAccountSection({
  isMyPage,
}: UserPageComponentsProps) {
  return (
    <section className={styles.userAccountSection}>
      {isMyPage ? (
        <>
          <h3>로그아웃 / 회원 탈퇴</h3>
          <p>탈퇴 시 작성된 챌린지 및 댓글은 복구되지 않습니다.</p>
          <div className={styles.accountManageButtons}>
            <SignOutButton />
            <DeleteAccountButton />
          </div>
        </>
      ) : (
        <>
          <h3>신고하기</h3>
          <p>신고는 익명으로 처리됩니다.</p>
          <div className={styles.accountManageButtons}>
            <ReportAccountButton />
          </div>
        </>
      )}
    </section>
  )
}
