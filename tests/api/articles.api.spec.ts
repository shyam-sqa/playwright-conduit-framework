import { ArticleApi } from '../../api/article.api';
import { test, expect } from '../../fixtures/test.fixture';

test('authenticated user can create and retrieve an article @api @smoke', async ({
  articleApi,
}) => {
  const input = {
    title: `API Article ${Date.now()}`,
    description: 'API contract verification',
    body: 'Created and retrieved through the Conduit API',
    tagList: ['playwright', 'api'],
  };

  const created = await articleApi.createTrackedArticle(input);
  expect(created).toMatchObject({
    title: input.title,
    description: input.description,
    body: input.body,
  });
  expect(created.tagList.map((tag) => tag.toLowerCase())).toEqual(
    input.tagList.map((tag) => tag.toLowerCase()),
  );
  expect(created.slug).toEqual(expect.any(String));

  const retrieved = await articleApi.getArticle(created.slug);
  expect(retrieved).toMatchObject({
    title: input.title,
    description: input.description,
    body: input.body,
  });
  expect(retrieved.tagList.map((tag) => tag.toLowerCase())).toEqual(
    input.tagList.map((tag) => tag.toLowerCase()),
  );
});

test('anonymous user cannot create an article @api @regression', async ({
  anonymousApiContext,
}) => {
  const response = await new ArticleApi(anonymousApiContext).createArticleRequest({
    title: 'Unauthorized article',
    description: 'Negative authorization test',
    body: 'This request must be rejected',
  });
  expect(response.status()).toBe(401);
});

test('article creation rejects missing required fields @api @regression', async ({
  apiContext,
}) => {
  const response = await apiContext.post('/api/articles/', {
    data: { article: { title: '', description: '', body: '' } },
  });
  expect(response.status()).toBe(422);
  await expect(response.json()).resolves.toMatchObject({ errors: expect.any(Object) });
});

test('missing article returns not found @api @regression', async ({ anonymousApiContext }) => {
  const response = await anonymousApiContext.get('/api/articles/not-a-real-article-slug');
  expect(response.status()).toBe(404);
});
