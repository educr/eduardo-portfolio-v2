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

  if (!source.length) return []

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
  const normalizedImages = normalizeImages(images)

  if (!normalizedImages.length) {
    return (
      <figure className="my-10 space-y-4">
        <div className="rounded-[20px] border border-rose-300/60 bg-rose-50/70 px-4 py-3 text-sm text-rose-800">
          Carousel received no valid images.
        </div>
      </figure>
    )
  }

  const ratio = resolveAspect(aspect)

  return (
    <figure className="my-10 space-y-4">
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {normalizedImages.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className="min-w-full snap-center overflow-hidden rounded-[28px] border border-white/20 bg-white/10"
            style={{ aspectRatio: ratio, minHeight: 320 }}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </div>

      {(caption || normalizedImages[0].caption) ? (
        <figcaption className="text-center text-sm text-fg/70">
          {caption ?? normalizedImages[0].caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
