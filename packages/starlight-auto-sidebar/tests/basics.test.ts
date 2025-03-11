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
        items: [
          { label: 'sub-2/a' },
          { label: 'sub-2/b' },
          {
            label: 'sub-1',
            items: [{ label: 'sub-2/sub-1/a' }, { label: 'sub-2/sub-1/b' }],
          },
        ],
      },
      {
        label: 'sub-3 (modified)',
        items: [
          { label: 'sub-3/a' },
          { label: 'sub-3/b' },
          {
            label: 'sub-1',
            items: [{ label: 'sub-3/sub-1/a' }, { label: 'sub-3/sub-1/b' }],
          },
        ],
      },
      // `sub-4` and `sub-5` are both `hidden`.
    ])
  })

  test('updates the collapsed state of a directory', async ({ getPage }) => {
    const page = await getPage()
    await page.go()

    expect(await page.getSidebarGroupState(['updates'])).toBe('expanded')
    expect(await page.getSidebarGroupState(['updates', 'sub-3 (modified)'])).toBe('collapsed')
  })

  test('updates the collapsed state of a directory for collapsed an auto-generated group and its subgroups', async ({
    getPage,
  }) => {
    const page = await getPage()
    await page.go()

    expect(await page.getSidebarGroupState(['collapsed'])).toBe('collapsed')
    expect(await page.getSidebarGroupState(['collapsed', 'sub-1'])).toBe('collapsed')
    expect(await page.getSidebarGroupState(['collapsed', 'sub-2'])).toBe('expanded')
  })

  test('updates the collapsed state of a directory for an auto-generated group and its collapsed subgroups', async ({
    getPage,
  }) => {
    const page = await getPage()
    await page.go()

    expect(await page.getSidebarGroupState(['collapsed-subgroups'])).toBe('expanded')
    expect(await page.getSidebarGroupState(['collapsed-subgroups', 'sub-1'])).toBe('collapsed')
    expect(await page.getSidebarGroupState(['collapsed-subgroups', 'sub-2'])).toBe('expanded')
  })

  test('updates badges', async ({ getPage }) => {
    const page = await getPage()
    await page.go()

    expect(await page.getSidebarGroupBadge(['updates'])).toBeNull()
    expect(await page.getSidebarGroupBadge(['updates', 'sub-2'])).toMatchObject({ text: 'String', variant: 'default' })
    expect(await page.getSidebarGroupBadge(['updates', 'sub-2', 'sub-1'])).toMatchObject({
      text: 'Object',
      variant: 'danger',
    })
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
              // Manual`order` of 1 and sidebar label overridden in the file frontmatter.
              { label: 'sub-1/sub-1/c (modified)' },
              // Manual`order` of 2.
              {
                label: 'sub-1',
                // The `reverse-slug` sort is cascaded from the parent group.
                items: [{ label: 'sub-1/sub-1/sub-1/b' }, { label: 'sub-1/sub-1/sub-1/a' }],
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
          prev: { href: '/updates/sub-3/sub-1/b/', label: 'sub-3/sub-1/b' },
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
          // Prev link label overridden in the file frontmatter.
          prev: { href: '/sort-slug/sub-1/sub-1/b/', label: 'sub-1/sub-1/b (modified)' },
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
          // Next link label hidden in the file frontmatter.
          next: null,
        },
      },
      {
        url: '/sub-2/b/',
        expected: {
          prev: { href: '/sort-slug/sub-2/a/', label: 'sub-2/a' },
          next: { href: '/sort-reverse-slug/c/', label: 'c' },
        },
      },
    ])
  })

  test('sets prev/next links when sorting by `reverse-slug`', async ({ getPage }) => {
    const page = await getPage()

    await page.expectPrevNextLinks('sort-reverse-slug', [
      {
        url: '/c/',
        expected: {
          prev: { href: '/sort-slug/sub-2/b/', label: 'sub-2/b' },
          next: { href: '/sort-reverse-slug/sub-3/a/', label: 'sub-3/a' },
        },
      },
      {
        url: '/sub-3/a/',
        expected: {
          prev: { href: '/sort-reverse-slug/c/', label: 'c' },
          next: { href: '/sort-reverse-slug/sub-3/b/', label: 'sub-3/b' },
        },
      },
      {
        url: '/sub-3/b/',
        expected: {
          prev: { href: '/sort-reverse-slug/sub-3/a/', label: 'sub-3/a' },
          next: { href: '/sort-reverse-slug/b/', label: 'b' },
        },
      },
      {
        url: '/b/',
        expected: {
          prev: { href: '/sort-reverse-slug/sub-3/b/', label: 'sub-3/b' },
          next: { href: '/sort-reverse-slug/sub-2/a/', label: 'sub-2/a' },
        },
      },
      {
        url: '/sub-2/a/',
        expected: {
          prev: { href: '/sort-reverse-slug/b/', label: 'b' },
          next: { href: '/sort-reverse-slug/sub-2/b/', label: 'sub-2/b' },
        },
      },
      {
        url: '/sub-2/b/',
        expected: {
          prev: { href: '/sort-reverse-slug/sub-2/a/', label: 'sub-2/a' },
          next: { href: '/sort-reverse-slug/sub-1/a/', label: 'sub-1/a' },
        },
      },
      {
        url: '/sub-1/a/',
        expected: {
          prev: { href: '/sort-reverse-slug/sub-2/b/', label: 'sub-2/b' },
          next: { href: '/sort-reverse-slug/sub-1/b/', label: 'sub-1/b' },
        },
      },
      {
        url: '/sub-1/b/',
        expected: {
          prev: { href: '/sort-reverse-slug/sub-1/a/', label: 'sub-1/a' },
          // Sidebar label overridden in the file frontmatter.
          next: { href: '/sort-reverse-slug/sub-1/sub-1/c/', label: 'sub-1/sub-1/c (modified)' },
        },
      },
      {
        url: '/sub-1/sub-1/c/',
        expected: {
          prev: { href: '/sort-reverse-slug/sub-1/b/', label: 'sub-1/b' },
          next: { href: '/sort-reverse-slug/sub-1/sub-1/sub-1/b/', label: 'sub-1/sub-1/sub-1/b' },
        },
      },
      {
        url: '/sub-1/sub-1/sub-1/b/',
        expected: {
          // Sidebar label overridden in the file frontmatter.
          prev: { href: '/sort-reverse-slug/sub-1/sub-1/c/', label: 'sub-1/sub-1/c (modified)' },
          next: { href: '/sort-reverse-slug/sub-1/sub-1/sub-1/a/', label: 'sub-1/sub-1/sub-1/a' },
        },
      },
      {
        url: '/sub-1/sub-1/sub-1/a/',
        expected: {
          prev: { href: '/sort-reverse-slug/sub-1/sub-1/sub-1/b/', label: 'sub-1/sub-1/sub-1/b' },
          next: { href: '/sort-reverse-slug/sub-1/sub-1/b/', label: 'sub-1/sub-1/b' },
        },
      },
      {
        url: '/sub-1/sub-1/b/',
        expected: {
          prev: { href: '/sort-reverse-slug/sub-1/sub-1/sub-1/a/', label: 'sub-1/sub-1/sub-1/a' },
          next: { href: '/sort-reverse-slug/sub-1/sub-1/d/', label: 'sub-1/sub-1/d' },
        },
      },
      {
        url: '/sub-1/sub-1/d/',
        expected: {
          // Prev link label and href overridden in the file frontmatter.
          prev: { href: '/unrelated-page/', label: 'Unrelated Page (modified)' },
          next: { href: '/sort-reverse-slug/sub-1/sub-1/a/', label: 'sub-1/sub-1/a' },
        },
      },
      {
        url: '/sub-1/sub-1/a/',
        expected: {
          prev: { href: '/sort-reverse-slug/sub-1/sub-1/d/', label: 'sub-1/sub-1/d' },
          next: { href: '/sort-reverse-slug/a/', label: 'a' },
        },
      },
      {
        url: '/a/',
        expected: {
          prev: { href: '/sort-reverse-slug/sub-1/sub-1/a/', label: 'sub-1/sub-1/a' },
          // Last sidebar item.
          next: { href: '/collapsed/sub-1/a/', label: 'sub-1/a' },
        },
      },
    ])
  })
})

test.describe('applies depth limit to auto-generated sidebar groups', () => {
  test('applies a depth of 1 to the root directory', async ({ getPage }) => {
    const page = await getPage()
    await page.go()

    const items = await page.getSidebarGroupItems('depth-root-1')

    expect(items).toMatchSidebar([
      { label: 'a' },
      { label: 'b' },
      {
        label: 'sub-1',
        items: [{ label: 'sub-1/a' }, { label: 'sub-1/b' }],
      },
      {
        label: 'sub-2',
        items: [{ label: 'sub-2/a' }, { label: 'sub-2/b' }],
      },
    ])
  })

  test('applies a depth greater than 1 to the root directory', async ({ getPage }) => {
    const page = await getPage()
    await page.go()

    const items = await page.getSidebarGroupItems('depth-root-3')

    expect(items).toMatchSidebar([
      { label: 'a' },
      { label: 'b' },
      {
        label: 'sub-1',
        items: [
          { label: 'sub-1/a' },
          { label: 'sub-1/b' },
          {
            label: 'sub-1',
            items: [
              { label: 'sub-1/sub-1/a' },
              { label: 'sub-1/sub-1/b' },
              {
                label: 'sub-1',
                items: [{ label: 'sub-1/sub-1/sub-1/a' }, { label: 'sub-1/sub-1/sub-1/b' }],
              },
            ],
          },
        ],
      },
      {
        label: 'sub-2',
        items: [{ label: 'sub-2/a' }, { label: 'sub-2/b' }],
      },
    ])
  })

  test('applies depth limits to nested directories', async ({ getPage }) => {
    const page = await getPage()
    await page.go()

    const items = await page.getSidebarGroupItems('mixed-depth')

    expect(items).toMatchSidebar([
      { label: 'a' },
      { label: 'b' },
      // Depth limit of 2.
      {
        label: 'sub-1 (depth 2)',
        items: [
          { label: 'sub-1/a' },
          { label: 'sub-1/b' },
          {
            label: 'sub-1',
            items: [
              { label: 'sub-1/sub-1/a' },
              { label: 'sub-1/sub-1/b' },
              {
                label: 'sub-1',
                items: [{ label: 'sub-1/sub-1/sub-1/a' }, { label: 'sub-1/sub-1/sub-1/b' }],
              },
            ],
          },
        ],
      },
      {
        label: 'sub-2',
        items: [
          { label: 'sub-2/a' },
          { label: 'sub-2/b' },
          // Depth limit of 1.
          {
            label: 'sub-1 (depth 1)',
            items: [
              { label: 'sub-2/sub-1/a' },
              { label: 'sub-2/sub-1/b' },
              {
                label: 'sub-1',
                items: [{ label: 'sub-2/sub-1/sub-1/a' }, { label: 'sub-2/sub-1/sub-1/b' }],
              },
            ],
          },
        ],
      },
      {
        label: 'sub-3',
        items: [
          { label: 'sub-3/a' },
          { label: 'sub-3/b' },
          {
            label: 'sub-1',
            items: [
              { label: 'sub-3/sub-1/a' },
              { label: 'sub-3/sub-1/b' },
              // Depth limit of 1.
              {
                label: 'sub-1 (depth 1)',
                items: [
                  { label: 'sub-3/sub-1/sub-1/a' },
                  { label: 'sub-3/sub-1/sub-1/b' },
                  {
                    label: 'sub-1',
                    items: [{ label: 'sub-3/sub-1/sub-1/sub-1/a' }, { label: 'sub-3/sub-1/sub-1/sub-1/b' }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ])
  })
})

test.describe('cascades options to auto-generated sidebar groups when enabled', () => {
  test('cascades the `collapsed` option', async ({ getPage }) => {
    const page = await getPage()
    await page.go()

    expect(await page.getSidebarGroupState(['updates', 'sub-3 (modified)'])).toBe('collapsed')
    expect(await page.getSidebarGroupState(['updates', 'sub-3 (modified)', 'sub-1'])).toBe('collapsed')
  })
})
