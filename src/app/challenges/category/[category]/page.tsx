import type { Metadata } from "next"
import {
  getTopChallengesByCategory,
  getChallengesByCategory,
} from "@/utils/supabase/api/categories"
import CategoryContent from "./category-content"
import styles from "./page.module.css"

interface PageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)

  return {
    title: `${decodedCategory} 챌린지 | Minimo`,
    description: `${decodedCategory} 카테고리의 챌린지를 탐색하고 참여하세요.`,
    keywords: [decodedCategory, "챌린지", "습관 형성", "자기계발"],
    openGraph: {
      title: `${decodedCategory} 챌린지 - Minimo`,
      description: `${decodedCategory} 카테고리의 챌린지를 탐색하고 참여하세요.`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedCategory} 챌린지 - Minimo`,
      description: `${decodedCategory} 카테고리의 챌린지를 탐색하고 참여하세요.`,
    },
  }
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
