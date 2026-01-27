/* host-app/src/routes/layout.tsx */
import { Outlet, useLocation, useNavigate } from '@modern-js/runtime/router';
import { useEffect, useMemo, useRef } from 'react'; // useRef añadido
import { Toaster } from 'sonner';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { ErrorMaster } from '../components/common/ErrorMaster';
import GlobalLoading from '../components/globalLoading';
import { AppShell } from '../components/layout/AppShell';
import { APP_ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
import './index.css';

export default function RootLayout() {
  const { isAuthenticated, loading, initSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isInitialized = useRef(false); // Silver Bullet para evitar bucles

  // Inicialización única absoluta
  useEffect(() => {
    if (!isInitialized.current) {
      initSession();
      isInitialized.current = true;
    }
  }, [initSession]);

  const isPublicRoute = useMemo(() => {
    const publicRoutes = [
      APP_ROUTES.LOGIN,
      APP_ROUTES.REGISTER,
      APP_ROUTES.FORGOT_PASSWORD,
      APP_ROUTES.VERIFY_REGISTRATION,
      APP_ROUTES.RESET_PASSWORD,
    ];
    return publicRoutes.includes(location.pathname);
  }, [location.pathname]);

  // Guardia de navegación reactiva
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && !isPublicRoute) {
        navigate(APP_ROUTES.LOGIN, { replace: true });
      } else if (isAuthenticated && isPublicRoute) {
        navigate(APP_ROUTES.HOME, { replace: true });
      }
    }
  }, [isAuthenticated, loading, isPublicRoute, navigate]);

  if (loading) {
    return (
      <div className="root-loader-container">
        <div className="root-loader-spinner" />
        <span className="nexus-loading-subtext">
          Iniciando Verdugo Nexus...
        </span>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<ErrorMaster />}>
      <Toaster position="bottom-right" richColors closeButton theme="light" />
      <GlobalLoading />
      {isPublicRoute ? (
        <div className="auth-wrapper">
          <Outlet />
        </div>
      ) : (
        <AppShell>
          <Outlet />
        </AppShell>
      )}
    </ErrorBoundary>
  );
}
