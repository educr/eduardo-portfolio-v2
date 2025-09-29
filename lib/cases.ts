'use server'

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// ... rest of your code

const casesDir = path.join(process.cwd(), 'content', 'cases')

export type CaseMeta = {
  slug: string
  title: string
  summary: string
  sector?: string[]
  category?: string[]
  role?: string[]
  featured?: boolean
  cover?: string
  year?: number
  date?: string
  yearLabel?: string
}

export type CaseEntry = CaseMeta & {
  content: string
}

export async function getAllCases(): Promise<CaseMeta[]> {
  const files = fs.readdirSync(casesDir).filter(f => f.endsWith('.mdx'))
  return files
    .map(file => {
      const slug = file.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(casesDir, file), 'utf8')
      const { data } = matter(raw)
      const { slug: frontmatterSlug, category, sector, date, year, ...rest } = data as Record<string, unknown>
      const resolvedSector = Array.isArray(sector)
        ? sector
        : Array.isArray(category)
          ? category
          : undefined

      const yearString = typeof year === 'string' ? year.trim() : undefined

      const resolvedYear = typeof year === 'number'
        ? year
        : yearString && /^\d{4}$/.test(yearString)
          ? Number.parseInt(yearString, 10)
          : undefined

      const resolvedDate = typeof date === 'string' && date.trim()
        ? date
        : undefined

      return {
        slug,
        ...rest,
        sector: resolvedSector,
        category: Array.isArray(category) ? category : undefined,
        year: resolvedYear,
        date: resolvedDate,
        yearLabel: determineYearLabel(year, resolvedYear)
      } as CaseMeta
    })
    .sort((a, b) => getCaseTimestamp(b) - getCaseTimestamp(a))
}

export async function getCaseBySlug(slug: string): Promise<CaseEntry | null> {
  const fullPath = path.join(casesDir, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const raw = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(raw)
  const { slug: frontmatterSlug, category, sector, date, year, ...rest } = data as Record<string, unknown>
  const resolvedSector = Array.isArray(sector)
    ? sector
    : Array.isArray(category)
      ? category
      : undefined

  const yearString = typeof year === 'string' ? year.trim() : undefined

  const resolvedYear = typeof year === 'number'
    ? year
    : yearString && /^\d{4}$/.test(yearString)
      ? Number.parseInt(yearString, 10)
      : undefined

  const resolvedDate = typeof date === 'string' && date.trim()
    ? date
    : undefined

  return {
    slug,
    ...rest,
    sector: resolvedSector,
    category: Array.isArray(category) ? category : undefined,
    year: resolvedYear,
    date: resolvedDate,
    yearLabel: determineYearLabel(year, resolvedYear),
    content
  } as CaseEntry
}

function getCaseTimestamp(meta: CaseMeta): number {
  if (meta.date) {
    const parsed = Date.parse(meta.date)
    if (!Number.isNaN(parsed)) {
      return parsed
    }
  }

  if (typeof meta.year === 'number') {
    return Date.UTC(meta.year, 0, 1)
  }

  if (meta.yearLabel) {
    const match = meta.yearLabel.match(/\d{4}(?!.*\d{4})/)
    if (match) {
      return Date.UTC(Number.parseInt(match[0], 10), 0, 1)
    }
  }

  return 0
}

function determineYearLabel(rawYear: unknown, resolvedYear: number | undefined): string | undefined {
  if (typeof rawYear === 'string' && rawYear.trim()) {
    return rawYear.trim()
  }

  if (typeof rawYear === 'number') {
    return rawYear.toString()
  }

  if (typeof resolvedYear === 'number') {
    return resolvedYear.toString()
  }

  return undefined
}
