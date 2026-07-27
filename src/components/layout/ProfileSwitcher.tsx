import { useAppStore } from '../../store/useAppStore'

export function ProfileSwitcher() {
  const profiles = useAppStore((s) => s.profiles)
  const activeProfileId = useAppStore((s) => s.activeProfileId)
  const setActiveProfileId = useAppStore((s) => s.setActiveProfileId)

  return (
    <div className="flex gap-1 rounded-2xl bg-charcoal/5 p-1">
      {profiles.map((profile) => {
        const isActive = profile.id === activeProfileId
        return (
          <button
            key={profile.id}
            onClick={() => setActiveProfileId(profile.id)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors"
            style={{
              backgroundColor: isActive ? profile.accentColorSoft : 'transparent',
              color: isActive ? profile.accentColor : 'var(--color-charcoal-soft)',
            }}
          >
            <span>{profile.emoji}</span>
            {profile.name}
          </button>
        )
      })}
    </div>
  )
}
