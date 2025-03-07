import type { StarlightPlugin } from '@astrojs/starlight/types'

import { getProjectMetadata, setupMetadataWatcher, type MetadataWatcher } from './libs/metadata'
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

        let metadataWatcher: MetadataWatcher | undefined

        addIntegration({
          name: 'starlight-auto-sidebar-integration',
          hooks: {
            'astro:config:setup': async ({ updateConfig }) => {
              const contentDir = new URL(`content/docs/`, astroConfig.srcDir)
              const metadata = await getProjectMetadata(contentDir, sidebar)

              if (command === 'dev') {
                metadataWatcher = await setupMetadataWatcher(astroConfig.root, contentDir, metadata)
              }

              updateConfig({
                vite: {
                  plugins: [vitePluginStarlightAutoSidebar(starlightConfig, contentDir, metadata)],
                },
              })
            },
            'astro:server:done': async () => {
              await metadataWatcher?.unsubscribe()
            },
          },
        })
      },
    },
  }
}
