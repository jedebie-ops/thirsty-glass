import { useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import { computePaceProjection } from '../lib/calorie/pace'
import type { PaceProjection } from '../types'
import { useWeightEntriesForProfile } from './useLatestWeight'

export function usePaceProjection(profileId: string): PaceProjection | undefined {
  const profile = useAppStore((s) => s.profiles.find((p) => p.id === profileId))
  const entries = useWeightEntriesForProfile(profileId)

  return useMemo(() => {
    if (!profile) return undefined
    return computePaceProjection({
      goalWeightKg: profile.goalWeightKg,
      weeklyPaceKgPerWeek: profile.weeklyPaceKgPerWeek,
      entries,
    })
  }, [profile, entries])
}
