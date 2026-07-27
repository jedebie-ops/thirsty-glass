import { describe, expect, it } from 'vitest'
import { computePaceProjection } from '../../src/lib/calorie/pace'
import type { WeightEntry } from '../../src/types'

const TODAY_ISO = '2026-07-27'

function isoDaysAgo(daysAgo: number): string {
  const d = new Date(`${TODAY_ISO}T00:00:00`)
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}

function entriesFrom(weights: Array<[daysAgo: number, weightKg: number]>): WeightEntry[] {
  return weights.map(([daysAgo, weightKg], i) => ({
    id: `e${i}`,
    profileId: 'p1',
    dateISO: isoDaysAgo(daysAgo),
    weightKg,
  }))
}

describe('computePaceProjection — statische inschatting', () => {
  it("Jochem: (122-92)/0.6 = 50 weken tot doelgewicht", () => {
    const projection = computePaceProjection({
      goalWeightKg: 92,
      weeklyPaceKgPerWeek: 0.6,
      entries: entriesFrom([[0, 122]]),
      todayISO: TODAY_ISO,
    })

    expect(projection.weeksRemainingStatic).toBeCloseTo(50, 0)
    expect(projection.hasDynamicData).toBe(false)
    expect(projection.status).toBe('insufficient_data')
  })

  it('Charlotte: (80-60)/0.6 ≈ 33.3 weken tot doelgewicht', () => {
    const projection = computePaceProjection({
      goalWeightKg: 60,
      weeklyPaceKgPerWeek: 0.6,
      entries: entriesFrom([[0, 80]]),
      todayISO: TODAY_ISO,
    })

    expect(projection.weeksRemainingStatic).toBeCloseTo(33.33, 1)
  })
})

describe('computePaceProjection — dynamische inschatting uit weeglogs', () => {
  it('herkent "op schema" wanneer het gerealiseerde tempo dicht bij het doeltempo ligt', () => {
    const projection = computePaceProjection({
      goalWeightKg: 92,
      weeklyPaceKgPerWeek: 0.6,
      entries: entriesFrom([
        [21, 111.8],
        [14, 111.2],
        [7, 110.6],
        [0, 110.0],
      ]),
      todayISO: TODAY_ISO,
    })

    expect(projection.hasDynamicData).toBe(true)
    expect(projection.actualWeeklyRateKg).toBeCloseTo(0.6, 1)
    expect(projection.status).toBe('on_track')
  })

  it('herkent "voor op schema" wanneer er sneller wordt afgevallen dan gepland', () => {
    const projection = computePaceProjection({
      goalWeightKg: 92,
      weeklyPaceKgPerWeek: 0.6,
      entries: entriesFrom([
        [21, 113],
        [14, 111],
        [7, 109],
        [0, 107],
      ]),
      todayISO: TODAY_ISO,
    })

    expect(projection.status).toBe('ahead')
  })

  it('herkent "iets achter" wanneer het verlies duidelijk trager gaat dan gepland', () => {
    const projection = computePaceProjection({
      goalWeightKg: 92,
      weeklyPaceKgPerWeek: 0.6,
      entries: entriesFrom([
        [21, 110.3],
        [14, 110.2],
        [7, 110.1],
        [0, 110.0],
      ]),
      todayISO: TODAY_ISO,
    })

    expect(projection.status).toBe('behind')
  })

  it('herkent een vlakke/stijgende trend zonder te beschuldigen', () => {
    const projection = computePaceProjection({
      goalWeightKg: 92,
      weeklyPaceKgPerWeek: 0.6,
      entries: entriesFrom([
        [21, 108],
        [14, 109],
        [7, 110],
        [0, 111],
      ]),
      todayISO: TODAY_ISO,
    })

    expect(projection.status).toBe('flat_or_gaining')
    expect(projection.actualWeeklyRateKg).toBeLessThanOrEqual(0)
  })

  it('valt terug op de statische inschatting als er te weinig data in het venster is', () => {
    const projection = computePaceProjection({
      goalWeightKg: 92,
      weeklyPaceKgPerWeek: 0.6,
      entries: entriesFrom([[0, 110]]),
      todayISO: TODAY_ISO,
    })

    expect(projection.hasDynamicData).toBe(false)
    expect(projection.weeksRemainingDynamic).toBeNull()
    expect(projection.weeksRemainingStatic).toBeGreaterThan(0)
  })
})
