import type { StarlightPlugin } from '@astrojs/starlight/types'

import { getDefinitionsFromSidebarConfig } from './libs/sidebar'
import { vitePluginStarlightAutoSidebar } from './libs/vite'

export default function starlightAutoSidebar(): StarlightPlugin {
  return {
    name: 'starlight-auto-sidebar',
    hooks: {
      'config:setup': ({ addIntegration, addRouteMiddleware, astroConfig, config: starlightConfig }) => {
        const { sidebar } = starlightConfig

        // TODO(HiDeoo) handle non-configured sidebar
        if (!sidebar) return

        addRouteMiddleware({ entrypoint: 'starlight-auto-sidebar/middleware', order: 'post' })

        addIntegration({
          name: 'starlight-auto-sidebar-integration',
          hooks: {
            'astro:config:setup': async ({ updateConfig }) => {
              const contentDir = new URL(`content/docs/`, astroConfig.srcDir)
              const definitions = await getDefinitionsFromSidebarConfig(contentDir, sidebar)

              updateConfig({
                vite: {
                  plugins: [vitePluginStarlightAutoSidebar(sidebar, definitions, contentDir)],
                },
              })
            },
          },
        })
      },
    },
  }
}
