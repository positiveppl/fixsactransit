import type { Metadata, Viewport } from 'next'
import './globals.css'

const SITE_URL = 'https://fixsactransit.org'
const SITE_NAME = 'Fix Sac Transit'
const TITLE = 'Fix Sac Transit — Sacramento Transit Reality Check'
const DESCRIPTION =
  "How bad is Sacramento transit? We measure the Pain Ratio, Accessibility Gap, and Transit Viability Score across 12 major US cities — live data, updated daily."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // ── Core ───────────────────────────────────────────────────────────────────
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    'Sacramento transit',
    'public transit health',
    'pain ratio',
    'transit viability score',
    'accessibility gap',
    'GTFS data',
    'SacRT',
    'urban planning metrics',
    'transit vs driving',
    'Sacramento public transportation',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  // ── Canonical ──────────────────────────────────────────────────────────────
  alternates: {
    canonical: '/',
  },

  // ── Open Graph ─────────────────────────────────────────────────────────────
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',   // 1200×630, create this (see notes below)
        width: 1200,
        height: 630,
        alt: 'Fix Sac Transit — Sacramento transit is 6.6× slower than driving',
      },
    ],
  },

  // ── Twitter / X ────────────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
    // creator: '@yourhandle',   // add when you have one
  },

  // ── Robots ─────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── App / PWA hints ────────────────────────────────────────────────────────
  applicationName: SITE_NAME,
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },

  // ── Web manifest ───────────────────────────────────────────────────────────
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f172a' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              // WebSite schema — enables sitelinks search box in Google
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: SITE_NAME,
                url: SITE_URL,
                description: DESCRIPTION,
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `${SITE_URL}/?q={search_term_string}`,
                  },
                  'query-input': 'required name=search_term_string',
                },
              },
              // Dataset schema — signals to Google this is real data
              {
                '@context': 'https://schema.org',
                '@type': 'Dataset',
                name: 'US City Transit Health Metrics',
                description:
                  'Pain Ratio, Accessibility Gap Index, and Transit Viability Score for 12 major US cities, computed from live GTFS feeds.',
                url: SITE_URL,
                creator: {
                  '@type': 'Organization',
                  name: SITE_NAME,
                  url: SITE_URL,
                },
                license: 'https://creativecommons.org/licenses/by/4.0/',
                variableMeasured: [
                  'Pain Ratio (transit time ÷ car time)',
                  'Accessibility Gap Index',
                  'Transit Viability Score',
                  'Average headway',
                  'Route coverage percentage',
                ],
                spatialCoverage: {
                  '@type': 'Place',
                  name: 'United States',
                },
                temporalCoverage: '2024/..',
                updateFrequency: 'Daily',
              },
            ]),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
