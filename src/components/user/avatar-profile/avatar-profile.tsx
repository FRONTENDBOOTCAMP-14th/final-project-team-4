import { LucidePen } from "lucide-react"
import Avatar from "../avatar/avatar"
import styles from "./avatar-profile.module.css"

interface AvatarProfileProps {
  imageUrl: string
}

export default function AvatarProfile({ imageUrl }: AvatarProfileProps) {
  return (
    <div className={styles.avatarImageContainer}>
      <Avatar imageUrl={imageUrl} responsive="profileSizes" altText="" />
      <button
        className={styles.editButton}
        type="button"
        aria-label="프로필 사진 업데이트"
      >
        <LucidePen className={styles.editIcon} />
      </button>
    </div>
  )
}
