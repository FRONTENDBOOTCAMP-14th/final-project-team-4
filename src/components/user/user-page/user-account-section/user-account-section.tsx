import DeleteAccountButton from "@/components/user/user-page/delete-account-button/delete-account-button"
import SignOutButton from "@/components/user/user-page/sign-out-button/sign-out-button"
import styles from "./user-account-section.module.css"

export default function UserAccountSection() {
  return (
    <section className={styles.userAccountSection}>
      <h3>로그아웃 / 회원 탈퇴</h3>
      <p>탈퇴 시 작성된 챌린지 및 댓글은 복구되지 않습니다.</p>
      <div className={styles.accountManageButtons}>
        <SignOutButton />
        <DeleteAccountButton />
      </div>
    </section>
  )
}
