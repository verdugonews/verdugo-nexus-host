import apiClient from '../api/client';
import {
  API_ROUTES,
  APP_ROUTES,
  PUBLIC_API_ENDPOINTS,
} from '../constants/routes';
import type {
  ApiResponse,
  AuthResponse,
  GenericSuccessResponse,
  RegisterData,
} from '../models/api.model';
import { storageService } from './storage.service';

/**
 * Servicio centralizado para todas las operaciones relacionadas con identidad y acceso.
 */
export const authService = {
  /**
   * Registra un nuevo prospecto de proveedor.
   */
  register: async (email: string, pass: string, fullName: string) => {
    const { data } = await apiClient.post<ApiResponse<RegisterData>>(
      API_ROUTES.REGISTER,
      { email, password: pass, fullName },
    );
    return data;
  },

  /**
   * Verifica el registro inicial mediante el código enviado por correo.
   */
  verifyRegistration: async (email: string, code: string) => {
    const { data } = await apiClient.post<ApiResponse<GenericSuccessResponse>>(
      API_ROUTES.VERIFY_REGISTRATION,
      { email, code },
    );
    return data;
  },

  /**
   * Inicia sesión con credenciales básicas.
   */
  login: async (email: string, pass: string) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ROUTES.LOGIN,
      { email, password: pass },
    );
    return data;
  },

  /**
   * Valida el segundo factor de autenticación (2FA).
   */
  verify2Fa: async (email: string, code: string) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ROUTES.VERIFY_2FA,
      { email, code },
    );
    return data;
  },

  /**
   * Solicita un enlace de recuperación de contraseña.
   */
  forgotPassword: async (email: string) => {
    const { data } = await apiClient.post<ApiResponse<GenericSuccessResponse>>(
      API_ROUTES.FORGOT_PASSWORD,
      { email },
    );
    return data;
  },

  /**
   * Restablece la contraseña utilizando un token enviado por correo.
   */
  resetPassword: async (email: string, token: string, newPass: string) => {
    const { data } = await apiClient.post<ApiResponse<GenericSuccessResponse>>(
      API_ROUTES.RESET_PASSWORD,
      {
        email,
        token,
        newPassword: newPass,
      },
    );
    return data;
  },

  /**
   * Cambia la contraseña de un usuario autenticado.
   */
  changePassword: async (currentPass: string, newPass: string) => {
    const { data } = await apiClient.post<ApiResponse<GenericSuccessResponse>>(
      API_ROUTES.CHANGE_PASSWORD,
      {
        currentPassword: currentPass,
        newPassword: newPass,
      },
    );
    return data;
  },

  /**
   * Refresca el token de acceso utilizando un token de refresco válido.
   */
  refresh: async (refreshToken: string | null) => {
    if (!refreshToken) throw new Error('No refresh token available');
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ROUTES.REFRESH,
      { refreshToken },
    );
    return data;
  },

  /**
   * Cierra la sesión de forma segura invalidando el token en el servidor y limpiando el almacenamiento local.
   */
  logout: async () => {
    const refreshToken = storageService.getRefreshToken();
    try {
      await apiClient.post(API_ROUTES.LOGOUT, { refreshToken });
    } finally {
      storageService.clear();
    }
  },
};
