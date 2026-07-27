import type { CookingMethod } from '../types'

export const COOKING_METHODS: CookingMethod[] = [
  {
    id: 'oven',
    name: 'Oven',
    description: '20-25 min op 200°C',
    emoji: '🔥',
  },
  {
    id: 'airfryer',
    name: 'Airfryer',
    description: '15-18 min op 180°C',
    emoji: '🌀',
  },
  {
    id: 'pan',
    name: 'Pan',
    description: '10-12 min op middelhoog vuur',
    emoji: '🍳',
  },
]

export const COOKING_METHODS_BY_ID: Record<string, CookingMethod> = Object.fromEntries(
  COOKING_METHODS.map((m) => [m.id, m]),
)
