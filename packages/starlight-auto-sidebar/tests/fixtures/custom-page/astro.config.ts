import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightAutoSidebar from 'starlight-auto-sidebar'

export default defineConfig({
  integrations: [
    starlight({
      title: 'Custom Page',
      sidebar: [{ slug: 'manual-a', label: 'manual-a' }],
      pagefind: false,
      plugins: [starlightAutoSidebar()],
    }),
  ],
})
