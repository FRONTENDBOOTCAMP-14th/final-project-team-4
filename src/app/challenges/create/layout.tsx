import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "챌린지 생성 | Minimo",
  description:
    "나만의 챌린지를 만들고 다른 사람들과 함께 도전하세요. 새로운 습관을 형성하고 목표를 달성해보세요.",
  keywords: [
    "챌린지 생성",
    "챌린지 만들기",
    "습관 형성",
    "목표 달성",
    "챌린지",
  ],
  openGraph: {
    title: "챌린지 생성 - Minimo",
    description: "나만의 챌린지를 만들고 다른 사람들과 함께 도전하세요.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "챌린지 생성 - Minimo",
    description: "나만의 챌린지를 만들고 다른 사람들과 함께 도전하세요.",
  },
}

export default function ChallengeCreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
