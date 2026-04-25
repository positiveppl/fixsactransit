'use client'
import React from 'react'

interface ShareTicketProps {
  origin: string
  dest: string
  transitMin: number
  driveMin: number
  pain: string
  walkMin: number
  waitMin: number
  waitPct: number
  transfers: number
  ticketRef: React.RefObject<HTMLDivElement>
}

// Barcode bar widths — deterministic fake barcode
const BARCODE = [2,1,3,1,2,1,1,2,3,1,2,1,1,3,1,2,1,2,1,1,3,2,1,1,2,1,3,1,2,1]

function fmtMin(m: number) {
  if (m < 60) return `${Math.round(m)} min`
  const h = Math.floor(m / 60)
  const rem = Math.round(m % 60)
  return rem === 0 ? `${h}h` : `${h}h ${rem}m`
}

export default function ShareTicket({
  origin, dest, transitMin, driveMin,
  pain, walkMin, waitMin, waitPct, transfers,
  ticketRef
}: ShareTicketProps) {

  const truncate = (s: string, max: number) =>
    s.length > max ? s.slice(0, max - 1) + '…' : s

  const neighborhood = (s: string) => {
    const parts = s.split(',').map(p => p.trim()).filter(Boolean)
    return truncate(parts[1] ?? parts[0] ?? s, 22)
  }
  const fromLabel = neighborhood(origin)
  const toLabel   = neighborhood(dest)
  const waitPctDisplay = Math.round(waitPct * 100)

  return (
    <div
      ref={ticketRef}
      style={{
        position: 'fixed',
        left: '-9999px',
        top: 0,
        width: 340,
        fontFamily: "'Space Mono', 'JetBrains Mono', monospace",
        background: 'transparent',
        zIndex: -1,
        // html2canvas needs the element visible in the DOM tree
        visibility: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Ticket card */}
      <div style={{
        width: 340,
        background: '#ffffff',
        borderRadius: 6,
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
      }}>

        {/* ── Skyline header ── */}
        <div style={{ position: 'relative', height: 180, background: '#1a1a1a', overflow: 'hidden' }}>
          <svg width="340" height="180" viewBox="0 0 340 180" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="st-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1c2e4a"/>
                <stop offset="60%" stopColor="#2d4a6e"/>
                <stop offset="100%" stopColor="#3d6080"/>
              </linearGradient>
              <linearGradient id="st-river" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a3a52"/>
                <stop offset="100%" stopColor="#0f2233"/>
              </linearGradient>
            </defs>

            {/* Sky */}
            <rect width="340" height="180" fill="url(#st-sky)"/>

            {/* Moon */}
            <circle cx="290" cy="32" r="9" fill="#e8dfc8" opacity="0.9"/>

            {/* Stars */}
            <circle cx="40"  cy="18" r="0.8" fill="#fff" opacity="0.6"/>
            <circle cx="80"  cy="12" r="0.6" fill="#fff" opacity="0.5"/>
            <circle cx="130" cy="20" r="0.7" fill="#fff" opacity="0.7"/>
            <circle cx="180" cy="10" r="0.5" fill="#fff" opacity="0.4"/>
            <circle cx="240" cy="22" r="0.8" fill="#fff" opacity="0.6"/>
            <circle cx="55"  cy="30" r="0.5" fill="#fff" opacity="0.4"/>

            {/* BG buildings */}
            <rect x="60"  y="80"  width="18" height="48" fill="#2a4a68" rx="1"/>
            <rect x="78"  y="72"  width="14" height="56" fill="#2d5070" rx="1"/>
            <rect x="92"  y="85"  width="20" height="43" fill="#263d58" rx="1"/>
            <rect x="112" y="78"  width="12" height="50" fill="#2a4868" rx="1"/>

            {/* Main tower left */}
            <rect x="130" y="52" width="28" height="76" fill="#233d5a" rx="1"/>
            <rect x="134" y="56" width="4" height="4" fill="#6ba3c8" opacity="0.5" rx="0.5"/>
            <rect x="140" y="56" width="4" height="4" fill="#6ba3c8" opacity="0.6" rx="0.5"/>
            <rect x="146" y="56" width="4" height="4" fill="#f0c060" opacity="0.7" rx="0.5"/>
            <rect x="134" y="64" width="4" height="4" fill="#f0c060" opacity="0.5" rx="0.5"/>
            <rect x="140" y="64" width="4" height="4" fill="#6ba3c8" opacity="0.4" rx="0.5"/>
            <rect x="146" y="72" width="4" height="4" fill="#f0c060" opacity="0.6" rx="0.5"/>
            <rect x="143" y="42" width="2" height="12" fill="#3a6080"/>
            <circle cx="144" cy="42" r="2" fill="#4a7a9a"/>

            {/* Mid tower */}
            <rect x="162" y="62" width="22" height="66" fill="#1e3550" rx="1"/>
            <rect x="165" y="66" width="4" height="4" fill="#f0c060" opacity="0.8" rx="0.5"/>
            <rect x="172" y="66" width="4" height="4" fill="#6ba3c8" opacity="0.5" rx="0.5"/>
            <rect x="165" y="74" width="4" height="4" fill="#6ba3c8" opacity="0.4" rx="0.5"/>
            <rect x="172" y="82" width="4" height="4" fill="#f0c060" opacity="0.5" rx="0.5"/>

            {/* Short wide building */}
            <rect x="188" y="82" width="30" height="46" fill="#243e58" rx="1"/>
            <rect x="191" y="86" width="5" height="4" fill="#f0c060" opacity="0.6" rx="0.5"/>
            <rect x="199" y="86" width="5" height="4" fill="#6ba3c8" opacity="0.4" rx="0.5"/>
            <rect x="207" y="94" width="5" height="4" fill="#f0c060" opacity="0.4" rx="0.5"/>

            {/* Right cluster */}
            <rect x="220" y="74" width="16" height="54" fill="#1e3550" rx="1"/>
            <rect x="223" y="78" width="4" height="4" fill="#f0c060" opacity="0.7" rx="0.5"/>
            <rect x="238" y="88" width="20" height="40" fill="#28415e" rx="1"/>
            <rect x="242" y="92" width="4" height="4" fill="#6ba3c8" opacity="0.5" rx="0.5"/>

            {/* Tower Bridge */}
            <rect x="78"  y="126" width="185" height="5" fill="#c8853a"/>
            <rect x="96"  y="102" width="12"  height="30" fill="#d4903f" rx="0.5"/>
            <polygon points="96,102 108,102 105,92 99,92" fill="#d4903f"/>
            <rect x="100" y="88"  width="8"   height="6"  fill="#c8853a"/>
            <polygon points="100,88 108,88 104,82" fill="#bf7a30"/>
            <rect x="99"  y="106" width="4" height="5" fill="#7ab8d8" opacity="0.6" rx="0.5"/>

            <rect x="233" y="102" width="12"  height="30" fill="#d4903f" rx="0.5"/>
            <polygon points="233,102 245,102 242,92 236,92" fill="#d4903f"/>
            <rect x="237" y="88"  width="8"   height="6"  fill="#c8853a"/>
            <polygon points="237,88 245,88 241,82" fill="#bf7a30"/>
            <rect x="236" y="106" width="4" height="5" fill="#7ab8d8" opacity="0.6" rx="0.5"/>

            {/* Cables */}
            <line x1="102" y1="92" x2="155" y2="126" stroke="#b87830" strokeWidth="0.8" opacity="0.7"/>
            <line x1="108" y1="92" x2="170" y2="126" stroke="#b87830" strokeWidth="0.8" opacity="0.7"/>
            <line x1="241" y1="92" x2="189" y2="126" stroke="#b87830" strokeWidth="0.8" opacity="0.7"/>
            <line x1="235" y1="92" x2="175" y2="126" stroke="#b87830" strokeWidth="0.8" opacity="0.7"/>

            {/* River */}
            <rect x="0" y="131" width="340" height="49" fill="url(#st-river)"/>
            <line x1="20"  y1="140" x2="80"  y2="140" stroke="#1e4a6a" strokeWidth="1" opacity="0.5"/>
            <line x1="100" y1="144" x2="200" y2="144" stroke="#1e4a6a" strokeWidth="1" opacity="0.4"/>
            <line x1="220" y1="140" x2="310" y2="140" stroke="#1e4a6a" strokeWidth="1" opacity="0.5"/>

            {/* Ground */}
            <rect x="0"   y="128" width="78"  height="4" fill="#162a1e" opacity="0.9"/>
            <rect x="263" y="128" width="77"  height="4" fill="#162a1e" opacity="0.9"/>

            {/* Foreground trees */}
            <ellipse cx="30"  cy="128" rx="18" ry="16" fill="#0f2018"/>
            <ellipse cx="50"  cy="132" rx="14" ry="12" fill="#122218"/>
            <ellipse cx="16"  cy="133" rx="12" ry="10" fill="#0d1c14"/>
            <ellipse cx="310" cy="128" rx="18" ry="16" fill="#0f2018"/>
            <ellipse cx="295" cy="132" rx="14" ry="12" fill="#122218"/>
            <ellipse cx="325" cy="133" rx="12" ry="10" fill="#0d1c14"/>
          </svg>

          {/* Brand overlay */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            padding: '14px 18px',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#fff', textTransform: 'uppercase' }}>
                Fix Sac Transit
              </div>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 2 }}>
                Sacramento, CA
              </div>
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
              #0047821
            </div>
          </div>
        </div>

        {/* ── Ticket body ── */}

        {/* Route section */}
        <div style={{ padding: '18px 22px 14px' }}>
          <div style={{ fontSize: 7, letterSpacing: '0.25em', color: '#bbb', textTransform: 'uppercase', marginBottom: 10 }}>
            Route
          </div>

          {/* FROM */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dashed #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              </svg>
              <span style={{ fontSize: 10, color: '#333' }}>{fromLabel}</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#1a1a1a' }}>FROM</span>
          </div>

          {/* TO */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
              </svg>
              <span style={{ fontSize: 10, color: '#333' }}>{toLabel}</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#1a1a1a' }}>TO</span>
          </div>
        </div>

        {/* Tear line */}
        <div style={{ height: 1, background: '#e8e8e8', position: 'relative', margin: '0 10px' }}/>

        {/* Pain ratio */}
        <div style={{ padding: '20px 22px 8px', display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1, color: '#e02000', letterSpacing: '-0.04em' }}>
            {pain}
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#e02000', lineHeight: 1 }}>×</div>
            <div style={{ fontSize: 8, letterSpacing: '0.15em', color: '#999', textTransform: 'uppercase', lineHeight: 1.4 }}>
              slower<br/>by transit
            </div>
          </div>
        </div>

        {/* Wait bar */}
        <div style={{ padding: '0 22px 18px' }}>
          <div style={{ height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden', marginBottom: 5 }}>
            <div style={{ height: '100%', width: `${waitPctDisplay}%`, background: '#e02000', borderRadius: 3 }}/>
          </div>
          <div style={{ fontSize: 8, color: '#bbb', letterSpacing: '0.08em' }}>
            <span style={{ color: '#e02000' }}>{waitPctDisplay}%</span> of trip spent waiting
          </div>
        </div>

        {/* Tear line */}
        <div style={{ height: 1, background: '#e8e8e8', margin: '0 10px' }}/>

        {/* Breakdown */}
        <div style={{ padding: '18px 22px 14px' }}>
          <div style={{ fontSize: 7, letterSpacing: '0.25em', color: '#bbb', textTransform: 'uppercase', marginBottom: 10 }}>
            Trip Breakdown
          </div>

          {[
            {
              label: 'Walk to stop', val: fmtMin(walkMin), valColor: '#1a1a1a',
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="2"/><path d="M15 8l-3 2-2 5H8"/><path d="M9 10l-2 8"/><path d="M13 10l2 4 3 2"/><path d="M11 15l-1 5"/></svg>
            },
            {
              label: 'Wait for bus', val: fmtMin(waitMin), valColor: '#e02000', labelColor: '#999',
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>
            },
            {
              label: 'Bus ride', val: fmtMin(transitMin - walkMin - waitMin), valColor: '#1a1a1a',
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="13" rx="2"/><path d="M3 10h18"/><path d="M8 18v2M16 18v2"/><circle cx="7.5" cy="14" r="1" fill="#1a1a1a"/><circle cx="16.5" cy="14" r="1" fill="#1a1a1a"/></svg>
            },
            {
              label: 'Same trip by car', val: fmtMin(driveMin), valColor: '#1a7a4a', labelColor: '#999',
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11l1.5-4.5h11L19 11"/><rect x="3" y="11" width="18" height="7" rx="1"/><circle cx="7.5" cy="18" r="1.5" fill="#1a1a1a"/><circle cx="16.5" cy="18" r="1.5" fill="#1a1a1a"/></svg>
            },
            {
              label: 'Transfers', val: String(transfers), valColor: '#1a1a1a',
              icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
            },
          ].map((row, i, arr) => (
            <div key={row.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '5px 0',
              borderBottom: i < arr.length - 1 ? '1px dashed #f0f0f0' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {row.icon}
                <span style={{ fontSize: 10, color: row.labelColor ?? '#333' }}>{row.label}</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: row.valColor }}>{row.val}</span>
            </div>
          ))}
        </div>

        {/* Stub */}
        <div style={{
          background: '#1a1a1a', padding: '14px 22px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.05em' }}>
              fixsactransit.org
            </div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>
              We can do better.
            </div>
          </div>
          {/* Barcode */}
          <div style={{ display: 'flex', gap: 1.5, alignItems: 'center', height: 32 }}>
            {BARCODE.map((w, i) => (
              <div key={i} style={{
                width: w, height: '100%',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: 1,
              }}/>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
