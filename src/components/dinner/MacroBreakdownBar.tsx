import type { Totals } from '../../types'

export function MacroBreakdownBar({ totals, targetKcal }: { totals: Totals; targetKcal: number }) {
  const proteinKcal = totals.proteinG * 4
  const carbsKcal = totals.carbsG * 4
  const fatKcal = totals.fatG * 9
  const sum = proteinKcal + carbsKcal + fatKcal || 1

  return (
    <div className="flex flex-col gap-1">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-charcoal/5">
        <div style={{ width: `${(proteinKcal / sum) * 100}%`, backgroundColor: 'var(--color-coral)' }} />
        <div style={{ width: `${(carbsKcal / sum) * 100}%`, backgroundColor: 'var(--color-sage)' }} />
        <div style={{ width: `${(fatKcal / sum) * 100}%`, backgroundColor: 'var(--color-amber)' }} />
      </div>
      <div className="flex justify-between text-[11px] text-charcoal-soft">
        <span>
          {Math.round(totals.proteinG)}g eiwit · {Math.round(totals.carbsG)}g kh · {Math.round(totals.fatG)}g vet
        </span>
        <span>doel {Math.round(targetKcal)} kcal</span>
      </div>
    </div>
  )
}
