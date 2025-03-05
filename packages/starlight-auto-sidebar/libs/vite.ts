import type { HookParameters, StarlightUserConfig } from '@astrojs/starlight/types'
import type { AstroConfig, ViteUserConfig } from 'astro'

export function vitePluginStarlightAutoSidebar(
  starlightConfig: HookParameters<'config:setup'>['config'],
  astroConfig: AstroConfig,
): VitePlugin {
  const modules = {
    'virtual:starlight-auto-sidebar/context': `export default ${JSON.stringify({
      sidebar: starlightConfig.sidebar,
      contentDir: new URL(`content/docs/`, astroConfig.srcDir).toString(),
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

export interface StarlightAutoSidebarContext {
  contentDir: string
  sidebar: StarlightUserConfig['sidebar']
}

type VitePlugin = NonNullable<ViteUserConfig['plugins']>[number]
