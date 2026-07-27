import { useAppStore } from '../../store/useAppStore'
import type { WeightEntry } from '../../types'
import { formatKg } from '../../lib/utils/format'

export function WeightHistoryTable({ entries }: { entries: WeightEntry[] }) {
  const deleteWeightEntry = useAppStore((s) => s.deleteWeightEntry)
  const reversed = [...entries].reverse()

  if (reversed.length === 0) {
    return <p className="text-sm text-charcoal-soft">Nog geen wegingen gelogd.</p>
  }

  return (
    <ul className="flex flex-col divide-y divide-charcoal/5">
      {reversed.map((entry) => (
        <li key={entry.id} className="flex items-center justify-between py-2 text-sm">
          <span className="text-charcoal-soft">{entry.dateISO}</span>
          <span className="font-semibold">{formatKg(entry.weightKg)}</span>
          <button onClick={() => deleteWeightEntry(entry.id)} className="text-xs text-charcoal-soft underline">
            verwijderen
          </button>
        </li>
      ))}
    </ul>
  )
}
