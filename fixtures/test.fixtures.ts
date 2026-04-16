import { test as base } from '@playwright/test';
import { createUserAPI } from '../api/auth.api';

type TestFixtures = {
  authToken: string;
};

export const test = base.extend<TestFixtures>({
  authToken: async ({}, use) => {
    const user = await createUserAPI();

    await use(user.token);
  },
});

export { expect } from '@playwright/test';