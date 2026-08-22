import { test } from '../fixtures/test.fixture';
import { HomePage } from '../pages/home.page';

test('user can filter the global feed by popular tags', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.open();

  const tags = await homePage.getPopularTags();
  for (const tag of tags) {
    await test.step(`filter articles by "${tag}"`, async () => {
      await homePage.filterByTag(tag);
      await homePage.expectEveryArticleTagged(tag);
    });
  }
});
