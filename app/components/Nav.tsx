'use client'

export default function Nav() {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 32px', borderBottom: '1px solid #e5e5e5',
      position: 'sticky', top: 0, background: '#ffffff', zIndex: 50,
    }}>
      <div style={{ fontFamily: 'Arial Black, Impact, ui-sans-serif', fontSize: 15, fontWeight: 900, letterSpacing: '0.06em', color: '#202020', textTransform: 'uppercase' }}>
        Elastic City
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{ fontSize: 14, color: '#646464', textDecoration: 'underline dotted #bbbbbb', textUnderlineOffset: 3, cursor: 'pointer' }}>
          Sacramento, CA
        </span>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#2b9a66', color: '#fff', fontSize: 12, fontWeight: 600,
          padding: '4px 14px', borderRadius: 9999,
        }}>
          <div className="pulse" style={{ width: 5, height: 5, background: '#fff', borderRadius: '50%' }} />
          SacRT Live
        </div>
      </div>
    </nav>
  )
}
