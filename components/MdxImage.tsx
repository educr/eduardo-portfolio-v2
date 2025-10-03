'use client'

import NextImage from 'next/image'
import { useMemo, useState } from 'react'
import type { CSSProperties, ImgHTMLAttributes } from 'react'

const DEFAULT_IMAGE_SIZES = '(min-width: 1280px) 900px, (min-width: 768px) 720px, 100vw'
const DEFAULT_MIN_HEIGHT = 360
const FALLBACK_ASPECT = 16 / 9

function parseDimension(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return undefined
}

function parseAspect(value: unknown): number | undefined {
  if (typeof value !== 'string') {
    return undefined
  }
  const cleaned = value.replace(/\s+/g, '')
  if (!cleaned.includes('/')) {
    return undefined
  }
  const [rawWidth, rawHeight] = cleaned.split('/')
  const width = Number.parseFloat(rawWidth)
  const height = Number.parseFloat(rawHeight)
  if (!Number.isFinite(width) || !Number.isFinite(height) || height === 0) {
    return undefined
  }
  return width / height
}

type MdxImageProps = ImgHTMLAttributes<HTMLImageElement>

export default function MdxImage(props: MdxImageProps) {
  const {
    src,
    alt = '',
    className,
    width,
    height,
    sizes,
    loading,
    style,
    title,
    ...rest
  } = props

  if (!src) {
    return null
  }

  const numericWidth = parseDimension(width)
  const numericHeight = parseDimension(height)
  const aspectFromProps = numericWidth && numericHeight ? numericWidth / numericHeight : undefined

  const dataFit = typeof rest['data-fit'] === 'string' ? rest['data-fit'] : undefined
  const dataUnframed = rest['data-unframed']
  const dataAspect = rest['data-aspect']

  const [natural, setNatural] = useState<{ width: number; height: number } | null>(null)

  const aspectRatio = useMemo(() => {
    if (natural && natural.height) {
      return natural.width / natural.height
    }
    return aspectFromProps ?? parseAspect(dataAspect) ?? FALLBACK_ASPECT
  }, [natural, aspectFromProps, dataAspect])

  const resolvedSizes = typeof sizes === 'string' && sizes.trim().length > 0 ? sizes : DEFAULT_IMAGE_SIZES
  const loadingMode = loading === 'eager' ? 'eager' : 'lazy'
  const objectFitClass = dataFit === 'cover' ? 'object-cover' : 'object-contain'
  const unframed =
    dataUnframed === true ||
    dataUnframed === 'true' ||
    dataUnframed === ''

  const wrapperClasses = [
    'relative w-full overflow-hidden',
    unframed ? undefined : 'rounded-[28px] border border-white/20 bg-white/10',
    className
  ].filter(Boolean).join(' ')

  const wrapperStyle: CSSProperties = {
    ...(style as CSSProperties | undefined)
  }

  if (aspectRatio) {
    wrapperStyle.aspectRatio = aspectRatio
  }

  if (!natural) {
    wrapperStyle.minHeight ??= DEFAULT_MIN_HEIGHT
  }

  const handleLoaded = (image: HTMLImageElement) => {
    const { naturalWidth, naturalHeight } = image
    if (naturalWidth && naturalHeight) {
      setNatural(prev => {
        if (prev && prev.width === naturalWidth && prev.height === naturalHeight) {
          return prev
        }
        return { width: naturalWidth, height: naturalHeight }
      })
    }
  }

  return (
    <div className={wrapperClasses} style={wrapperStyle}>
      <NextImage
        src={src}
        alt={alt}
        fill
        sizes={resolvedSizes}
        loading={loadingMode}
        priority={loadingMode === 'eager'}
        onLoadingComplete={handleLoaded}
        className={['h-full w-full', objectFitClass].filter(Boolean).join(' ')}
        title={title}
      />
    </div>
  )
}
