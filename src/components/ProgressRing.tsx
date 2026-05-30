'use client'

import { motion } from 'motion/react'

interface Props {
  pct: number
  size?: number
  stroke?: number
  color?: string
  trackColor?: string
  className?: string
}

export default function ProgressRing({
  pct,
  size = 40,
  stroke = 2.5,
  color = '#fff',
  trackColor = 'rgba(255,255,255,0.07)',
}: Props) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={trackColor}
        strokeWidth={stroke}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${dash} ${circ}` }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
      />
    </svg>
  )
}
