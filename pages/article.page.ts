import { Page, expect } from '@playwright/test';

export class ArticlePage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('https://conduit.bondaracademy.com/');
  }

  async createArticle(title: string) {
    await this.page.getByText('New Article').click();

    await this.page.getByPlaceholder('Article Title').fill(title);
    await this.page.getByPlaceholder("What's this article about?").fill('Test automation');
    await this.page.getByPlaceholder('Write your article (in markdown)').fill('Content');

    await this.page.getByRole('button', { name: 'Publish Article' }).click();
  }

  async expectArticleVisible(title: string) {
    await expect(this.page.getByText(title)).toBeVisible();
  }

  async expectLoggedIn() {
    await expect(this.page.getByText('New Article')).toBeVisible();
  }
}