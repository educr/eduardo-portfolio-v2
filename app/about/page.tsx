import Image from 'next/image'
import Link from 'next/link'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="page-fade relative mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
      <div className="pointer-events-none absolute -left-14 top-20 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute right-6 top-0 h-64 w-64 rounded-full bg-white/35 blur-3xl" />

      <section className="glass-panel relative flex flex-col items-center gap-8 px-4 py-6 md:px-8 md:py-10">
        <div className="pointer-events-none absolute -left-16 top-6 hidden h-44 w-44 rounded-full bg-white/30 blur-3xl md:block" />
        <div className="pointer-events-none absolute right-4 bottom-4 hidden h-40 w-40 rounded-full bg-accent/25 blur-3xl md:block" />

        <div className="relative mx-auto w-80 aspect-square overflow-hidden rounded-full border border-white/40 bg-white/40 p-1 shadow-inner md:border-white/60">
          <Image src="/me.jpeg" alt="Eduardo Crespo" fill className="object-cover mix-blend-multiply" />
        </div>
        <div className="relative space-y-4 text-center md:max-w-3xl md:text-left">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-fg md:text-4xl">About Me</h1>
          </div>
          <p className="text-base text-fg/75 md:text-lg">
            I’m a product designer with over five years of experience, including 4+ years in healthcare technology, where I’ve designed solutions that support patients, clinicians, and complex care systems. With a foundation in visual art, I bring an approach that unites aesthetic sensitivity with technical rigor—balancing empathy and creativity with structure and functionality.
          </p>
          <p className="text-base text-fg/75 md:text-lg">
            As an artist, I’ve explored themes of embodiment, sensory experience, mental health, disability, and spirituality, which deeply inform my design practice. This perspective equips me to create experiences that are not only useful and accessible, but also ethically grounded, dignified, and formally beautiful.
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
            <a href="resume.pdf" className="glass-pill">
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
