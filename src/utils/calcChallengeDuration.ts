export default function calcChallengeDuration(
  startAt: string,
  endAt: string
): number {
  const startAtDate = new Date(startAt)
  const endAtDate = new Date(endAt)

  const startUtc = Date.UTC(
    startAtDate.getFullYear(),
    startAtDate.getMonth(),
    startAtDate.getDate()
  )

  const endUtc = Date.UTC(
    endAtDate.getFullYear(),
    endAtDate.getMonth(),
    endAtDate.getDate()
  )

  const MS_PER_DAY = 1000 * 60 * 60 * 24
  const diffTime = Math.abs(endUtc - startUtc)
  const diffDays = Math.ceil(diffTime / MS_PER_DAY)

  return diffDays + 1
}
