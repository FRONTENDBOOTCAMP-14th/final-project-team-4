import {
  getTopChallengesByCategory,
  getChallengesByCategory,
} from "@/utils/supabase/api/categories"
import CategoryContent from "./category-content"
import styles from "./page.module.css"

interface PageProps {
  params: Promise<{ category: string }>
}

export default async function ChallengeCategory({ params }: PageProps) {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)

  const [topChallenges, initialChallenges] = await Promise.all([
    getTopChallengesByCategory(decodedCategory, 10),
    getChallengesByCategory(decodedCategory, undefined, "latest", 100),
  ])

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.main}>
        <CategoryContent
          category={decodedCategory}
          initialTopChallenges={topChallenges}
          initialChallenges={initialChallenges}
        />
      </main>
    </div>
  )
}
