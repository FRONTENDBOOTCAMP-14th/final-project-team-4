import Link from "next/link"
import type { Database } from "@/utils/supabase/database.types"
import Avatar from "../avatar/avatar"
import styles from "./avatar-link.module.css"

export type User = Database["public"]["Tables"]["users"]["Row"]

interface AvatarLinkProps {
  userData: User
}

export default function AvatarLink({ userData }: AvatarLinkProps) {
  return (
    <Link href={`/user/${userData.id}`} className={styles.link}>
      <Avatar
        imageUrl={userData.profile_image}
        responsive="linkSizes"
        altText={`${userData.username}의 프로필 보기`}
      />
    </Link>
  )
}
