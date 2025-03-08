import { expect as baseExpect, test as baseTest } from '@playwright/test'

import { DocPage, type TestSidebarItem } from './fixtures/DocPage'

export type { TestPrevNextLink } from './fixtures/DocPage'

export const expect = baseExpect.extend({
  toMatchSidebar(items: TestSidebarItem[], expected: TestSidebarItem[]) {
    let pass = false
    const assertionName = 'toMatchSidebar'
    let matcherResult: MatcherResult | undefined

    try {
      baseExpect(items).toMatchObject(expected)
      pass = true
    } catch (error: unknown) {
      if (isMatcherResultError(error)) matcherResult = error.matcherResult
    }

    return {
      expected,
      message: () =>
        matcherResult?.message ?? this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }),
      name: assertionName,
      pass,
    }
  },
})

function isMatcherResultError(error: unknown): error is MatcherResultError {
  return typeof error === 'object' && error !== null && 'matcherResult' in error
}

export const test = baseTest.extend<Fixtures>({
  docPage: async ({ page }, use) => {
    const docPage = new DocPage(page)

    await use(docPage)
  },
})

interface Fixtures {
  docPage: DocPage
}

interface MatcherResult {
  message: string
  pass: boolean
}

interface MatcherResultError {
  matcherResult: MatcherResult
}
