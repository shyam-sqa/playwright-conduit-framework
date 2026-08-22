import { test, expect } from '../fixtures/test.fixture';
import { ArticleInput } from '../models/article';
import { ArticlePage } from '../pages/article.page';

test('authenticated user can complete the article lifecycle', async ({ page, articleApi }) => {
  const articlePage = new ArticlePage(page);
  const article: ArticleInput = {
    title: `Playwright Article ${Date.now()}`,
    description: 'Test automation basics',
    body: 'This is a detailed article...',
  };
  const updatedArticle: ArticleInput = {
    title: `${article.title} Updated`,
    description: `${article.description} Updated`,
    body: `${article.body} Updated`,
  };

  await test.step('create an article through the UI', async () => {
    await articlePage.open();
    await articlePage.expectLoggedIn();
    await articlePage.createArticle(article);
    await articlePage.expectArticleVisible(article);
    articleApi.trackForCleanup(articlePage.getSlug());
  });

  await test.step('verify the created article through the API', async () => {
    const createdArticle = await articleApi.getArticle(articlePage.getSlug());
    expect(createdArticle).toMatchObject(article);
  });

  await test.step('edit the article and verify it through the UI and API', async () => {
    await articlePage.editArticle(updatedArticle);
    await articlePage.expectArticleVisible(updatedArticle);
    articleApi.trackForCleanup(articlePage.getSlug());
    const savedArticle = await articleApi.getArticle(articlePage.getSlug());
    expect(savedArticle).toMatchObject(updatedArticle);
  });

  await test.step('add a comment and delete the article', async () => {
    await articlePage.addComment('Useful automation article');
    await articlePage.expectComment('Useful automation article');
    await articlePage.deleteArticle();
  });
});
