import type { HookParameters } from '@astrojs/starlight/types'
import type { ViteUserConfig } from 'astro'

import type { SidebarItemConfig } from './sidebar'

export function vitePluginStarlightAutoSidebar(starlightConfig: StarlightConfig): VitePlugin {
  const modules = {
    'virtual:starlight-auto-sidebar/context': `export default ${JSON.stringify({
      defaultLocale: starlightConfig.defaultLocale,
      isMultilingual: Object.keys(starlightConfig.locales ?? {}).length > 1,
      locales: starlightConfig.locales,
      pagination: starlightConfig.pagination,
      sidebar: starlightConfig.sidebar ?? [],
    } satisfies StarlightAutoSidebarContext)}`,
  }

  const moduleResolutionMap = Object.fromEntries(
    (Object.keys(modules) as (keyof typeof modules)[]).map((key) => [resolveVirtualModuleId(key), key]),
  )

  return {
    name: 'vite-plugin-starlight-auto-sidebar',
    load(id) {
      const moduleId = moduleResolutionMap[id]
      return moduleId ? modules[moduleId] : undefined
    },
    resolveId(id) {
      return id in modules ? resolveVirtualModuleId(id) : undefined
    },
  }
}

function resolveVirtualModuleId<TModuleId extends string>(id: TModuleId): `\0${TModuleId}` {
  return `\0${id}`
}

type StarlightConfig = HookParameters<'config:setup'>['config']

export interface StarlightAutoSidebarContext {
  defaultLocale: StarlightConfig['defaultLocale']
  isMultilingual: boolean
  locales: StarlightConfig['locales']
  pagination: StarlightConfig['pagination']
  sidebar: SidebarItemConfig[]
}

type VitePlugin = NonNullable<ViteUserConfig['plugins']>[number]
