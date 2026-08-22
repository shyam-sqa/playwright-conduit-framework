import { AuthApi } from '../../api/auth.api';
import { test, expect } from '../../fixtures/test.fixture';

test('user can authenticate with valid credentials @api @smoke', async ({
  anonymousApiContext,
  user,
}) => {
  const response = await new AuthApi(anonymousApiContext).login(user);
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.user).toMatchObject({ email: user.email, username: user.username });
  expect(body.user.token).toEqual(expect.any(String));
});

test('authentication rejects an invalid password @api @regression', async ({
  anonymousApiContext,
  user,
}) => {
  const response = await new AuthApi(anonymousApiContext).login({
    email: user.email,
    password: 'wrong-password',
  });
  expect(response.status()).toBe(403);
  await expect(response.json()).resolves.toMatchObject({ errors: expect.any(Object) });
});

test('registration rejects an existing email and username @api @regression', async ({
  anonymousApiContext,
  user,
}) => {
  const response = await new AuthApi(anonymousApiContext).register(user);
  expect(response.status()).toBe(422);
  await expect(response.json()).resolves.toMatchObject({ errors: expect.any(Object) });
});
