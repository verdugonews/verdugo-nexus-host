export const API_ROUTES = {
  LOGIN: '/Auth/login',
  REGISTER: '/Auth/register',
  VERIFY_REGISTRATION: '/Auth/verify-registration',
  VERIFY_2FA: '/Auth/verify-2fa',
  FORGOT_PASSWORD: '/Auth/forgot-password',
  RESET_PASSWORD: '/Auth/reset-password',
  CHANGE_PASSWORD: '/Auth/change-password',
  LOGOUT: '/Auth/logout',
  REFRESH: '/Auth/refresh-token',
};

/** Contrato de endpoints que no requieren cabecera Authorization */
export const PUBLIC_API_ENDPOINTS = [
  API_ROUTES.LOGIN,
  API_ROUTES.VERIFY_2FA,
  API_ROUTES.REGISTER,
  API_ROUTES.FORGOT_PASSWORD,
  API_ROUTES.REFRESH,
];

export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_REGISTRATION: '/verify-registration',
  RESET_PASSWORD: '/reset-password',
  CHANGE_PASSWORD: '/change-password',
};
