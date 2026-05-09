import { test as base, request, APIRequestContext, Page } from '@playwright/test';
import { createUserAPI } from '../api/auth.api';

// type Fixtures = {
//   apiContext: APIRequestContext;
//   page: Page;
// };

// export const test = base.extend<Fixtures>({
  
//   apiContext: async ({}, use) => {
//     const apiContext = await request.newContext({
//       baseURL: 'https://conduit-api.bondaracademy.com',
//     });

//     await use(apiContext);
//     await apiContext.dispose();
//   },

//   page: async ({ page, apiContext }, use) => {
//     const user = await createUserAPI(apiContext);

//     await page.addInitScript((token: string) => {
//       localStorage.setItem('jwtToken', token);
//     }, user.token);

//     await use(page);
//   },

// });

// export { expect } from '@playwright/test';

type User = {
  token: string;
  username: string;
  email: string;
};

type Fixtures = {
  apiContext: APIRequestContext;
  user: User;
  page: Page;
};

export const test = base.extend<Fixtures>({

  user: async ({}, use) => {
    const context = await request.newContext({
      baseURL: 'https://conduit-api.bondaracademy.com',
    });
    const user = await createUserAPI(context);
    await use(user);
    await context.dispose()
  },

  apiContext: async ({ user }, use) => {
    const apiContext = await request.newContext({
      baseURL: 'https://conduit-api.bondaracademy.com',
      extraHTTPHeaders: {
        Authorization: `Token ${user.token}`,
      },
    })
    await use(apiContext);
    await apiContext.dispose();
  },
  page: async ({ page, user }, use) => {
    await page.addInitScript((token: string) => {
      localStorage.setItem('jwtToken', token)
    }, user.token)
    await use(page)
  },

});

export { expect } from '@playwright/test'