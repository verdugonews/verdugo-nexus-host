import { model } from '@modern-js/runtime/model';
import type { UserInfo } from '../models/api.model';

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export default model('auth').define({
  state: {
    user: null,
    isAuthenticated: false,
    loading: true,
  } as AuthState,
  actions: {
    setAuth(
      state,
      payload: { user: UserInfo | null; isAuthenticated: boolean },
    ) {
      state.user = payload.user;
      state.isAuthenticated = payload.isAuthenticated;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});
