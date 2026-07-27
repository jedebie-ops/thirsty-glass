import { useAppStore } from '../../store/useAppStore'
import type { Profile } from '../../types'
import { Card } from '../ui/Card'

export function ProfileEditorForm({ profile }: { profile: Profile }) {
  const updateProfile = useAppStore((s) => s.updateProfile)

  return (
    <Card className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-charcoal-soft">Persoonlijke gegevens</p>
      <label className="flex items-center justify-between text-sm">
        Lengte (cm)
        <input
          type="number"
          value={profile.heightCm}
          onChange={(event) => updateProfile(profile.id, { heightCm: Number(event.target.value) })}
          className="w-24 rounded-xl border border-charcoal/10 bg-white px-3 py-1.5 text-right"
        />
      </label>
      <label className="flex items-center justify-between text-sm">
        Leeftijd
        <input
          type="number"
          value={profile.age}
          onChange={(event) => updateProfile(profile.id, { age: Number(event.target.value) })}
          className="w-24 rounded-xl border border-charcoal/10 bg-white px-3 py-1.5 text-right"
        />
      </label>
      <label className="flex items-center justify-between text-sm">
        Doelgewicht (kg)
        <input
          type="number"
          value={profile.goalWeightKg}
          onChange={(event) => updateProfile(profile.id, { goalWeightKg: Number(event.target.value) })}
          className="w-24 rounded-xl border border-charcoal/10 bg-white px-3 py-1.5 text-right"
        />
      </label>
      <label className="flex items-center justify-between text-sm">
        Eiwit (g/kg lichaamsgewicht)
        <input
          type="number"
          step="0.1"
          value={profile.proteinGPerKgBodyweight}
          onChange={(event) => updateProfile(profile.id, { proteinGPerKgBodyweight: Number(event.target.value) })}
          className="w-24 rounded-xl border border-charcoal/10 bg-white px-3 py-1.5 text-right"
        />
      </label>
    </Card>
  )
}
