import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: '#556B2F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  manifest: '/manifest.json',
  icons: {
    apple: '/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Krckaj.me',
  },
  title: {
    default: "Krckaj.me - Tvoja digitalna knjiga recepata",
    template: "%s | Krckaj.me"
  },
  description: "Otkrijte, sačuvajte i podelite svoje omiljene recepte. Krckaj.me je vaša digitalna knjiga recepata sa sastojcima, nutritivnim vrednostima i korisničkim ocenama.",
  keywords: ["recepti", "kuvanje", "knjiga recepata", "kuhinja", "srpski recepti", "balkanska kuhinja", "domaća jela"],
  authors: [{ name: "Krckaj.me" }],
  creator: "Krckaj.me",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "sr_RS",
    siteName: "Krckaj.me",
    title: "Krckaj.me - Tvoja digitalna knjiga recepata",
    description: "Otkrijte, sačuvajte i podelite svoje omiljene recepte.",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Krckaj.me - Tvoja digitalna knjiga recepata"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Krckaj.me - Tvoja digitalna knjiga recepata",
    description: "Otkrijte, sačuvajte i podelite svoje omiljene recepte.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  }
};

import { GoogleAnalytics } from '@next/third-parties/google'
import WelcomeModal from '@/components/WelcomeModalClient'
import Footer from '@/components/Footer'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import CookieBanner from '@/components/CookieBanner'
import { Analytics } from '@vercel/analytics/react'
import MobileBottomNav from '@/components/MobileBottomNav'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased font-sans pb-16 md:pb-0`}
      >
        <ServiceWorkerRegistration />
        {children}
        <WelcomeModal />
        <CookieBanner />
        <Footer />
        <MobileBottomNav />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        <Analytics />
      </body>
    </html>
  );
}
