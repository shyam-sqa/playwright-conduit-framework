import { APIRequestContext, APIResponse } from '@playwright/test';
import { LoginCredentials, RegistrationData, TestUser, UserResponse } from '../models/user';

export class AuthApi {
  constructor(private readonly apiContext: APIRequestContext) {}

  async register(user: RegistrationData): Promise<APIResponse> {
    return this.apiContext.post('/api/users/', { data: { user } });
  }

  async login(credentials: LoginCredentials): Promise<APIResponse> {
    return this.apiContext.post('/api/users/login', { data: { user: credentials } });
  }
}

export async function createUserApi(apiContext: APIRequestContext): Promise<TestUser> {
  const uniqueId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const username = `qa${uniqueId}`;
  const email = `${username}@test.com`;
  const password = 'Test12345678!';

  const response = await new AuthApi(apiContext).register({ email, password, username });

  if (response.status() !== 201) {
    throw new Error(
      `User creation failed (${response.status()} ${response.statusText()}): ${await response.text()}`,
    );
  }

  const { user } = (await response.json()) as UserResponse;
  if (!user?.token) {
    throw new Error('User creation response did not contain an authentication token');
  }

  return { ...user, password };
}
