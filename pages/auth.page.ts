import { expect, Page } from '@playwright/test';
import { LoginCredentials, RegistrationData } from '../models/user';

export class AuthPage {
  constructor(private readonly page: Page) {}

  async openLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  async openRegistration(): Promise<void> {
    await this.page.goto('/register');
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.page.getByPlaceholder('Email').fill(credentials.email);
    await this.page.getByPlaceholder('Password').fill(credentials.password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }

  async register(user: RegistrationData): Promise<void> {
    await this.page.getByPlaceholder('Username').fill(user.username);
    await this.page.getByPlaceholder('Email').fill(user.email);
    await this.page.getByPlaceholder('Password').fill(user.password);
    await this.page.getByRole('button', { name: 'Sign up' }).click();
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.page).toHaveURL('/');
    await expect(this.page.getByRole('link', { name: 'New Article' })).toBeVisible();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.page.locator('.error-messages')).toContainText(message);
  }
}
