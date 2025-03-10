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
        { label: 'collapsed', autogenerate: { directory: 'collapsed' }, collapsed: true },
        {
          label: 'collapsed-subgroups',
          autogenerate: { directory: 'collapsed-subgroups', collapsed: true },
          collapsed: false,
        },
      ],
      pagefind: false,
      plugins: [starlightAutoSidebar()],
    }),
  ],
})
