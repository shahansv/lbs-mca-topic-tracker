'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'

export default function Nav() {
  const path = usePathname()

  const links = [
    { href: '/',         label: 'Days' },
    { href: '/overview', label: 'Progress' },
  ]

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 600,
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              letterSpacing: 0,
            }}
          >
            LBS
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.01em' }}>
            MCA Prep
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: 4 }}>
          {links.map(({ href, label }) => {
            const active = path === href
            return (
              <Link
                key={href}
                href={href}
                style={{
                  position: 'relative',
                  padding: '5px 14px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: active ? 500 : 400,
                  color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 6,
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
