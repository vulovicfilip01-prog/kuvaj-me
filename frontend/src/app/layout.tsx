import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    default: "Kuvaj.me - Tvoja digitalna knjiga recepata",
    template: "%s | Kuvaj.me"
  },
  description: "Otkrijte, sačuvajte i podelite svoje omiljene recepte. Kuvaj.me je vaša digitalna knjiga recepata sa sastojcima, nutritivnim vrednostima i korisničkim ocenama.",
  keywords: ["recepti", "kuvanje", "knjiga recepata", "kuhinja", "srpski recepti", "balkanska kuhinja", "domaća jela"],
  authors: [{ name: "Kuvaj.me" }],
  creator: "Kuvaj.me",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "sr_RS",
    siteName: "Kuvaj.me",
    title: "Kuvaj.me - Tvoja digitalna knjiga recepata",
    description: "Otkrijte, sačuvajte i podelite svoje omiljene recepte.",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Kuvaj.me - Tvoja digitalna knjiga recepata"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Kuvaj.me - Tvoja digitalna knjiga recepata",
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
import dynamic from 'next/dynamic'

const WelcomeModal = dynamic(() => import('@/components/WelcomeModal'), {
  ssr: false
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased font-sans`}
      >
        {children}
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
      <WelcomeModal />
    </html>
  );
}
