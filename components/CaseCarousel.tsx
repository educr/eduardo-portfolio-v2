'use client'

import { useEffect, useMemo, useState } from 'react'
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
  let source: unknown[] = []

  if (Array.isArray(images)) {
    source = images
  } else if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images) as unknown
      if (Array.isArray(parsed)) {
        source = parsed
      }
    } catch {
      source = []
    }
  }

  const normalized = source
    .map((item): CarouselImage | null => {
      if (!item) return null
      if (typeof item === 'string') return item.trim() ? { src: item.trim(), alt: '' } : null

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

  const seen = new Set<string>()
  return normalized.filter(item => {
    if (seen.has(item.src)) return false
    seen.add(item.src)
    return true
  })
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

  useEffect(() => {
    if (normalizedImages.length <= 1) return

    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % normalizedImages.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [normalizedImages.length])

  useEffect(() => {
    if (!normalizedImages.length) {
      setIndex(0)
      return
    }
    setIndex(prev => Math.min(prev, normalizedImages.length - 1))
  }, [normalizedImages.length])

  if (!normalizedImages.length) {
    return (
      <figure className="my-10 space-y-4">
        <div className="rounded-[20px] border border-rose-300/60 bg-rose-50/70 px-4 py-3 text-sm text-rose-800">
          Carousel received no valid images.
        </div>
      </figure>
    )
  }

  const active = normalizedImages[index]
  const ratio = resolveAspect(aspect)

  return (
    <figure className="my-10 space-y-4">
      <div
        className="relative overflow-hidden rounded-[28px] border border-white/20 bg-white/10"
        style={{ aspectRatio: ratio, minHeight: 320 }}
      >
        <img
          src={active.src}
          alt={active.alt}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-contain"
        />

        {normalizedImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => setIndex(prev => (prev - 1 + normalizedImages.length) % normalizedImages.length)}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/85 text-fg/80 shadow transition hover:text-fg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setIndex(prev => (prev + 1) % normalizedImages.length)}
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
              className={`h-2.5 w-2.5 rounded-full transition ${dotIndex === index ? 'bg-accent' : 'bg-fg/20 hover:bg-fg/40'}`}
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
