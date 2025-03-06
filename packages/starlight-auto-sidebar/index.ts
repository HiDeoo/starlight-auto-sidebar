import type { StarlightPlugin } from '@astrojs/starlight/types'

import { setupDefinitionsWatcher, type DefinitionsWatcher } from './libs/definitions'
import { getDefinitionsFromSidebarConfig } from './libs/sidebar'
import { vitePluginStarlightAutoSidebar } from './libs/vite'

export default function starlightAutoSidebar(): StarlightPlugin {
  return {
    name: 'starlight-auto-sidebar',
    hooks: {
      'config:setup': ({ addIntegration, addRouteMiddleware, astroConfig, command, config: starlightConfig }) => {
        if (command !== 'dev' && command !== 'build') return

        const { sidebar } = starlightConfig
        // TODO(HiDeoo) handle non-configured sidebar
        if (!sidebar) return

        addRouteMiddleware({ entrypoint: 'starlight-auto-sidebar/middleware', order: 'post' })

        let definitionsWatcher: DefinitionsWatcher | undefined

        addIntegration({
          name: 'starlight-auto-sidebar-integration',
          hooks: {
            'astro:config:setup': async ({ updateConfig }) => {
              const contentDir = new URL(`content/docs/`, astroConfig.srcDir)
              const definitions = await getDefinitionsFromSidebarConfig(contentDir, sidebar)

              if (command === 'dev') {
                definitionsWatcher = await setupDefinitionsWatcher(astroConfig.root, contentDir, definitions)
              }

              updateConfig({
                vite: {
                  plugins: [vitePluginStarlightAutoSidebar(starlightConfig, definitions, contentDir)],
                },
              })
            },
            'astro:server:done': async () => {
              await definitionsWatcher?.unsubscribe()
            },
          },
        })
      },
    },
  }
}
