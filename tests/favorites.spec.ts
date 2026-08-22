import { test, expect } from '../fixtures/test.fixture';
import { HomePage } from '../pages/home.page';

test('authenticated user can add and remove an article from favorites', async ({
  page,
  articleApi,
}) => {
  const article = await articleApi.createTrackedArticle({
    title: `Favorites Test ${Date.now()}`,
    description: 'Favorite behavior',
    body: 'Article created through the API for UI verification',
  });
  const homePage = new HomePage(page);

  await homePage.open();
  const initialCount = await homePage.getFavoritesCount(article.title);

  await homePage.addToFavorites(article.title);
  expect(await homePage.getFavoritesCount(article.title)).toBe(initialCount + 1);

  await homePage.removeFromFavorites(article.title);
  expect(await homePage.getFavoritesCount(article.title)).toBe(initialCount);
});
