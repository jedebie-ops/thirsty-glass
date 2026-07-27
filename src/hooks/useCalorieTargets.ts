import { useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import { computeCalorieTarget } from '../lib/calorie/bmr'
import type { CalorieTarget, Profile, WeightEntry } from '../types'
import { useLatestWeight } from './useLatestWeight'

function latestWeightFor(weightEntries: WeightEntry[], profileId: string): number | undefined {
  const entries = weightEntries
    .filter((e) => e.profileId === profileId)
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO))
  return entries[entries.length - 1]?.weightKg
}

function targetFor(profile: Profile, weightKg: number): CalorieTarget {
  return computeCalorieTarget({
    sex: profile.sex,
    weightKg,
    heightCm: profile.heightCm,
    age: profile.age,
    activityLevel: profile.activityLevel,
    weeklyPaceKgPerWeek: profile.weeklyPaceKgPerWeek,
    proteinGPerKgBodyweight: profile.proteinGPerKgBodyweight,
  })
}

export function useCalorieTarget(profileId: string): CalorieTarget | undefined {
  const profile = useAppStore((s) => s.profiles.find((p) => p.id === profileId))
  const latestWeight = useLatestWeight(profileId)

  return useMemo(() => {
    if (!profile || latestWeight === undefined) return undefined
    return targetFor(profile, latestWeight)
  }, [profile, latestWeight])
}

export function useCalorieTargetsByProfileId(): Record<string, CalorieTarget> {
  const profiles = useAppStore((s) => s.profiles)
  const weightEntries = useAppStore((s) => s.weightEntries)

  return useMemo(() => {
    const result: Record<string, CalorieTarget> = {}
    for (const profile of profiles) {
      const weightKg = latestWeightFor(weightEntries, profile.id)
      if (weightKg === undefined) continue
      result[profile.id] = targetFor(profile, weightKg)
    }
    return result
  }, [profiles, weightEntries])
}
