import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Fraunces, Inter } from 'next/font/google'

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces'
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Eduardo Crespo — Product Designer',
  description: 'Portfolio of Eduardo Crespo, product designer focused on healthcare UX.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} antialiased`}>
      <body>
        <header className="site-header max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="font-semibold">Eduardo Crespo</Link>
          <nav className="site-header-nav flex gap-6 text-sm">
            <Link href="/">Work</Link>
            <Link href="/about">About</Link>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto px-4">{children}</main>
        <footer className="max-w-6xl mx-auto px-4 py-8 text-sm text-fg/70 border-t border-border mt-12">
          © {new Date().getFullYear()} Eduardo Crespo
        </footer>
      </body>
    </html>
  )
}
