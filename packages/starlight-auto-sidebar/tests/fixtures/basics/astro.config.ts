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
        { label: 'depth-root-1', autogenerate: { directory: 'depth-root-1' } },
        { label: 'depth-root-3', autogenerate: { directory: 'depth-root-3' } },
        { label: 'mixed-depth', autogenerate: { directory: 'mixed-depth' } },
      ],
      pagefind: false,
      plugins: [starlightAutoSidebar()],
    }),
  ],
})
