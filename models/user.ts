export type TestUser = {
  token: string;
  username: string;
  email: string;
  password: string;
};

export type UserResponse = {
  user: TestUser;
};
