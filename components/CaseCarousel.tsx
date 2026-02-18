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

function looksLikeImagePath(value: string): boolean {
  const normalized = value.toLowerCase().split('?')[0]
  return (
    normalized.startsWith('/') &&
    (normalized.endsWith('.png') ||
      normalized.endsWith('.jpg') ||
      normalized.endsWith('.jpeg') ||
      normalized.endsWith('.gif') ||
      normalized.endsWith('.webp') ||
      normalized.endsWith('.avif') ||
      normalized.endsWith('.svg'))
  )
}

function extractImagePathsFromText(text: string): string[] {
  const matches = text.match(/\/cases\/[^"'`\s)]+?\.(png|jpe?g|gif|webp|avif|svg)/gi) ?? []
  return matches.map(match => match.trim())
}

function previewValue(value: unknown): string {
  try {
    const serialized = JSON.stringify(value)
    if (!serialized) return String(value)
    return serialized.length > 220 ? `${serialized.slice(0, 220)}...` : serialized
  } catch {
    return Object.prototype.toString.call(value)
  }
}

function extractImagesDeep(value: unknown, seen = new Set<unknown>()): CarouselImage[] {
  if (!value) return []
  if (seen.has(value)) return []

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return []

    if (looksLikeImagePath(trimmed)) {
      return [{ src: trimmed, alt: '' }]
    }

    if ((trimmed.startsWith('[') || trimmed.startsWith('{')) && (trimmed.endsWith(']') || trimmed.endsWith('}'))) {
      try {
        return extractImagesDeep(JSON.parse(trimmed), seen)
      } catch {
        return extractImagePathsFromText(trimmed).map(src => ({ src, alt: '' }))
      }
    }

    return extractImagePathsFromText(trimmed).map(src => ({ src, alt: '' }))
  }

  if (typeof value !== 'object') return []

  seen.add(value)

  if (Array.isArray(value)) {
    return value.flatMap(item => extractImagesDeep(item, seen))
  }

  const record = value as Record<string, unknown>
  const directSrc = resolveSrc(record).trim()
  const fromNode =
    directSrc && looksLikeImagePath(directSrc)
      ? [{
          src: directSrc,
          alt: typeof record.alt === 'string' ? record.alt : '',
          caption: typeof record.caption === 'string' ? record.caption : undefined
        }]
      : []

  const nested = Object.values(record).flatMap(item => extractImagesDeep(item, seen))
  return [...fromNode, ...nested]
}

function normalizeImages(images: unknown): CarouselImage[] {
  const extracted = extractImagesDeep(images)
  const deduped: CarouselImage[] = []
  const seen = new Set<string>()

  for (const image of extracted) {
    if (!image.src || seen.has(image.src)) continue
    seen.add(image.src)
    deduped.push(image)
  }

  return deduped
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

  if (!normalizedImages.length) {
    return (
      <figure className="my-10 space-y-4">
        <div className="rounded-[20px] border border-rose-300/60 bg-rose-50/70 px-4 py-3 text-sm text-rose-800">
          Carousel received no valid images.
          <div className="mt-2 break-all font-mono text-[11px] leading-snug text-rose-700/90">
            {`type=${Array.isArray(images) ? 'array' : typeof images} value=${previewValue(images)}`}
          </div>
        </div>
      </figure>
    )
  }

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
