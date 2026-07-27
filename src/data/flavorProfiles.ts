import type { FlavorProfile } from '../types'

export const FLAVOR_PROFILES: FlavorProfile[] = [
  {
    id: 'mediterraans',
    name: 'Mediterraans',
    herbs: ['oregano', 'tijm', 'knoflook', 'citroen', 'rode ui'],
    emoji: '🍋',
  },
  {
    id: 'oosters_curry',
    name: 'Oosters-Curry',
    herbs: ['kerriepoeder', 'gember', 'komijn', 'koriander'],
    emoji: '🍛',
  },
  {
    id: 'mexicaans',
    name: 'Mexicaans',
    herbs: ['paprikapoeder', 'komijn', 'chilivlokken', 'limoen'],
    emoji: '🌶️',
  },
  {
    id: 'klassiek',
    name: 'Klassiek',
    herbs: ['zout', 'versgemalen peper', 'knoflookpoeder', 'gedroogde peterselie'],
    emoji: '🧂',
  },
]

export const FLAVOR_PROFILES_BY_ID: Record<string, FlavorProfile> = Object.fromEntries(
  FLAVOR_PROFILES.map((f) => [f.id, f]),
)
