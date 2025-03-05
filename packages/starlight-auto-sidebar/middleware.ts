import { defineRouteMiddleware } from '@astrojs/starlight/route-data'
import context from 'virtual:starlight-auto-sidebar/context'

import { updateSidebarItems } from './libs/sidebar'

export const onRequest = defineRouteMiddleware(async ({ locals }) => {
  const { starlightRoute } = locals
  const { sidebar } = starlightRoute

  starlightRoute.sidebar = await updateSidebarItems(sidebar, context)
})
