export interface User {
  id: string;
  email: string;
  displayName?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UpdateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'password' | 'email'>;

export type GetUserData = Omit<User, 'password'>;

export type CreateUserData = Pick<User, 'email' | 'password'> & {
  confirmPassword: string;
};
