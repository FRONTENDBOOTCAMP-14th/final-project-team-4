"use client"
import { create } from "zustand"

interface RecordCardState {
  isLiked: boolean
  isReported: boolean
  likesCount: number
  commentsCount: number
  setFromServer: (p: Partial<RecordCardState>) => void
  toggleLikeOptimistic: () => void
  markReported: () => void
}

const useRecordCardStore = create<RecordCardState>((set) => ({
  isLiked: false,
  isReported: false,
  likesCount: 0,
  commentsCount: 0,
  setFromServer: (p) => set(p),
  toggleLikeOptimistic: () =>
    set((s) => ({
      isLiked: !s.isLiked,
      likesCount: s.isLiked ? s.likesCount - 1 : s.likesCount + 1,
    })),
  markReported: () => set({ isReported: true }),
}))

export default useRecordCardStore
