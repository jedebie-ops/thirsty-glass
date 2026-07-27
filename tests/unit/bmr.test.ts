import { describe, expect, it } from 'vitest'
import { computeBMR, computeCalorieTarget, computeTDEE } from '../../src/lib/calorie/bmr'

describe('computeBMR (Mifflin-St Jeor)', () => {
  it('matches Jochem worked example (184cm, 122kg, 28j, man)', () => {
    const bmr = computeBMR({ sex: 'male', weightKg: 122, heightCm: 184, age: 28 })
    expect(bmr).toBeCloseTo(2235, 0)
  })

  it('matches Charlotte worked example (174cm, 80kg, 28j, vrouw)', () => {
    const bmr = computeBMR({ sex: 'female', weightKg: 80, heightCm: 174, age: 28 })
    expect(bmr).toBeCloseTo(1586.5, 1)
  })
})

describe('computeTDEE', () => {
  it('Jochem: licht actief (1.375)', () => {
    expect(computeTDEE(2235, 'light')).toBeCloseTo(3073.1, 0)
  })

  it('Charlotte: matig actief (1.55)', () => {
    expect(computeTDEE(1586.5, 'moderate')).toBeCloseTo(2459.1, 0)
  })
})

describe('computeCalorieTarget', () => {
  it('Jochem lands on ~2413 kcal target, well above the male floor', () => {
    const target = computeCalorieTarget({
      sex: 'male',
      weightKg: 122,
      heightCm: 184,
      age: 28,
      activityLevel: 'light',
      weeklyPaceKgPerWeek: 0.6,
      proteinGPerKgBodyweight: 1.8,
    })

    expect(target.targetKcal).toBeCloseTo(2413, 0)
    expect(target.isFloorClamped).toBe(false)
    expect(target.macros.proteinG).toBeCloseTo(219.6, 0)
    // Macro's moeten exact optellen tot het caloriedoel.
    expect(target.macros.proteinKcal + target.macros.fatKcal + target.macros.carbsKcal).toBeCloseTo(
      target.targetKcal,
      0,
    )
  })

  it('Charlotte lands on ~1799 kcal target at default pace, above the female floor', () => {
    const target = computeCalorieTarget({
      sex: 'female',
      weightKg: 80,
      heightCm: 174,
      age: 28,
      activityLevel: 'moderate',
      weeklyPaceKgPerWeek: 0.6,
      proteinGPerKgBodyweight: 1.8,
    })

    expect(target.targetKcal).toBeCloseTo(1799, 0)
    expect(target.isFloorClamped).toBe(false)
  })

  it('clamps Charlotte to the 1200 kcal floor and flags it when pace is pushed too hard', () => {
    const target = computeCalorieTarget({
      sex: 'female',
      weightKg: 80,
      heightCm: 174,
      age: 28,
      activityLevel: 'moderate',
      weeklyPaceKgPerWeek: 1.2,
      proteinGPerKgBodyweight: 1.8,
    })

    expect(target.rawTargetKcal).toBeLessThan(1200)
    expect(target.isFloorClamped).toBe(true)
    expect(target.targetKcal).toBe(1200)
  })

  it('never lets macro kcal exceed the target, even at an aggressively low target', () => {
    const target = computeCalorieTarget({
      sex: 'female',
      weightKg: 80,
      heightCm: 174,
      age: 28,
      activityLevel: 'sedentary',
      weeklyPaceKgPerWeek: 2,
      proteinGPerKgBodyweight: 2.5,
    })

    const macroSum = target.macros.proteinKcal + target.macros.fatKcal + target.macros.carbsKcal
    expect(macroSum).toBeLessThanOrEqual(target.targetKcal + 0.01)
    expect(target.macros.carbsKcal).toBeGreaterThanOrEqual(0)
  })
})
