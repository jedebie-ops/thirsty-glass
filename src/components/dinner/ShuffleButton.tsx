import { motion } from 'framer-motion'
import { Shuffle } from 'lucide-react'
import { Button } from '../ui/Button'

export function ShuffleButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button variant="primary" onClick={onClick} className="w-full">
      <motion.span whileTap={{ rotate: 180 }} transition={{ duration: 0.4 }} className="inline-flex">
        <Shuffle className="h-5 w-5" />
      </motion.span>
      {label}
    </Button>
  )
}
