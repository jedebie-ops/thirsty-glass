import { motion } from 'framer-motion'

const COLORS = ['#FF6B4A', '#4C9A6A', '#D99A2B', '#4A6FA5', '#D9668B']
const PARTICLE_COUNT = 24

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

export function ConfettiBurst() {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    color: COLORS[i % COLORS.length],
    x: randomBetween(-140, 140),
    y: randomBetween(-260, -60),
    rotate: randomBetween(-180, 180),
    delay: randomBetween(0, 0.15),
    size: randomBetween(6, 11),
  }))

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-sm"
          style={{ backgroundColor: p.color, width: p.size, height: p.size * 1.6 }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.rotate }}
          transition={{ duration: 1.1, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
