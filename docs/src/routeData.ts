import { defineRouteMiddleware } from '@astrojs/starlight/route-data'

import { isDemoPage } from './libs/demo'

export const onRequest = defineRouteMiddleware((context) => {
  if (isDemoPage(context.locals.starlightRoute.id)) {
    context.locals.starlightRoute.entry.data.pagefind = false
  }
})
