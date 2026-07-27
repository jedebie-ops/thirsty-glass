import { describe, expect, it } from 'vitest'
import { computeCalorieTarget } from '../../src/lib/calorie/bmr'
import { comboFingerprint, dinnerPlanFingerprint, generateDinnerPlan, selectDinnerCombo } from '../../src/lib/dinner/generator'
import { createDefaultProfiles } from '../../src/data/defaultProfiles'
import type { CalorieTarget } from '../../src/types'

const profiles = createDefaultProfiles()

function targetsFor(weights: Record<string, number>): Record<string, CalorieTarget> {
  const result: Record<string, CalorieTarget> = {}
  for (const profile of profiles) {
    result[profile.id] = computeCalorieTarget({
      sex: profile.sex,
      weightKg: weights[profile.id],
      heightCm: profile.heightCm,
      age: profile.age,
      activityLevel: profile.activityLevel,
      weeklyPaceKgPerWeek: profile.weeklyPaceKgPerWeek,
      proteinGPerKgBodyweight: profile.proteinGPerKgBodyweight,
    })
  }
  return result
}

const calorieTargetsByProfileId = targetsFor({ jochem: 122, charlotte: 80 })

describe('comboFingerprint', () => {
  it('is onafhankelijk van de volgorde van groenten', () => {
    const a = comboFingerprint('rice_cooked', ['broccoli', 'carrot'], 'klassiek')
    const b = comboFingerprint('rice_cooked', ['carrot', 'broccoli'], 'klassiek')
    expect(a).toBe(b)
  })

  it('verschilt wanneer de koolhydraatbasis anders is', () => {
    const a = comboFingerprint('rice_cooked', ['broccoli'], 'klassiek')
    const b = comboFingerprint('potato_boiled', ['broccoli'], 'klassiek')
    expect(a).not.toBe(b)
  })
})

describe('selectDinnerCombo — herhaling vermijden', () => {
  it('geeft nooit twee keer op rij exact dezelfde combinatie (200 generaties)', () => {
    let previousFingerprint: string | undefined
    for (let i = 0; i < 200; i++) {
      const combo = selectDinnerCombo(previousFingerprint)
      if (previousFingerprint) {
        expect(combo.fingerprint).not.toBe(previousFingerprint)
      }
      previousFingerprint = combo.fingerprint
    }
  })

  it('kiest telkens 2 of 3 groenten', () => {
    for (let i = 0; i < 50; i++) {
      const combo = selectDinnerCombo()
      expect(combo.vegetables.length).toBeGreaterThanOrEqual(2)
      expect(combo.vegetables.length).toBeLessThanOrEqual(3)
      // geen dubbele groenten binnen dezelfde combinatie
      const uniqueIds = new Set(combo.vegetables.map((v) => v.id))
      expect(uniqueIds.size).toBe(combo.vegetables.length)
    }
  })
})

describe('generateDinnerPlan', () => {
  it('genereert een plan met een portie per profiel, hele kipburger-eenheden en positieve totalen', () => {
    const plan = generateDinnerPlan({ profiles, calorieTargetsByProfileId })

    expect(plan.portionsByProfile).toHaveLength(2)
    for (const portion of plan.portionsByProfile) {
      expect(portion.protein.grams % 100).toBe(0)
      expect(portion.protein.grams).toBeGreaterThan(0)
      expect(portion.carbBase.grams).toBeGreaterThanOrEqual(80)
      expect(portion.carbBase.grams).toBeLessThanOrEqual(600)
      expect(portion.totals.kcal).toBeGreaterThan(0)
    }
  })

  it("Jochems dinerportie is groter dan Charlottes bij hetzelfde gegenereerde gerecht", () => {
    const plan = generateDinnerPlan({ profiles, calorieTargetsByProfileId })
    const jochem = plan.portionsByProfile.find((p) => p.profileId === 'jochem')!
    const charlotte = plan.portionsByProfile.find((p) => p.profileId === 'charlotte')!

    expect(jochem.totals.kcal).toBeGreaterThan(charlotte.totals.kcal)
  })

  it('respecteert de vorige combinatie om herhaling te vermijden over meerdere generaties', () => {
    let plan = generateDinnerPlan({ profiles, calorieTargetsByProfileId })
    for (let i = 0; i < 20; i++) {
      const previousFingerprint = dinnerPlanFingerprint(plan)
      const next = generateDinnerPlan({ profiles, calorieTargetsByProfileId, previousFingerprint })
      expect(dinnerPlanFingerprint(next)).not.toBe(previousFingerprint)
      plan = next
    }
  })
})
