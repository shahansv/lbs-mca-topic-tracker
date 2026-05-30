import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginBottom: 16 }}>
        404
      </p>
      <h1 style={{ fontSize: 24, fontWeight: 300, color: '#fff', marginBottom: 24 }}>Page not found</h1>
      <Link
        href="/"
        style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', textDecoration: 'none' }}
      >
        ← Go home
      </Link>
    </main>
  )
}
