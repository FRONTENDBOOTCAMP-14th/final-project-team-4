"use client"

import { Toaster } from "sonner"

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "var(--main-pale)",
          color: "var(--text-default-main)",
          border: "1px solid var(--brand-main)",
        },
      }}
    />
  )
}
