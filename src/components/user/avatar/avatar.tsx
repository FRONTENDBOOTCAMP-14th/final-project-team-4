import Image from "next/image"
import styles from "./avatar.module.css"

interface AvatarProps {
  imageUrl: string
  responsive: ResponsiveSizeType
  altText: string
  className?: string
}

type ResponsiveSizeType = "linkSizes" | "profileSizes"

const responsiveSizes: Record<ResponsiveSizeType, string> = {
  linkSizes:
    "(max-width: 580px) 37px, (max-width: 1200px) 31px, (max-width: 1440px) 70px",
  profileSizes: "(max-width: 360px) 124px, (max-width: 1024px) 140px",
}

const userFallbackImage = "/fallback/fallback-user.png"

export default function Avatar({
  imageUrl,
  responsive,
  altText,
  className,
}: AvatarProps) {
  let safeImageUrl: string

  if (!imageUrl) {
    safeImageUrl = userFallbackImage
  } else if (imageUrl.startsWith("http:")) {
    safeImageUrl = imageUrl.replace(/^http:/, "https:")
  } else {
    safeImageUrl = imageUrl
  }

  return (
    <figure className={`${styles.avatar} ${styles[responsive]} ${className}`}>
      <Image
        src={safeImageUrl}
        className={styles.avatarImage}
        alt={altText}
        sizes={responsiveSizes[responsive]}
        fill
      />
    </figure>
  )
}
