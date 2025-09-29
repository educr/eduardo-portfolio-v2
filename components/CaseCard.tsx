"use client"

import Link from 'next/link'
import Image from 'next/image'
import type { CaseMeta } from '@/lib/cases'

export default function CaseCard({ data }: { data: CaseMeta }) {
  const displayDate = (() => {
    if (data.date) {
      const parsed = Date.parse(data.date)
      if (!Number.isNaN(parsed)) {
        return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(parsed))
      }
      return data.date
    }

    if (data.yearLabel) {
      return data.yearLabel
    }

    if (typeof data.year === 'number') {
      return data.year.toString()
    }

    return null
  })()

  return (
    <Link
      href={`/case/${data.slug}`}
      className="block border border-border rounded-lg bg-white shadow hover:shadow-md transition overflow-hidden"
    >
      {data.cover && (
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={data.cover}
            alt={data.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4 space-y-3">
        {displayDate ? (
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-fg/50">
            {displayDate}
          </p>
        ) : null}
        <h3 className="font-semibold text-lg">{data.title}</h3>
        <p className="text-sm text-fg/70">{data.summary}</p>
        <div className="flex flex-wrap gap-2">
          {data.sector?.map(sector => (
            <span
              key={sector}
              className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full"
            >
              {sector}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
