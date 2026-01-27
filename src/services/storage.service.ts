import type { UserInfo } from '../models/api.model';

const KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
};

export const storageService = {
  setToken: (token: string) =>
    typeof window !== 'undefined' && localStorage.setItem(KEYS.TOKEN, token),
  getToken: () =>
    typeof window !== 'undefined' ? localStorage.getItem(KEYS.TOKEN) : null,

  setRefreshToken: (token: string) =>
    typeof window !== 'undefined' &&
    localStorage.setItem(KEYS.REFRESH_TOKEN, token),
  getRefreshToken: () =>
    typeof window !== 'undefined'
      ? localStorage.getItem(KEYS.REFRESH_TOKEN)
      : null,

  setUserInfo: (user: UserInfo) =>
    typeof window !== 'undefined' &&
    localStorage.setItem(KEYS.USER_INFO, JSON.stringify(user)),
  getUserInfo: (): UserInfo | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(KEYS.USER_INFO);
    return user ? (JSON.parse(user) as UserInfo) : null;
  },
  clear: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(KEYS.TOKEN);
      localStorage.removeItem(KEYS.REFRESH_TOKEN);
      localStorage.removeItem(KEYS.USER_INFO);
    }
  },
};
