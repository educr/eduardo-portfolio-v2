'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
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

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-6">
        <div className="relative w-full md:max-w-xs" ref={sectorRef}>
          <button
            type="button"
            onClick={() => setSectorOpen(open => !open)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/20 bg-white/80 px-4 py-3 text-sm text-fg/80 shadow-sm transition hover:border-accent focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          >
            <span className="truncate text-left">
              {sectorFilters.length ? `${sectorFilters.length} sector${sectorFilters.length > 1 ? 's' : ''} selected` : 'All sectors'}
            </span>
            <ChevronDown className={`h-4 w-4 transition ${sectorOpen ? 'rotate-180' : ''}`} />
          </button>

          {sectorOpen ? (
            <div className="absolute left-0 right-0 z-20 mt-2 rounded-2xl border border-white/30 bg-white/95 p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between text-xs text-fg/60">
                <span className="uppercase tracking-[0.3em]">Sector</span>
                <button
                  type="button"
                  className="text-accent underline-offset-4 hover:underline"
                  onClick={() => setSectorFilters([])}
                >
                  Clear
                </button>
              </div>
              <div className="flex max-h-56 flex-col gap-2 overflow-y-auto text-sm">
                {sectors.map(sector => {
                  const checked = sectorFilters.includes(sector)
                  return (
                    <label key={sector} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSector(sector)}
                        className="h-4 w-4 rounded border-accent text-accent focus:ring-accent/40"
                      />
                      <span className="text-fg/80">{sector}</span>
                    </label>
                  )
                })}
                {!sectors.length ? (
                  <p className="text-xs text-fg/50">No sectors available.</p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        {roles.length ? (
          <div className="relative w-full md:max-w-xs" ref={roleRef}>
            <button
              type="button"
              onClick={() => setRoleOpen(open => !open)}
              className="flex w-full items-center justify-between rounded-2xl border border-white/20 bg-white/80 px-4 py-3 text-sm text-fg/80 shadow-sm transition hover:border-accent focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <span className="truncate text-left">
                {roleFilters.length ? `${roleFilters.length} role${roleFilters.length > 1 ? 's' : ''} selected` : 'All roles'}
              </span>
              <ChevronDown className={`h-4 w-4 transition ${roleOpen ? 'rotate-180' : ''}`} />
            </button>

            {roleOpen ? (
              <div className="absolute left-0 right-0 z-20 mt-2 rounded-2xl border border-white/30 bg-white/95 p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between text-xs text-fg/60">
                  <span className="uppercase tracking-[0.3em]">Role</span>
                  <button
                    type="button"
                    className="text-accent underline-offset-4 hover:underline"
                    onClick={() => setRoleFilters([])}
                  >
                    Clear
                  </button>
                </div>
                <div className="flex max-h-56 flex-col gap-2 overflow-y-auto text-sm">
                  {roles.map(role => {
                    const checked = roleFilters.includes(role)
                    return (
                      <label key={role} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRole(role)}
                          className="h-4 w-4 rounded border-accent text-accent focus:ring-accent/40"
                        />
                        <span className="text-fg/80">{role}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
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
