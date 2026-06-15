import type { Metadata } from "next"
import {
  Caveat,
  DM_Sans,
  Geist,
  Instrument_Sans,
  Instrument_Serif,
  Inter,
  Plus_Jakarta_Sans,
} from "next/font/google"

import "./globals.css"

const pjs = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-pjs",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
})

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
  display: "swap",
})

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
})

// Serif used ONLY for the highlighted "value" words inside marketing/website
// headings — always italic at regular weight 400 (Instrument Serif, the
// family's only weight). Website surfaces only; product/app stay on Satoshi.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
})

// Handwriting font — used for the playful on-hover photo annotations on the
// About / team page. Decorative only; the product UI stays on Satoshi.
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
})

// Runs before React hydration so the saved theme paints on first frame.
const THEME_INIT_SCRIPT = `
try {
  var t = localStorage.getItem('theme-version');
  if (t && /^v[1-7]$/.test(t)) {
    document.documentElement.setAttribute('data-theme', t);
  }
} catch (e) {}
`

export const metadata: Metadata = {
  title: "PluginLive",
  description: "Campus recruitment platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-theme="v7"
      suppressHydrationWarning
      className={`${pjs.variable} ${dmSans.variable} ${inter.variable} ${instrumentSans.variable} ${geist.variable} ${instrumentSerif.variable} ${caveat.variable}`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f%5B%5D=satoshi@300,400,500,600,700,900&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased bg-[var(--bg-page)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  )
}
