'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

export default function ZoomImage({
  src,
  alt,
  caption
}: {
  src: string
  alt: string
  caption?: string
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) {
      return
    }
    if (open) {
      const previous = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = previous
      }
    }
    return undefined
  }, [open, mounted])

  return (
    <figure className="my-8 space-y-3 text-center text-sm text-fg/70">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative mx-auto block w-full overflow-hidden rounded-[28px] border border-white/20 bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <img
          src={src}
          alt={alt}
          className="mx-auto w-full rounded-[28px] object-contain"
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition group-hover:opacity-100">
          <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
            View
          </span>
        </span>
      </button>
      {caption ? <figcaption>{caption}</figcaption> : null}

      {open && mounted
        ? createPortal(
          <div
            className="fixed inset-0 z-[100] bg-black/80"
            onClick={() => setOpen(false)}
          >
            <div
              className="flex h-full w-full items-center justify-center overflow-auto p-4"
              onClick={event => event.stopPropagation()}
              style={{ touchAction: 'pan-y pinch-zoom' }}
            >
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                  aria-label="Close expanded image"
                >
                  <X className="h-5 w-5" />
                </button>
                <img
                  src={src}
                  alt={alt}
                  className="mx-auto h-full max-h-[95vh] w-full rounded-[32px] border border-white/25 object-contain"
                  draggable={false}
                />
              </div>
            </div>
          </div>,
          document.body
        )
        : null}
    </figure>
  )
}
