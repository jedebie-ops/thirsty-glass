import { Card } from '../ui/Card'
import { computeStreak } from '../../lib/utils/date'
import type { WeightEntry } from '../../types'

export function StreakCard({ entries }: { entries: WeightEntry[] }) {
  const streak = computeStreak(entries.map((e) => e.dateISO))

  return (
    <Card className="flex flex-col gap-1">
      <span className="text-2xl">🔥</span>
      <p className="text-sm font-semibold">
        {streak.current} {streak.current === 1 ? 'dag' : 'dagen'} op rij
      </p>
      <p className="text-xs text-charcoal-soft">{streak.isActiveToday ? 'Vandaag al gelogd!' : 'Log vandaag je gewicht'}</p>
    </Card>
  )
}
