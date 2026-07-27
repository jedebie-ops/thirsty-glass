import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-3xl bg-white/70 p-5 shadow-sm ring-1 ring-charcoal/5 backdrop-blur-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
