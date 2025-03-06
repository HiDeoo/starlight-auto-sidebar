import { stripLeadingSlash, stripTrailingSlash } from './path'
import type { StarlightAutoSidebarContext } from './vite'

export async function getEntryOrder(id: string) {
  const { getEntry } = await import('astro:content')
  const entry = await getEntry('docs', stripLeadingSlash(stripTrailingSlash(id)))

  return entry?.data.sidebar.order ?? Number.MAX_VALUE
}

export function getDefaultLang(context: StarlightAutoSidebarContext): string {
  return context.locales?.root?.lang ?? context.defaultLocale ?? 'en'
}
