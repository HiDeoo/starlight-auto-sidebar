import { expect, testFactory } from './test'

const test = testFactory('basics')

test.describe('updates auto-generated sidebar groups', () => {
  test('updates labels', async ({ getPage }) => {
    const page = await getPage()
    await page.go()

    const items = await page.getSidebarGroupItems('updates')

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
})

test.describe('sorts auto-generated sidebar groups', () => {
  test('sorts by `slug`', async ({ getPage }) => {
    const page = await getPage()
    await page.go()

    const items = await page.getSidebarGroupItems('sort-slug')

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

  test('sorts by `reverse-slug`', async ({ getPage }) => {
    const page = await getPage()
    await page.go()

    const items = await page.getSidebarGroupItems('sort-reverse-slug')

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
})

test.describe('updates prev/next links of auto-generated sidebar group pages', () => {
  test('sets prev/next links when sorting by `slug`', async ({ getPage }) => {
    const page = await getPage()

    await page.expectPrevNextLinks('sort-slug', [
      {
        url: '/c/',
        expected: {
          // TODO(HiDeoo) test prev (which is in another fixture/group)
          // prev: { href: '/sub-3/b/', label: 'sub-3/b' },
          next: { href: '/sort-slug/sub-3/a/', label: 'sub-3/a' },
        },
      },
      {
        url: '/sub-3/a/',
        expected: {
          prev: { href: '/sort-slug/c/', label: 'c' },
          next: { href: '/sort-slug/sub-3/b/', label: 'sub-3/b' },
        },
      },
      {
        url: '/sub-3/b/',
        expected: {
          prev: { href: '/sort-slug/sub-3/a/', label: 'sub-3/a' },
          next: { href: '/sort-slug/b/', label: 'b' },
        },
      },
      {
        url: '/b/',
        expected: {
          prev: { href: '/sort-slug/sub-3/b/', label: 'sub-3/b' },
          next: { href: '/sort-slug/a/', label: 'a' },
        },
      },
      {
        url: '/a/',
        expected: {
          prev: { href: '/sort-slug/b/', label: 'b' },
          next: { href: '/sort-slug/sub-1/b/', label: 'sub-1/b' },
        },
      },
      {
        url: '/sub-1/b/',
        expected: {
          prev: { href: '/sort-slug/a/', label: 'a' },
          next: { href: '/sort-slug/sub-1/sub-1/c/', label: 'sub-1/sub-1/c' },
        },
      },
      {
        url: '/sub-1/sub-1/c/',
        expected: {
          prev: { href: '/sort-slug/sub-1/b/', label: 'sub-1/b' },
          next: { href: '/sort-slug/sub-1/sub-1/b/', label: 'sub-1/sub-1/b' },
        },
      },
      {
        url: '/sub-1/sub-1/b/',
        expected: {
          prev: { href: '/sort-slug/sub-1/sub-1/c/', label: 'sub-1/sub-1/c' },
          next: { href: '/sort-slug/sub-1/sub-1/a/', label: 'sub-1/sub-1/a' },
        },
      },
      {
        url: '/sub-1/sub-1/a/',
        expected: {
          prev: { href: '/sort-slug/sub-1/sub-1/b/', label: 'sub-1/sub-1/b' },
          next: { href: '/sort-slug/sub-1/sub-1/d/', label: 'sub-1/sub-1/d' },
        },
      },
      {
        url: '/sub-1/sub-1/d/',
        expected: {
          prev: { href: '/sort-slug/sub-1/sub-1/a/', label: 'sub-1/sub-1/a' },
          next: { href: '/sort-slug/sub-1/a/', label: 'sub-1/a' },
        },
      },
      {
        url: '/sub-1/a/',
        expected: {
          prev: { href: '/sort-slug/sub-1/sub-1/d/', label: 'sub-1/sub-1/d' },
          next: { href: '/sort-slug/sub-2/a/', label: 'sub-2/a' },
        },
      },
      {
        url: '/sub-2/a/',
        expected: {
          prev: { href: '/sort-slug/sub-1/a/', label: 'sub-1/a' },
          next: { href: '/sort-slug/sub-2/b/', label: 'sub-2/b' },
        },
      },
      {
        url: '/sub-2/b/',
        expected: {
          prev: { href: '/sort-slug/sub-2/a/', label: 'sub-2/a' },
          // TODO(HiDeoo) test prev (which is in another fixture/group)
          // next: { href: '/sub-3/b/', label: 'sub-3/b' },
        },
      },
    ])
  })

  // TODO(HiDeoo) test reverse-slug
})
