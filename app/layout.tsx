import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fix Sac Transit — Sacramento vs Every Other City',
  description: "Sacramento transit is 6.6× slower than driving. We're the state capital. This should not be acceptable.",
  openGraph: {
    title: 'Fix Sac Transit',
    description: "Sacramento transit is 6.6× slower than driving. We're the state capital.",
    url: 'https://fixsactransit.org',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
