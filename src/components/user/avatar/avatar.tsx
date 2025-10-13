import Image from "next/image"
import styles from "./avatar.module.css"

interface AvatarProps {
  imageUrl: string
  responsive: ResponsiveSizeType
}

type ResponsiveSizeType = "linkSizes" | "profileSizes"

export default function Avatar({ imageUrl, responsive }: AvatarProps) {
  const responsiveSizes: Record<ResponsiveSizeType, string> = {
    linkSizes:
      "(max-width: 580px) 37px, (max-width: 1200px) 31px, (max-width: 1440px) 70px",
    profileSizes: "(max-width: 360px) 124px, (max-width: 1024px) 140px",
  }

  return (
    <figure className={`${styles.avatar} ${styles[responsive]}`}>
      <Image
        src={imageUrl}
        className={styles.avatarImage}
        alt="아바타"
        sizes={responsiveSizes[responsive]}
        fill
      />
    </figure>
  )
}
