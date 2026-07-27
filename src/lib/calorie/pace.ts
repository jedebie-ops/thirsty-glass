import type { PaceProjection, WeightEntry } from '../../types'

const ON_TRACK_BAND = 0.1 // ±10%
const DEFAULT_WINDOW_DAYS = 28
const MS_PER_DAY = 86_400_000

function toDate(dateISO: string): Date {
  return new Date(`${dateISO}T00:00:00`)
}

function addDaysISO(base: Date, days: number): string {
  const safeDays = Number.isFinite(days) ? days : 0
  const d = new Date(base)
  d.setDate(d.getDate() + safeDays)
  return d.toISOString().slice(0, 10)
}

/** Kleinste-kwadraten helling (per dag) door (dag-index, gewicht)-punten. */
function linearRegressionSlopePerDay(points: { x: number; y: number }[]): number | null {
  const n = points.length
  if (n < 2) return null
  const sumX = points.reduce((s, p) => s + p.x, 0)
  const sumY = points.reduce((s, p) => s + p.y, 0)
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0)
  const sumXX = points.reduce((s, p) => s + p.x * p.x, 0)
  const denom = n * sumXX - sumX * sumX
  if (denom === 0) return null
  return (n * sumXY - sumX * sumY) / denom
}

export function computePaceProjection(params: {
  goalWeightKg: number
  weeklyPaceKgPerWeek: number
  entries: WeightEntry[]
  todayISO?: string
  windowDays?: number
}): PaceProjection {
  const { goalWeightKg, weeklyPaceKgPerWeek, entries, windowDays = DEFAULT_WINDOW_DAYS } = params
  const today = params.todayISO ? toDate(params.todayISO) : new Date()

  const sorted = [...entries].sort((a, b) => toDate(a.dateISO).getTime() - toDate(b.dateISO).getTime())
  const startWeightKg = sorted[0]?.weightKg ?? goalWeightKg
  const currentWeightKg = sorted[sorted.length - 1]?.weightKg ?? goalWeightKg

  const kgLostSoFar = startWeightKg - currentWeightKg
  const totalToLose = startWeightKg - goalWeightKg
  const kgToGo = Math.max(currentWeightKg - goalWeightKg, 0)
  const progressFraction = totalToLose > 0 ? Math.min(Math.max(kgLostSoFar / totalToLose, 0), 1) : 0

  const weeksRemainingStatic = weeklyPaceKgPerWeek > 0 ? kgToGo / weeklyPaceKgPerWeek : 0
  const goalDateStatic = addDaysISO(today, Math.round(weeksRemainingStatic * 7))

  const windowStart = new Date(today)
  windowStart.setDate(windowStart.getDate() - windowDays)
  const windowPoints = sorted
    .filter((e) => toDate(e.dateISO).getTime() >= windowStart.getTime())
    .map((e) => ({ x: toDate(e.dateISO).getTime() / MS_PER_DAY, y: e.weightKg }))

  const slopePerDay = linearRegressionSlopePerDay(windowPoints)
  const hasDynamicData = windowPoints.length >= 2 && slopePerDay !== null

  let actualWeeklyRateKg: number | null = null
  let weeksRemainingDynamic: number | null = null
  let goalDateDynamic: string | null = null
  let status: PaceProjection['status'] = 'insufficient_data'

  if (hasDynamicData && slopePerDay !== null) {
    // Gewicht dat daalt => negatieve helling => positief verlies-tempo.
    actualWeeklyRateKg = -slopePerDay * 7

    if (actualWeeklyRateKg <= 0) {
      status = 'flat_or_gaining'
    } else {
      weeksRemainingDynamic = kgToGo / actualWeeklyRateKg
      goalDateDynamic = addDaysISO(today, Math.round(weeksRemainingDynamic * 7))

      if (actualWeeklyRateKg >= weeklyPaceKgPerWeek * (1 + ON_TRACK_BAND)) {
        status = 'ahead'
      } else if (actualWeeklyRateKg >= weeklyPaceKgPerWeek * (1 - ON_TRACK_BAND)) {
        status = 'on_track'
      } else {
        status = 'behind'
      }
    }
  }

  return {
    currentWeightKg,
    goalWeightKg,
    kgLostSoFar,
    kgToGo,
    progressFraction,
    weeksRemainingStatic,
    goalDateStatic,
    hasDynamicData,
    actualWeeklyRateKg,
    weeksRemainingDynamic,
    goalDateDynamic,
    status,
  }
}
