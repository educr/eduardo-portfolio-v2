'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import NextImage from 'next/image'
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react'

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
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const carouselId = useId()

  const normalizedImages = useMemo(() => images.filter(Boolean), [images])

  const parseAspect = (value: string | number | undefined) => {
    if (!value) return undefined
    if (typeof value === 'number') return value
    if (value.includes('/')) {
      const [w, h] = value.split('/')
      const width = Number.parseFloat(w)
      const height = Number.parseFloat(h)
      if (Number.isFinite(width) && Number.isFinite(height) && height !== 0) return width / height
    }
    const numeric = Number.parseFloat(value)
    return Number.isFinite(numeric) ? numeric : undefined
  }

  const preferredAspect = parseAspect(aspect) ?? 16 / 9

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    setIndex(prev => (normalizedImages.length ? Math.min(prev, normalizedImages.length - 1) : 0))
  }, [normalizedImages.length])

  useEffect(() => {
    if (prevIndex === null) return
    const activeImage = normalizedImages[Math.min(index, normalizedImages.length - 1)]
    if (!loadedMap[activeImage?.src ?? '']) return
    const timeout = setTimeout(() => setPrevIndex(null), 280)
    return () => clearTimeout(timeout)
  }, [prevIndex, index, normalizedImages, loadedMap])

  useEffect(() => {
    if (normalizedImages.length <= 1 || isPaused) return
    const handle = setInterval(() => {
      setIndex(prev => { setPrevIndex(prev); setDirection(1); return (prev + 1) % normalizedImages.length })
    }, 5000)
    return () => clearInterval(handle)
  }, [normalizedImages.length, isPaused])

  const markLoaded = (src: string) => {
    if (!src) return
    setLoadedMap(prev => (prev[src] ? prev : { ...prev, [src]: true }))
  }

  useEffect(() => {
    if (normalizedImages.length) markLoaded(normalizedImages[0].src)
  }, [normalizedImages])

  useEffect(() => {
    normalizedImages.forEach(image => {
      if (!image?.src || loadedMap[image.src]) return
      const preload = new window.Image()
      preload.src = image.src
      preload.onload = () => markLoaded(image.src)
    })
  }, [normalizedImages, loadedMap])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxOpen(false) }
    document.body.style.overflow = 'hidden'
    setIsPaused(true)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [lightboxOpen])

  if (!normalizedImages.length) return null

  const activeImage = normalizedImages[Math.min(index, normalizedImages.length - 1)]
  const previousImage = prevIndex !== null ? normalizedImages[prevIndex] : null

  const next = () => {
    if (normalizedImages.length <= 1) return
    setIndex(prev => { setPrevIndex(prev); setDirection(1); return (prev + 1) % normalizedImages.length })
  }
  const prev = () => {
    if (normalizedImages.length <= 1) return
    setIndex(prev => { setPrevIndex(prev); setDirection(-1); return (prev - 1 + normalizedImages.length) % normalizedImages.length })
  }
  const selectIndex = (target: number) => {
    if (target === index || target < 0 || target >= normalizedImages.length) return
    const len = normalizedImages.length
    const forward = (target - index + len) % len
    const backward = (index - target + len) % len
    setPrevIndex(index)
    setDirection(forward <= backward ? 1 : -1)
    setIndex(target)
  }

  const btnClass = 'flex items-center justify-center rounded-full border-2 border-fg bg-paper text-fg shadow-[2px_2px_0_rgba(53, 97, 125, 0.35)] transition hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40'

  const lightbox = mounted && lightboxOpen ? createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={e => { if (e.target === overlayRef.current) setLightboxOpen(false) }}
    >
      <div className="relative flex items-center justify-center" style={{ maxHeight: '90dvh', maxWidth: '92vw' }}>
        <button type="button" onClick={() => setLightboxOpen(false)} aria-label="Close"
          className={`${btnClass} absolute -right-4 -top-4 z-10 h-9 w-9`}>
          <X className="h-4 w-4" />
        </button>
        <img
          src={activeImage.src}
          alt={activeImage.alt}
          style={{
            maxHeight: '90dvh', maxWidth: '92vw', objectFit: 'contain',
            borderRadius: 12, border: '3px solid #351F57',
            boxShadow: '5px 5px 0 rgba(53, 97, 125, 0.35)', display: 'block',
            backgroundColor: '#FFFFFF',
          }}
        />
        {normalizedImages.length > 1 ? (
          <>
            <button type="button" onClick={prev} aria-label="Previous image"
              className={`${btnClass} absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2`}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={next} aria-label="Next image"
              className={`${btnClass} absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2`}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>
    </div>,
    document.body
  ) : null

  return (
    <figure className="my-10 space-y-4">
      <div className="relative">
        {/*
          Image area — clicking anywhere on it opens the lightbox.
          `group` drives the hover icon fade-in.
        */}
        <div
          className="group relative w-full cursor-zoom-in"
          style={{ aspectRatio: preferredAspect, minHeight: 320 }}
          onClick={() => setLightboxOpen(true)}
        >
          <div className="absolute inset-0">
            {previousImage ? (
              <div className={`carousel-slide ${direction === 1 ? 'carousel-exit-left' : 'carousel-exit-right'}`}>
                <div className="relative h-full w-full">
                  <NextImage
                    src={previousImage.src} alt={previousImage.alt} fill
                    sizes="(min-width: 1280px) 900px, (min-width: 768px) 720px, 100vw"
                    loading="lazy"
                    className={`carousel-image transition-opacity duration-300 ${loadedMap[previousImage.src] ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => markLoaded(previousImage.src)} aria-hidden
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
                  src={activeImage.src} alt={activeImage.alt} fill
                  sizes="(min-width: 1280px) 900px, (min-width: 768px) 720px, 100vw"
                  loading={index === 0 ? 'eager' : 'lazy'} priority={index === 0}
                  className={`carousel-image transition-opacity duration-300 ${loadedMap[activeImage.src] ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => markLoaded(activeImage.src)}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Carousel controls — siblings of the image area so clicks don't bubble to it */}
        {normalizedImages.length > 1 ? (
          <>
            <button type="button" onClick={prev} aria-label="Previous slide"
              className={`${btnClass} absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2`}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={next} aria-label="Next slide"
              className={`${btnClass} absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2`}>
              <ChevronRight className="h-5 w-5" />
            </button>
            <button type="button" onClick={e => { e.stopPropagation(); setIsPaused(p => !p) }}
              aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
              className={`${btnClass} absolute bottom-3 right-3 h-8 w-8`}>
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

      {lightbox}
    </figure>
  )
}
