import { useAppStore } from '../../store/useAppStore'
import { ACTIVITY_LEVEL_LABELS, ACTIVITY_MULTIPLIERS } from '../../lib/calorie/bmr'
import type { ActivityLevel, Profile } from '../../types'
import { Card } from '../ui/Card'

const LEVELS: ActivityLevel[] = ['sedentary', 'light', 'moderate', 'active', 'very_active']

export function ActivityLevelPicker({ profile }: { profile: Profile }) {
  const updateProfile = useAppStore((s) => s.updateProfile)

  return (
    <Card className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-charcoal-soft">Activiteitsniveau</p>
      <div className="flex flex-col gap-1.5">
        {LEVELS.map((level) => {
          const isActive = profile.activityLevel === level
          return (
            <button
              key={level}
              onClick={() => updateProfile(profile.id, { activityLevel: level })}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors"
              style={{
                backgroundColor: isActive ? profile.accentColorSoft : 'transparent',
                color: isActive ? profile.accentColor : 'var(--color-charcoal)',
                fontWeight: isActive ? 700 : 500,
              }}
            >
              <span>{ACTIVITY_LEVEL_LABELS[level]}</span>
              <span className="text-xs text-charcoal-soft">×{ACTIVITY_MULTIPLIERS[level]}</span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
