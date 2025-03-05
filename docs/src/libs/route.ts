import { defineRouteMiddleware } from '@astrojs/starlight/route-data'

export const onRequest = defineRouteMiddleware((context) => {
  if (process.env['NODE_ENV'] !== 'production') return

  const { starlightRoute } = context.locals

  // TODO(HiDeoo) adjust when docs are ready
  // TODO(HiDeoo) comment the 3
  starlightRoute.sidebar = starlightRoute.sidebar.slice(0, 3)
})
