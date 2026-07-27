import type { ActivityLevel, CalorieTarget, Sex } from '../../types'
import { computeMacros } from './macros'

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Zittend, weinig beweging',
  light: 'Licht actief',
  moderate: 'Matig actief',
  active: 'Sterk actief',
  very_active: 'Extreem actief',
}

const KCAL_PER_KG_BODY_MASS = 7700

const SAFE_FLOOR_KCAL: Record<Sex, number> = {
  male: 1500,
  female: 1200,
}

export function computeBMR(params: { sex: Sex; weightKg: number; heightCm: number; age: number }): number {
  const { sex, weightKg, heightCm, age } = params
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'male' ? base + 5 : base - 161
}

export function computeTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel]
}

export function computeDailyDeficit(weeklyPaceKgPerWeek: number): number {
  return (weeklyPaceKgPerWeek * KCAL_PER_KG_BODY_MASS) / 7
}

export function computeCalorieTarget(params: {
  sex: Sex
  weightKg: number
  heightCm: number
  age: number
  activityLevel: ActivityLevel
  weeklyPaceKgPerWeek: number
  proteinGPerKgBodyweight: number
}): CalorieTarget {
  const { sex, weightKg, heightCm, age, activityLevel, weeklyPaceKgPerWeek, proteinGPerKgBodyweight } = params

  const bmr = computeBMR({ sex, weightKg, heightCm, age })
  const tdee = computeTDEE(bmr, activityLevel)
  const dailyDeficitKcal = computeDailyDeficit(weeklyPaceKgPerWeek)
  const rawTargetKcal = tdee - dailyDeficitKcal
  const floorKcal = SAFE_FLOOR_KCAL[sex]
  const isFloorClamped = rawTargetKcal < floorKcal
  const targetKcal = Math.max(rawTargetKcal, floorKcal)

  const macros = computeMacros({ targetKcal, weightKg, proteinGPerKgBodyweight })

  return {
    currentWeightKg: weightKg,
    bmr,
    tdee,
    dailyDeficitKcal,
    rawTargetKcal,
    targetKcal,
    isFloorClamped,
    floorKcal,
    macros,
  }
}
