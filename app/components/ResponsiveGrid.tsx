'use client'
import { useEffect, useState, ReactNode } from 'react'

export function ContentGrid({ children }: { children: ReactNode }) {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{
      maxWidth: 1200, margin: '0 auto',
      padding: mobile ? '32px 16px' : '64px 32px',
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '1fr 380px',
      gap: mobile ? 24 : 48,
    }}>
      {children}
    </div>
  )
}

export function StatGrid({ children }: { children: ReactNode }) {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 560)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)',
      borderBottom: '1px solid #e5e5e5',
    }}>
      {children}
    </div>
  )
}

export function TripGrid({ children }: { children: ReactNode }) {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{
      maxWidth: 1200, margin: '0 auto',
      padding: mobile ? '60px 20px' : '80px 32px',
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
      gap: mobile ? 32 : 48,
      alignItems: 'start',
    }}>
      {children}
    </div>
  )
}
