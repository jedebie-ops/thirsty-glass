import type { DinnerComponentPortion, FoodItem, PersonDinnerPortion, Totals } from '../../types'

export const MEAL_SPLIT = { breakfast: 0.25, lunch: 0.3, dinner: 0.45 } as const

const PROTEIN_CAP_SHARE_OF_DINNER = 0.55
const MAX_PROTEIN_UNITS = 3
const VEG_BASE_GRAMS = 120
const VEG_MIN_SCALE = 0.75
const VEG_MAX_SCALE = 1.25
const VEG_REFERENCE_KCAL = 850
const CARB_MIN_GRAMS = 80
const CARB_MAX_GRAMS = 600

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function roundToNearest(value: number, step: number): number {
  return Math.round(value / step) * step
}

function foodPortion(food: FoodItem, grams: number): DinnerComponentPortion {
  const factor = grams / 100
  return {
    foodId: food.id,
    grams,
    kcal: food.per100g.kcal * factor,
    proteinG: food.per100g.proteinG * factor,
    carbsG: food.per100g.carbsG * factor,
    fatG: food.per100g.fatG * factor,
  }
}

function sumTotals(portions: Totals[]): Totals {
  return portions.reduce(
    (acc, p) => ({
      kcal: acc.kcal + p.kcal,
      proteinG: acc.proteinG + p.proteinG,
      carbsG: acc.carbsG + p.carbsG,
      fatG: acc.fatG + p.fatG,
    }),
    { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  )
}

/**
 * Een kipburger komt uit een pak in hele stuks (~100g) — geen ingrediënt dat je
 * in willekeurige grammen afweegt. De generator kiest daarom het maximale aantal
 * hele stuks dat binnen een aandeel van het dinerbudget past (minstens 1).
 */
export function computeProteinPortion(params: {
  dinnerKcalTarget: number
  proteinFood: FoodItem
  capShare?: number
  maxUnits?: number
}): DinnerComponentPortion {
  const { dinnerKcalTarget, proteinFood, capShare = PROTEIN_CAP_SHARE_OF_DINNER, maxUnits = MAX_PROTEIN_UNITS } =
    params
  const unitGrams = proteinFood.unitGrams ?? 100
  const kcalPerUnit = (proteinFood.per100g.kcal / 100) * unitGrams
  const cap = capShare * dinnerKcalTarget

  const unitsFittingCap = Math.floor(cap / kcalPerUnit)
  const units = clamp(unitsFittingCap, 1, maxUnits)

  return foodPortion(proteinFood, units * unitGrams)
}

/** Groenten krijgen een royale, licht op het caloriebudget geschaalde portie. */
export function computeVegetablePortions(params: {
  dinnerKcalTarget: number
  vegetables: FoodItem[]
  baseGrams?: number
  minScale?: number
  maxScale?: number
  referenceKcal?: number
}): DinnerComponentPortion[] {
  const {
    dinnerKcalTarget,
    vegetables,
    baseGrams = VEG_BASE_GRAMS,
    minScale = VEG_MIN_SCALE,
    maxScale = VEG_MAX_SCALE,
    referenceKcal = VEG_REFERENCE_KCAL,
  } = params

  const scale = clamp(dinnerKcalTarget / referenceKcal, minScale, maxScale)
  const gramsPerVeg = roundToNearest(baseGrams * scale, 10)

  return vegetables.map((veg) => foodPortion(veg, gramsPerVeg))
}

/** De koolhydraatbasis vult aan het eind op wat er nog over is van het caloriebudget. */
export function computeCarbBasePortion(params: {
  remainingKcal: number
  carbBase: FoodItem
  minGrams?: number
  maxGrams?: number
}): DinnerComponentPortion {
  const { remainingKcal, carbBase, minGrams = CARB_MIN_GRAMS, maxGrams = CARB_MAX_GRAMS } = params
  const rawGrams = (Math.max(remainingKcal, 0) / carbBase.per100g.kcal) * 100
  const grams = clamp(roundToNearest(rawGrams, 5), minGrams, maxGrams)

  return foodPortion(carbBase, grams)
}

export function computePersonDinnerPortion(params: {
  profileId: string
  dailyTargetKcal: number
  dailyTargetProteinG: number
  carbBase: FoodItem
  proteinFood: FoodItem
  vegetables: FoodItem[]
}): PersonDinnerPortion {
  const { profileId, dailyTargetKcal, dailyTargetProteinG, carbBase, proteinFood, vegetables } = params
  const dinnerKcalTarget = dailyTargetKcal * MEAL_SPLIT.dinner

  const protein = computeProteinPortion({ dinnerKcalTarget, proteinFood })
  const veggies = computeVegetablePortions({ dinnerKcalTarget, vegetables })
  const vegKcalTotal = veggies.reduce((sum, v) => sum + v.kcal, 0)

  const remainingKcal = dinnerKcalTarget - protein.kcal - vegKcalTotal
  const carb = computeCarbBasePortion({ remainingKcal, carbBase })

  // Werkelijke totalen (na afronden/clippen) tellen we opnieuw op — nooit het
  // ongeclipte doel als bereikt voorwenden.
  const totals = sumTotals([protein, carb, ...veggies])

  return {
    profileId,
    dinnerKcalTarget,
    carbBase: carb,
    protein,
    vegetables: veggies,
    totals,
    remainingToday: {
      kcal: Math.max(dailyTargetKcal - totals.kcal, 0),
      proteinG: Math.max(dailyTargetProteinG - totals.proteinG, 0),
    },
  }
}
