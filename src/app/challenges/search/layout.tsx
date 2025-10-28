import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "챌린지 검색 | Minimo",
  description:
    "원하는 챌린지를 검색하고 발견하세요. 다양한 주제의 챌린지에 참여해보세요.",
  keywords: ["챌린지 검색", "챌린지 찾기", "습관 형성", "자기계발", "챌린지"],
  openGraph: {
    title: "챌린지 검색 - Minimo",
    description: "원하는 챌린지를 검색하고 발견하세요.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "챌린지 검색 - Minimo",
    description: "원하는 챌린지를 검색하고 발견하세요.",
  },
}

export default function ChallengeSearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
