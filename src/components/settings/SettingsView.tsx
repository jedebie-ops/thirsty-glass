import { useActiveProfile } from '../../hooks/useActiveProfile'
import { useCalorieTarget } from '../../hooks/useCalorieTargets'
import { ProfileEditorForm } from './ProfileEditorForm'
import { ActivityLevelPicker } from './ActivityLevelPicker'
import { DeficitPacePicker } from './DeficitPacePicker'
import { Card } from '../ui/Card'

export function SettingsView() {
  const profile = useActiveProfile()
  const calorieTarget = useCalorieTarget(profile.id)

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <p className="text-sm font-semibold text-charcoal-soft">
          Instellingen voor {profile.emoji} {profile.name}
        </p>
      </Card>
      <ProfileEditorForm profile={profile} />
      <ActivityLevelPicker profile={profile} />
      <DeficitPacePicker profile={profile} calorieTarget={calorieTarget} />
    </div>
  )
}
