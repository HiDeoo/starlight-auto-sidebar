import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightAutoSidebar from 'starlight-auto-sidebar'

export default defineConfig({
  integrations: [
    starlight({
      title: 'Basics',
      sidebar: [
        { slug: '', label: 'Home' },
        { label: 'updates', items: [{ autogenerate: { directory: 'updates/' } }] },
        { label: 'sort-slug', items: [{ autogenerate: { directory: 'sort-slug' } }] },
        { label: 'sort-reverse-slug', items: [{ autogenerate: { directory: 'sort-reverse-slug' } }] },
        { label: 'collapsed', items: [{ autogenerate: { directory: 'collapsed' } }], collapsed: true },
        {
          label: 'collapsed-subgroups',
          items: [{ autogenerate: { directory: 'collapsed-subgroups', collapsed: true } }],
          collapsed: false,
        },
        { label: 'depth-root-1', items: [{ autogenerate: { directory: 'depth-root-1' } }] },
        { label: 'depth-root-3', items: [{ autogenerate: { directory: 'depth-root-3' } }] },
        { label: 'mixed-depth', items: [{ autogenerate: { directory: 'mixed-depth' } }] },
        { label: 'sort-label', items: [{ autogenerate: { directory: 'sort-label' } }] },
        { label: 'sort-reverse-label', items: [{ autogenerate: { directory: 'sort-reverse-label' } }] },
      ],
      pagefind: false,
      plugins: [starlightAutoSidebar()],
    }),
  ],
})
