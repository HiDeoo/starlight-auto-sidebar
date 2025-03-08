import { defineRouteMiddleware } from '@astrojs/starlight/route-data'
import context from 'virtual:starlight-auto-sidebar/context'

import { getProjectMetadata } from './libs/metadata'
import { updatePageSidebar } from './libs/sidebar'

export const onRequest = defineRouteMiddleware(async ({ locals }) => {
  const { starlightRoute } = locals

  const metadata = await getProjectMetadata(context.sidebar)
  const { sidebar, prev, next } = await updatePageSidebar(starlightRoute.sidebar, metadata, context)

  starlightRoute.sidebar = sidebar

  if (prev) starlightRoute.pagination.prev = prev
  if (next) starlightRoute.pagination.next = next
})
