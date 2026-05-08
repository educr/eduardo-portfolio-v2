import Image from 'next/image'
import Link from 'next/link'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="page-fade relative mx-auto flex max-w-5xl flex-col gap-12 px-4 py-16 sm:px-6">

      <section className="glass-panel relative flex flex-col items-center gap-10 px-5 py-8 sm:px-8 md:flex-row md:items-start md:px-12 md:py-14 md:gap-16">

        <div className="relative mx-auto w-56 shrink-0 aspect-[3/4] overflow-hidden rounded-3xl md:mx-0"
          style={{
            border: '3px solid #351F57',
            boxShadow: '5px 5px 0 rgba(130, 83, 26, 0.35)'
          }}
        >
          <Image src="/me.jpeg" alt="Eduardo Crespo" fill className="object-cover object-top" />
        </div>

        <div className="relative space-y-6 text-center md:text-left md:pt-2">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-fg/40 mb-2">About</p>
            <h1 className="text-4xl text-fg md:text-5xl">Eduardo Crespo</h1>
          </div>
          <div className="space-y-4">
            <p className="text-base text-fg/75 leading-[1.85] md:text-lg">
              Product designer. Former visual artist. Five years of experience, mostly in healthcare.
            </p>
            <p className="text-base text-fg/75 leading-[1.85] md:text-lg">
              I came to design through fine art, which means I think differently about form, meaning, and what it actually feels like to use something. That background shows up in my work — in the care I put into visual systems, and in the questions I ask before I start designing.
            </p>
            <p className="text-base text-fg/75 leading-[1.85] md:text-lg">
              Most of my work has been in healthcare, where the stakes make the craft matter more.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:justify-start pt-2">
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
            <a href="Resume.pdf" className="glass-pill">
              Resume
            </a>
            <a href="https://eduardoandrescrespo.com" className="glass-pill">
              Artist Site
            </a>
          </div>
        </div>

      </section>
    </div>
  )
}
