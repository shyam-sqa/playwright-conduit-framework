import { test as base, Page } from '@playwright/test';
import { createUserAPI } from '../api/auth.api';

type TestFixtures = {
  page: Page;
};

export const test = base.extend<TestFixtures>({
  page: async ({page}, use) => {
    const user = await createUserAPI();
    await page.addInitScript((token:string) => {
      localStorage.setItem('jwtToken', token);
    }, user.token);
    await use(page);
  },
});

export { expect } from '@playwright/test';