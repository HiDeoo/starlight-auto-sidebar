import { expect, test } from './test'

test('updates labels', async ({ docPage }) => {
  await docPage.go()

  const items = await docPage.getSidebarGroupItems('basics')

  expect(items).toMatchSidebar([
    { label: 'basics/a' },
    { label: 'basics/b' },
    {
      label: 'sub-1 (modified)',
      items: [
        { label: 'basics/sub-1/a' },
        { label: 'basics/sub-1/b' },
        {
          label: 'sub-1/sub-1 (modified)',
          items: [{ label: 'basics/sub-1/sub-1/a' }, { label: 'basics/sub-1/sub-1/b' }],
        },
      ],
    },
    {
      label: 'sub-2',
      items: [{ label: 'basics/sub-2/a' }, { label: 'basics/sub-2/b' }],
    },
    {
      label: 'sub-3 (modified)',
      items: [{ label: 'basics/sub-3/a' }, { label: 'basics/sub-3/b' }],
    },
  ])
})
