import { defineRouteMiddleware } from '@astrojs/starlight/route-data'
import config from 'virtual:starlight/user-config'

import { updateSidebar } from './libs/sidebar'

export const onRequest = defineRouteMiddleware((context) => {
  const { starlightRoute } = context.locals
  const { sidebar } = starlightRoute

  // TODO(HiDeoo) handle non-configured sidebar
  if (!config.sidebar) return

  starlightRoute.sidebar = updateSidebar(config.sidebar, sidebar)
})
