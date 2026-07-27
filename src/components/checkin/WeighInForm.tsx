import { useState, type FormEvent } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export function WeighInForm({ profileId }: { profileId: string }) {
  const addOrUpdateWeightEntry = useAppStore((s) => s.addOrUpdateWeightEntry)
  const todayISO = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(todayISO)
  const [weight, setWeight] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const value = Number.parseFloat(weight.replace(',', '.'))
    if (!Number.isFinite(value) || value <= 0) return
    addOrUpdateWeightEntry(profileId, value, date)
    setWeight('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-charcoal-soft">Nieuwe weging loggen</p>
        <div className="flex gap-2">
          <input
            type="date"
            value={date}
            max={todayISO}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-xl border border-charcoal/10 bg-white px-3 py-2 text-sm"
          />
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            placeholder="bv. 121.4"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            className="flex-1 rounded-xl border border-charcoal/10 bg-white px-3 py-2 text-sm"
          />
          <span className="self-center text-sm text-charcoal-soft">kg</span>
        </div>
        <Button type="submit" variant="primary">
          {saved ? 'Opgeslagen ✓' : 'Opslaan'}
        </Button>
      </form>
    </Card>
  )
}
