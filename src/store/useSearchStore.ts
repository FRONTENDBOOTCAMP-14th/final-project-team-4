import { create } from "zustand"
import type { ChallengeWithOwner } from "@/utils/supabase/api/search"

export interface SearchState {
  query: string
  searchResults: ChallengeWithOwner[]
  photoChallenges: ChallengeWithOwner[]
  writingChallenges: ChallengeWithOwner[]
  attendanceChallenges: ChallengeWithOwner[]
  photoSort: "latest" | "popular" | "period-desc" | "period-asc"
  writingSort: "latest" | "popular" | "period-desc" | "period-asc"
  attendanceSort: "latest" | "popular" | "period-desc" | "period-asc"
  isLoading: boolean
  isPhotoLoading: boolean
  isWritingLoading: boolean
  isAttendanceLoading: boolean
  error: string | null
  setQuery: (query: string) => void
  setSearchResults: (results: ChallengeWithOwner[]) => void
  setPhotoChallenges: (challenges: ChallengeWithOwner[]) => void
  setWritingChallenges: (challenges: ChallengeWithOwner[]) => void
  setAttendanceChallenges: (challenges: ChallengeWithOwner[]) => void
  setPhotoSort: (
    sort: "latest" | "popular" | "period-desc" | "period-asc"
  ) => void
  setWritingSort: (
    sort: "latest" | "popular" | "period-desc" | "period-asc"
  ) => void
  setAttendanceSort: (
    sort: "latest" | "popular" | "period-desc" | "period-asc"
  ) => void
  setLoading: (loading: boolean) => void
  setPhotoLoading: (loading: boolean) => void
  setWritingLoading: (loading: boolean) => void
  setAttendanceLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetSearch: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  searchResults: [],
  photoChallenges: [],
  writingChallenges: [],
  attendanceChallenges: [],
  photoSort: "latest",
  writingSort: "latest",
  attendanceSort: "latest",
  isLoading: false,
  isPhotoLoading: false,
  isWritingLoading: false,
  isAttendanceLoading: false,
  error: null,
  setQuery: (query) => set({ query }),
  setSearchResults: (results) => set({ searchResults: results }),
  setPhotoChallenges: (challenges) => set({ photoChallenges: challenges }),
  setWritingChallenges: (challenges) => set({ writingChallenges: challenges }),
  setAttendanceChallenges: (challenges) =>
    set({ attendanceChallenges: challenges }),
  setPhotoSort: (sort) => set({ photoSort: sort }),
  setWritingSort: (sort) => set({ writingSort: sort }),
  setAttendanceSort: (sort) => set({ attendanceSort: sort }),
  setLoading: (loading) => set({ isLoading: loading }),
  setPhotoLoading: (loading) => set({ isPhotoLoading: loading }),
  setWritingLoading: (loading) => set({ isWritingLoading: loading }),
  setAttendanceLoading: (loading) => set({ isAttendanceLoading: loading }),
  setError: (error) => set({ error }),
  resetSearch: () =>
    set({
      query: "",
      searchResults: [],
      photoChallenges: [],
      writingChallenges: [],
      attendanceChallenges: [],
      photoSort: "latest",
      writingSort: "latest",
      attendanceSort: "latest",
      isLoading: false,
      isPhotoLoading: false,
      isWritingLoading: false,
      isAttendanceLoading: false,
      error: null,
    }),
}))
