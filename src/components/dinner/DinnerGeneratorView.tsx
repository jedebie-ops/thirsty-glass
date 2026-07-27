import { AnimatePresence, motion } from 'framer-motion'
import { useDinnerGenerator } from '../../hooks/useDinnerGenerator'
import { useAppStore } from '../../store/useAppStore'
import { DinnerCard } from './DinnerCard'
import { ShuffleButton } from './ShuffleButton'
import { FavoritesList } from './FavoritesList'
import { Chip } from '../ui/Chip'
import { FLAVOR_PROFILES_BY_ID } from '../../data/flavorProfiles'
import { COOKING_METHODS_BY_ID } from '../../data/cookingMethods'

export function DinnerGeneratorView() {
  const { currentPlan, generate, canGenerate, toggleFavorite } = useDinnerGenerator()
  const profiles = useAppStore((s) => s.profiles)

  if (!canGenerate) {
    return <p className="text-sm text-charcoal-soft">Log eerst een gewicht bij Check-in om een diner te genereren.</p>
  }

  if (!currentPlan) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <span className="text-5xl">🍽️</span>
        <p className="text-charcoal-soft">Nog geen diner gegenereerd. Klaar om te koken?</p>
        <ShuffleButton onClick={generate} label="Genereer ons eerste diner" />
      </div>
    )
  }

  const flavor = FLAVOR_PROFILES_BY_ID[currentPlan.flavorProfileId]
  const method = COOKING_METHODS_BY_ID[currentPlan.cookingMethodId]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Chip tone="coral">
          {flavor.emoji} {flavor.name}
        </Chip>
        <Chip tone="sage">
          {method.emoji} {method.name} · {method.description}
        </Chip>
        <button onClick={() => toggleFavorite(currentPlan.id)} className="ml-auto text-2xl" aria-label="Favoriet">
          {currentPlan.isFavorite ? '⭐' : '☆'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPlan.id}
          initial={{ opacity: 0, rotateY: -8, scale: 0.98 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {currentPlan.portionsByProfile.map((portion) => {
            const profile = profiles.find((p) => p.id === portion.profileId)
            if (!profile) return null
            return <DinnerCard key={portion.profileId} profile={profile} portion={portion} />
          })}
        </motion.div>
      </AnimatePresence>

      <ShuffleButton onClick={generate} label="Genereer opnieuw" />

      <FavoritesList />
    </div>
  )
}
