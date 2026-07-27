import { Card } from '../ui/Card'
import { MacroBreakdownBar } from './MacroBreakdownBar'
import { FOODS_BY_ID } from '../../data/foods'
import type { PersonDinnerPortion, Profile } from '../../types'
import { formatGrams, formatKcal } from '../../lib/utils/format'

export function DinnerCard({ profile, portion }: { profile: Profile; portion: PersonDinnerPortion }) {
  const carbFood = FOODS_BY_ID[portion.carbBase.foodId]
  const proteinFood = FOODS_BY_ID[portion.protein.foodId]
  const proteinUnits = proteinFood.unitGrams ? Math.round(portion.protein.grams / proteinFood.unitGrams) : null

  return (
    <Card className="flex flex-col gap-3" style={{ boxShadow: `0 0 0 1px ${profile.accentColorSoft}` }}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{profile.emoji}</span>
        <span className="font-bold" style={{ color: profile.accentColor }}>
          {profile.name}
        </span>
        <span className="ml-auto text-sm font-semibold text-charcoal-soft">{formatKcal(portion.totals.kcal)}</span>
      </div>

      <ul className="flex flex-col gap-1.5 text-sm">
        <li className="flex items-center justify-between">
          <span>
            {proteinFood.emoji} {proteinFood.name}
            {proteinUnits ? ` × ${proteinUnits}` : ''}
          </span>
          <span className="text-charcoal-soft">{formatGrams(portion.protein.grams)}</span>
        </li>
        <li className="flex items-center justify-between">
          <span>
            {carbFood.emoji} {carbFood.name}
          </span>
          <span className="text-charcoal-soft">{formatGrams(portion.carbBase.grams)}</span>
        </li>
        {portion.vegetables.map((veg) => {
          const food = FOODS_BY_ID[veg.foodId]
          return (
            <li key={veg.foodId} className="flex items-center justify-between">
              <span>
                {food.emoji} {food.name}
              </span>
              <span className="text-charcoal-soft">{formatGrams(veg.grams)}</span>
            </li>
          )
        })}
      </ul>

      <MacroBreakdownBar totals={portion.totals} targetKcal={portion.dinnerKcalTarget} />

      <p className="text-xs text-charcoal-soft">
        Nog nodig vandaag: {formatKcal(portion.remainingToday.kcal)}, {Math.round(portion.remainingToday.proteinG)}g
        eiwit
      </p>
    </Card>
  )
}
