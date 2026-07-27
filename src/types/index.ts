export type Sex = 'male' | 'female'

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'

export interface Profile {
  id: string
  name: string
  sex: Sex
  age: number
  heightCm: number
  goalWeightKg: number
  activityLevel: ActivityLevel
  weeklyPaceKgPerWeek: number
  proteinGPerKgBodyweight: number
  accentColor: string
  accentColorSoft: string
  emoji: string
  createdAtISO: string
}

export interface WeightEntry {
  id: string
  profileId: string
  dateISO: string
  weightKg: number
  note?: string
}

export type FoodCategory = 'carb_base' | 'protein' | 'vegetable'

export interface MacroPer100g {
  kcal: number
  proteinG: number
  carbsG: number
  fatG: number
}

export interface FoodItem {
  id: string
  name: string
  category: FoodCategory
  emoji: string
  per100g: MacroPer100g
  isEstimate?: boolean
  unitGrams?: number
}

export interface FlavorProfile {
  id: string
  name: string
  herbs: string[]
  emoji: string
}

export interface CookingMethod {
  id: string
  name: string
  description: string
  emoji: string
}

export interface Totals {
  kcal: number
  proteinG: number
  carbsG: number
  fatG: number
}

export interface DinnerComponentPortion extends Totals {
  foodId: string
  grams: number
}

export interface PersonDinnerPortion {
  profileId: string
  dinnerKcalTarget: number
  carbBase: DinnerComponentPortion
  protein: DinnerComponentPortion
  vegetables: DinnerComponentPortion[]
  totals: Totals
  remainingToday: {
    kcal: number
    proteinG: number
  }
}

export interface DinnerPlan {
  id: string
  createdAtISO: string
  carbBaseId: string
  vegetableIds: string[]
  flavorProfileId: string
  cookingMethodId: string
  portionsByProfile: PersonDinnerPortion[]
  isFavorite: boolean
}

export interface MacroTargets {
  proteinG: number
  fatG: number
  carbsG: number
  proteinKcal: number
  fatKcal: number
  carbsKcal: number
}

export interface CalorieTarget {
  currentWeightKg: number
  bmr: number
  tdee: number
  dailyDeficitKcal: number
  rawTargetKcal: number
  targetKcal: number
  isFloorClamped: boolean
  floorKcal: number
  macros: MacroTargets
}

export type PaceStatus = 'ahead' | 'on_track' | 'behind' | 'flat_or_gaining' | 'insufficient_data'

export interface PaceProjection {
  currentWeightKg: number
  goalWeightKg: number
  kgLostSoFar: number
  kgToGo: number
  progressFraction: number
  weeksRemainingStatic: number
  goalDateStatic: string
  hasDynamicData: boolean
  actualWeeklyRateKg: number | null
  weeksRemainingDynamic: number | null
  goalDateDynamic: string | null
  status: PaceStatus
}

export interface AppState {
  profiles: Profile[]
  weightEntries: WeightEntry[]
  dinnerHistory: DinnerPlan[]
  activeProfileId: string
  celebratedMilestones: Record<string, number[]>
}
