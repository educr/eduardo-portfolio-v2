"use client"

import Link from 'next/link'
import Image from 'next/image'
import type { CaseMeta } from '@/lib/cases'

export default function CaseCard({ data }: { data: CaseMeta }) {
  const sectors = data.sector?.length ? data.sector : data.category ?? []
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
          <span className="inline-block text-xs font-medium uppercase tracking-[0.3em] text-fg/50">
            {displayDate}
          </span>
        ) : null}
        <h3 className="font-semibold text-lg">{data.title}</h3>
        <p className="text-sm text-fg/70">{data.summary}</p>
        {(sectors.length || (data.role?.length ?? 0) > 0) ? (
          <div className="flex flex-wrap gap-1.5">
            {sectors.map(sector => (
              <span key={`sector-${sector}`} className="tag-chip tag-sector text-[0.65rem]">
                {sector}
              </span>
            ))}
            {data.role?.map(role => (
              <span key={`role-${role}`} className="tag-chip tag-role text-[0.65rem]">
                {role}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  )
}
