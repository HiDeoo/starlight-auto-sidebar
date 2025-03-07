import { getEntry } from 'astro:content'

import { stripLeadingAndTrailingSlash } from './path'
import type { StarlightAutoSidebarContext } from './vite'

export async function getEntryOrder(id: string) {
  const entry = await getEntry('docs', stripLeadingAndTrailingSlash(id))

  return entry?.data.sidebar.order ?? Number.MAX_VALUE
}

export function getDefaultLang(context: StarlightAutoSidebarContext): string {
  return context.locales?.root?.lang ?? context.defaultLocale ?? 'en'
}
