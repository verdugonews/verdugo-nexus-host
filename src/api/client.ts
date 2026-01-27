import axios from 'axios';
import { toast } from 'sonner';
import { ENV } from '../config/env.config';
import {
  API_ROUTES,
  APP_ROUTES,
  PUBLIC_API_ENDPOINTS,
} from '../constants/routes';
import { storageService } from '../services/storage.service';
import { NEXUS_EVENTS, emitNexusEvent } from '../utils/events';

const IS_AUTH_PATH = (url: string) =>
  PUBLIC_API_ENDPOINTS.some(path => url.endsWith(path));

interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

const notifyError = (message: string) => {
  toast.error(message, {
    description: 'Si el problema persiste, contacte a soporte técnico.',
  });
};

const apiClient = axios.create({
  baseURL: ENV.API_URL,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  for (const prom of failedQueue) {
    if (error) prom.reject(error);
    else prom.resolve(token);
  }
  failedQueue = [];
};

apiClient.interceptors.request.use(config => {
  const token = storageService.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => {
    if (response.data && response.data.success === false) {
      const msg = response.data.errors?.[0] || 'Error en la operación';
      notifyError(msg);
    }
    return response;
  },
  async error => {
    const originalRequest = error.config;
    const url = originalRequest.url || '';

    if (error.response) {
      const { status, data } = error.response;
      const msg = data?.errors?.[0];

      if (status === 401 && !originalRequest._retry && !IS_AUTH_PATH(url)) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        emitNexusEvent(NEXUS_EVENTS.SESSION_REFRESHING, true);

        try {
          const refreshToken = storageService.getRefreshToken();
          const { data: refreshData } = await axios.post(
            `${ENV.API_URL}${API_ROUTES.REFRESH}`,
            { refreshToken },
          );

          if (refreshData.success && refreshData.data.accessToken) {
            storageService.setToken(refreshData.data.accessToken);
            storageService.setRefreshToken(refreshData.data.refreshToken);

            emitNexusEvent(
              NEXUS_EVENTS.TOKEN_UPDATED,
              refreshData.data.accessToken,
            );

            processQueue(null, refreshData.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${refreshData.data.accessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          emitNexusEvent(NEXUS_EVENTS.SESSION_EXPIRED);
          storageService.clear();
          processQueue(refreshError, null);
          window.location.replace(APP_ROUTES.LOGIN);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
          emitNexusEvent(NEXUS_EVENTS.SESSION_REFRESHING, false);
        }
      }

      switch (status) {
        case 401:
          if (IS_AUTH_PATH(url)) notifyError(msg || 'Credenciales inválidas');
          break;
        case 403:
          notifyError('No tiene permisos para realizar esta acción');
          break;
        case 404:
          notifyError('El recurso solicitado no está disponible');
          break;
        case 500:
          notifyError('Error interno del servidor (500)');
          break;
        default:
          if (msg) notifyError(msg);
      }
    } else if (error.request) {
      notifyError(
        'No se pudo establecer comunicación con el servidor. Revise su conexión.',
      );
    }

    return Promise.reject(error);
  },
);

export default apiClient;
