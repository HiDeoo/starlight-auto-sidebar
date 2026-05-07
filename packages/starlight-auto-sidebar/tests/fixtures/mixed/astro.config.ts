import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightAutoSidebar from 'starlight-auto-sidebar'

export default defineConfig({
  integrations: [
    starlight({
      title: 'Mixed',
      sidebar: [
        { slug: '', label: 'Home' },
        { autogenerate: { directory: 'root-auto' } },
        {
          label: 'Mixed',
          items: [
            { slug: 'manual-before', label: 'Manual Before' },
            { autogenerate: { directory: 'mixed-auto' } },
            { slug: 'manual-after', label: 'Manual After' },
          ],
        },
        {
          label: 'Adjacent',
          items: [{ autogenerate: { directory: 'adjacent-a' } }, { autogenerate: { directory: 'adjacent-b' } }],
        },
        { slug: 'last', label: 'Last' },
      ],
      pagefind: false,
      plugins: [starlightAutoSidebar()],
    }),
  ],
})
