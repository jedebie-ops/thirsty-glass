import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { WeightEntry } from '../../types'

interface WeightTrendChartProps {
  entries: WeightEntry[]
  goalWeightKg: number
  color: string
}

export function WeightTrendChart({ entries, goalWeightKg, color }: WeightTrendChartProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-charcoal-soft">Nog geen wegingen gelogd.</p>
  }

  const data = entries.map((e) => ({
    date: e.dateISO.slice(5),
    gewicht: e.weightKg,
  }))

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-charcoal-soft)" strokeOpacity={0.1} vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-charcoal-soft)' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--color-charcoal-soft)' }}
            axisLine={false}
            tickLine={false}
            width={44}
            domain={['auto', 'auto']}
          />
          <Tooltip formatter={(value) => [`${value} kg`, 'Gewicht'] as [string, string]} />
          <ReferenceLine
            y={goalWeightKg}
            stroke="var(--color-sage)"
            strokeDasharray="4 4"
            label={{ value: `doel ${goalWeightKg}kg`, fontSize: 11, fill: 'var(--color-sage-dark)', position: 'insideTopRight' }}
          />
          <Line type="monotone" dataKey="gewicht" stroke={color} strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
