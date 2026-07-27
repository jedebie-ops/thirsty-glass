import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AppState, DinnerPlan, Profile } from '../types'
import { createDefaultProfiles, createDefaultWeightEntries, JOCHEM_PROFILE_ID } from '../data/defaultProfiles'
import { generateId } from '../lib/utils/id'
import { addPlanToHistory, toggleFavorite as toggleFavoriteInHistory } from '../lib/dinner/history'

interface AppActions {
  setActiveProfileId: (profileId: string) => void
  updateProfile: (profileId: string, patch: Partial<Profile>) => void
  addOrUpdateWeightEntry: (profileId: string, weightKg: number, dateISO?: string, note?: string) => void
  deleteWeightEntry: (entryId: string) => void
  addDinnerPlan: (plan: DinnerPlan) => void
  toggleFavoriteDinnerPlan: (planId: string) => void
  markMilestoneCelebrated: (profileId: string, milestoneKg: number) => void
}

type AppStore = AppState & AppActions

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      profiles: createDefaultProfiles(),
      weightEntries: createDefaultWeightEntries(),
      dinnerHistory: [],
      activeProfileId: JOCHEM_PROFILE_ID,
      celebratedMilestones: {},

      setActiveProfileId: (profileId) => set({ activeProfileId: profileId }),

      updateProfile: (profileId, patch) =>
        set((state) => ({
          profiles: state.profiles.map((p) => (p.id === profileId ? { ...p, ...patch } : p)),
        })),

      // Eén weging per dag per profiel: een tweede log op dezelfde dag corrigeert
      // de eerste in plaats van een duplicaat toe te voegen.
      addOrUpdateWeightEntry: (profileId, weightKg, dateISO, note) =>
        set((state) => {
          const targetDate = dateISO ?? new Date().toISOString().slice(0, 10)
          const existingIndex = state.weightEntries.findIndex(
            (e) => e.profileId === profileId && e.dateISO === targetDate,
          )

          if (existingIndex >= 0) {
            const updated = [...state.weightEntries]
            updated[existingIndex] = { ...updated[existingIndex], weightKg, note }
            return { weightEntries: updated }
          }

          return {
            weightEntries: [
              ...state.weightEntries,
              { id: generateId(), profileId, dateISO: targetDate, weightKg, note },
            ],
          }
        }),

      deleteWeightEntry: (entryId) =>
        set((state) => ({
          weightEntries: state.weightEntries.filter((e) => e.id !== entryId),
        })),

      addDinnerPlan: (plan) =>
        set((state) => ({
          dinnerHistory: addPlanToHistory(state.dinnerHistory, plan),
        })),

      toggleFavoriteDinnerPlan: (planId) =>
        set((state) => ({
          dinnerHistory: toggleFavoriteInHistory(state.dinnerHistory, planId),
        })),

      markMilestoneCelebrated: (profileId, milestoneKg) =>
        set((state) => ({
          celebratedMilestones: {
            ...state.celebratedMilestones,
            [profileId]: [...(state.celebratedMilestones[profileId] ?? []), milestoneKg],
          },
        })),
    }),
    {
      name: 'dinerduo-store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
