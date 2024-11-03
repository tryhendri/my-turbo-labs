import Cookies from 'js-cookie';

export const COOKIE_KEYS = {
  AUTH_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
} as const;

class CookieManager {
  public setCookie(key: string, value: string, options?: Cookies.CookieAttributes): void {
    Cookies.set(key, value, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      ...options,
    });
  }

  public getCookie(key: string): string | undefined {
    return Cookies.get(key);
  }

  public removeCookie(key: string): void {
    Cookies.remove(key);
  }

  public setAuthCookies(
    authToken: string,
    refreshToken: string,
    userId: string,
    expiresInMinutes?: number,
  ): void {
    const options = expiresInMinutes
      ? { expires: new Date(Date.now() + expiresInMinutes * 60 * 1000) }
      : undefined;

    this.setCookie(COOKIE_KEYS.AUTH_TOKEN, authToken, options);
    this.setCookie(COOKIE_KEYS.REFRESH_TOKEN, refreshToken);
    this.setCookie(COOKIE_KEYS.USER_ID, userId, options);
  }

  public clearAuthCookies(): void {
    this.removeCookie(COOKIE_KEYS.AUTH_TOKEN);
    this.removeCookie(COOKIE_KEYS.REFRESH_TOKEN);
    this.removeCookie(COOKIE_KEYS.USER_ID);
  }
}

export const cookieManager = new CookieManager();
