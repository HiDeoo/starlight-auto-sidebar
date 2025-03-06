import { expect, test } from './test'

test('sorts by `reverse-slug`', async ({ docPage }) => {
  await docPage.go()

  const items = await docPage.getSidebarGroupItems('sort-reverse-slug')

  expect(items).toMatchSidebar([
    {
      label: 'sub-2',
      items: [{ label: 'sort-reverse-slug/sub-2/a' }, { label: 'sort-reverse-slug/sub-2/b' }],
    },
    {
      label: 'z-sub-1 (modified)',
      items: [
        { label: 'sort-reverse-slug/sub-1/a' },
        { label: 'sort-reverse-slug/sub-1/b' },
        {
          label: 'sub-1',
          items: [{ label: 'sort-reverse-slug/sub-1/sub-1/b' }, { label: 'sort-reverse-slug/sub-1/sub-1/a' }],
        },
      ],
    },
    { label: 'sort-reverse-slug/b' },
    { label: 'sort-reverse-slug/a' },
  ])
})
