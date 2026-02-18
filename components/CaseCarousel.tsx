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
  if (typeof value === 'string') {
    return value
  }

  if (!value || typeof value !== 'object') {
    return ''
  }

  const record = value as Record<string, unknown>

  if (typeof record.src === 'string') {
    return record.src
  }

  if (record.src && typeof record.src === 'object') {
    const nested = record.src as Record<string, unknown>
    if (typeof nested.src === 'string') {
      return nested.src
    }
  }

  if (typeof record.default === 'string') {
    return record.default
  }

  return ''
}

function normalizeImagesInput(images: unknown): unknown[] {
  if (Array.isArray(images)) {
    return images
  }

  if (!images) {
    return []
  }

  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images) as unknown
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  if (typeof images === 'object') {
    const iterable = images as { [Symbol.iterator]?: () => Iterator<unknown> }
    if (typeof iterable[Symbol.iterator] === 'function') {
      return Array.from(iterable as Iterable<unknown>)
    }

    return Object.values(images as Record<string, unknown>)
  }

  return []
}

function parseAspect(value: string | number | undefined): string {
  if (!value) {
    return '16 / 9'
  }

  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return `${value}`
  }

  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  return '16 / 9'
}

export default function CaseCarousel({ images, aspect = '16/9', caption }: CarouselProps) {
  const normalizedImages = normalizeImagesInput(images)
    .map((image): CarouselImage | null => {
      if (!image) {
        return null
      }

      if (typeof image === 'string') {
        return image.trim() ? { src: image, alt: '' } : null
      }

      const record = image as Record<string, unknown>
      const src = resolveSrc(record)
      if (!src.trim()) {
        return null
      }

      return {
        src,
        alt: typeof record.alt === 'string' ? record.alt : '',
        caption: typeof record.caption === 'string' ? record.caption : undefined
      }
    })
    .filter((image): image is CarouselImage => Boolean(image))

  if (!normalizedImages.length) {
    return null
  }

  const carouselId = `carousel-${normalizedImages[0].src.replace(/[^a-z0-9]/gi, '')}`
  const ratio = parseAspect(aspect)

  return (
    <figure className="my-10 space-y-4">
      <div
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        aria-label="Image carousel"
      >
        {normalizedImages.map((image, index) => (
          <a
            id={`${carouselId}-${index}`}
            key={`${carouselId}-${index}-${image.src}`}
            href={`#${carouselId}-${index}`}
            className="block min-w-full snap-center overflow-hidden rounded-[28px] border border-white/20 bg-white/10"
            style={{ aspectRatio: ratio }}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="h-full w-full object-contain"
            />
          </a>
        ))}
      </div>

      {normalizedImages.length > 1 ? (
        <div className="flex items-center justify-center gap-3">
          {normalizedImages.map((image, index) => (
            <a
              key={`${carouselId}-dot-${index}-${image.src}`}
              href={`#${carouselId}-${index}`}
              aria-label={`View slide ${index + 1}`}
              className="h-2.5 w-2.5 rounded-full bg-fg/30 transition hover:bg-fg/60"
            />
          ))}
        </div>
      ) : null}

      {(caption || normalizedImages[0].caption) ? (
        <figcaption className="text-center text-sm text-fg/70">
          {caption ?? normalizedImages[0].caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
