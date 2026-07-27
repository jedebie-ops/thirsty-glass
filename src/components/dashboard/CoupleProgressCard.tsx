import { Card } from '../ui/Card'
import { useAppStore } from '../../store/useAppStore'
import { usePaceProjection } from '../../hooks/usePaceProjection'
import { formatKg } from '../../lib/utils/format'

export function CoupleProgressCard() {
  const profiles = useAppStore((s) => s.profiles)
  const [a, b] = profiles

  const paceA = usePaceProjection(a?.id ?? '')
  const paceB = usePaceProjection(b?.id ?? '')

  if (!a || !b || !paceA || !paceB) return null

  const combinedKgLost = Math.max(paceA.kgLostSoFar + paceB.kgLostSoFar, 0)

  return (
    <Card className="flex items-center gap-3 bg-coral-soft/60">
      <span className="text-3xl">🤝</span>
      <div>
        <p className="text-sm font-semibold text-coral-dark">Samen al {formatKg(combinedKgLost)} kwijt!</p>
        <p className="text-xs text-charcoal-soft">
          {a.name} &amp; {b.name} samen op weg naar hun doel
        </p>
      </div>
    </Card>
  )
}
