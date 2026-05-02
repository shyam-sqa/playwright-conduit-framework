import { Locator, Page, expect } from '@playwright/test';

export class articlePage {
  constructor(private page: Page) {
  }

  async open() {
    await this.page.goto('/');
  }

  async createArticle(title: string, about:string, content:string) {
    await this.page.getByText('New Article').click();

    await this.page.getByPlaceholder('Article Title').fill(title);
    await this.page.getByPlaceholder("What's this article about?").fill(about);
    await this.page.getByPlaceholder('Write your article (in markdown)').fill(content);

    await this.page.getByRole('button', { name: 'Publish Article' }).click();
  }

  async editArticle(updatedTitle:string, updatedAbout:string, updatedContent:string){
    await this.page.getByRole('link',{name:'Edit Article'}).nth(0).click()
    await this.page.getByPlaceholder('Article Title').fill(updatedTitle);
    await this.page.getByPlaceholder("What's this article about?").fill(updatedAbout);
    await this.page.getByPlaceholder('Write your article (in markdown)').fill(updatedContent)

    await this.page.getByRole('button', { name: 'Publish Article' }).click();
  }

  async addComment(comment:string){
    await this.page.getByPlaceholder('Write a comment...').fill(comment)
    await this.page.getByRole('button', { name: ' Post Comment ' }).click()
  }

  async expectComment(comment:string){
    await expect(this.page.locator('.card-text').nth(0)).toContainText(comment)
  }

  async deleteArticle(){
    await this.page.getByRole('button',{name:' Delete Article '}).nth(0).click()
  }


  async expectArticleVisible(title: string, content:string) {
    await this.page.waitForSelector('.article-page h1',{state:'visible'})
    await this.page.waitForSelector('.article-content',{state:'visible'})
    await expect(this.page.locator('.article-page h1')).toBeVisible();
    await expect(this.page.locator('.article-content')).toContainText(content)
  }

  async expectLoggedIn() {
    await expect(this.page.getByText('New Article')).toBeVisible();
  }

  getSlug(): string {
  const url = this.page.url();
  return url.split('/').pop() ?? '';  
}
}