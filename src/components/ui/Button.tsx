import { motion } from 'framer-motion'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'
>

interface ButtonProps extends NativeButtonProps {
  variant?: Variant
  children?: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-coral text-white shadow-md shadow-coral/30 hover:bg-coral-dark',
  secondary: 'bg-coral-soft text-coral-dark hover:bg-coral-soft/80',
  ghost: 'bg-transparent text-charcoal hover:bg-charcoal/5',
}

export function Button({ variant = 'primary', children, className = '', ...rest }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
