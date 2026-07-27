import { describe, expect, it } from 'vitest'
import {
  computeCarbBasePortion,
  computePersonDinnerPortion,
  computeProteinPortion,
  computeVegetablePortions,
} from '../../src/lib/dinner/portionMath'
import { FOODS_BY_ID } from '../../src/data/foods'

const rice = FOODS_BY_ID.rice_cooked
const kipburger = FOODS_BY_ID.kipburger
const broccoli = FOODS_BY_ID.broccoli
const bellPepper = FOODS_BY_ID.bell_pepper

describe('computeProteinPortion — hele kipburgers, nooit 0', () => {
  it('kiest 2 hele kipburgers bij het dinerbudget van Jochem (~1086 kcal)', () => {
    const portion = computeProteinPortion({ dinnerKcalTarget: 1085.85, proteinFood: kipburger })
    expect(portion.grams).toBe(200)
    expect(portion.grams % 100).toBe(0)
  })

  it('kiest 2 hele kipburgers bij het dinerbudget van Charlotte (~810 kcal)', () => {
    const portion = computeProteinPortion({ dinnerKcalTarget: 809.55, proteinFood: kipburger })
    expect(portion.grams).toBe(200)
  })

  it('kiest nooit 0 stuks, ook niet bij een zeer laag budget', () => {
    const portion = computeProteinPortion({ dinnerKcalTarget: 100, proteinFood: kipburger })
    expect(portion.grams).toBe(100)
  })

  it('klemt vast op maximaal 3 stuks bij een zeer hoog budget', () => {
    const portion = computeProteinPortion({ dinnerKcalTarget: 3000, proteinFood: kipburger })
    expect(portion.grams).toBe(300)
  })
})

describe('computeVegetablePortions — royale, geschaalde porties', () => {
  it('schaalt naar boven (geclipt op 1.25x) bij een groot dinerbudget', () => {
    const [portion] = computeVegetablePortions({ dinnerKcalTarget: 1085.85, vegetables: [broccoli] })
    expect(portion.grams).toBe(150)
  })

  it('schaalt naar onder bij een kleiner dinerbudget', () => {
    const [portion] = computeVegetablePortions({ dinnerKcalTarget: 809.55, vegetables: [broccoli] })
    expect(portion.grams).toBe(110)
  })

  it('nooit onder de 0.75x-ondergrens, ook niet bij een zeer laag budget', () => {
    const [portion] = computeVegetablePortions({ dinnerKcalTarget: 200, vegetables: [broccoli] })
    expect(portion.grams).toBe(90)
  })
})

describe('computeCarbBasePortion — vult het budget aan, nooit negatief', () => {
  it('rekent de rest van het budget om naar rijst', () => {
    const portion = computeCarbBasePortion({ remainingKcal: 556.85, carbBase: rice })
    expect(portion.grams).toBe(430)
  })

  it('klemt vast op de ondergrens in plaats van negatieve grammen te geven', () => {
    const portion = computeCarbBasePortion({ remainingKcal: -50, carbBase: rice })
    expect(portion.grams).toBe(80)
    expect(portion.grams).toBeGreaterThan(0)
  })
})

describe('computePersonDinnerPortion — uitgewerkte voorbeelden uit het plan', () => {
  it('Jochem: 2 kipburgers + 150g broccoli + 150g paprika + ~430g rijst, ≈1088 kcal / ≈47g eiwit', () => {
    const portion = computePersonDinnerPortion({
      profileId: 'jochem',
      dailyTargetKcal: 2413,
      dailyTargetProteinG: 219.6,
      carbBase: rice,
      proteinFood: kipburger,
      vegetables: [broccoli, bellPepper],
    })

    expect(portion.protein.grams).toBe(200)
    expect(portion.carbBase.grams).toBe(430)
    expect(portion.vegetables.map((v) => v.grams)).toEqual([150, 150])
    expect(portion.totals.kcal).toBeCloseTo(1088, 0)
    expect(portion.totals.proteinG).toBeCloseTo(47.3, 0)
  })

  it('Charlotte: 2 kipburgers + 110g broccoli + 110g paprika + ~235g rijst, ≈808 kcal / ≈40.5g eiwit', () => {
    const portion = computePersonDinnerPortion({
      profileId: 'charlotte',
      dailyTargetKcal: 1799,
      dailyTargetProteinG: 144,
      carbBase: rice,
      proteinFood: kipburger,
      vegetables: [broccoli, bellPepper],
    })

    expect(portion.protein.grams).toBe(200)
    expect(portion.carbBase.grams).toBe(235)
    expect(portion.vegetables.map((v) => v.grams)).toEqual([110, 110])
    expect(portion.totals.kcal).toBeCloseTo(808, 0)
    expect(portion.totals.proteinG).toBeCloseTo(40.5, 0)
  })

  it("Jochem's portie is consequent groter dan Charlotte's bij hetzelfde gerecht", () => {
    const jochem = computePersonDinnerPortion({
      profileId: 'jochem',
      dailyTargetKcal: 2413,
      dailyTargetProteinG: 219.6,
      carbBase: rice,
      proteinFood: kipburger,
      vegetables: [broccoli, bellPepper],
    })
    const charlotte = computePersonDinnerPortion({
      profileId: 'charlotte',
      dailyTargetKcal: 1799,
      dailyTargetProteinG: 144,
      carbBase: rice,
      proteinFood: kipburger,
      vegetables: [broccoli, bellPepper],
    })

    expect(jochem.totals.kcal).toBeGreaterThan(charlotte.totals.kcal)
  })

  it('toont eerlijk het resterende budget voor ontbijt/lunch, nooit negatief', () => {
    const portion = computePersonDinnerPortion({
      profileId: 'jochem',
      dailyTargetKcal: 2413,
      dailyTargetProteinG: 219.6,
      carbBase: rice,
      proteinFood: kipburger,
      vegetables: [broccoli, bellPepper],
    })

    expect(portion.remainingToday.kcal).toBeGreaterThan(0)
    expect(portion.remainingToday.proteinG).toBeGreaterThanOrEqual(0)
  })
})
