import type { StarlightPlugin } from '@astrojs/starlight/types'

import { vitePluginStarlightAutoSidebar } from './libs/vite'

export default function starlightAutoSidebar(): StarlightPlugin {
  return {
    name: 'starlight-auto-sidebar',
    hooks: {
      'config:setup': ({ addIntegration, addRouteMiddleware, command, config: starlightConfig }) => {
        if (command !== 'dev' && command !== 'build') return

        const { sidebar } = starlightConfig
        if (!sidebar) return

        addRouteMiddleware({ entrypoint: 'starlight-auto-sidebar/middleware', order: 'post' })

        addIntegration({
          name: 'starlight-auto-sidebar-integration',
          hooks: {
            'astro:config:setup': ({ updateConfig }) => {
              updateConfig({
                vite: {
                  plugins: [vitePluginStarlightAutoSidebar(starlightConfig)],
                },
              })
            },
          },
        })
      },
    },
  }
}
