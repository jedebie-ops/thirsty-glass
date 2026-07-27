import { useAppStore } from '../../store/useAppStore'
import { getFavorites } from '../../lib/dinner/history'
import { FOODS_BY_ID } from '../../data/foods'
import { FLAVOR_PROFILES_BY_ID } from '../../data/flavorProfiles'

export function FavoritesList() {
  const dinnerHistory = useAppStore((s) => s.dinnerHistory)
  const favorites = getFavorites(dinnerHistory)

  if (favorites.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-charcoal-soft">⭐ Favoriete diners</p>
      <ul className="flex flex-col gap-1.5">
        {favorites.map((plan) => (
          <li key={plan.id} className="rounded-xl bg-white/60 px-3 py-2 text-sm">
            {FOODS_BY_ID[plan.carbBaseId].emoji} {FOODS_BY_ID[plan.carbBaseId].name} met{' '}
            {plan.vegetableIds.map((id) => FOODS_BY_ID[id].name).join(', ')} —{' '}
            {FLAVOR_PROFILES_BY_ID[plan.flavorProfileId].name}
          </li>
        ))}
      </ul>
    </div>
  )
}
