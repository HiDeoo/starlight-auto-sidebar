import { defineRouteMiddleware } from '@astrojs/starlight/route-data'
import context from 'virtual:starlight-auto-sidebar/context'

import { updatePageSidebar } from './libs/sidebar'

export const onRequest = defineRouteMiddleware(async ({ locals }) => {
  const { starlightRoute } = locals

  const { sidebar, prev, next } = await updatePageSidebar(starlightRoute.sidebar, context)

  starlightRoute.sidebar = sidebar

  if (prev) starlightRoute.pagination.prev = prev
  if (next) starlightRoute.pagination.next = next
})
