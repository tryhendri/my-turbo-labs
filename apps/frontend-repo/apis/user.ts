import { GetUserData, UpdateUserData } from '@my-turbo-labs/shared';
import { COOKIE_KEYS, cookieManager } from '../utils/cookies';

class UserService {
  static async updateUserData(id: string, data: UpdateUserData): Promise<GetUserData> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/update-user-data/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookieManager.getCookie(COOKIE_KEYS.AUTH_TOKEN)}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error(`Signup failed: ${response.statusText}`);
      }

      const res = await response.json();

      return res;
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  }

  static async getUserData(id: string): Promise<GetUserData> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/fetch-user-data?id=${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookieManager.getCookie(COOKIE_KEYS.AUTH_TOKEN)}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Signup failed: ${response.statusText}`);
      }

      const res = await response.json();

      return res;
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  }
}

export default UserService;
