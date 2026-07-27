import { useAppStore } from '../store/useAppStore'
import type { Profile } from '../types'

export function useActiveProfile(): Profile {
  const activeProfileId = useAppStore((s) => s.activeProfileId)
  const profiles = useAppStore((s) => s.profiles)
  return profiles.find((p) => p.id === activeProfileId) ?? profiles[0]
}
