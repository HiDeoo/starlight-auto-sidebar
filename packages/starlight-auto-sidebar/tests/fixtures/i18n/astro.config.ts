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
        { label: 'sort-label', autogenerate: { directory: 'sort-label' } },
        { label: 'sort-reverse-label', autogenerate: { directory: 'sort-reverse-label' } },
      ],
      pagefind: false,
      plugins: [starlightAutoSidebar()],
    }),
  ],
})
