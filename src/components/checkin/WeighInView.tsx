import { useActiveProfile } from '../../hooks/useActiveProfile'
import { useWeightEntriesForProfile } from '../../hooks/useLatestWeight'
import { WeighInForm } from './WeighInForm'
import { WeightHistoryTable } from './WeightHistoryTable'

export function WeighInView() {
  const profile = useActiveProfile()
  const entries = useWeightEntriesForProfile(profile.id)

  return (
    <div className="flex flex-col gap-4">
      <WeighInForm profileId={profile.id} />
      <WeightHistoryTable entries={entries} />
    </div>
  )
}
