import { expect, Locator, Page } from '@playwright/test';
import { ArticleInput } from '../models/article';

export class ArticlePage {
  private readonly articleContent: Locator;
  private readonly articleTitle: Locator;
  private readonly commentInput: Locator;

  constructor(private readonly page: Page) {
    this.articleContent = page.locator('.article-content');
    this.articleTitle = page.locator('.article-page h1');
    this.commentInput = page.getByPlaceholder('Write a comment...');
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async createArticle(article: ArticleInput): Promise<void> {
    await this.page.getByRole('link', { name: 'New Article' }).click();
    await this.fillEditor(article);
    await this.publishArticle();
  }

  async editArticle(article: ArticleInput): Promise<void> {
    await this.primaryArticleActions().getByRole('link', { name: 'Edit Article' }).click();
    await this.fillEditor(article);
    await this.publishArticle();
  }

  async addComment(comment: string): Promise<void> {
    await this.commentInput.fill(comment);
    await this.page.getByRole('button', { name: 'Post Comment' }).click();
  }

  async expectComment(comment: string): Promise<void> {
    await expect(this.page.locator('.card-text').filter({ hasText: comment })).toBeVisible();
  }

  async deleteArticle(): Promise<void> {
    await this.primaryArticleActions().getByRole('button', { name: 'Delete Article' }).click();
    await expect(this.page).toHaveURL('/');
  }

  async expectArticleVisible(article: Pick<ArticleInput, 'title' | 'body'>): Promise<void> {
    await expect(this.articleTitle).toHaveText(article.title);
    await expect(this.articleContent).toContainText(article.body);
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.page.getByRole('link', { name: 'New Article' })).toBeVisible();
  }

  getSlug(): string {
    const pathname = new URL(this.page.url()).pathname;
    const slug = pathname.split('/').filter(Boolean).at(-1);
    if (!slug) throw new Error(`Unable to read article slug from URL: ${this.page.url()}`);
    return slug;
  }

  private primaryArticleActions(): Locator {
    return this.page.locator('.article-meta').first();
  }

  private async fillEditor(article: ArticleInput): Promise<void> {
    await this.page.getByPlaceholder('Article Title').fill(article.title);
    await this.page.getByPlaceholder("What's this article about?").fill(article.description);
    await this.page.getByPlaceholder('Write your article (in markdown)').fill(article.body);

    for (const tag of article.tagList ?? []) {
      await this.page.getByPlaceholder('Enter tags').fill(tag);
      await this.page.getByPlaceholder('Enter tags').press('Enter');
    }
  }

  private async publishArticle(): Promise<void> {
    await this.page.getByRole('button', { name: 'Publish Article' }).click();
    await this.page.waitForURL('**/article/**');
  }
}
