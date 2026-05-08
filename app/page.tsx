import Image from 'next/image'
import Link from 'next/link'
import { getAllCases } from '@/lib/cases'
import CaseCard from '@/components/CaseCard'
import CaseGrid from '@/components/CaseGrid'

export default async function Home() {
  const cases = await getAllCases()
  const featured = cases.filter(c => c.featured)
  const others = cases.filter(c => !c.featured)

  return (
    <div className="page-fade relative mx-auto flex max-w-6xl flex-col gap-8 pb-32 pt-16">

      {/* Hero */}
      <section className="glass-panel relative grid gap-10 px-5 py-8 sm:px-8 md:grid-cols-[auto,1fr] md:items-center md:gap-16 md:px-12 md:py-14">
        <div className="relative mx-auto mb-4 w-36 aspect-square overflow-hidden rounded-3xl md:mx-0 md:mb-0"
          style={{
            border: '3px solid #351F57',
            boxShadow: '4px 4px 0 rgba(130, 83, 26, 0.35)'
          }}
        >
          <Image src="/me.jpeg" alt="Eduardo Crespo" fill className="object-cover" />
        </div>
        <div className="relative space-y-5 text-center md:text-left">
          <div>
            <h1 className="text-5xl leading-tight text-fg md:text-6xl">
              Eduardo Crespo
            </h1>
            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-fg/40">
              Product Designer
            </p>
          </div>
          <p className="text-base text-fg/70 leading-[1.8] md:text-lg md:max-w-xl">
            Visual art foundation. Five years in healthcare. I think differently about form, meaning, and what it actually feels like to use something.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:justify-start">
            <a href="mailto:crespoeduardo@icloud.com" className="glass-pill">
              Email
            </a>
            <Link
              href="https://www.linkedin.com/in/eduardo-crespo-20138a192"
              className="glass-pill"
              target="_blank"
              rel="noopener noreferrer"
              prefetch={false}
            >
              LinkedIn
            </Link>
            <a href="/Resume.pdf" className="glass-pill" target="_blank" rel="noopener noreferrer">
              Resume
            </a>
            <a href="https://eduardoandrescrespo.com" className="glass-pill" target="_blank" rel="noopener noreferrer">
              Artist Site
            </a>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.3em] text-fg/40">Selected work</p>
          <h2 className="text-2xl text-fg/90">Highlighted Projects</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {featured.map(c => <CaseCard key={c.slug} data={c} />)}
        </div>
      </section>

      {/* All cases with filters */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.3em] text-fg/40">Full archive</p>
          <h2 className="text-2xl text-fg/90">All Work</h2>
        </div>
        <CaseGrid cases={others} />
      </section>
    </div>
  )
}
