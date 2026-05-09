'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import NextImage from 'next/image'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

export type CarouselImage = {
  src: string
  alt: string
  caption?: string
}

type CarouselProps = {
  images: CarouselImage[] | string
  aspect?: string
  caption?: string
}

export default function CaseCarousel({ images: imagesProp, aspect = '16/9', caption }: CarouselProps) {
  const images: CarouselImage[] = typeof imagesProp === 'string' ? JSON.parse(imagesProp) : Array.isArray(imagesProp) ? imagesProp : []
  const [index, setIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [isPaused, setIsPaused] = useState(false)
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({})
  const carouselId = useId()

  const normalizedImages = useMemo(() => images.filter(Boolean), [images])

  const parseAspect = (value: string | number | undefined) => {
    if (!value) {
      return undefined
    }
    if (typeof value === 'number') {
      return value
    }
    if (value.includes('/')) {
      const [w, h] = value.split('/')
      const width = Number.parseFloat(w)
      const height = Number.parseFloat(h)
      if (Number.isFinite(width) && Number.isFinite(height) && height !== 0) {
        return width / height
      }
    }
    const numeric = Number.parseFloat(value)
    return Number.isFinite(numeric) ? numeric : undefined
  }

  const preferredAspect = parseAspect(aspect) ?? 16 / 9

  useEffect(() => {
    setIndex(prev => (normalizedImages.length ? Math.min(prev, normalizedImages.length - 1) : 0))
  }, [normalizedImages.length])

  useEffect(() => {
    if (prevIndex === null) {
      return
    }
    const activeImage = normalizedImages[Math.min(index, normalizedImages.length - 1)]
    const isActiveLoaded = Boolean(loadedMap[activeImage?.src ?? ''])
    if (!isActiveLoaded) {
      return
    }

    const timeout = setTimeout(() => setPrevIndex(null), 280)
    return () => clearTimeout(timeout)
  }, [prevIndex, index, normalizedImages, loadedMap])

  useEffect(() => {
    if (normalizedImages.length <= 1 || isPaused) {
      return
    }

    const handle = setInterval(() => {
      setIndex(prev => {
        setPrevIndex(prev)
        setDirection(1)
        return (prev + 1) % normalizedImages.length
      })
    }, 5000)

    return () => clearInterval(handle)
  }, [normalizedImages.length, isPaused])

  const markLoaded = (src: string) => {
    if (!src) return
    setLoadedMap(prev => (prev[src] ? prev : { ...prev, [src]: true }))
  }

  useEffect(() => {
    if (normalizedImages.length) {
      markLoaded(normalizedImages[0].src)
    }
  }, [normalizedImages])

  useEffect(() => {
    normalizedImages.forEach(image => {
      if (!image?.src || loadedMap[image.src]) {
        return
      }

      const preload = new window.Image()
      preload.src = image.src
      preload.onload = () => markLoaded(image.src)
    })
  }, [normalizedImages, loadedMap])

  if (!normalizedImages.length) {
    return null
  }

  const activeImage = normalizedImages[Math.min(index, normalizedImages.length - 1)]
  const previousImage = prevIndex !== null ? normalizedImages[prevIndex] : null

  const next = () => {
    if (normalizedImages.length <= 1) return
    setIndex(prev => {
      setPrevIndex(prev)
      setDirection(1)
      return (prev + 1) % normalizedImages.length
    })
  }

  const prev = () => {
    if (normalizedImages.length <= 1) return
    setIndex(prev => {
      setPrevIndex(prev)
      setDirection(-1)
      return (prev - 1 + normalizedImages.length) % normalizedImages.length
    })
  }

  const selectIndex = (target: number) => {
    if (target === index || target < 0 || target >= normalizedImages.length) {
      return
    }
    const len = normalizedImages.length
    const forwardSteps = (target - index + len) % len
    const backwardSteps = (index - target + len) % len
    setPrevIndex(index)
    setDirection(forwardSteps <= backwardSteps ? 1 : -1)
    setIndex(target)
  }

  return (
    <figure className="my-10 space-y-4">
      <div className="relative">
        <div className="relative w-full" style={{ aspectRatio: preferredAspect, minHeight: 320 }}>
          <div className="absolute inset-0">
            {previousImage ? (
              <div className={`carousel-slide ${direction === 1 ? 'carousel-exit-left' : 'carousel-exit-right'}`}>
                <div className="relative h-full w-full">
                  <NextImage
                    src={previousImage.src}
                    alt={previousImage.alt}
                    fill
                    sizes="(min-width: 1280px) 900px, (min-width: 768px) 720px, 100vw"
                    loading="lazy"
                    className={`carousel-image transition-opacity duration-300 ${loadedMap[previousImage.src] ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => markLoaded(previousImage.src)}
                    aria-hidden
                  />
                </div>
              </div>
            ) : null}
            <div
              key={`${carouselId}-${index}`}
              className={`carousel-slide ${prevIndex !== null ? (direction === 1 ? 'carousel-enter-right' : 'carousel-enter-left') : 'carousel-steady'}`}
            >
              <div className="relative h-full w-full">
                <NextImage
                  src={activeImage.src}
                  alt={activeImage.alt}
                  fill
                  sizes="(min-width: 1280px) 900px, (min-width: 768px) 720px, 100vw"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  priority={index === 0}
                  className={`carousel-image transition-opacity duration-300 ${loadedMap[activeImage.src] ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => markLoaded(activeImage.src)}
                />
              </div>
            </div>
          </div>
        </div>
        {normalizedImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2 border-fg bg-paper text-fg shadow-[2px_2px_0_rgba(130,83,26,0.35)] transition hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2 border-fg bg-paper text-fg shadow-[2px_2px_0_rgba(130,83,26,0.35)] transition hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsPaused(prev => !prev)}
              aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
              className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-fg bg-paper text-fg shadow-[2px_2px_0_rgba(130,83,26,0.35)] transition hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
          </>
        ) : null}
      </div>

      {normalizedImages.length > 1 ? (
        <div className="flex items-center justify-center gap-3">
          {normalizedImages.map((image, dotIndex) => (
            <button
              type="button"
              key={`${carouselId}-dot-${image.src}`}
              onClick={() => selectIndex(dotIndex)}
              aria-label={`View slide ${dotIndex + 1}`}
              className={`h-2.5 w-2.5 rounded-full border border-fg/30 transition ${dotIndex === index ? 'bg-accent border-fg scale-110' : 'bg-paper hover:bg-accent/40'}`}
            />
          ))}
        </div>
      ) : null}

      {(caption || activeImage.caption) ? (
        <figcaption className="text-center text-sm text-fg/70">
          {activeImage.caption ?? caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
