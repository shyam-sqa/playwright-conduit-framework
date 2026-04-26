import { test as base, request, APIRequestContext, Page } from '@playwright/test';
import { createUserAPI } from '../api/auth.api';

type Fixtures = {
  apiContext: APIRequestContext;
  page: Page;
};

export const test = base.extend<Fixtures>({
  
  apiContext: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL: 'https://conduit-api.bondaracademy.com',
    });

    await use(apiContext);
    await apiContext.dispose();
  },

  page: async ({ page, apiContext }, use) => {
    const user = await createUserAPI(apiContext);

    await page.addInitScript((token: string) => {
      localStorage.setItem('jwtToken', token);
    }, user.token);

    await use(page);
  },

});

export { expect } from '@playwright/test';