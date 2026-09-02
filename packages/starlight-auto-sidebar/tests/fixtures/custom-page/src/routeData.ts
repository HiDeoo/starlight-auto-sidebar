import { defineRouteMiddleware } from '@astrojs/starlight/route-data'

export const onRequest = defineRouteMiddleware((context) => {
  const { starlightRoute } = context.locals
  if (starlightRoute.id !== 'manual-a') return

  starlightRoute.sidebar.unshift({
    attrs: {},
    badge: undefined,
    href: '/test/',
    isCurrent: false,
    label: 'Test',
    type: 'link',
  })
})
