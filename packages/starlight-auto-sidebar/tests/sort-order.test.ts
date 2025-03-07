import { expect, test } from './test'

test('orders and sorts by `slug`', async ({ docPage }) => {
  await docPage.go()

  const items = await docPage.getSidebarGroupItems('sort-slug')

  expect(items).toMatchSidebar([
    // Manual `order` of 1.
    { label: 'c' },
    // Manual`order` of 2.
    {
      label: 'sub-3',
      items: [{ label: 'sub-3/a' }, { label: 'sub-3/b' }],
    },
    // Manual`order` of 3.
    { label: 'b' },
    { label: 'a' },
    {
      label: 'z-sub-1 (modified)',
      items: [
        // Manual `order` of 1.
        { label: 'sub-1/b' },
        // Manual `order` of 2.
        {
          label: 'sub-1',
          items: [
            // Manual`order` of 1.
            { label: 'sub-1/sub-1/c' },
            // Manual`order` of 2.
            { label: 'sub-1/sub-1/b' },
            { label: 'sub-1/sub-1/a' },
            { label: 'sub-1/sub-1/d' },
          ],
        },
        { label: 'sub-1/a' },
      ],
    },
    {
      label: 'sub-2',
      items: [{ label: 'sub-2/a' }, { label: 'sub-2/b' }],
    },
  ])
})

test('orders and sorts by `reverse-slug`', async ({ docPage }) => {
  await docPage.go()

  const items = await docPage.getSidebarGroupItems('sort-reverse-slug')

  expect(items).toMatchSidebar([
    // Manual`order` of 1.
    { label: 'c' },
    // Manual`order` of 2.
    {
      label: 'sub-3',
      items: [{ label: 'sub-3/a' }, { label: 'sub-3/b' }],
    },
    // Manual`order` of 3.
    { label: 'b' },
    {
      label: 'sub-2',
      items: [{ label: 'sub-2/a' }, { label: 'sub-2/b' }],
    },
    {
      label: 'z-sub-1 (modified)',
      items: [
        { label: 'sub-1/a' },
        { label: 'sub-1/b' },
        {
          label: 'sub-1',
          items: [
            // Manual`order` of 1.
            { label: 'sub-1/sub-1/c' },
            // Manual`order` of 2.
            {
              label: 'sub-1',
              items: [{ label: 'sub-1/sub-1/sub-1/a' }, { label: 'sub-1/sub-1/sub-1/b' }],
            },
            // Manual`order` of 3.
            { label: 'sub-1/sub-1/b' },
            { label: 'sub-1/sub-1/d' },
            { label: 'sub-1/sub-1/a' },
          ],
        },
      ],
    },
    { label: 'a' },
  ])
})
