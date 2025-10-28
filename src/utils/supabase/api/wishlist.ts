import browserClient from "../client"
import type { Challenge } from ".."

export interface WishlistParams {
  userId: string
  categories?: string[]
  authTypes?: string[]
  sortType?: "latest" | "oldest"
  limit?: number
  offset?: number
}

export interface WishlistResult {
  challenges: Challenge[]
  totalCount: number
  hasMore: boolean
}

export async function getWishlistChallenges({
  userId,
  categories = [],
  authTypes = [],
  sortType = "latest",
  limit = 12,
  offset = 0,
}: WishlistParams): Promise<WishlistResult> {
  const supabase = browserClient()

  try {
    // 찜한 챌린지 ID 목록 조회
    const { data: wishlistData, error: wishlistError } = await supabase
      .from("challenge_wishlist")
      .select("challenge_id")
      .eq("user_id", userId)

    if (wishlistError) {
      console.error("찜한 챌린지 조회 실패:", wishlistError)
      throw new Error("찜한 챌린지 조회 실패")
    }

    if (!wishlistData || wishlistData.length === 0) {
      return { challenges: [], totalCount: 0, hasMore: false }
    }

    const challengeIds = wishlistData.map((item) => item.challenge_id)

    // 찜한 챌린지 상세 정보 조회
    let query = supabase
      .from("challenges")
      .select("*")
      .in("id", challengeIds)
      .eq("is_public", true)

    // 카테고리 필터링
    if (categories.length > 0 && !categories.includes("전체")) {
      query = query.in("category", categories)
    }

    // 인증 타입 필터링
    if (authTypes.length > 0 && !authTypes.includes("전체")) {
      const uploadingTypeMap: Record<string, string> = {
        "사진 인증": "사진 인증",
        "텍스트 인증": "텍스트 인증",
        "출석체크 인증": "출석체크 인증",
      }
      const mappedTypes = authTypes
        .map((type) => uploadingTypeMap[type])
        .filter(Boolean)
      if (mappedTypes.length > 0) {
        query = query.in("uploading_type", mappedTypes)
      }
    }

    // 정렬
    if (sortType === "oldest") {
      query = query.order("id", { ascending: true })
    } else {
      query = query.order("id", { ascending: false })
    }

    // 페이지네이션
    query = query.range(offset, offset + limit - 1)

    const { data: challenges, error: challengesError } = await query

    if (challengesError) {
      console.error("챌린지 조회 실패:", challengesError)
      throw new Error("챌린지 조회 실패")
    }

    // 전체 개수 조회 (필터링 적용)
    let countQuery = supabase
      .from("challenges")
      .select("*", { count: "exact", head: true })
      .in("id", challengeIds)
      .eq("is_public", true)

    if (categories.length > 0 && !categories.includes("전체")) {
      countQuery = countQuery.in("category", categories)
    }

    if (authTypes.length > 0 && !authTypes.includes("전체")) {
      const uploadingTypeMap: Record<string, string> = {
        "사진 인증": "사진 인증",
        "텍스트 인증": "텍스트 인증",
        "출석체크 인증": "출석체크 인증",
      }
      const mappedTypes = authTypes
        .map((type) => uploadingTypeMap[type])
        .filter(Boolean)
      if (mappedTypes.length > 0) {
        countQuery = countQuery.in("uploading_type", mappedTypes)
      }
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      console.error("챌린지 개수 조회 실패:", countError)
    }

    const totalCount = count || 0
    const hasMore = offset + limit < totalCount

    return {
      challenges: challenges || [],
      totalCount,
      hasMore,
    }
  } catch (error) {
    console.error("찜한 챌린지 API 오류:", error)
    throw new Error("찜한 챌린지 조회 중 오류가 발생했습니다.")
  }
}

export async function addToWishlist(
  userId: string,
  challengeId: string
): Promise<void> {
  const supabase = browserClient()

  const { error } = await supabase.from("challenge_wishlist").insert({
    user_id: userId,
    challenge_id: challengeId,
  })

  if (error) {
    console.error("찜하기 추가 실패:", error)
    throw new Error("찜하기 추가 실패")
  }
}

export async function removeFromWishlist(
  userId: string,
  challengeId: string
): Promise<void> {
  const supabase = browserClient()

  const { error } = await supabase
    .from("challenge_wishlist")
    .delete()
    .eq("user_id", userId)
    .eq("challenge_id", challengeId)

  if (error) {
    console.error("찜하기 제거 실패:", error)
    throw new Error("찜하기 제거 실패")
  }
}

export async function isInWishlist(
  userId: string,
  challengeId: string
): Promise<boolean> {
  const supabase = browserClient()

  const { data, error } = await supabase
    .from("challenge_wishlist")
    .select("id")
    .eq("user_id", userId)
    .eq("challenge_id", challengeId)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("찜하기 상태 조회 실패:", error)
    return false
  }

  return !!data
}
