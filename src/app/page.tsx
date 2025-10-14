// app/challenges/page.tsx
import Link from "next/link"
import type { Database } from "@/libs/supabase/database.types"
import { createClient } from "@/libs/supabase/server"

export type Challenge = Database["public"]["Tables"]["challenges"]["Row"]

export default async function ChallengesPage() {
  const supabase = await createClient()

  const { data: challenges, error } = await supabase
    .from("challenges")
    .select("id, title")
    .returns<Challenge[]>()

  if (error || !challenges) {
    console.error("챌린지 목록을 불러오지 못했습니다:", error)
    return <p>데이터를 불러올 수 없습니다 😢</p>
  }

  return (
    <section>
      <ul className="space-y-3">
        {challenges.map((challenge) => (
          <li key={challenge.id}>
            <Link href={`/challenges/${challenge.id}`}>
              <h2>{challenge.title}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
