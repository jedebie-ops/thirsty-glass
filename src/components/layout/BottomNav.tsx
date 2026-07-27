import { motion } from 'framer-motion'
import { ChefHat, Home, Scale, Settings } from 'lucide-react'
import type { ComponentType } from 'react'

export type TabId = 'dashboard' | 'dinner' | 'checkin' | 'settings'

const TABS: { id: TabId; label: string; icon: ComponentType<{ className?: string; strokeWidth?: number; color?: string }> }[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'dinner', label: 'Diner', icon: ChefHat },
  { id: 'checkin', label: 'Check-in', icon: Scale },
  { id: 'settings', label: 'Instellingen', icon: Settings },
]

interface BottomNavProps {
  active: TabId
  onChange: (tab: TabId) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-charcoal/5 bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-2xl items-stretch justify-between px-2">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          const color = isActive ? 'var(--color-coral-dark)' : 'var(--color-charcoal-soft)'
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="relative flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-x-2 top-1 h-8 rounded-xl bg-coral-soft"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon className="relative z-10 h-5 w-5" strokeWidth={2} color={color} />
              <span className="relative z-10" style={{ color }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
