/* verdugo-nexus-host/src/services/config.service.ts */

export interface MfeModuleConfig {
  id: string;
  scope: string;
  module?: string;
  url: string;
  path: string;
  label: string;
  icon: string;
  type: 'mfe' | 'iframe';
  category: string;
  categoryColor: string;
}

export const configService = {
  getAvailableModules: async (): Promise<MfeModuleConfig[]> => {
    return [
      {
        id: 'suppliers-mfe',
        scope: 'suppliers',
        module: './App',
        url: 'http://localhost:8081/remoteEntry.js',
        path: '/suppliers',
        label: 'Gestión Proveedores',
        icon: 'SuppliersIcon',
        type: 'mfe',
        category: 'suppliers management',
        categoryColor: '#F0D224', // Amarillo Coppel
      },
      {
        id: 'products-mfe',
        scope: 'products',
        module: './App',
        url: 'http://localhost:8082/remoteEntry.js',
        path: '/products',
        label: 'Catálogo Productos',
        icon: 'ProductsIcon',
        type: 'mfe',
        category: 'products management',
        categoryColor: '#FF9100', // Naranja
      },
      {
        id: 'purchases-mfe',
        scope: 'purchases',
        module: './App',
        url: 'http://localhost:8083/remoteEntry.js',
        path: '/purchases',
        label: 'Órdenes de Compra',
        icon: 'PurchasesIcon',
        type: 'mfe',
        category: 'purchases management',
        categoryColor: '#4CAF50', // Verde
      },
      {
        id: 'looker-analytics',
        scope: 'analytics',
        url: 'https://lookerstudio.google.com/embed/reporting/3646afef-cce4-4a81-b7f1-c940a1fbcbb8/page/1M',
        path: '/analytics',
        label: 'Ventas y Operación',
        icon: 'AnalyticsIcon',
        type: 'iframe',
        category: 'strategic planning',
        categoryColor: '#00E5FF', // Cyan brillante
      },
      {
        id: 'pricing-mfe',
        scope: 'pricing',
        module: './App',
        url: 'http://localhost:8084/remoteEntry.js',
        path: '/pricing',
        label: 'Gestión de Precios',
        icon: 'PricingIcon',
        type: 'mfe',
        category: 'pricing and promotions',
        categoryColor: '#E91E63', // Rosa/Magenta
      },
    ];
  },
};
