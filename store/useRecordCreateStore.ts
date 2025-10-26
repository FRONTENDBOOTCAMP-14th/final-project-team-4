import { create } from "zustand"

interface State {
  file: File | null
  previewUrl: string | null
  content: string
  submitting: boolean
  error: string | null
  done: boolean
}

interface Actions {
  setFile: (file: File | null) => void
  setContent: (v: string) => void
  setSubmitting: (v: boolean) => void
  setError: (v: string | null) => void
  setDone: (v: boolean) => void
  reset: () => void
}

export const useRecordCreateStore = create<State & Actions>((set, get) => ({
  file: null,
  previewUrl: null,
  content: "",
  submitting: false,
  error: null,
  done: false,

  setFile: (file) => {
    const prev = get().previewUrl
    if (prev) URL.revokeObjectURL(prev)

    if (!file) {
      set({ file: null, previewUrl: null })
      return
    }
    const url = URL.createObjectURL(file)
    set({ file, previewUrl: url })
  },

  setContent: (v) => set({ content: v }),
  setSubmitting: (v) => set({ submitting: v }),
  setError: (v) => set({ error: v }),
  setDone: (v) => set({ done: v }),

  reset: () => {
    const prev = get().previewUrl
    if (prev) URL.revokeObjectURL(prev)
    set({
      file: null,
      previewUrl: null,
      content: "",
      submitting: false,
      error: null,
      done: false,
    })
  },
}))
