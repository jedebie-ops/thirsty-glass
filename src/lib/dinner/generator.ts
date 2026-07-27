import { CARB_BASES, PROTEINS, VEGETABLES } from '../../data/foods'
import { FLAVOR_PROFILES } from '../../data/flavorProfiles'
import { COOKING_METHODS } from '../../data/cookingMethods'
import type { CalorieTarget, DinnerPlan, FoodItem, Profile } from '../../types'
import { generateId } from '../utils/id'
import { computePersonDinnerPortion } from './portionMath'

const MAX_REPEAT_AVOID_ATTEMPTS = 10

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function sampleDistinct<T>(items: T[], count: number): T[] {
  const pool = [...items]
  const result: T[] = []
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    result.push(pool.splice(idx, 1)[0])
  }
  return result
}

export function comboFingerprint(carbBaseId: string, vegetableIds: string[], flavorProfileId: string): string {
  return `${carbBaseId}|${[...vegetableIds].sort().join(',')}|${flavorProfileId}`
}

export function dinnerPlanFingerprint(plan: DinnerPlan): string {
  return comboFingerprint(plan.carbBaseId, plan.vegetableIds, plan.flavorProfileId)
}

interface DinnerCombo {
  carbBase: FoodItem
  proteinFood: FoodItem
  vegetables: FoodItem[]
  flavorProfile: (typeof FLAVOR_PROFILES)[number]
  cookingMethod: (typeof COOKING_METHODS)[number]
  fingerprint: string
}

function drawCombo(): DinnerCombo {
  const carbBase = randomItem(CARB_BASES)
  const proteinFood = randomItem(PROTEINS)
  const vegCount = Math.random() < 0.5 ? 2 : 3
  const vegetables = sampleDistinct(VEGETABLES, vegCount)
  const flavorProfile = randomItem(FLAVOR_PROFILES)
  const cookingMethod = randomItem(COOKING_METHODS)

  return {
    carbBase,
    proteinFood,
    vegetables,
    flavorProfile,
    cookingMethod,
    fingerprint: comboFingerprint(
      carbBase.id,
      vegetables.map((v) => v.id),
      flavorProfile.id,
    ),
  }
}

/** Trekt een willekeurige combinatie, en trekt opnieuw als die identiek is aan de vorige keer. */
export function selectDinnerCombo(previousFingerprint?: string): DinnerCombo {
  let combo = drawCombo()
  let attempt = 0

  while (previousFingerprint && combo.fingerprint === previousFingerprint && attempt < MAX_REPEAT_AVOID_ATTEMPTS) {
    combo = drawCombo()
    attempt++
  }

  return combo
}

export function generateDinnerPlan(params: {
  profiles: Profile[]
  calorieTargetsByProfileId: Record<string, CalorieTarget>
  previousFingerprint?: string
}): DinnerPlan {
  const { profiles, calorieTargetsByProfileId, previousFingerprint } = params
  const combo = selectDinnerCombo(previousFingerprint)

  const portionsByProfile = profiles.map((profile) => {
    const target = calorieTargetsByProfileId[profile.id]
    return computePersonDinnerPortion({
      profileId: profile.id,
      dailyTargetKcal: target.targetKcal,
      dailyTargetProteinG: target.macros.proteinG,
      carbBase: combo.carbBase,
      proteinFood: combo.proteinFood,
      vegetables: combo.vegetables,
    })
  })

  return {
    id: generateId(),
    createdAtISO: new Date().toISOString(),
    carbBaseId: combo.carbBase.id,
    vegetableIds: combo.vegetables.map((v) => v.id),
    flavorProfileId: combo.flavorProfile.id,
    cookingMethodId: combo.cookingMethod.id,
    portionsByProfile,
    isFavorite: false,
  }
}
