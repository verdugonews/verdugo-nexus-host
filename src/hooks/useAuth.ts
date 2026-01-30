/* verdugo-nexus-host/src/hooks/useAuth.ts */
import { useModel } from '@modern-js/runtime/model';
import { useCallback, useMemo } from 'react';
import type { UserInfo } from '../models/api.model';
import { storageService } from '../services/storage.service';
import authModel from '../store/auth';
import { NEXUS_EVENTS, emitNexusEvent } from '../utils/events';

export const useAuth = () => {
  const [state, actions] = useModel(authModel);

  const initSession = useCallback(() => {
    // Si ya no estamos cargando, significa que la sesión ya se procesó.
    if (!state.loading) return;

    const token = storageService.getToken();
    const user = storageService.getUserInfo();

    if (token && user) {
      actions.setAuth({ user, isAuthenticated: true });
      emitNexusEvent(NEXUS_EVENTS.USER_UPDATED, user);
    } else {
      // Si no hay token, marcamos sesión como inválida pero terminamos la carga
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
