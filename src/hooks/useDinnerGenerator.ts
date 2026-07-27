import { useCallback } from 'react'
import { useAppStore } from '../store/useAppStore'
import { generateDinnerPlan } from '../lib/dinner/generator'
import { getMostRecentFingerprint } from '../lib/dinner/history'
import { useCalorieTargetsByProfileId } from './useCalorieTargets'

export function useDinnerGenerator() {
  const profiles = useAppStore((s) => s.profiles)
  const dinnerHistory = useAppStore((s) => s.dinnerHistory)
  const addDinnerPlan = useAppStore((s) => s.addDinnerPlan)
  const toggleFavorite = useAppStore((s) => s.toggleFavoriteDinnerPlan)
  const calorieTargetsByProfileId = useCalorieTargetsByProfileId()

  const currentPlan = dinnerHistory[0]
  const canGenerate = profiles.every((p) => calorieTargetsByProfileId[p.id] !== undefined)

  const generate = useCallback(() => {
    if (!canGenerate) return
    const previousFingerprint = getMostRecentFingerprint(dinnerHistory)
    const plan = generateDinnerPlan({ profiles, calorieTargetsByProfileId, previousFingerprint })
    addDinnerPlan(plan)
  }, [canGenerate, profiles, calorieTargetsByProfileId, dinnerHistory, addDinnerPlan])

  return {
    currentPlan,
    history: dinnerHistory,
    canGenerate,
    generate,
    toggleFavorite,
  }
}
