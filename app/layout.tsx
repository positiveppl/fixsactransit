import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fix Sac Transit — Sacramento Transit Reality',
  description: "Sacramento transit is 6.6× slower than driving. We're the state capital. This should not be acceptable.",
  // remove the viewport line from here
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,     // prevents weird zoom on iOS
  userScalable: true,  // or false if you want to lock zoom
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}