export type TestUser = {
  token: string;
  username: string;
  email: string;
  password: string;
};

export type LoginCredentials = Pick<TestUser, 'email' | 'password'>;

export type RegistrationData = Pick<TestUser, 'email' | 'password' | 'username'>;

export type UserResponse = {
  user: TestUser;
};
