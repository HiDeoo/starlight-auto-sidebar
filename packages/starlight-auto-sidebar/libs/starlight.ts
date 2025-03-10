import { getEntry, type CollectionEntry } from 'astro:content'
import context from 'virtual:starlight-auto-sidebar/context'

import { stripLeadingAndTrailingSlash } from './path'

export const DefaultLocale = context.defaultLocale === 'root' ? undefined : context.defaultLocale

const entryDataMap = new Map<string, EntryData>()

export async function getEntryOrder(id: string, locale: Locale) {
  const data = await getEntryData(id, locale)

  return data.order ?? Number.MAX_VALUE
}

export async function getEntryPrevNextLinks(id: string, locale: Locale): Promise<Pick<EntryData, 'next' | 'prev'>> {
  const { prev, next } = await getEntryData(id, locale)
  return { prev, next }
}

export function getDefaultLang(): string {
  return context.locales?.root?.lang ?? context.defaultLocale ?? 'en'
}

async function getEntryData(id: string, locale: Locale): Promise<EntryData> {
  let data = entryDataMap.get(id)
  if (data) return data

  const entry = await getEntryOrFallback(id, locale)
  data = {
    order: entry?.data.sidebar.order,
    next: entry?.data.next,
    prev: entry?.data.prev,
  }

  entryDataMap.set(id, data)

  return data
}

async function getEntryOrFallback(id: string, locale: Locale) {
  id = stripLeadingAndTrailingSlash(id)

  if (!context.isMultilingual || !locale) return getStarlightDocsEntry(id)

  const entry = await getStarlightDocsEntry(id)
  if (entry) return entry

  return getStarlightDocsEntry(id.replace(new RegExp(`^${locale}/`), ''))
}

async function getStarlightDocsEntry(id: string) {
  // Briefly override `console.warn()` to silence logging when an entry is not found.
  const warn = console.warn
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  console.warn = () => {}

  const entry = await getEntry('docs', id)

  // Restore the original warn implementation.
  console.warn = warn

  return entry
}

export interface EntryData {
  order: CollectionEntry<'docs'>['data']['sidebar']['order']
  next: CollectionEntry<'docs'>['data']['next']
  prev: CollectionEntry<'docs'>['data']['prev']
}

export type Locale = string | undefined
