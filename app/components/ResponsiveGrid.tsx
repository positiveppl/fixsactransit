'use client'
import { useEffect, useState, ReactNode } from 'react'

export function ContentGrid({ children }: { children: ReactNode }) {
  const [cols, setCols] = useState('1fr 380px')
  const [pad, setPad] = useState('64px 32px')
  const [gap, setGap] = useState(48)

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 900
      setCols(mobile ? '1fr' : '1fr 380px')
      setPad(mobile ? '32px 16px' : '64px 32px')
      setGap(mobile ? 24 : 48)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{
      maxWidth: 1200, margin: '0 auto',
      padding: pad, display: 'grid',
      gridTemplateColumns: cols, gap,
    }}>
      {children}
    </div>
  )
}
