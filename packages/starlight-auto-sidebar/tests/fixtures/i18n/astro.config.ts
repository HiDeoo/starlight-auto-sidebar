import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightAutoSidebar from 'starlight-auto-sidebar'

export default defineConfig({
  integrations: [
    starlight({
      locales: {
        root: { label: 'English', lang: 'en' },
        ja: { label: '日本語', lang: 'ja' },
        fr: { label: 'Français', lang: 'fr' },
      },
      title: 'i18n',
      sidebar: [
        { label: 'updates', autogenerate: { directory: 'updates' } },
        { label: 'mixed-sort', autogenerate: { directory: 'mixed-sort' } },
      ],
      pagefind: false,
      plugins: [starlightAutoSidebar()],
    }),
  ],
})
