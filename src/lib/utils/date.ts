const MS_PER_DAY = 86_400_000

export interface Streak {
  current: number
  isActiveToday: boolean
}

/** Langste keten van opeenvolgende kalenderdagen met minstens één log, tellend vanaf vandaag/gisteren. */
export function computeStreak(dateISOs: string[], todayISO?: string): Streak {
  const today = todayISO ?? new Date().toISOString().slice(0, 10)
  const uniqueDates = Array.from(new Set(dateISOs)).sort().reverse()

  if (uniqueDates.length === 0) {
    return { current: 0, isActiveToday: false }
  }

  const todayDate = new Date(`${today}T00:00:00`)
  const mostRecent = new Date(`${uniqueDates[0]}T00:00:00`)
  const daysSinceLast = Math.round((todayDate.getTime() - mostRecent.getTime()) / MS_PER_DAY)

  if (daysSinceLast > 1) {
    return { current: 0, isActiveToday: false }
  }

  let streak = 1
  let cursor = mostRecent
  for (let i = 1; i < uniqueDates.length; i++) {
    const d = new Date(`${uniqueDates[i]}T00:00:00`)
    const diff = Math.round((cursor.getTime() - d.getTime()) / MS_PER_DAY)
    if (diff === 1) {
      streak++
      cursor = d
    } else {
      break
    }
  }

  return { current: streak, isActiveToday: daysSinceLast === 0 }
}
