import { defineRouteMiddleware } from '@astrojs/starlight/route-data'
import context from 'virtual:starlight-auto-sidebar/context'

import { updateSidebar } from './libs/sidebar'

export const onRequest = defineRouteMiddleware(async ({ locals }) => {
  const { starlightRoute } = locals
  const { sidebar } = starlightRoute

  // TODO(HiDeoo) handle non-configured sidebar
  if (!context.sidebar) return

  starlightRoute.sidebar = await updateSidebar(context.sidebar, sidebar)
})
