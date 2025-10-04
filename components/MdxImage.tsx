'use client'

import NextImage from 'next/image'
import type { CSSProperties, ImgHTMLAttributes } from 'react'
import imageManifest from '@/lib/imageManifest'

const DEFAULT_IMAGE_SIZES = '(min-width: 1280px) 960px, (min-width: 768px) 720px, 100vw'
const FALLBACK_ASPECT = 16 / 9

function parseDimension(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return undefined
}

function parseAspect(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    if (value.includes('/')) {
      const [w, h] = value.split('/')
      const width = Number.parseFloat(w)
      const height = Number.parseFloat(h)
      if (Number.isFinite(width) && Number.isFinite(height) && height !== 0) {
        return width / height
      }
    }

    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return undefined
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

  const manifestEntry = typeof src === 'string' ? imageManifest[src] : undefined
  const numericWidth = parseDimension(width) ?? manifestEntry?.width
  const numericHeight = parseDimension(height) ?? manifestEntry?.height
  const aspectFromData = parseAspect(rest['data-aspect'])
  const aspectRatio = (() => {
    if (numericWidth && numericHeight) {
      return numericWidth / numericHeight
    }
    if (aspectFromData) {
      return aspectFromData
    }
    return FALLBACK_ASPECT
  })()

  const resolvedWidth = numericWidth ?? 1600
  const resolvedHeight = numericHeight ?? Math.round(resolvedWidth / aspectRatio)

  const dataFit = typeof rest['data-fit'] === 'string' ? rest['data-fit'] : undefined
  const dataUnframed = rest['data-unframed']
  const loadingMode = loading === 'eager' ? 'eager' : 'lazy'

  const wrapperClasses = [
    'overflow-hidden',
    dataUnframed === true || dataUnframed === 'true' || dataUnframed === ''
      ? undefined
      : 'rounded-[28px] border border-white/20 bg-white/10',
    className
  ].filter(Boolean).join(' ')

  const wrapperStyle: CSSProperties = {
    ...(style as CSSProperties | undefined),
    aspectRatio
  }

  const resolvedSizes = typeof sizes === 'string' && sizes.trim().length > 0 ? sizes : DEFAULT_IMAGE_SIZES

  return (
    <div className={wrapperClasses} style={wrapperStyle}>
      <NextImage
        src={src}
        alt={alt}
        width={resolvedWidth}
        height={resolvedHeight}
        sizes={resolvedSizes}
        loading={loadingMode}
        priority={loadingMode === 'eager'}
        className={dataFit === 'cover' ? 'object-cover' : 'object-contain'}
        style={{ width: '100%', height: 'auto' }}
        title={title}
      />
    </div>
  )
}
