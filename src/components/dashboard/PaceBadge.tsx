import { Card } from '../ui/Card'
import type { PaceProjection } from '../../types'

const STATUS_COPY: Record<PaceProjection['status'], { label: string; emoji: string; tone: string }> = {
  ahead: { label: 'Voor op schema', emoji: '🚀', tone: 'text-sage-dark' },
  on_track: { label: 'Op schema', emoji: '✅', tone: 'text-sage-dark' },
  behind: { label: 'Iets achter, geen zorgen', emoji: '💪', tone: 'text-amber' },
  flat_or_gaining: { label: 'Trend vlak — blijf loggen', emoji: '📊', tone: 'text-charcoal-soft' },
  insufficient_data: { label: 'Log een paar wegingen voor je tempo', emoji: '📅', tone: 'text-charcoal-soft' },
}

export function PaceBadge({ pace }: { pace: PaceProjection }) {
  const copy = STATUS_COPY[pace.status]
  const weeks =
    pace.hasDynamicData && pace.weeksRemainingDynamic != null ? pace.weeksRemainingDynamic : pace.weeksRemainingStatic

  return (
    <Card className="flex flex-col gap-1">
      <span className="text-2xl">{copy.emoji}</span>
      <p className={`text-sm font-semibold ${copy.tone}`}>{copy.label}</p>
      <p className="text-xs text-charcoal-soft">nog ~{Math.max(Math.round(weeks), 0)} weken</p>
    </Card>
  )
}
