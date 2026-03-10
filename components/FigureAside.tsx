'use client'

import ExpandableFigure from './ExpandableFigure'

interface FigureAsideProps {
  children: React.ReactNode
  src: string
  caption?: string
  href?: string
}

export default function FigureAside({ children, src, caption, href }: FigureAsideProps) {
  return (
    <div className="md:grid md:grid-cols-[1fr_272px] md:items-start md:gap-8 lg:grid-cols-[1fr_304px]">
      <div className="flex min-w-0 flex-col gap-6">{children}</div>
      <ExpandableFigure src={src} caption={caption} href={href} />
    </div>
  )
}
