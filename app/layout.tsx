import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Eduardo Crespo — Product Designer',
  description: 'Portfolio of Eduardo Crespo, product designer focused on healthcare UX.',
  icons: {
    icon: "/favicon.ico", // or "/favicon.png" or even multiple
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/gyq0hts.css" />
      </head>
      <body>
        <header className="max-w-6xl mx-auto px-3 py-4 flex justify-between items-center sm:px-4">
          <Link href="/" className="site-brand">Eduardo Crespo</Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/">Work</Link>
            <Link href="/about">About</Link>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto px-3 sm:px-4">{children}</main>
        <footer className="max-w-6xl mx-auto px-3 py-8 text-sm text-fg/70 border-t border-border mt-12 sm:px-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Eduardo Crespo</span>
          <nav className="flex gap-4">
            <a href="mailto:eduardo.a.crespo@icloud.com" className="hover:text-fg transition-colors">Email</a>
            <Link href="https://www.linkedin.com/in/eduardo-crespo-20138a192" target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">LinkedIn</Link>
            <a href="/Resume.pdf" className="hover:text-fg transition-colors">Resume</a>
            <a href="https://eduardoandrescrespo.com" target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">Artist Site</a>
          </nav>
        </footer>
      </body>
    </html>
  )
}
