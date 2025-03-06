import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightAutoSidebar from 'starlight-auto-sidebar'

export default defineConfig({
  integrations: [
    starlight({
      components: {
        MarkdownContent: './src/components/MarkdownContent.astro',
      },
      description: '// TODO(HiDeoo)',
      editLink: {
        baseUrl: 'https://github.com/HiDeoo/starlight-auto-sidebar/edit/main/docs/',
      },
      plugins: [starlightAutoSidebar()],
      routeMiddleware: ['./src/libs/route.ts'],
      sidebar: [
        // TODO(HiDeoo)
        'guides/example',
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Example Guide', slug: 'guides/example' },
            'guides/example',
          ],
        },
        { label: 'Meteor Store', link: '/shop/' },
        {
          label: 'Tests',
          // TODO(HiDeoo)
          // collapsed: process.env['NODE_ENV'] !== 'test',
          items: [
            { label: 'basics', autogenerate: { directory: 'tests/basics' } },
            { label: 'sort-reverse-slug', autogenerate: { directory: 'tests/sort-reverse-slug' } },
          ],
        },
        // TODO(HiDeoo)
        // {
        //   label: 'Guides',
        //   items: [
        //     // Each item here is one entry in the navigation menu.
        //     { label: 'Example Guide', slug: 'guides/example' },
        //     {
        //       label: 'Reference 2',
        //       autogenerate: { directory: 'reference' },
        //     },
        //     'guides/example',
        //     {
        //       label: 'Reference Test',
        //       autogenerate: { directory: 'reference/test' },
        //     },
        //   ],
        // },
        // TODO(HiDeoo)
        // {
        //   label: 'Start Here',
        //   items: ['getting-started'],
        // },
        // {
        //   label: 'Guides',
        //   items: ['guides/actions', 'guides/i18n'],
        // },
        // TODO(HiDeoo)
        // {
        //   label: 'Resources',
        //   items: [{ label: 'Plugins and Tools', slug: 'resources/starlight' }],
        // },
        // TODO(HiDeoo)
        // {
        //   label: 'Demo',
        //   items: ['demo/video-guides', 'demo/video-courses'],
        // },
      ],
      social: {
        blueSky: 'https://bsky.app/profile/hideoo.dev',
        github: 'https://github.com/HiDeoo/starlight-auto-sidebar',
      },
      // TODO(HiDeoo) casing here
      title: 'Starlight Auto Sidebar',
    }),
  ],
  site: 'https://starlight-auto-sidebar.netlify.app/',
  trailingSlash: 'always',
})
