import type { Profile, WeightEntry } from '../types'

export const JOCHEM_PROFILE_ID = 'jochem'
export const CHARLOTTE_PROFILE_ID = 'charlotte'

export function createDefaultProfiles(): Profile[] {
  const nowISO = new Date().toISOString()

  return [
    {
      id: JOCHEM_PROFILE_ID,
      name: 'Jochem',
      sex: 'male',
      age: 28,
      heightCm: 184,
      goalWeightKg: 92,
      // Zittend werk, met 1-2x per week fysiek werk als hovenier.
      activityLevel: 'light',
      weeklyPaceKgPerWeek: 0.6,
      proteinGPerKgBodyweight: 1.8,
      accentColor: 'var(--color-jochem)',
      accentColorSoft: 'var(--color-jochem-soft)',
      emoji: '🧑',
      createdAtISO: nowISO,
    },
    {
      id: CHARLOTTE_PROFILE_ID,
      name: 'Charlotte',
      sex: 'female',
      age: 28,
      heightCm: 174,
      goalWeightKg: 60,
      // Staand werk + 4x per week fietsen IJmuiden-Heemstede v.v.
      activityLevel: 'moderate',
      weeklyPaceKgPerWeek: 0.6,
      proteinGPerKgBodyweight: 1.8,
      accentColor: 'var(--color-charlotte)',
      accentColorSoft: 'var(--color-charlotte-soft)',
      emoji: '👩',
      createdAtISO: nowISO,
    },
  ]
}

export function createDefaultWeightEntries(): WeightEntry[] {
  const todayISO = new Date().toISOString().slice(0, 10)

  return [
    {
      id: 'seed-jochem-weight',
      profileId: JOCHEM_PROFILE_ID,
      dateISO: todayISO,
      weightKg: 122,
    },
    {
      id: 'seed-charlotte-weight',
      profileId: CHARLOTTE_PROFILE_ID,
      dateISO: todayISO,
      weightKg: 80,
    },
  ]
}
