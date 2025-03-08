import type { Locator, Page } from '@playwright/test'

import { stripLeadingSlash } from '../../libs/path'

export class DocPage {
  constructor(public readonly page: Page) {}

  go() {
    return this.page.goto('/')
  }

  goto(url: string) {
    return this.page.goto(url)
  }

  gotoFixture(fixture: string, url: string) {
    return this.page.goto(`/tests/${fixture}/${stripLeadingSlash(url)}`)
  }

  getSidebarGroupItems(label: string) {
    return this.#getSidebarGroupItemFromList(this.#getSidebarGroupList(label))
  }

  async getPrevNextLink(type: 'prev' | 'next'): Promise<TestPrevNextLink> {
    const link = this.page.locator(`a[rel="${type}"]`)
    const href = await link.getAttribute('href')
    const label = await link.locator('.link-title').textContent()

    if (!href || !label) {
      throw new Error(`Failed to find ${type} link`)
    }

    return { href, label }
  }

  get #sidebar() {
    return this.page.getByRole('navigation', { name: 'Main' }).locator('div.sidebar-content')
  }

  #getSidebarGroupList(label: string) {
    return this.#sidebar
      .getByRole('listitem')
      .locator(`details:has(summary > div > span:text-is("${label}"))`)
      .last()
      .locator('> ul')
  }

  async #getSidebarGroupItemFromList(groupList: Locator) {
    const items: TestSidebarItem[] = []

    for (const item of await groupList.locator('> li > :is(a, details)').all()) {
      const href = await item.getAttribute('href')

      if (href) {
        const label = await item.textContent()
        items.push({ label: label?.trim() })
      } else {
        const label = await item.locator(`> summary > div > span`).textContent()
        items.push({
          label: label?.trim(),
          items: await this.#getSidebarGroupItemFromList(item.locator('> ul')),
        })
      }
    }

    return items
  }
}

export type TestSidebarItem = TestSidebarItemGroup | TestSidebarItemLink

interface TestSidebarItemGroup {
  items: (TestSidebarItemGroup | TestSidebarItemLink)[]
  label: string | undefined
}

interface TestSidebarItemLink {
  label: string | undefined
}

export interface TestPrevNextLink {
  href: string
  label: string
}
