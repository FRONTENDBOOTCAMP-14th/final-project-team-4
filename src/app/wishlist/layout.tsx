import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "찜한 챌린지 | Minimo",
  description:
    "내가 찜한 챌린지를 확인하고 관리하세요. 관심있는 챌린지로 함께 성장해가요.",
  keywords: ["찜한 챌린지", "즐겨찾기", "챌린지", "습관 형성"],
  openGraph: {
    title: "찜한 챌린지 - Minimo",
    description: "내가 찜한 챌린지를 확인하고 관리하세요.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "찜한 챌린지 - Minimo",
    description: "내가 찜한 챌린지를 확인하고 관리하세요.",
  },
}

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
