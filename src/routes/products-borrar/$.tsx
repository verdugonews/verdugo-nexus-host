import { useModuleApps } from '@modern-js/plugin-garfish/runtime';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { MfeTableSkeleton } from '../../components/common/MfeTableSkeleton';
import { ENV } from '../../config/env.config';
import { useAuth } from '../../hooks/useAuth';
import { storageService } from '../../services/storage.service';

export default function ProductsRoute() {
  const { products: ProductsMFE } = useModuleApps();
  const { user } = useAuth();
  const token =
    typeof window !== 'undefined' ? storageService.getToken() : null;

  // La lógica de protección de ruta se eliminó por ser redundante con RootLayout
  if (!token) return null;

  return (
    <ErrorBoundary
      fallback={
        <div style={{ padding: '24px' }}>
          <h3 style={{ color: '#d93025' }}>
            Error al cargar el módulo de Productos.
          </h3>
          <p>
            Por favor, intente recargar la página o contacte a soporte técnico.
          </p>
        </div>
      }
    >
      <div style={{ height: '100%', width: '100%' }}>
        {ProductsMFE ? (
          <ProductsMFE user={user} token={token} apiUrl={ENV.API_URL} />
        ) : (
          <MfeTableSkeleton />
        )}
      </div>
    </ErrorBoundary>
  );
}
