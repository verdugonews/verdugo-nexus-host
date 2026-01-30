/**
 * Configuración centralizada de variables de entorno.
 * Asegura que los valores críticos estén definidos y tipados para evitar errores en runtime.
 */
export const ENV = {
  API_URL: process.env.MODERN_PUBLIC_API_URL || 'http://localhost:5000/api',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  APP_VERSION: '1.0.0',
};

// Validación de seguridad en desarrollo
if (!process.env.MODERN_PUBLIC_API_URL && !ENV.IS_PRODUCTION) {
  console.warn(
    '⚠️ [Verdugo Nexus]: MODERN_PUBLIC_API_URL no está definida. Usando fallback local.',
  );
}
