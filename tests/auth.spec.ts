import { test } from '../fixtures/test.fixture';
import { AuthPage } from '../pages/auth.page';

test('registered user can sign in @smoke @regression @cross-browser', async ({
  anonymousPage,
  user,
}) => {
  const authPage = new AuthPage(anonymousPage);
  await authPage.openLogin();
  await authPage.login(user);
  await authPage.expectLoggedIn();
});

test('visitor can register a new account @smoke @regression', async ({ anonymousPage }) => {
  const uniqueId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const username = `ui${uniqueId}`;
  const authPage = new AuthPage(anonymousPage);

  await authPage.openRegistration();
  await authPage.register({
    username,
    email: `${username}@test.com`,
    password: 'Test12345678!',
  });
  await authPage.expectLoggedIn();
});

test('login rejects an unknown email @regression', async ({ anonymousPage }) => {
  const authPage = new AuthPage(anonymousPage);
  await authPage.openLogin();
  await authPage.login({
    email: `missing-${Date.now()}@test.com`,
    password: 'Test12345678!',
  });
  await authPage.expectError('email or password is invalid');
});

test('login rejects an incorrect password @regression', async ({ anonymousPage, user }) => {
  const authPage = new AuthPage(anonymousPage);
  await authPage.openLogin();
  await authPage.login({ email: user.email, password: 'incorrect-password' });
  await authPage.expectError('email or password is invalid');
});
