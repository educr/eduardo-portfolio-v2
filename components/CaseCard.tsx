"use client"

import { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { CaseMeta } from '@/lib/cases'

function CaseCardComponent({ data }: { data: CaseMeta }) {
  const sectors = data.sector ?? []
  const categories = data.category ?? []

  return (
    <Link
      href={`/case/${data.slug}`}
      className="block paper-card"
    >
      {data.cover && (
        <div className="p-3 pb-0">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl"
            style={{ border: '1px solid rgba(30,18,12,0.06)' }}
          >
            <Image
              src={data.cover}
              alt={data.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        </div>
      )}
      <div className="p-4 space-y-3">
        <h3 className="text-lg">{data.title}</h3>
        <p className="text-sm text-fg/65 leading-relaxed">{data.summary}</p>
        {(sectors.length || categories.length || (data.role?.length ?? 0) > 0) ? (
          <div className="flex flex-wrap gap-1.5">
            {sectors.map(sector => (
              <span key={`sector-${sector}`} className="tag-chip tag-sector text-[0.65rem]">
                {sector}
              </span>
            ))}
            {categories.map(category => (
              <span key={`category-${category}`} className="tag-chip tag-category text-[0.65rem]">
                {category}
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

export default memo(CaseCardComponent, (prev, next) => prev.data === next.data)
