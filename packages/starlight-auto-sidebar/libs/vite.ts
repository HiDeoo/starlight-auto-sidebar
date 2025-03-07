import type { HookParameters } from '@astrojs/starlight/types'
import type { ViteUserConfig } from 'astro'

import type { ProjectMetadata } from './metadata'
import type { SidebarItemConfig } from './sidebarConfig'

export function vitePluginStarlightAutoSidebar(
  starlightConfig: StarlightConfig,
  contentDir: URL,
  metadata: ProjectMetadata,
): VitePlugin {
  const modules = {
    'virtual:starlight-auto-sidebar/context': `export default ${JSON.stringify({
      contentDir: contentDir.toString(),
      defaultLocale: starlightConfig.defaultLocale,
      locales: starlightConfig.locales,
      metadata,
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
  contentDir: string
  defaultLocale: StarlightConfig['defaultLocale']
  locales: StarlightConfig['locales']
  metadata: ProjectMetadata
  sidebar: SidebarItemConfig[]
}

type VitePlugin = NonNullable<ViteUserConfig['plugins']>[number]
