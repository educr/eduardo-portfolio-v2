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
    <div className="page-fade relative mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-24 pt-16 sm:px-6">
      <div className="pointer-events-none absolute -left-10 top-24 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute right-8 top-0 h-72 w-72 rounded-full bg-white/40 blur-3xl" />

      {/* Hero */}
      <section className="glass-panel relative grid gap-10 px-3 py-6 sm:px-4 md:grid-cols-[auto,1fr] md:items-center md:gap-12 md:px-8 md:py-10">
        <div className="pointer-events-none absolute -left-16 top-6 hidden h-44 w-44 rounded-full bg-white/30 blur-3xl md:block" />
        <div className="pointer-events-none absolute right-4 bottom-4 hidden h-40 w-40 rounded-full bg-accent/20 blur-3xl md:block" />

        <div className="relative mx-auto mb-4 w-40 aspect-square overflow-hidden rounded-full border border-white/40 bg-white/40 p-1 shadow-inner md:mx-0 md:mb-0 md:border-white/60">
          <Image src="/me.jpeg" alt="Eduardo Crespo" fill className="object-cover mix-blend-multiply" />
        </div>
        <div className="relative space-y-4 text-center md:text-left">
          <div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-fg">
              Eduardo Crespo
            </h1>
          </div>
          <p className="text-lg text-fg/80">
            Product Designer blending deep healthcare experience with a visual art foundation, crafting experiences that are intuitive, empathetic, and visually refined.
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
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="glass-panel space-y-6 px-3 py-6 sm:px-4 md:px-8 md:py-10">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h2 className="text-2xl font-semibold text-fg/90">Highlighted Projects</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {featured.map(c => <CaseCard key={c.slug} data={c} />)}
        </div>
      </section>

      {/* All cases with filters */}
      <section className="glass-panel space-y-6 px-3 py-6 sm:px-4 md:px-8 md:py-10">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h2 className="text-2xl font-semibold text-fg/90">All Work</h2>
        </div>
        <CaseGrid cases={others} />
      </section>
    </div>
  )
}
