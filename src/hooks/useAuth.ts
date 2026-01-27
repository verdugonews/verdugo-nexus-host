import { useModel } from '@modern-js/runtime/model';
/* host-app/src/hooks/useAuth.ts */
import { useCallback, useMemo } from 'react';
import type { UserInfo } from '../models/api.model';
import { storageService } from '../services/storage.service';
import authModel from '../store/auth';
import { NEXUS_EVENTS, emitNexusEvent } from '../utils/events';

export const useAuth = () => {
  const [state, actions] = useModel(authModel);

  /** * Inicialización estable de la sesión.
   * Se añade validación física de state.loading para romper bucles infinitos.
   */
  const initSession = useCallback(() => {
    // PROTECCIÓN CRÍTICA: Si ya no estamos cargando, no re-inicializar
    if (!state.loading) return;

    const token = storageService.getToken();
    const user = storageService.getUserInfo();

    if (token && user) {
      actions.setAuth({ user, isAuthenticated: true });
      emitNexusEvent(NEXUS_EVENTS.USER_UPDATED, user);
    } else {
      actions.setAuth({ user: null, isAuthenticated: false });
    }
  }, [actions, state.loading]);

  const logout = useCallback(() => {
    storageService.clear();
    actions.logout();
    emitNexusEvent(NEXUS_EVENTS.SESSION_EXPIRED);
  }, [actions]);

  const setAuth = useCallback(
    (payload: { user: UserInfo | null; isAuthenticated: boolean }) => {
      actions.setAuth(payload);
      if (payload.user) {
        emitNexusEvent(NEXUS_EVENTS.USER_UPDATED, payload.user);
      }
    },
    [actions],
  );

  // Memoización del objeto de retorno para estabilidad del App Shell
  return useMemo(
    () => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      loading: state.loading,
      initSession,
      setAuth,
      logout,
    }),
    [
      state.user,
      state.isAuthenticated,
      state.loading,
      initSession,
      setAuth,
      logout,
    ],
  );
};
