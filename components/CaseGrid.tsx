'use client'

import { useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import CaseCard from '@/components/CaseCard'
import type { CaseMeta } from '@/lib/cases'

type FilterSection = {
  key: 'sector' | 'category' | 'role'
  label: string
  items: string[]
  filters: string[]
  toggle: (value: string) => void
  emptyLabel: string
}

export default function CaseGrid({ cases }: { cases: CaseMeta[] }) {
  const [sectorFilters, setSectorFilters] = useState<string[]>([])
  const [categoryFilters, setCategoryFilters] = useState<string[]>([])
  const [roleFilters, setRoleFilters] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const controlsRef = useRef<HTMLDivElement>(null)

  const deferredCases = useDeferredValue(cases)
  const deferredSectorFilters = useDeferredValue(sectorFilters)
  const deferredCategoryFilters = useDeferredValue(categoryFilters)
  const deferredRoleFilters = useDeferredValue(roleFilters)

  const sectors = useMemo(
    () => Array.from(new Set(deferredCases.flatMap(c => c.sector ?? []))).sort(),
    [deferredCases]
  )
  const categories = useMemo(
    () => Array.from(new Set(deferredCases.flatMap(c => c.category ?? []))).sort(),
    [deferredCases]
  )
  const roles = useMemo(
    () => Array.from(new Set(deferredCases.flatMap(c => c.role ?? []))).sort(),
    [deferredCases]
  )

  const sectorFilterSet = useMemo(() => new Set(deferredSectorFilters), [deferredSectorFilters])
  const categoryFilterSet = useMemo(() => new Set(deferredCategoryFilters), [deferredCategoryFilters])
  const roleFilterSet = useMemo(() => new Set(deferredRoleFilters), [deferredRoleFilters])

  const filtered = useMemo(() => {
    if (!sectorFilterSet.size && !categoryFilterSet.size && !roleFilterSet.size) {
      return deferredCases
    }

    return deferredCases.filter(caseItem => {
      const sectorMatch = !sectorFilterSet.size || (caseItem.sector ?? []).some(sector => sectorFilterSet.has(sector))
      if (!sectorMatch) {
        return false
      }

      const categoryMatch =
        !categoryFilterSet.size || (caseItem.category ?? []).some(category => categoryFilterSet.has(category))
      if (!categoryMatch) {
        return false
      }

      const roleMatch = !roleFilterSet.size || (caseItem.role ?? []).some(role => roleFilterSet.has(role))
      return roleMatch
    })
  }, [deferredCases, sectorFilterSet, categoryFilterSet, roleFilterSet])

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!filtersOpen || !controlsRef.current) {
        return
      }
      const target = event.target as Node
      if (!controlsRef.current.contains(target)) {
        setFiltersOpen(false)
      }
    }

    if (filtersOpen) {
      window.addEventListener('mousedown', handleClick)
      return () => window.removeEventListener('mousedown', handleClick)
    }

    return undefined
  }, [filtersOpen])

  const toggleSector = (value: string) => {
    startTransition(() => {
      setSectorFilters(prev => (prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]))
    })
  }

  const toggleCategory = (value: string) => {
    startTransition(() => {
      setCategoryFilters(prev => (prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]))
    })
  }

  const toggleRole = (value: string) => {
    startTransition(() => {
      setRoleFilters(prev => (prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]))
    })
  }

  const resetFilters = () => {
    startTransition(() => {
      setSectorFilters([])
      setCategoryFilters([])
      setRoleFilters([])
      setFiltersOpen(false)
    })
  }

  const hasActiveFilters = sectorFilters.length > 0 || categoryFilters.length > 0 || roleFilters.length > 0
  const activeCount = sectorFilters.length + categoryFilters.length + roleFilters.length

const filterBaseClass = 'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 whitespace-nowrap backdrop-blur-sm'

const filterStyles: Record<FilterSection['key'], { activeButton: string; inactiveButton: string; activeLabel: string; inactiveLabel: string }> = {
  sector: {
    activeButton: 'border-accent bg-[rgba(47,158,153,0.18)] text-accent shadow-sm',
    inactiveButton: 'border-white/40 bg-white/60 text-fg/70 hover:border-accent/40 hover:text-fg',
    activeLabel: 'text-accent-dark',
    inactiveLabel: 'text-fg'
  },
  category: {
    activeButton: 'border-[rgba(122,201,138,0.55)] bg-[rgba(122,201,138,0.24)] text-[#256845] shadow-sm',
    inactiveButton: 'border-white/40 bg-white/60 text-fg/70 hover:border-[rgba(122,201,138,0.5)] hover:text-fg',
    activeLabel: 'text-[#1f5538]',
    inactiveLabel: 'text-fg'
  },
  role: {
    activeButton: 'border-role bg-[rgba(37,99,235,0.22)] text-role shadow-sm',
    inactiveButton: 'border-white/40 bg-white/60 text-fg/70 hover:border-role hover:text-fg',
    activeLabel: 'text-role-dark',
    inactiveLabel: 'text-fg'
  }
}

  const sections: FilterSection[] = [
    {
      key: 'sector',
      label: 'Sector',
      items: sectors,
      filters: sectorFilters,
      toggle: toggleSector,
      emptyLabel: 'No sector tags yet.'
    },
    {
      key: 'category',
      label: 'Category',
      items: categories,
      filters: categoryFilters,
      toggle: toggleCategory,
      emptyLabel: 'No category tags yet.'
    },
    {
      key: 'role',
      label: 'Role',
      items: roles,
      filters: roleFilters,
      toggle: toggleRole,
      emptyLabel: 'No role tags yet.'
    }
  ]

  return (
    <div className="flex flex-col gap-6" aria-busy={isPending}>
      <div className="flex flex-col gap-3" ref={controlsRef}>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setFiltersOpen(open => !open)}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/30 px-4 py-2 text-sm font-medium text-fg/70 shadow-sm backdrop-blur-md transition hover:border-accent/40 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {activeCount > 0 ? (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
                {activeCount}
              </span>
            ) : null}
          </button>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/25 px-4 py-2 text-sm font-medium text-fg/70 backdrop-blur transition hover:border-accent/40 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <RotateCcw className="h-4 w-4" /> Reset all
            </button>
          ) : null}
        </div>

        {filtersOpen ? (
          <div className="flex flex-col gap-5 rounded-3xl border border-white/30 bg-white/15 p-5 shadow-2xl backdrop-blur-2xl">
            <div className="grid gap-5 md:grid-cols-3">
              {sections.map(section => (
                <div key={section.key} className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fg/50">
                    {section.label}
                  </p>
                  {section.items.length ? (
                    <div className="flex flex-wrap gap-2">
                      {section.items.map(item => {
                        const active = section.filters.includes(item)
                        const palette = filterStyles[section.key]
                        const buttonClass = [filterBaseClass, active ? palette.activeButton : palette.inactiveButton].join(' ')
                        const labelClass = ['truncate text-sm font-medium', active ? palette.activeLabel : palette.inactiveLabel].join(' ')

                        return (
                          <button
                            key={`${section.key}-${item}`}
                            type="button"
                            onClick={() => section.toggle(item)}
                            className={buttonClass}
                          >
                            <span className={labelClass}>{item}</span>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-fg/50">{section.emptyLabel}</p>
                  )}
                </div>
              ))}
            </div>
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
