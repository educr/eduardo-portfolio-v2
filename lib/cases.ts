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
  role?: string[]
  featured?: boolean
  cover?: string
}

export type CaseEntry = CaseMeta & {
  content: string
}

export async function getAllCases(): Promise<CaseMeta[]> {
  const files = fs.readdirSync(casesDir).filter(f => f.endsWith('.mdx'))
  return files.map(file => {
    const slug = file.replace(/\.mdx$/, '')
    const raw = fs.readFileSync(path.join(casesDir, file), 'utf8')
    const { data } = matter(raw)
    const { slug: frontmatterSlug, category, sector, ...rest } = data as Record<string, unknown>
    const resolvedSector = Array.isArray(sector)
      ? sector
      : Array.isArray(category)
        ? category
        : undefined

    return {
      slug,
      ...rest,
      sector: resolvedSector
    } as CaseMeta
  })
}

export async function getCaseBySlug(slug: string): Promise<CaseEntry | null> {
  const fullPath = path.join(casesDir, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const raw = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(raw)
  const { slug: frontmatterSlug, category, sector, ...rest } = data as Record<string, unknown>
  const resolvedSector = Array.isArray(sector)
    ? sector
    : Array.isArray(category)
      ? category
      : undefined

  return {
    slug,
    ...rest,
    sector: resolvedSector,
    content
  } as CaseEntry
}
