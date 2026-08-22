import { expect, Locator, Page } from '@playwright/test';

export class HomePage {
  private readonly articlePreviews: Locator;
  private readonly popularTags: Locator;

  constructor(private readonly page: Page) {
    this.articlePreviews = page.locator('.article-preview');
    this.popularTags = page.locator('.sidebar').getByRole('link');
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async getPopularTags(): Promise<string[]> {
    await expect(this.page.getByText('Popular Tags', { exact: true })).toBeVisible();
    return this.popularTags.allInnerTexts();
  }

  async filterByTag(tag: string): Promise<void> {
    await this.popularTags.filter({ hasText: tag }).click();
    await expect(this.page.locator('.feed-toggle')).toContainText(tag);
  }

  async expectEveryArticleTagged(tag: string): Promise<void> {
    await expect(this.articlePreviews.first()).toBeVisible();
    const count = await this.articlePreviews.count();
    expect(count, `Expected at least one article for tag "${tag}"`).toBeGreaterThan(0);

    for (let index = 0; index < count; index++) {
      await expect(
        this.articlePreviews.nth(index).locator('.tag-list li'),
        `Article ${index + 1} should contain tag "${tag}"`,
      ).toContainText(tag);
    }
  }

  articleByTitle(title: string): Locator {
    return this.articlePreviews.filter({
      has: this.page.getByRole('heading', { name: title, exact: true }),
    });
  }

  async getFavoritesCount(title: string): Promise<number> {
    const button = this.favoriteButton(title);
    await expect(button).toBeVisible();
    return this.readCount(await button.innerText(), title);
  }

  async addToFavorites(title: string): Promise<void> {
    await this.toggleFavorite(title, true);
  }

  async removeFromFavorites(title: string): Promise<void> {
    await this.toggleFavorite(title, false);
  }

  private favoriteButton(title: string): Locator {
    return this.articleByTitle(title).locator('.article-meta button');
  }

  private async toggleFavorite(title: string, expectIncrease: boolean): Promise<void> {
    const button = this.favoriteButton(title);
    const beforeCount = await this.getFavoritesCount(title);
    await button.click();

    const currentCount = expect.poll(async () => this.readCount(await button.innerText(), title));
    if (expectIncrease) {
      await currentCount.toBe(beforeCount + 1);
    } else {
      await currentCount.toBe(beforeCount - 1);
    }
  }

  private readCount(text: string, title: string): number {
    const count = Number.parseInt(text.replace(/\D/g, ''), 10);
    if (Number.isNaN(count)) {
      throw new Error(`Unable to parse favorite count for article "${title}" from "${text}"`);
    }
    return count;
  }
}
