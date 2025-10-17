import Link from "next/link"
import Avatar from "../avatar/avatar"
import styles from "./avatar-link.module.css"

interface AvatarLinkProps {
  imageUrl: string
  userName: string
}

export default function AvatarLink({ imageUrl, userName }: AvatarLinkProps) {
  return (
    <Link href="/" className={styles.link}>
      <Avatar
        imageUrl={imageUrl}
        responsive="linkSizes"
        altText={`${userName}의 프로필 보기`}
      />
    </Link>
  )
}
