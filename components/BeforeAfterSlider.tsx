'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import NextImage from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type BeforeAfterSliderProps = {
  before: string
  after: string
  beforeAlt?: string
  afterAlt?: string
  aspect?: string
  caption?: string
}

const pillClass =
  'pointer-events-none absolute bottom-3 flex h-8 items-center rounded-full border-2 border-fg bg-paper px-3 text-xs font-medium text-fg shadow-[2px_2px_0_rgba(130,83,26,0.35)]'

// rounded-xl = 12px — inset the line so it doesn't poke into the rounded corners
const CORNER_RADIUS = 12

export default function BeforeAfterSlider({
  before,
  after,
  beforeAlt = 'Before',
  afterAlt = 'After',
  aspect = '16/9',
  caption,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const parseAspect = (value: string) => {
    if (value.includes('/')) {
      const [w, h] = value.split('/')
      const ratio = Number(w) / Number(h)
      return Number.isFinite(ratio) ? ratio : 16 / 9
    }
    const n = Number.parseFloat(value)
    return Number.isFinite(n) ? n : 16 / 9
  }

  const preferredAspect = parseAspect(aspect)

  const getPositionFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return 50
    const rect = containerRef.current.getBoundingClientRect()
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setPosition(getPositionFromClientX(e.clientX))
  }, [getPositionFromClientX])

  useEffect(() => {
    if (!isDragging) return
    const onMove = (e: MouseEvent) => setPosition(getPositionFromClientX(e.clientX))
    const onUp = () => setIsDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isDragging, getPositionFromClientX])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setPosition(getPositionFromClientX(e.touches[0].clientX))
  }, [getPositionFromClientX])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    setPosition(getPositionFromClientX(e.touches[0].clientX))
  }, [getPositionFromClientX])

  return (
    <figure className="my-10 space-y-4">
      {/*
        Outer container: no overflow-hidden — lets the handle + line
        extend to the edges without being clipped.
      */}
      <div
        ref={containerRef}
        className="relative w-full select-none"
        style={{ aspectRatio: preferredAspect, cursor: 'col-resize' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/*
          Image layer: overflow-hidden + rounded corners live here.
          Both images use object-cover so they always fill the same area
          with no width mismatch at the seam.
        */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          {/* After image — full area, behind */}
          <div className="absolute inset-0">
            <NextImage
              src={after}
              alt={afterAlt}
              fill
              className="object-cover object-top"
              sizes="(min-width: 1280px) 900px, (min-width: 768px) 720px, 100vw"
            />
          </div>

          {/* After label — clipped to the right (after) side */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ clipPath: `inset(0 0 0 ${position}%)` }}
          >
            <div className={`${pillClass} right-3`}>After</div>
          </div>

          {/* Before image + label — clipped to the left (before) side */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <NextImage
              src={before}
              alt={beforeAlt}
              fill
              className="object-cover object-top"
              sizes="(min-width: 1280px) 900px, (min-width: 768px) 720px, 100vw"
            />
            <div className={`${pillClass} left-3`}>Before</div>
          </div>
        </div>

        {/*
          Controls layer: sits on top of the image layer but is NOT inside
          overflow-hidden, so neither the line nor the handle get clipped
          when dragged to either edge.

          The line is inset CORNER_RADIUS px from top and bottom so it
          doesn't visually poke into the rounded corners of the image.
        */}
        <div
          className="pointer-events-none absolute"
          style={{
            left: `${position}%`,
            top: 0,
            bottom: 0,
            transform: 'translateX(-50%)',
          }}
        >
          {/* Divider line — inset from the corners */}
          <div
            className="absolute left-1/2 w-px -translate-x-1/2 bg-fg/60"
            style={{ top: CORNER_RADIUS, bottom: CORNER_RADIUS }}
          />

          {/* Drag handle */}
          <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-fg bg-paper text-fg shadow-[2px_2px_0_rgba(130,83,26,0.35)]">
            <ChevronLeft className="h-3.5 w-3.5" />
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {caption ? (
        <figcaption className="text-center text-sm text-fg/70">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
