import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightAutoSidebar from 'starlight-auto-sidebar'

export default defineConfig({
  integrations: [
    starlight({
      title: 'Basics',
      sidebar: [
        { slug: '', label: 'Home' },
        { label: 'updates', autogenerate: { directory: 'updates' } },
        { label: 'sort-slug', autogenerate: { directory: 'sort-slug' } },
        { label: 'sort-reverse-slug', autogenerate: { directory: 'sort-reverse-slug' } },
      ],
      pagefind: false,
      plugins: [starlightAutoSidebar()],
    }),
  ],
})
