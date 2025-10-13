import Link from "next/link"
import Avatar from "../avatar/avatar"
import styles from "./avatar-link.module.css"

interface AvatarLinkProps {
  imageUrl: string
}

export default function AvatarLink({ imageUrl }: AvatarLinkProps) {
  return (
    <Link href="/" className={styles.link}>
      <Avatar imageUrl={imageUrl} responsive="linkSizes" />
    </Link>
  )
}
