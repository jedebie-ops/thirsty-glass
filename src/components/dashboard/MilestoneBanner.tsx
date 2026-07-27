import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'
import { ConfettiBurst } from '../ui/ConfettiBurst'

const EMPTY_MILESTONES: number[] = []

export function MilestoneBanner({ profileId, kgLostSoFar }: { profileId: string; kgLostSoFar: number }) {
  // Stabiele referentie nodig: `?? []` zou elke render een nieuwe array
  // teruggeven en zo een render-loop veroorzaken via useSyncExternalStore.
  const celebratedMilestones = useAppStore((s) => s.celebratedMilestones[profileId] ?? EMPTY_MILESTONES)
  const markMilestoneCelebrated = useAppStore((s) => s.markMilestoneCelebrated)
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null)

  useEffect(() => {
    const reached = Math.floor(kgLostSoFar / 5) * 5
    if (reached >= 5 && !celebratedMilestones.includes(reached)) {
      setActiveMilestone(reached)
    }
  }, [kgLostSoFar, celebratedMilestones])

  if (activeMilestone === null) return null

  return (
    <AnimatePresence>
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-sage-soft p-5 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        <ConfettiBurst />
        <p className="text-lg font-bold text-sage-dark">🎉 -{activeMilestone}kg mijlpaal gehaald!</p>
        <button
          className="mt-2 text-sm font-semibold text-sage-dark underline"
          onClick={() => {
            markMilestoneCelebrated(profileId, activeMilestone)
            setActiveMilestone(null)
          }}
        >
          Toppie!
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
