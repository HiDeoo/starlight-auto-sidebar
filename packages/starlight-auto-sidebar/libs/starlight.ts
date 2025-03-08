import { getEntry, type CollectionEntry } from 'astro:content'

import { stripLeadingAndTrailingSlash } from './path'
import type { StarlightAutoSidebarContext } from './vite'

const entryDataMap = new Map<string, EntryData>()

export async function getEntryOrder(id: string) {
  const data = await getEntryData(id)

  return data.order ?? Number.MAX_VALUE
}

export async function getEntryPrevNextLinks(id: string): Promise<Pick<EntryData, 'next' | 'prev'>> {
  const { prev, next } = await getEntryData(id)
  return { prev, next }
}

export function getDefaultLang(context: StarlightAutoSidebarContext): string {
  return context.locales?.root?.lang ?? context.defaultLocale ?? 'en'
}

async function getEntryData(id: string): Promise<EntryData> {
  let data = entryDataMap.get(id)
  if (data) return data

  const entry = await getEntry('docs', stripLeadingAndTrailingSlash(id))
  data = {
    order: entry?.data.sidebar.order,
    next: entry?.data.next,
    prev: entry?.data.prev,
  }

  entryDataMap.set(id, data)

  return data
}

export interface EntryData {
  order: CollectionEntry<'docs'>['data']['sidebar']['order']
  next: CollectionEntry<'docs'>['data']['next']
  prev: CollectionEntry<'docs'>['data']['prev']
}
