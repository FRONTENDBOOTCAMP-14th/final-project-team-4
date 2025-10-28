export function getTodaysPostISO() {
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000

  const now = new Date()

  const kstNow = new Date(now.getTime() + KST_OFFSET_MS)
  const y = kstNow.getUTCFullYear()
  const m = kstNow.getUTCMonth()
  const d = kstNow.getUTCDate()

  const kstStartUTC = new Date(Date.UTC(y, m, d, 0, 0, 0, 0) - KST_OFFSET_MS)
  const kstEndUTC = new Date(Date.UTC(y, m, d, 23, 59, 59, 999) - KST_OFFSET_MS)

  return {
    startISO: kstStartUTC.toISOString(),
    endISO: kstEndUTC.toISOString(),
  }
}
