import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightAutoSidebar from 'starlight-auto-sidebar'

export default defineConfig({
  integrations: [
    starlight({
      title: 'No Pagination',
      pagination: false,
      sidebar: [
        { slug: '', label: 'Home' },
        { label: 'updates', autogenerate: { directory: 'updates' } },
      ],
      pagefind: false,
      plugins: [starlightAutoSidebar()],
    }),
  ],
})
