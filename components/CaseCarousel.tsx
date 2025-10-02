'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type CarouselImage = {
  src: string
  alt: string
  caption?: string
}

type CarouselProps = {
  images: CarouselImage[]
  aspect?: string
  caption?: string
}

export default function CaseCarousel({ images, aspect = '16/9', caption }: CarouselProps) {
  const [index, setIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState<1 | -1>(1)
  const carouselId = useId()

  const normalizedImages = useMemo(() => images.filter(Boolean), [images])

  useEffect(() => {
    setIndex(prev => (normalizedImages.length ? Math.min(prev, normalizedImages.length - 1) : 0))
  }, [normalizedImages.length])

  useEffect(() => {
    if (prevIndex === null) {
      return
    }
    const timeout = setTimeout(() => setPrevIndex(null), 400)
    return () => clearTimeout(timeout)
  }, [prevIndex])

  useEffect(() => {
    if (normalizedImages.length <= 1) {
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
  }, [normalizedImages.length])

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
        <div className="relative w-full" style={{ aspectRatio: aspect }}>
          <div className="absolute inset-0">
            {previousImage ? (
              <div className={`carousel-slide ${direction === 1 ? 'carousel-exit-left' : 'carousel-exit-right'}`}>
                <img
                  src={previousImage.src}
                  alt={previousImage.alt}
                  className="carousel-image"
                  loading="lazy"
                  aria-hidden="true"
                />
              </div>
            ) : null}
            <div
              key={`${carouselId}-${index}`}
              className={`carousel-slide ${prevIndex !== null ? (direction === 1 ? 'carousel-enter-right' : 'carousel-enter-left') : 'carousel-steady'}`}
            >
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="carousel-image"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          </div>
        </div>
        {normalizedImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/85 text-fg/80 shadow transition hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/85 text-fg/80 shadow transition hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
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
              key={`${carouselId}-dot-${image.src}`}
              onClick={() => selectIndex(dotIndex)}
              aria-label={`View slide ${dotIndex + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition ${dotIndex === index ? 'bg-accent' : 'bg-fg/20 hover:bg-fg/40'}`}
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
