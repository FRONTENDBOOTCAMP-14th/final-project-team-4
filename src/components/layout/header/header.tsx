"use client"

import Navigation from "@/components/common/navigation/navigation"
import TabletNavigation from "@/components/common/navigation/tablet-navigation/tablet-navigation"
import styles from "./header.module.css"

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.pc}>
        <Navigation />
      </div>
      <div className={styles.tablet}>
        <TabletNavigation />
      </div>
    </header>
  )
}
