'use client'

export default function Manifesto() {
  return (
    <>
      <section style={{ background: '#202020', color: '#fff', padding: '96px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(234,40,4,0.15) 0%, transparent 70%)' }} />
        <div style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#8d8d8d', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 32, position: 'relative' }}>
          Sacramento, California · State Capital
        </div>
        <h2 style={{ fontFamily: 'Arial Black, Impact, ui-sans-serif', fontSize: 'clamp(48px, 9vw, 108px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: 24, position: 'relative' }}>
          This Should<br />Not Be <span style={{ color: '#ea2804' }}>Acceptable.</span>
        </h2>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', maxWidth: 580, margin: '0 auto 48px', lineHeight: 1.6, position: 'relative' }}>
          Thousands of people shuffle into downtown Sacramento every morning, clogging freeways — because transit isn't a real option. We are the capital of a state that leads the world in innovation. We can do better.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <button
            onClick={() => {
              const text = "Sacramento transit is dramatically slower than driving. We're the state capital. This should not be acceptable.\n\nfixsactransit.org #fixsactransit"
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400')
            }}
            style={{ background: '#202020', color: '#fcfcfc', fontSize: 15, fontWeight: 600, padding: '12px 28px', borderRadius: 9999, border: 'none', cursor: 'pointer', outline: '4px solid #202020' }}>
            Share This
          </button>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
            style={{ background: 'transparent', color: '#fff', fontSize: 15, fontWeight: 600, padding: '12px 28px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.4)', cursor: 'pointer', textDecoration: 'none' }}>
            View on GitHub
          </a>
        </div>
      </section>

      <footer style={{ background: '#fff', borderTop: '1px solid #e5e5e5', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#8d8d8d', fontFamily: 'JetBrains Mono, monospace', flexWrap: 'wrap', gap: 8 }}>
        <span>Data: SacRT GTFS-RT (live) · Built to make change.</span>
        <span>fixsactransit.org</span>
      </footer>
    </>
  )
}
