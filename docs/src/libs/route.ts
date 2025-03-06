import { defineRouteMiddleware } from '@astrojs/starlight/route-data'

export const onRequest = defineRouteMiddleware((context) => {
  const { starlightRoute } = context.locals
  const isTestContent = starlightRoute.id.startsWith('tests/')

  if (isTestContent) {
    starlightRoute.entry.data.pagefind = false
  }

  if (process.env['NODE_ENV'] !== 'production') {
    // TODO(HiDeoo) adjust when docs are ready
    // TODO(HiDeoo) comment the 3
    starlightRoute.sidebar = starlightRoute.sidebar.slice(0, 3)
  }
})
