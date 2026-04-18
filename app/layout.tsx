import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fix Sac Transit — Sacramento Transit Reality',
  description: "Sacramento transit is 6.6× slower than driving. We're the state capital. This should not be acceptable.",
  viewport: 'width=device-width, initial-scale=1.0',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
