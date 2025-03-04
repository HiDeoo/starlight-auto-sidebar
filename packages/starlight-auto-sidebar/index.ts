import type { StarlightPlugin } from '@astrojs/starlight/types'

export default function starlightAutoSidebar(): StarlightPlugin {
  return {
    name: 'starlight-auto-sidebar',
    hooks: {
      setup: ({ logger }) => {
        logger.info('starlight-auto-sidebar plugin loaded')
      },
    },
  }
}
