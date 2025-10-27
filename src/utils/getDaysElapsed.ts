export default function getDaysElapsed(startAt: string) {
  const startDate = new Date(startAt)

  const today = new Date()

  const startUtc = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  )

  const todayUtc = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  const MS_PER_DAY = 1000 * 60 * 60 * 24

  const diffTime = todayUtc - startUtc

  const diffDays = Math.floor(diffTime / MS_PER_DAY)

  return diffDays + 1
}
