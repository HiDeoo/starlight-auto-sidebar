import { expect, test } from './test'

test('updates labels', async ({ docPage }) => {
  await docPage.go()

  const items = await docPage.getSidebarGroupItems('basics')

  expect(items).toMatchSidebar([
    { label: 'a' },
    { label: 'b' },
    {
      label: 'sub-1 (modified)',
      items: [
        { label: 'sub-1/a' },
        { label: 'sub-1/b' },
        {
          label: 'sub-1/sub-1 (modified)',
          items: [{ label: 'sub-1/sub-1/a' }, { label: 'sub-1/sub-1/b' }],
        },
      ],
    },
    {
      label: 'sub-2',
      items: [{ label: 'sub-2/a' }, { label: 'sub-2/b' }],
    },
    {
      label: 'sub-3 (modified)',
      items: [{ label: 'sub-3/a' }, { label: 'sub-3/b' }],
    },
  ])
})
