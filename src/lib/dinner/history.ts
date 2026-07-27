import type { DinnerPlan } from '../../types'
import { dinnerPlanFingerprint } from './generator'

const MAX_HISTORY_LENGTH = 30

export function getMostRecentFingerprint(history: DinnerPlan[]): string | undefined {
  return history[0] ? dinnerPlanFingerprint(history[0]) : undefined
}

export function addPlanToHistory(history: DinnerPlan[], plan: DinnerPlan): DinnerPlan[] {
  return [plan, ...history].slice(0, MAX_HISTORY_LENGTH)
}

export function getFavorites(history: DinnerPlan[]): DinnerPlan[] {
  return history.filter((plan) => plan.isFavorite)
}

export function toggleFavorite(history: DinnerPlan[], planId: string): DinnerPlan[] {
  return history.map((plan) => (plan.id === planId ? { ...plan, isFavorite: !plan.isFavorite } : plan))
}
