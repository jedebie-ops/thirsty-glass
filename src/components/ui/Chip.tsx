import type { ReactNode } from 'react'

interface ChipProps {
  children: ReactNode
  tone?: 'coral' | 'sage' | 'amber' | 'neutral'
}

const toneClasses: Record<NonNullable<ChipProps['tone']>, string> = {
  coral: 'bg-coral-soft text-coral-dark',
  sage: 'bg-sage-soft text-sage-dark',
  amber: 'bg-amber-soft text-amber',
  neutral: 'bg-charcoal/5 text-charcoal-soft',
}

export function Chip({ children, tone = 'neutral' }: ChipProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${toneClasses[tone]}`}>
      {children}
    </span>
  )
}
