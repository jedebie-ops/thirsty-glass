import { ProfileSwitcher } from './ProfileSwitcher'

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-charcoal/5 bg-cream/95 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🥗</span>
        <span className="text-lg font-bold tracking-tight">DinerDuo</span>
      </div>
      <ProfileSwitcher />
    </header>
  )
}
