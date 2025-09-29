'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, RotateCcw } from 'lucide-react'
import CaseCard from '@/components/CaseCard'
import type { CaseMeta } from '@/lib/cases'

export default function CaseGrid({ cases }: { cases: CaseMeta[] }) {
  const [sectorFilters, setSectorFilters] = useState<string[]>([])
  const [roleFilters, setRoleFilters] = useState<string[]>([])
  const [sectorOpen, setSectorOpen] = useState(false)
  const [roleOpen, setRoleOpen] = useState(false)
  const sectorRef = useRef<HTMLDivElement>(null)
  const roleRef = useRef<HTMLDivElement>(null)

  const sectors = useMemo(
    () => Array.from(new Set(cases.flatMap(c => c.sector ?? []))).sort(),
    [cases]
  )
  const roles = useMemo(
    () => Array.from(new Set(cases.flatMap(c => c.role ?? []))).sort(),
    [cases]
  )

  const filtered = useMemo(() => {
    if (!sectorFilters.length && !roleFilters.length) {
      return cases
    }

    return cases.filter(caseItem => {
      const sectorMatch =
        !sectorFilters.length || (caseItem.sector ?? []).some(sector => sectorFilters.includes(sector))
      const roleMatch =
        !roleFilters.length || (caseItem.role ?? []).some(role => roleFilters.includes(role))
      return sectorMatch && roleMatch
    })
  }, [cases, sectorFilters, roleFilters])

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as Node
      if (sectorOpen && sectorRef.current && !sectorRef.current.contains(target)) {
        setSectorOpen(false)
      }
      if (roleOpen && roleRef.current && !roleRef.current.contains(target)) {
        setRoleOpen(false)
      }
    }

    if (sectorOpen || roleOpen) {
      window.addEventListener('mousedown', handleClick)
      return () => window.removeEventListener('mousedown', handleClick)
    }
    return undefined
  }, [sectorOpen, roleOpen])

  const toggleSector = (value: string) => {
    setSectorFilters(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value])
  }

  const toggleRole = (value: string) => {
    setRoleFilters(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value])
  }

  const resetFilters = () => {
    setSectorFilters([])
    setRoleFilters([])
    setSectorOpen(false)
    setRoleOpen(false)
  }

  const hasActiveFilters = sectorFilters.length > 0 || roleFilters.length > 0

  const triggerClass = (active: boolean, open: boolean) => [
    'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
    active || open
      ? 'border-accent bg-accent text-white shadow-sm'
      : 'border-white/40 bg-white/80 text-fg/70 hover:border-accent/40 hover:text-fg'
  ].join(' ')

  const optionClass = (checked: boolean) => [
    'flex items-center justify-between gap-4 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap',
    checked
      ? 'border-accent/60 bg-accent/15 text-fg'
      : 'border-transparent bg-white/60 text-fg/70 hover:border-accent/30 hover:text-fg'
  ].join(' ')

  return (
    <div className="flex flex-col gap-6">
      {sectorOpen || roleOpen ? (
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          className="fixed inset-0 z-20 cursor-default bg-transparent"
          onClick={() => {
            setSectorOpen(false)
            setRoleOpen(false)
          }}
        />
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        {sectors.length ? (
          <div className="relative z-30" ref={sectorRef}>
            <button
              type="button"
              onClick={() => setSectorOpen(open => !open)}
              className={triggerClass(Boolean(sectorFilters.length), sectorOpen)}
            >
              <span>{sectorFilters.length ? `${sectorFilters.length} sector${sectorFilters.length > 1 ? 's' : ''}` : 'All Sectors'}</span>
              <ChevronDown className={`h-4 w-4 transition ${sectorOpen ? 'rotate-180' : ''}`} />
            </button>

            {sectorOpen ? (
              <div className="absolute left-0 top-[calc(100%+0.75rem)] z-40 min-w-[220px] space-y-3 rounded-3xl border border-white/60 bg-white p-5 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-fg/50">
                  <span>Sector</span>
                  {sectorFilters.length ? (
                    <button
                      type="button"
                      className="text-accent underline-offset-4 hover:underline"
                      onClick={() => setSectorFilters([])}
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  {sectors.map(sector => {
                    const checked = sectorFilters.includes(sector)
                    return (
                      <button
                        key={sector}
                        type="button"
                        onClick={() => toggleSector(sector)}
                        className={optionClass(checked)}
                      >
                        <span className="truncate">{sector}</span>
                        {checked ? <Check className="h-4 w-4 text-accent" /> : null}
                      </button>
                    )
                  })}
                  {!sectors.length ? (
                    <p className="text-xs text-fg/50">No sectors available.</p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {roles.length ? (
          <div className="relative z-30" ref={roleRef}>
            <button
              type="button"
              onClick={() => setRoleOpen(open => !open)}
              className={triggerClass(Boolean(roleFilters.length), roleOpen)}
            >
              <span>{roleFilters.length ? `${roleFilters.length} role${roleFilters.length > 1 ? 's' : ''}` : 'All Roles'}</span>
              <ChevronDown className={`h-4 w-4 transition ${roleOpen ? 'rotate-180' : ''}`} />
            </button>

            {roleOpen ? (
              <div className="absolute left-0 top-[calc(100%+0.75rem)] z-40 min-w-[220px] space-y-3 rounded-3xl border border-white/60 bg-white p-5 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-fg/50">
                  <span>Roles</span>
                  {roleFilters.length ? (
                    <button
                      type="button"
                      className="text-accent underline-offset-4 hover:underline"
                      onClick={() => setRoleFilters([])}
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  {roles.map(role => {
                    const checked = roleFilters.includes(role)
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        className={optionClass(checked)}
                      >
                        <span className="truncate">{role}</span>
                        {checked ? <Check className="h-4 w-4 text-accent" /> : null}
                      </button>
                    )
                  })}
                  {!roles.length ? (
                    <p className="text-xs text-fg/50">No roles available.</p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/70 px-4 py-2 text-sm font-medium text-fg/70 shadow-sm transition hover:border-accent/40 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(c => (
          <CaseCard key={c.slug} data={c} />
        ))}
      </div>
    </div>
  )
}
