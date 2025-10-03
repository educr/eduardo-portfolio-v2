import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import NextImage, { type ImageProps } from 'next/image'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import type { AnchorHTMLAttributes, CSSProperties, HTMLAttributes, ImgHTMLAttributes, ReactElement } from 'react'
import { getAllCases, getCaseBySlug } from '@/lib/cases'
import CaseCarousel from '@/components/CaseCarousel'
import ZoomImage from '@/components/ZoomImage'

const DEFAULT_IMAGE_SIZES = '(min-width: 1280px) 900px, (min-width: 768px) 720px, 100vw'
const DEFAULT_MIN_HEIGHT = 360
const DEFAULT_ASPECT = '16 / 9'

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

function parseAspect(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }
  const cleaned = value.replace(/\s+/g, '')
  if (!cleaned.includes('/')) {
    return undefined
  }
  const [w, h] = cleaned.split('/')
  const width = Number.parseFloat(w)
  const height = Number.parseFloat(h)
  if (!Number.isFinite(width) || !Number.isFinite(height) || height === 0) {
    return undefined
  }
  return `${width} / ${height}`
}

function MdxImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt = '', className, width, height, sizes, loading, style, title } = props
  if (!src) {
    return null
  }

  const numericWidth = parseDimension(width)
  const numericHeight = parseDimension(height)
  const dataProps = props as Record<string, unknown>
  const aspectFromData = parseAspect(dataProps['data-aspect'])
  const aspectRatio =
    (numericWidth && numericHeight ? `${numericWidth} / ${numericHeight}` : undefined) ?? aspectFromData ?? DEFAULT_ASPECT
  const resolvedSizes = typeof sizes === 'string' && sizes.trim().length > 0 ? sizes : DEFAULT_IMAGE_SIZES
  const loadingMode = loading === 'eager' ? 'eager' : 'lazy'
  const fitDirective = typeof dataProps['data-fit'] === 'string' ? dataProps['data-fit'] : undefined
  const objectFitClass = fitDirective === 'cover' ? 'object-cover' : 'object-contain'
  const unframed =
    dataProps['data-unframed'] === true ||
    dataProps['data-unframed'] === 'true' ||
    dataProps['data-unframed'] === ''
  const wrapperClasses = [
    'relative w-full overflow-hidden',
    unframed ? undefined : 'rounded-[28px] border border-white/20 bg-white/10',
    className
  ].filter(Boolean).join(' ')

  const wrapperStyle: CSSProperties = {
    ...(style as CSSProperties | undefined)
  }

  wrapperStyle.aspectRatio ??= aspectRatio
  wrapperStyle.minHeight ??= DEFAULT_MIN_HEIGHT

  return (
    <div className={wrapperClasses} style={wrapperStyle}>
      <NextImage
        src={src}
        alt={alt}
        fill
        sizes={resolvedSizes}
        loading={loadingMode}
        priority={loadingMode === 'eager'}
        className={['h-full w-full', objectFitClass].filter(Boolean).join(' ')}
        title={title}
      />
    </div>
  )
}

const mdxComponents = {
  hr: () => <div className="my-10 h-px w-full bg-white/40" />,
  img: (props: ImgHTMLAttributes<HTMLImageElement>) => <MdxImage {...props} />,
  figure: ({ children, ...props }: HTMLAttributes<HTMLElement>) => (
    <figure
      {...props}
      className={['my-8 space-y-3 text-center text-sm text-fg/70', props.className].filter(Boolean).join(' ')}
    >
      {children}
    </figure>
  ),
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      className={['text-accent underline-offset-4 transition-colors hover:text-accent-dark', props.className]
        .filter(Boolean)
        .join(' ')}
    />
  ),
  Image: (props: ImageProps) => {
    const { className, ...rest } = props
    return (
      <div className="my-10 overflow-hidden rounded-[32px] border border-white/20 bg-white/10 p-2">
        <NextImage
          {...rest}
          className={['h-auto w-full rounded-[28px] object-cover', className].filter(Boolean).join(' ')}
        />
      </div>
    )
  },
  Carousel: CaseCarousel,
  ZoomImage
}

async function MdxContent({ source }: { source: string }): Promise<ReactElement> {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm]
      }
    }
  })

  return <div className="case-body mt-12">{content}</div>
}

export async function generateStaticParams() {
  const cases = await getAllCases()
  return cases.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = await getCaseBySlug(slug)
  if (!entry) {
    return {}
  }

  return {
    title: `${entry.title} – Eduardo Crespo`,
    description: entry.summary
  }
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = await getCaseBySlug(slug)

  if (!entry) {
    notFound()
  }

  const sectors = entry.sector ?? []
  const categories = entry.category ?? []
  const roles = entry.role ?? []
  const displayDate = (() => {
    if (entry.date) {
      const parsed = Date.parse(entry.date)
      if (!Number.isNaN(parsed)) {
        return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(parsed))
      }
      return entry.date
    }

    if (entry.yearLabel) {
      return entry.yearLabel
    }

    if (typeof entry.year === 'number') {
      return entry.year.toString()
    }

    return null
  })()

  return (
    <div className="page-fade relative mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16">
      <div className="pointer-events-none absolute -left-16 top-40 h-64 w-64 rounded-full bg-accent/25 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-8 h-80 w-80 rounded-full bg-white/40 blur-3xl" />

      <Link
        href="/"
        className="glass-pill w-fit gap-2 text-[0.7rem] lowercase tracking-[0.3em] text-fg/60 hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" /> back to work
      </Link>

      <article className="glass-panel p-10">
        <header className="flex flex-col gap-4">
          {(displayDate || sectors.length || categories.length || roles.length) ? (
            <div className="flex flex-wrap items-center gap-2">
              {displayDate ? (
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-fg/50">
                  {displayDate}
                </span>
              ) : null}
              {sectors.map(sector => (
                <span key={`sector-${sector}`} className="tag-chip tag-sector text-xs">
                  {sector}
                </span>
              ))}
              {categories.map(category => (
                <span key={`category-${category}`} className="tag-chip tag-category text-xs">
                  {category}
                </span>
              ))}
              {roles.map(role => (
                <span key={`role-${role}`} className="tag-chip tag-role text-xs">
                  {role}
                </span>
              ))}
            </div>
          ) : null}
          <h1 className="text-3xl font-semibold tracking-tight text-fg">
            {entry.title}
          </h1>
          <p className="text-base leading-relaxed text-fg/70">
            {entry.summary}
          </p>
        </header>

        {entry.content?.trim() ? <MdxContent source={entry.content} /> : null}
      </article>

      {!entry.content?.trim() ? (
        <p className="text-sm text-fg/60">
          Full write-up coming soon. Check back shortly for the deep dive.
        </p>
      ) : null}
    </div>
  )
}
