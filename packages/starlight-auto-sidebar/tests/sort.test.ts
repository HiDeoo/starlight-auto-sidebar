import { expect, test } from './test'

test('sorts by `reverse-slug`', async ({ docPage }) => {
  await docPage.go()

  const items = await docPage.getSidebarGroupItems('sort-reverse-slug')

  expect(items).toMatchSidebar([
    // Manually sorted entry with an `order` of 1.
    { label: 'sort-reverse-slug/c' },
    // Manually sorted entry with an `order` of 2.
    { label: 'sort-reverse-slug/b' },
    {
      label: 'sub-2',
      items: [{ label: 'sort-reverse-slug/sub-2/a' }, { label: 'sort-reverse-slug/sub-2/b' }],
    },
    {
      label: 'z-sub-1 (modified)',
      items: [
        {
          label: 'sub-1',
          items: [
            // Manually sorted entry with an `order` of 1.
            { label: 'sort-reverse-slug/sub-1/sub-1/c' },
            // Manually sorted entry with an `order` of 2.
            { label: 'sort-reverse-slug/sub-1/sub-1/b' },
            { label: 'sort-reverse-slug/sub-1/sub-1/d' },
            { label: 'sort-reverse-slug/sub-1/sub-1/a' },
          ],
        },
        { label: 'sort-reverse-slug/sub-1/a' },
        { label: 'sort-reverse-slug/sub-1/b' },
      ],
    },
    { label: 'sort-reverse-slug/a' },
  ])
})
