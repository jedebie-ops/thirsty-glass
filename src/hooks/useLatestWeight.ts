import { useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import type { WeightEntry } from '../types'

export function useWeightEntriesForProfile(profileId: string): WeightEntry[] {
  const weightEntries = useAppStore((s) => s.weightEntries)

  return useMemo(
    () =>
      weightEntries
        .filter((e) => e.profileId === profileId)
        .sort((a, b) => a.dateISO.localeCompare(b.dateISO)),
    [weightEntries, profileId],
  )
}

export function useLatestWeight(profileId: string): number | undefined {
  const entries = useWeightEntriesForProfile(profileId)
  return entries[entries.length - 1]?.weightKg
}
