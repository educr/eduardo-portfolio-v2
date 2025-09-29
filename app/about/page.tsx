import Image from 'next/image'
import Link from 'next/link'

export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">About Me</h1>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="relative w-40 aspect-square rounded-full overflow-hidden border border-border">
          <Image src="/me.jpeg" alt="Eduardo Crespo" fill className="object-cover" />
        </div>
        <div>
          <p className="mb-4">I’m a product designer with over five years of experience, including 4+ years in healthcare technology, where I’ve designed solutions that support patients, clinicians, and complex care systems. With a foundation in visual art, I bring an approach that unites aesthetic sensitivity with technical rigor—balancing empathy and creativity with structure and functionality.</p>
          <p className="mb-4">As an artist, I’ve explored themes of embodiment, sensory experience, mental health, disability, and spirituality, which deeply inform my design practice. This perspective equips me to create experiences that are not only useful and accessible, but also ethically grounded, dignified, and formally beautiful.</p>
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
            <a href="https://drive.google.com/file/d/1NEuDrVZdjsjRjHXzOt8q4ZO0CgF-oZIj/view" className="glass-pill">
              Resume
            </a>
            <a href="https://eduardoandrescrespo.com" className="glass-pill">
              Artist Site
            </a>
          </div>

        </div>

      </div>
    </div>

  )
}
