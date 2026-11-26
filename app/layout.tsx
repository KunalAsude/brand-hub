import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import '@fontsource/anton/400.css'
import '@fontsource-variable/archivo'
import '@fontsource/noto-sans-devanagari/devanagari-500.css'
import '@fontsource/noto-sans-devanagari/devanagari-700.css'
import './globals.css'

import { allowIndexing, siteUrl } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  robots: allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  title: 'Brand Hub Mens Wear – Kopargaon | Jackets, Shirts, Winter wear',
  description: 'Fresh arrivals at Brand Hub Mens Wear, Prashant Palace, Kopargaon. See real photos and reels of the latest styles, choose your colour and order on WhatsApp.',
  openGraph: {
    title: 'Brand Hub Mens Wear – Kopargaon',
    description: 'New stock has arrived. Browse real fits and order on WhatsApp.',
    images: [{ url: '/products/plain-shirt/maroon.jpg', width: 720, height: 900, alt: 'Premium plain shirt at Brand Hub Mens Wear' }],
    locale: 'en_IN',
    type: 'website',
  },
  icons: { icon: '/icon.png', apple: '/apple-icon.png' },
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#efede8', width: 'device-width', initialScale: 1 }

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: 'Brand Hub Mens Wear',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Prashant Palace, Juna Bhaji Market Road',
    addressLocality: 'Kopargaon',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  telephone: ['+918605339900', '+919156550404'],
  hasMap: 'https://www.google.com/maps/search/?api=1&query=Brand+Hub+Mens+Wear+Kopargaon',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness).replace(/</g, '\\u003c') }} />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
