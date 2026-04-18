'use client'
import { CityScore, fmtMin } from '../lib/api'

export default function CodeBlock({ sac }: { sac: CityScore | null }) {
  const transit = sac?.transit_minutes ?? 100
  const drive = sac?.drive_minutes ?? 15
  const wait = sac?.wait_minutes ?? 41
  const pain = sac?.pain_factor ?? 6.6

  return (
    <div style={{ marginTop: 16, background: '#24292e', borderRadius: 20, overflow: 'hidden', border: '1px solid #202020' }}>
      <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        </div>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>pain_factor.js</span>
      </div>
      <div style={{ padding: '20px 24px', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, lineHeight: 1.6, color: '#e8e8e8', overflowX: 'auto' }}>
        <span style={{ color: '#6a737d' }}>// Transit Reality Calculator — Sacramento</span><br />
        <span style={{ color: '#79b8ff' }}>const</span> trip = {'{'}<br />
        &nbsp;&nbsp;<span style={{ color: '#9ecbff' }}>origin</span>: <span style={{ color: '#f97583' }}>"Oak Park, Sacramento"</span>,<br />
        &nbsp;&nbsp;<span style={{ color: '#9ecbff' }}>destination</span>: <span style={{ color: '#f97583' }}>"Downtown Sacramento"</span>,<br />
        &nbsp;&nbsp;<span style={{ color: '#9ecbff' }}>transit_minutes</span>: <span style={{ color: '#f8e045' }}>{transit}</span>,<br />
        &nbsp;&nbsp;<span style={{ color: '#9ecbff' }}>drive_minutes</span>: <span style={{ color: '#f8e045' }}>{drive}</span>,<br />
        &nbsp;&nbsp;<span style={{ color: '#9ecbff' }}>wait_minutes</span>: <span style={{ color: '#f8e045' }}>{wait}</span>,<br />
        {'}'};<br /><br />
        <span style={{ color: '#6a737d' }}>// The number that says everything</span><br />
        <span style={{ color: '#79b8ff' }}>const</span> painFactor = trip.<span style={{ color: '#9ecbff' }}>transit_minutes</span> / trip.<span style={{ color: '#9ecbff' }}>drive_minutes</span>;<br />
        <span style={{ color: '#6a737d' }}>// → {pain} (We are the capital of California.)</span>
      </div>
    </div>
  )
}
