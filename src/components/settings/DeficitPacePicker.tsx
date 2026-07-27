import { useAppStore } from '../../store/useAppStore'
import type { CalorieTarget, Profile } from '../../types'
import { Card } from '../ui/Card'
import { formatKcal } from '../../lib/utils/format'

export function DeficitPacePicker({ profile, calorieTarget }: { profile: Profile; calorieTarget?: CalorieTarget }) {
  const updateProfile = useAppStore((s) => s.updateProfile)

  return (
    <Card className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-charcoal-soft">Afvaltempo</p>
      <input
        type="range"
        min={0.25}
        max={1.2}
        step={0.05}
        value={profile.weeklyPaceKgPerWeek}
        onChange={(event) => updateProfile(profile.id, { weeklyPaceKgPerWeek: Number(event.target.value) })}
        className="w-full"
      />
      <p className="text-sm">
        <strong>{profile.weeklyPaceKgPerWeek.toFixed(2)} kg/week</strong>
        {calorieTarget && (
          <span className="text-charcoal-soft"> → caloriedoel {formatKcal(calorieTarget.targetKcal)}</span>
        )}
      </p>
      {calorieTarget?.isFloorClamped && (
        <p className="rounded-xl bg-amber-soft px-3 py-2 text-xs text-amber">
          Bij dit tempo zou je doel onder de veilige ondergrens van {formatKcal(calorieTarget.floorKcal)} komen. We
          hebben het verhoogd naar {formatKcal(calorieTarget.floorKcal)} — kies een rustiger tempo voor een groter
          tekort.
        </p>
      )}
    </Card>
  )
}
