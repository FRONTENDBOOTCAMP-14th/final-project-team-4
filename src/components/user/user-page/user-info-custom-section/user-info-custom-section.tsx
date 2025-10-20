import ToggleSwitch from "@/components/common/toggle-switch/toggle-switch"
import styles from "./user-info-custom-section.module.css"

export default function UserInfoCustomSection() {
  return (
    <section className={styles.userInfoCustomSection}>
      <h3>개인 맞춤 설정</h3>
      <div className={styles.toggleContainer}>
        <div className={styles.toggle}>
          <span>계정 공개</span>
          <ToggleSwitch name="private" onLabel="공개" offLabel="비공개" />
        </div>
        <div className={styles.toggle}>
          <span>테마 설정</span>
          <ToggleSwitch
            name="private"
            onLabel="라이트 모드"
            offLabel="다크 모드"
          />
        </div>
      </div>
    </section>
  )
}
