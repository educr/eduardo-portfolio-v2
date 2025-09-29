"use client"

import Link from 'next/link'
import Image from 'next/image'
import type { CaseMeta } from '@/lib/cases'

export default function CaseCard({ data }: { data: CaseMeta }) {
  return (
    <Link
      href={`/case/${data.slug}`}
      className="block border border-border rounded-xl bg-white shadow hover:shadow-md transition overflow-hidden"
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
      <div className="p-4">
        <h3 className="font-semibold text-lg">{data.title}</h3>
        <p className="text-sm text-fg/70">{data.summary}</p>
        <div className="flex flex-wrap gap-2 mt-2">
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
