import { expect, testFactory } from './test'

const test = testFactory('custom-page')

test.describe('supports custom page sidebars', () => {
  test('updates a custom page sidebar', async ({ getPage }) => {
    const page = await getPage()
    await page.goTo('/custom/')

    const items = await page.getSidebarItems()

    expect(items).toMatchSidebar([{ label: 'manual-a' }, { label: 'b' }, { label: 'a' }, { label: 'manual-b' }])
  })
})
