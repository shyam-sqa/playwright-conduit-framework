import { APIRequestContext, Page, request, test as base } from '@playwright/test';
import { ArticleApi } from '../api/article.api';
import { createUserApi } from '../api/auth.api';
import { environment } from '../config/environment';
import { Article, ArticleInput } from '../models/article';
import { TestUser } from '../models/user';

type TrackedArticleApi = ArticleApi & {
  createTrackedArticle(input: ArticleInput): Promise<Article>;
  trackForCleanup(slug: string): void;
};

type Fixtures = {
  apiContext: APIRequestContext;
  articleApi: TrackedArticleApi;
  user: TestUser;
  page: Page;
};

export const test = base.extend<Fixtures>({
  user: async ({}, use) => {
    const context = await request.newContext({ baseURL: environment.apiBaseUrl });
    try {
      await use(await createUserApi(context));
    } finally {
      await context.dispose();
    }
  },

  apiContext: async ({ user }, use) => {
    const context = await request.newContext({
      baseURL: environment.apiBaseUrl,
      extraHTTPHeaders: { Authorization: `Token ${user.token}` },
    });
    try {
      await use(context);
    } finally {
      await context.dispose();
    }
  },

  articleApi: async ({ apiContext }, use) => {
    const api = new ArticleApi(apiContext);
    const slugs = new Set<string>();
    const trackedApi = Object.assign(api, {
      async createTrackedArticle(input: ArticleInput): Promise<Article> {
        const article = await api.createArticle(input);
        slugs.add(article.slug);
        return article;
      },
      trackForCleanup(slug: string): void {
        slugs.add(slug);
      },
    });

    try {
      await use(trackedApi);
    } finally {
      for (const slug of [...slugs].reverse()) {
        await api.deleteArticle(slug, true);
      }
    }
  },

  page: async ({ page, user }, use) => {
    await page.addInitScript((token: string) => {
      localStorage.setItem('jwtToken', token);
    }, user.token);
    await use(page);
  },
});

export { expect } from '@playwright/test';
