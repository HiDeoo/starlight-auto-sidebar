import type { DocPage } from './fixtures/DocPage'
import { expect, test, type TestPrevNextLink } from './test'

test('sets prev/next links when sorting by `slug`', async ({ docPage }) => {
  await expectPrevNextLinks(docPage, 'sort-slug', [
    {
      page: '/c/',
      expected: {
        // TODO(HiDeoo) test prev (which is in another fixture/group)
        // prev: { href: '/sub-3/b/', label: 'sub-3/b' },
        next: { href: '/sub-3/a/', label: 'sub-3/a' },
      },
    },
    {
      page: '/sub-3/a/',
      expected: {
        prev: { href: '/c/', label: 'c' },
        next: { href: '/sub-3/b/', label: 'sub-3/b' },
      },
    },
    {
      page: '/sub-3/b/',
      expected: {
        prev: { href: '/sub-3/a/', label: 'sub-3/a' },
        next: { href: '/b/', label: 'b' },
      },
    },
    {
      page: '/b/',
      expected: {
        prev: { href: '/sub-3/b/', label: 'sub-3/b' },
        next: { href: '/a/', label: 'a' },
      },
    },
    {
      page: '/a/',
      expected: {
        prev: { href: '/b/', label: 'b' },
        next: { href: '/sub-1/b/', label: 'sub-1/b' },
      },
    },
    {
      page: '/sub-1/b/',
      expected: {
        prev: { href: '/a/', label: 'a' },
        next: { href: '/sub-1/sub-1/c/', label: 'sub-1/sub-1/c' },
      },
    },
    {
      page: '/sub-1/sub-1/c/',
      expected: {
        prev: { href: '/sub-1/b/', label: 'sub-1/b' },
        next: { href: '/sub-1/sub-1/b/', label: 'sub-1/sub-1/b' },
      },
    },
    {
      page: '/sub-1/sub-1/b/',
      expected: {
        prev: { href: '/sub-1/sub-1/c/', label: 'sub-1/sub-1/c' },
        next: { href: '/sub-1/sub-1/a/', label: 'sub-1/sub-1/a' },
      },
    },
    {
      page: '/sub-1/sub-1/a/',
      expected: {
        prev: { href: '/sub-1/sub-1/b/', label: 'sub-1/sub-1/b' },
        next: { href: '/sub-1/sub-1/d/', label: 'sub-1/sub-1/d' },
      },
    },
    {
      page: '/sub-1/sub-1/d/',
      expected: {
        prev: { href: '/sub-1/sub-1/a/', label: 'sub-1/sub-1/a' },
        next: { href: '/sub-1/a/', label: 'sub-1/a' },
      },
    },
    {
      page: '/sub-1/a/',
      expected: {
        prev: { href: '/sub-1/sub-1/d/', label: 'sub-1/sub-1/d' },
        next: { href: '/sub-2/a/', label: 'sub-2/a' },
      },
    },
    {
      page: '/sub-2/a/',
      expected: {
        prev: { href: '/sub-1/a/', label: 'sub-1/a' },
        next: { href: '/sub-2/b/', label: 'sub-2/b' },
      },
    },
    {
      page: '/sub-2/b/',
      expected: {
        prev: { href: '/sub-2/a/', label: 'sub-2/a' },
        // TODO(HiDeoo) test prev (which is in another fixture/group)
        // next: { href: '/sub-3/b/', label: 'sub-3/b' },
      },
    },
  ])
})

// TODO(HiDeoo)
// test('sets prev/next links when sorting by `reverse-slug`', async ({ docPage }) => {
//   await docPage.go()

//   const items = await docPage.getSidebarGroupItems('sort-reverse-slug')

//   expect(items).toMatchSidebar([
//     // Manual`order` of 1.
//     { label: 'c' },
//     // Manual`order` of 2.
//     {
//       label: 'sub-3',
//       items: [{ label: 'sub-3/a' }, { label: 'sub-3/b' }],
//     },
//     // Manual`order` of 3.
//     { label: 'b' },
//     {
//       label: 'sub-2',
//       items: [{ label: 'sub-2/a' }, { label: 'sub-2/b' }],
//     },
//     {
//       label: 'z-sub-1 (modified)',
//       items: [
//         { label: 'sub-1/a' },
//         { label: 'sub-1/b' },
//         {
//           label: 'sub-1',
//           items: [
//             // Manual`order` of 1.
//             { label: 'sub-1/sub-1/c' },
//             // Manual`order` of 2.
//             {
//               label: 'sub-1',
//               items: [{ label: 'sub-1/sub-1/sub-1/a' }, { label: 'sub-1/sub-1/sub-1/b' }],
//             },
//             // Manual`order` of 3.
//             { label: 'sub-1/sub-1/b' },
//             { label: 'sub-1/sub-1/d' },
//             { label: 'sub-1/sub-1/a' },
//           ],
//         },
//       ],
//     },
//     { label: 'a' },
//   ])
// })

async function expectPrevNextLinks(docPage: DocPage, fixture: string, assertions: PrevNextAssertions) {
  for (const { page, expected } of assertions) {
    await docPage.gotoFixture(fixture, page)

    if (expected.prev) {
      const prev = await docPage.getPrevNextLink('prev')
      expect(prev).toEqual(formatExpectation(fixture, expected.prev))
    }

    if (expected.next) {
      const next = await docPage.getPrevNextLink('next')
      expect(next).toEqual(formatExpectation(fixture, expected.next))
    }
  }
}

function formatExpectation(fixture: string, { href, label }: TestPrevNextLink) {
  return { href: `/tests/${fixture}${href}`, label }
}

type PrevNextAssertions = {
  page: string
  expected: {
    prev?: TestPrevNextLink
    next?: TestPrevNextLink
  }
}[]
