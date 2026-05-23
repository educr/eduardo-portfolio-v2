import CaseCard from '@/components/CaseCard'
import type { CaseMeta } from '@/lib/cases'

export default function CaseGrid({ cases }: { cases: CaseMeta[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cases.map(c => (
        <CaseCard key={c.slug} data={c} />
      ))}
    </div>
  )
}
