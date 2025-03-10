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

  // TODO(HiDeoo) silence logs
  const entry = await getEntryOrFallback(id, locale)
  data = {
    order: entry?.data.sidebar.order,
    next: entry?.data.next,
    prev: entry?.data.prev,
  }

  entryDataMap.set(id, data)

  return data
}

export async function getEntryOrFallback(id: string, locale: Locale) {
  id = stripLeadingAndTrailingSlash(id)

  if (!context.isMultilingual || !locale) return getEntry('docs', stripLeadingAndTrailingSlash(id))

  const entry = await getEntry('docs', id)
  if (entry) return entry

  return getEntry('docs', id.replace(new RegExp(`^${locale}/`), ''))
}

export interface EntryData {
  order: CollectionEntry<'docs'>['data']['sidebar']['order']
  next: CollectionEntry<'docs'>['data']['next']
  prev: CollectionEntry<'docs'>['data']['prev']
}

export type Locale = string | undefined
