import { test, expect } from '../fixtures/test.fixtures';
import { ArticlePage } from '../pages/article.page';

test('Create article', async ({ page, authToken }) => {
  const articlePage = new ArticlePage(page);

  await page.addInitScript((token) => {
    localStorage.setItem('jwtToken', token);
  }, authToken);

  await articlePage.open();

  await articlePage.expectLoggedIn();

  const title = `Playwright Article ${Date.now()}`;

  await articlePage.createArticle(title);

  await articlePage.expectArticleVisible(title);
});