import type { Locator, Page } from '@playwright/test'

// TODO(HiDeoo) Show test disclaimer in test pages

export class DocPage {
  constructor(public readonly page: Page) {}

  go() {
    return this.page.goto('/')
  }

  getSidebarGroupItems(label: string) {
    return this.#getSidebarGroupItemFromList(this.#getSidebarGroupList(label))
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
