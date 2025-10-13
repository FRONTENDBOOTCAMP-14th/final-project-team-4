import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/common/navigation/navigation"
import styles from "./header.module.css"

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="미니모 홈으로 이동"
          width={100}
          height={76}
          priority={true}
        />
      </Link>
      <Navigation />
    </header>
  )
}
