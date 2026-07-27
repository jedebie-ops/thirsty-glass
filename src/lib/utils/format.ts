export function formatKcal(value: number): string {
  return `${Math.round(value)} kcal`
}

export function formatGrams(value: number): string {
  return `${Math.round(value)} g`
}

export function formatKg(value: number): string {
  return `${value.toFixed(1)} kg`
}

export function formatSignedKg(value: number): string {
  const rounded = Math.round(value * 10) / 10
  return rounded > 0 ? `+${rounded.toFixed(1)} kg` : `${rounded.toFixed(1)} kg`
}
