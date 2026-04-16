import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import NextImage, { type ImageProps } from 'next/image'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import type { AnchorHTMLAttributes, HTMLAttributes, ImgHTMLAttributes, ReactElement } from 'react'
import { getAllCases, getCaseBySlug } from '@/lib/cases'
import CaseCarousel from '@/components/CaseCarousel'
import ZoomImage from '@/components/ZoomImage'
import MdxImage from '@/components/MdxImage'
import ExpandableFigure from '@/components/ExpandableFigure'
import FigureAside from '@/components/FigureAside'

const mdxComponents = {
  hr: () => <div className="my-10 h-px w-full clear-both bg-bg" />,
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
      <div className="my-10 overflow-hidden rounded-sm p-3"
        style={{ border: '1px solid rgba(30,18,12,0.07)', background: '#faf6f0', boxShadow: '0 2px 12px rgba(30,18,12,0.08), inset 0 1px 0 rgba(255,255,255,0.85)' }}
      >
        <NextImage
          {...rest}
          className={['h-auto w-full rounded-xl object-cover', className].filter(Boolean).join(' ')}
        />
      </div>
    )
  },
  Carousel: CaseCarousel,
  ZoomImage,
  ExpandableFigure,
  FigureAside
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
  return (
    <div className="page-fade relative mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16 sm:px-6">

      <Link
        href="/"
        className="glass-pill w-fit gap-2 text-[0.7rem] lowercase tracking-[0.3em] text-fg/60 hover:text-fg"
      >
        <ArrowLeft className="h-4 w-4" /> back to work
      </Link>

      <article className="glass-panel p-6 sm:p-8 md:p-12">
        <header className="flex flex-col gap-5">
          {(sectors.length || categories.length || roles.length) ? (
            <div className="flex flex-wrap items-center gap-2">
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
          <h1 className="text-4xl leading-tight tracking-normal text-fg md:text-5xl">
            {entry.title}
          </h1>
          <p className="text-lg leading-[1.8] text-fg/65">
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
