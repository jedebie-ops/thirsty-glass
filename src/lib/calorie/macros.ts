import type { MacroTargets } from '../../types'

const FAT_SHARE_OF_TARGET = 0.25
const MIN_FAT_SHARE_OF_TARGET = 0.15

export function computeMacros(params: {
  targetKcal: number
  weightKg: number
  proteinGPerKgBodyweight: number
}): MacroTargets {
  const { targetKcal, weightKg, proteinGPerKgBodyweight } = params

  let proteinKcal = proteinGPerKgBodyweight * weightKg * 4
  let fatKcal = FAT_SHARE_OF_TARGET * targetKcal

  // Bewaakt tegen extreem lage caloriedoelen: eiwit+vet mogen nooit het
  // volledige budget opeisen zodat koolhydraten nooit negatief worden.
  // Vet wordt eerst verlaagd (met een ondergrens), pas daarna eiwit.
  if (proteinKcal + fatKcal > targetKcal) {
    fatKcal = Math.max(targetKcal - proteinKcal, targetKcal * MIN_FAT_SHARE_OF_TARGET)
    if (proteinKcal > targetKcal - fatKcal) {
      proteinKcal = Math.max(targetKcal - fatKcal, 0)
    }
  }

  const carbsKcal = Math.max(targetKcal - proteinKcal - fatKcal, 0)

  return {
    proteinG: proteinKcal / 4,
    fatG: fatKcal / 9,
    carbsG: carbsKcal / 4,
    proteinKcal,
    fatKcal,
    carbsKcal,
  }
}
