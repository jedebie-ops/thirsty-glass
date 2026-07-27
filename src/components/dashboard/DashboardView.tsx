import { useActiveProfile } from '../../hooks/useActiveProfile'
import { useCalorieTarget } from '../../hooks/useCalorieTargets'
import { usePaceProjection } from '../../hooks/usePaceProjection'
import { useWeightEntriesForProfile } from '../../hooks/useLatestWeight'
import { ProgressRing } from './ProgressRing'
import { WeightTrendChart } from './WeightTrendChart'
import { PaceBadge } from './PaceBadge'
import { StreakCard } from './StreakCard'
import { MilestoneBanner } from './MilestoneBanner'
import { CoupleProgressCard } from './CoupleProgressCard'
import { Card } from '../ui/Card'
import { formatKcal, formatKg } from '../../lib/utils/format'

export function DashboardView() {
  const profile = useActiveProfile()
  const calorieTarget = useCalorieTarget(profile.id)
  const pace = usePaceProjection(profile.id)
  const entries = useWeightEntriesForProfile(profile.id)

  if (!calorieTarget || !pace) return null

  return (
    <div className="flex flex-col gap-4">
      <MilestoneBanner profileId={profile.id} kgLostSoFar={pace.kgLostSoFar} />

      <Card className="flex items-center gap-5">
        <ProgressRing fraction={pace.progressFraction} color={profile.accentColor} />
        <div>
          <p className="text-sm text-charcoal-soft">
            Welkom terug, {profile.name} {profile.emoji}
          </p>
          <p className="text-2xl font-bold">{formatKg(pace.currentWeightKg)}</p>
          <p className="text-sm text-charcoal-soft">
            nog <strong>{formatKg(pace.kgToGo)}</strong> te gaan tot {formatKg(pace.goalWeightKg)}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <PaceBadge pace={pace} />
        <StreakCard entries={entries} />
      </div>

      <Card>
        <p className="mb-1 text-sm font-semibold text-charcoal-soft">Caloriedoel vandaag</p>
        <p className="text-3xl font-bold" style={{ color: profile.accentColor }}>
          {formatKcal(calorieTarget.targetKcal)}
        </p>
        {calorieTarget.isFloorClamped && (
          <p className="mt-1 text-xs text-amber">
            Vastgeklemd op de veilige ondergrens van {formatKcal(calorieTarget.floorKcal)} — kies een rustiger tempo
            bij Instellingen voor een groter tekort.
          </p>
        )}
        <div className="mt-3 flex gap-4 text-sm text-charcoal-soft">
          <span>{Math.round(calorieTarget.macros.proteinG)}g eiwit</span>
          <span>{Math.round(calorieTarget.macros.carbsG)}g koolhydraten</span>
          <span>{Math.round(calorieTarget.macros.fatG)}g vet</span>
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-semibold text-charcoal-soft">Gewichtsverloop</p>
        <WeightTrendChart entries={entries} goalWeightKg={profile.goalWeightKg} color={profile.accentColor} />
      </Card>

      <CoupleProgressCard />
    </div>
  )
}
