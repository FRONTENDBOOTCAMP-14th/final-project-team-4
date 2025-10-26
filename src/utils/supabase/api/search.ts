import browserClient from "../client"
import type { Challenge, User } from ".."

export interface SearchParams {
  query: string
  limit?: number
  offset?: number
}

export interface ChallengeWithOwner extends Challenge {
  owner: User
}

export interface SearchResult {
  challenges: ChallengeWithOwner[]
  totalCount: number
}

export async function searchChallenges({
  query,
  limit = 20,
  offset = 0,
}: SearchParams): Promise<SearchResult> {
  if (!query?.trim()) {
    return { challenges: [], totalCount: 0 }
  }

  const searchTerm = `%${query.trim().replace(/[%_\\]/g, "\\$&")}%`

  try {
    const supabase = browserClient()
    const { data: challenges, error } = await supabase
      .from("challenges")
      .select("*")
      .or(
        `title.ilike.${searchTerm},category.ilike.${searchTerm},tags.cs.{${query}},uploading_type.ilike.${searchTerm}`
      )
      .eq("is_public", true)
      .eq("is_finished", false)
      .order("start_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("검색 쿼리 오류:", error)
      throw new Error(`검색 실패: ${error.message}`)
    }

    const { count, error: countError } = await supabase
      .from("challenges")
      .select("*", { count: "exact", head: true })
      .or(
        `title.ilike.${searchTerm},category.ilike.${searchTerm},tags.cs.{${query}},uploading_type.ilike.${searchTerm}`
      )
      .eq("is_public", true)
      .eq("is_finished", false)

    if (countError) {
      console.error("검색 개수 조회 오류:", countError)
    }

    if (!challenges || challenges.length === 0) {
      return { challenges: [], totalCount: count || 0 }
    }

    const ownerIds = [
      ...new Set(
        challenges.map((challenge) => challenge.created_by_id).filter(Boolean)
      ),
    ]
    const { data: owners, error: ownersError } = await supabase
      .from("users")
      .select("id, username, profile_image")
      .in("id", ownerIds)

    if (ownersError) {
      console.error("소유자 정보 조회 오류:", ownersError)
    }

    const ownerMap = new Map(owners?.map((owner) => [owner.id, owner]) || [])
    const challengesWithOwners: ChallengeWithOwner[] = challenges.map(
      (challenge) => ({
        ...challenge,
        owner: ownerMap.get(challenge.created_by_id) || {
          id: challenge.created_by_id || "",
          username: "알 수 없음",
          profile_image: null,
          email: "",
          bio: null,
          is_public: false,
        },
      })
    )

    return {
      challenges: challengesWithOwners,
      totalCount: count || 0,
    }
  } catch (error) {
    console.error("검색 API 오류:", error)
    throw new Error("검색 중 오류가 발생했습니다.")
  }
}

export async function searchChallengesByAuthType({
  query,
  authType,
  limit = 20,
  offset = 0,
}: SearchParams & {
  authType: "사진" | "글쓰기" | "출석체크"
}): Promise<SearchResult> {
  if (!query?.trim()) {
    return { challenges: [], totalCount: 0 }
  }

  const searchTerm = `%${query.trim().replace(/[%_\\]/g, "\\$&")}%`

  try {
    const supabase = browserClient()
    const { data: challenges, error } = await supabase
      .from("challenges")
      .select("*")
      .or(
        `title.ilike.${searchTerm},category.ilike.${searchTerm},tags.cs.{${query}},uploading_type.ilike.${searchTerm}`
      )
      .eq("is_public", true)
      .eq("is_finished", false)
      .eq("uploading_type", authType)
      .order("start_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("인증방법별 검색 쿼리 오류:", error)
      throw new Error(`검색 실패: ${error.message}`)
    }

    const { count, error: countError } = await supabase
      .from("challenges")
      .select("*", { count: "exact", head: true })
      .or(
        `title.ilike.${searchTerm},category.ilike.${searchTerm},tags.cs.{${query}},uploading_type.ilike.${searchTerm}`
      )
      .eq("is_public", true)
      .eq("is_finished", false)
      .eq("uploading_type", authType)

    if (countError) {
      console.error("인증방법별 검색 개수 조회 오류:", countError)
    }

    if (!challenges || challenges.length === 0) {
      return { challenges: [], totalCount: count || 0 }
    }

    const ownerIds = [
      ...new Set(
        challenges.map((challenge) => challenge.created_by_id).filter(Boolean)
      ),
    ]
    const { data: owners, error: ownersError } = await supabase
      .from("users")
      .select("id, username, profile_image")
      .in("id", ownerIds)

    if (ownersError) {
      console.error("소유자 정보 조회 오류:", ownersError)
    }

    const ownerMap = new Map(owners?.map((owner) => [owner.id, owner]) || [])
    const challengesWithOwners: ChallengeWithOwner[] = challenges.map(
      (challenge) => ({
        ...challenge,
        owner: ownerMap.get(challenge.created_by_id) || {
          id: challenge.created_by_id || "",
          username: "알 수 없음",
          profile_image: null,
          email: "",
          bio: null,
          is_public: false,
        },
      })
    )

    return {
      challenges: challengesWithOwners,
      totalCount: count || 0,
    }
  } catch (error) {
    console.error("인증방법별 검색 API 오류:", error)
    throw new Error("검색 중 오류가 발생했습니다.")
  }
}
