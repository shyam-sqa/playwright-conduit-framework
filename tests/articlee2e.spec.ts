import { test, expect } from '../libs/fixtures/test.fixtures';
import { articlePage } from '../libs/pages/article.page';
import { articleAPI } from '../libs/api/article.api';

  
test('Article lifecycle', async ({page}) => {

  const article = new articlePage(page);
  const title = `Playwright Article ${Date.now()}`;
  const about = "Test automation basics";
  const content = "This is a detailed article...";
  const updatedTitle = title + "Updated";
  const updatedAbout = about + "Updated";
  const updatedContent = content + "Updated";
  const comment = "Nice one";
  const api = new articleAPI()


  await article.open();

  await article.expectLoggedIn();

  await article.createArticle(title,about,content);
  await article.expectArticleVisible(title,content);

    const slug= article.getSlug()
    const response = await api.getArticle(slug)
    expect(response.ok()).toBeTruthy();
    const body = await response.json()
    expect(body.article.title).toEqual(title)
    expect(body.article.description).toEqual(about)
    expect(body.article.body).toEqual(content)
  


  await article.editArticle(updatedTitle,updatedAbout,updatedContent)
  await article.expectArticleVisible(updatedTitle,updatedContent);
  const upadtedslug = article.getSlug()
  const updatedResponse = await api.getArticle(upadtedslug)
  const updatedbody = await updatedResponse.json()
  expect((updatedResponse.ok())).toBeTruthy()
  expect(updatedbody.article.title).toEqual(updatedTitle)
  expect(updatedbody.article.description).toEqual(updatedAbout)
  expect(updatedbody.article.body).toEqual(updatedContent)

  await article.addComment(comment)
  await article.expectComment(comment)

  await article.deleteArticle()
  await expect(page).toHaveURL('https://conduit.bondaracademy.com/')

});

