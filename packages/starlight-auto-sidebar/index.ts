import type { StarlightPlugin } from '@astrojs/starlight/types'

export default function starlightAutoSidebar(): StarlightPlugin {
  return {
    name: 'starlight-auto-sidebar',
    hooks: {
      setup: ({ addRouteMiddleware }) => {
        addRouteMiddleware({ entrypoint: 'starlight-auto-sidebar/middleware', order: 'post' })
      },
    },
  }
}
