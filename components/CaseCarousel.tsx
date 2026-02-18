'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type CarouselImage = {
  src: string
  alt: string
  caption?: string
}

type CarouselProps = {
  images?: unknown
  aspect?: string
  caption?: string
}

function resolveSrc(value: unknown): string {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return ''

  const record = value as Record<string, unknown>
  if (typeof record.src === 'string') return record.src

  if (record.src && typeof record.src === 'object') {
    const nested = record.src as Record<string, unknown>
    if (typeof nested.src === 'string') return nested.src
  }

  if (typeof record.default === 'string') return record.default
  return ''
}

function normalizeImages(images: unknown): CarouselImage[] {
  const source = Array.isArray(images) ? images : []

  return source
    .map((item): CarouselImage | null => {
      if (!item) return null
      if (typeof item === 'string') return item.trim() ? { src: item, alt: '' } : null

      const record = item as Record<string, unknown>
      const src = resolveSrc(record).trim()
      if (!src) return null

      return {
        src,
        alt: typeof record.alt === 'string' ? record.alt : '',
        caption: typeof record.caption === 'string' ? record.caption : undefined
      }
    })
    .filter((item): item is CarouselImage => Boolean(item))
}

function resolveAspect(value: string | number | undefined): string {
  if (!value) return '16 / 9'
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return `${value}`
  if (typeof value === 'string' && value.trim()) return value.trim()
  return '16 / 9'
}

export default function CaseCarousel({ images, aspect = '16/9', caption }: CarouselProps) {
  const normalizedImages = useMemo(() => normalizeImages(images), [images])
  const [index, setIndex] = useState(0)

  if (!normalizedImages.length) return null

  const activeIndex = Math.min(index, normalizedImages.length - 1)
  const active = normalizedImages[activeIndex]

  const next = () => setIndex(prev => (prev + 1) % normalizedImages.length)
  const prev = () => setIndex(prev => (prev - 1 + normalizedImages.length) % normalizedImages.length)

  return (
    <figure className="my-10 space-y-4">
      <div className="relative overflow-hidden rounded-[28px] border border-white/20 bg-white/10" style={{ aspectRatio: resolveAspect(aspect), minHeight: 320 }}>
        <img
          src={active.src}
          alt={active.alt}
          loading={activeIndex === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-contain"
        />

        {normalizedImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/85 text-fg/80 shadow transition hover:text-fg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/85 text-fg/80 shadow transition hover:text-fg"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {normalizedImages.length > 1 ? (
        <div className="flex items-center justify-center gap-3">
          {normalizedImages.map((image, dotIndex) => (
            <button
              type="button"
              key={`${image.src}-${dotIndex}`}
              onClick={() => setIndex(dotIndex)}
              aria-label={`View slide ${dotIndex + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition ${dotIndex === activeIndex ? 'bg-accent' : 'bg-fg/20 hover:bg-fg/40'}`}
            />
          ))}
        </div>
      ) : null}

      {(active.caption || caption) ? (
        <figcaption className="text-center text-sm text-fg/70">
          {active.caption ?? caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
