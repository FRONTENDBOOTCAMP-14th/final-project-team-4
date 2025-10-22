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
      <label htmlFor="profilePicture" aria-label="프로필 사진 업데이트">
        <span className={styles.updateButton} tabIndex={0}>
          <LucidePen className={styles.editIcon} aria-hidden="true" />
        </span>
      </label>
      <input
        type="file"
        id="profilePicture"
        className={styles.input}
        accept="image/png, image/jpeg, image/jpg"
      />
    </div>
  )
}
