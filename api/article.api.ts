import { APIRequestContext, APIResponse } from '@playwright/test';
import { Article, ArticleInput, ArticleResponse } from '../models/article';

export class ArticleApi {
  constructor(private readonly apiContext: APIRequestContext) {}

  async getArticle(slug: string): Promise<Article> {
    const response = await this.apiContext.get(`/api/articles/${slug}`);
    await this.assertStatus(response, 200, `get article "${slug}"`);
    return ((await response.json()) as ArticleResponse).article;
  }

  async createArticle(input: ArticleInput): Promise<Article> {
    const response = await this.apiContext.post('/api/articles/', {
      data: { article: { ...input, tagList: input.tagList ?? [] } },
    });
    await this.assertStatus(response, 201, `create article "${input.title}"`);
    return ((await response.json()) as ArticleResponse).article;
  }

  async createArticleRequest(input: ArticleInput): Promise<APIResponse> {
    return this.apiContext.post('/api/articles/', {
      data: { article: { ...input, tagList: input.tagList ?? [] } },
    });
  }

  async deleteArticle(slug: string, allowNotFound = false): Promise<void> {
    const response = await this.apiContext.delete(`/api/articles/${slug}`);
    if (allowNotFound && response.status() === 404) return;
    await this.assertStatus(response, 204, `delete article "${slug}"`);
  }

  private async assertStatus(
    response: APIResponse,
    expectedStatus: number,
    operation: string,
  ): Promise<void> {
    if (response.status() === expectedStatus) return;

    const responseBody = await response.text();
    throw new Error(
      `Failed to ${operation}: expected status ${expectedStatus}, ` +
        `received ${response.status()} ${response.statusText()}. Body: ${responseBody}`,
    );
  }
}
