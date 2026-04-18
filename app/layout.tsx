import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fix Sac Transit — Sacramento Transit Reality',
  description: "Sacramento transit is 6.6× slower than driving. We're the state capital. This should not be acceptable.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          @media (max-width: 900px) {
            .content-grid {
              grid-template-columns: 1fr !important;
              padding: 32px 16px !important;
              gap: 24px !important;
            }
            .stat-strip-grid {
              grid-template-columns: 1fr 1fr !important;
            }
            .hero-section {
              padding: 60px 20px 72px !important;
            }
            .trip-planner-grid {
              grid-template-columns: 1fr !important;
              gap: 32px !important;
            }
            .manifesto-section {
              padding: 64px 20px !important;
            }
          }
          @media (max-width: 560px) {
            .stat-strip-grid {
              grid-template-columns: 1fr 1fr !important;
            }
            .stat-cell-inner {
              padding: 18px 16px !important;
            }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
