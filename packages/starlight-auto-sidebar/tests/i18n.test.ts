import { expect, testFactory } from './test'

const test = testFactory('i18n')

test.describe('updates auto-generated sidebar groups', () => {
  test('uses metadata for the current locale', async ({ getPage }) => {
    const page = await getPage()
    await page.goTo('/fr/')

    const items = await page.getSidebarGroupItems('updates')

    expect(items).toMatchSidebar([
      { label: 'a' },
      { label: 'b' },
      {
        label: 'sub-1 (modifié)',
        items: [
          { label: 'sub-1/a' },
          { label: 'sub-1/b' },
          {
            label: 'sub-1/sub-1 (modifié)',
            items: [{ label: 'sub-1/sub-1/a' }, { label: 'sub-1/sub-1/b' }],
          },
        ],
      },
      {
        label: 'sub-2',
        items: [{ label: 'sub-2/a' }, { label: 'sub-2/b' }],
      },
    ])
  })

  test('fallbacks to the default locale metadata', async ({ getPage }) => {
    const page = await getPage()
    await page.goTo('/ja/')

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
    ])
  })
})

test.describe('sorts auto-generated sidebar groups', () => {
  test('uses metadata for the current locale', async ({ getPage }) => {
    const page = await getPage()
    await page.goTo('/fr/')

    const items = await page.getSidebarGroupItems('mixed-sort')

    expect(items).toMatchSidebar([
      // Manual `order` of 1.
      { label: 'c' },
      // Manual`order` of 2.
      {
        label: 'sub-2',
        items: [{ label: 'sub-2/a' }, { label: 'sub-2/b' }],
      },
      // Manual `order` of 3.
      {
        label: 'z-sub-1 (modifié)',
        // Sorted by `reverse-slug` for the current locale.
        items: [{ label: 'sub-1/b' }, { label: 'sub-1/a' }],
      },
      { label: 'a' },
      { label: 'b' },
    ])
  })

  test('fallbacks to the default locale metadata', async ({ getPage }) => {
    const page = await getPage()
    await page.goTo('/ja/')

    const items = await page.getSidebarGroupItems('mixed-sort')

    expect(items).toMatchSidebar([
      // Manual `order` of 1.
      { label: 'c' },
      // Manual`order` of 2.
      {
        label: 'z-sub-1 (modified)',
        items: [{ label: 'sub-1/a' }, { label: 'sub-1/b' }],
      },
      { label: 'a' },
      { label: 'b' },
      {
        label: 'sub-2',
        items: [{ label: 'sub-2/a' }, { label: 'sub-2/b' }],
      },
    ])
  })
})

test.describe('updates prev/next links of auto-generated sidebar group pages', () => {
  test('uses metadata for the current locale', async ({ getPage }) => {
    const page = await getPage()

    await page.expectPrevNextLinks(
      'mixed-sort',
      [
        {
          url: '/c/',
          expected: {
            prev: { href: '/fr/updates/sub-2/b/', label: 'sub-2/b' },
            next: { href: '/fr/mixed-sort/sub-2/a/', label: 'sub-2/a' },
          },
        },
        {
          url: '/sub-2/a/',
          expected: {
            prev: { href: '/fr/mixed-sort/c/', label: 'c' },
            next: { href: '/fr/mixed-sort/sub-2/b/', label: 'sub-2/b' },
          },
        },
        {
          url: '/sub-2/b/',
          expected: {
            prev: { href: '/fr/mixed-sort/sub-2/a/', label: 'sub-2/a' },
            next: { href: '/fr/mixed-sort/sub-1/b/', label: 'sub-1/b' },
          },
        },
        {
          url: '/sub-1/b/',
          expected: {
            prev: { href: '/fr/mixed-sort/sub-2/b/', label: 'sub-2/b' },
            next: { href: '/fr/mixed-sort/sub-1/a/', label: 'sub-1/a' },
          },
        },
        {
          url: '/sub-1/a/',
          expected: {
            // Prev link label hidden in the file frontmatter.
            prev: null,
            next: { href: '/fr/mixed-sort/a/', label: 'a' },
          },
        },
        {
          url: '/a/',
          expected: {
            prev: { href: '/fr/mixed-sort/sub-1/a/', label: 'sub-1/a' },
            next: { href: '/fr/mixed-sort/b/', label: 'b' },
          },
        },
        {
          url: '/b/',
          expected: {
            prev: { href: '/fr/mixed-sort/a/', label: 'a' },
            // Last sidebar item.
            next: null,
          },
        },
      ],
      'fr',
    )
  })

  test('fallbacks to the default locale metadata', async ({ getPage }) => {
    const page = await getPage()

    await page.expectPrevNextLinks(
      'mixed-sort',
      [
        {
          url: '/c/',
          expected: {
            prev: { href: '/ja/updates/sub-2/b/', label: 'sub-2/b' },
            next: { href: '/ja/mixed-sort/sub-1/a/', label: 'sub-1/a' },
          },
        },
        {
          url: '/sub-1/a/',
          expected: {
            prev: { href: '/ja/mixed-sort/c/', label: 'c' },
            next: { href: '/ja/mixed-sort/sub-1/b/', label: 'sub-1/b' },
          },
        },
        {
          url: '/sub-1/b/',
          expected: {
            prev: { href: '/ja/mixed-sort/sub-1/a/', label: 'sub-1/a' },
            next: { href: '/ja/mixed-sort/a/', label: 'a' },
          },
        },
        {
          url: '/a/',
          expected: {
            prev: { href: '/ja/mixed-sort/sub-1/b/', label: 'sub-1/b' },
            next: { href: '/ja/mixed-sort/b/', label: 'b' },
          },
        },
        {
          url: '/b/',
          expected: {
            prev: { href: '/ja/mixed-sort/a/', label: 'a' },
            next: { href: '/ja/mixed-sort/sub-2/a/', label: 'sub-2/a' },
          },
        },
        {
          url: '/sub-2/a/',
          expected: {
            prev: { href: '/ja/mixed-sort/b/', label: 'b' },
            // Prev link label hidden in the file frontmatter.
            next: null,
          },
        },
        {
          url: '/sub-2/b/',
          expected: {
            prev: { href: '/ja/mixed-sort/sub-2/a/', label: 'sub-2/a' },
            // Last sidebar item.
            next: null,
          },
        },
      ],
      'ja',
    )
  })
})
