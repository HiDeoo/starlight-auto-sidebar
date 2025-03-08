import type { AstroConfig } from 'astro'

import { stripLeadingSlash } from './path'

const base = stripLeadingSlash(import.meta.env.BASE_URL)

export function getRelativeSrcDir(config: AstroConfig) {
  return config.srcDir.pathname.replace(config.root.pathname, '')
}

export function stripBase(pathname: string) {
  return pathname.replace(base, '')
}
