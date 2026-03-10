'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ExpandableFigureProps {
  src: string
  caption?: string
  href?: string
  previewHeight?: number
}

export default function ExpandableFigure({
  src,
  caption,
  href,
  previewHeight = 320,
}: ExpandableFigureProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <figure className="my-4 space-y-2 text-center text-sm text-fg/70">
      <div className="relative">
        {/* Clipped image */}
        <div
          className="overflow-hidden rounded-[28px] border border-white/20 bg-white/10 transition-[max-height] duration-500 ease-in-out"
          style={{ maxHeight: expanded ? 2000 : previewHeight }}
        >
          <img
            src={src}
            alt={caption ?? ''}
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Gradient fade (collapsed only) */}
        {!expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 rounded-b-[28px] bg-gradient-to-t from-white/80 via-white/40 to-transparent" />
        )}

        {/* Toggle button, always inside image at bottom */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1.5 rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-xs font-medium text-fg/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/95"
          >
            {expanded
              ? <><ChevronUp className="h-3 w-3" /> Collapse</>
              : <>Show full image <ChevronDown className="h-3 w-3" /></>
            }
          </button>
        </div>
      </div>

      {caption && (
        <figcaption>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline-offset-4 transition-colors hover:text-accent-dark"
            >
              {caption}
            </a>
          ) : (
            caption
          )}
        </figcaption>
      )}
    </figure>
  )
}
