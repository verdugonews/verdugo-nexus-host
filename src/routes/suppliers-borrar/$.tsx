import { useModuleApps } from '@modern-js/plugin-garfish/runtime';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { MfeTableSkeleton } from '../../components/common/MfeTableSkeleton';
import { ENV } from '../../config/env.config';
import { useAuth } from '../../hooks/useAuth';
import { storageService } from '../../services/storage.service';
import styles from '../mfe-loading.module.css';

export default function SuppliersRoute() {
  const { suppliers: SuppliersMFE } = useModuleApps();
  const { user } = useAuth();

  // Recuperamos el token solo para pasarlo al microfrontend si es necesario
  const token =
    typeof window !== 'undefined' ? storageService.getToken() : null;

  // Se eliminó el useEffect de navegación local.
  // La protección de ruta ahora es gestionada centralizadamente por RootLayout.

  if (!token) return null;

  return (
    <ErrorBoundary
      fallback={
        <div className={styles.loadingContainer}>
          <h3 style={{ color: '#d93025' }}>
            Error al cargar el módulo de Proveedores.
          </h3>
          <p>
            Por favor, intente recargar la página o contacte a soporte técnico.
          </p>
        </div>
      }
    >
      <div style={{ height: '100%', width: '100%' }}>
        {SuppliersMFE ? (
          /* Paso de contratos de datos directamente al Microfrontend */
          <SuppliersMFE user={user} token={token} apiUrl={ENV.API_URL} />
        ) : (
          /* Uso del Skeleton centralizado para consistencia visual */
          <MfeTableSkeleton />
        )}
      </div>
    </ErrorBoundary>
  );
}
