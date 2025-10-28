export const getMaxEndDate = (start: string) => {
  const date = new Date(start)
  date.setDate(date.getDate() + 30)
  return date.toISOString().split("T")[0]
}

export const getTotalDays = (start: string, end: string) =>
  Math.ceil(
    (new Date(end).getTime() - new Date(start).getTime()) /
      (1000 * 60 * 60 * 24)
  ) + 1

export const getSuccessDays = (percent: number, total: number) =>
  Math.ceil((percent / 100) * total)
