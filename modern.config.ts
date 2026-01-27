import { appTools, defineConfig } from '@modern-js/app-tools';
import { garfishPlugin } from '@modern-js/plugin-garfish';
import statePlugin from '@modern-js/plugin-state';

export default defineConfig({
  server: {
    port: 8080, // Cambiar de 3000 a 8080 si prefieres que Modern.js use este puerto siempre
  },
  runtime: {
    router: true,
    //state: true, // Para gestión de estado simple
    // Configuración MFE: Actúa como Maestro
    masterApp: {
      apps: [
        {
          name: 'suppliers',
          // En producción, esto sería una URL real. En local, el puerto del micro.
          entry: 'http://localhost:3001',
          activeWhen: '/suppliers', // Ruta donde se activará
          props: {
            // shared: ['react', 'react-dom']
          },
        },
        {
          name: 'products',
          entry: 'http://localhost:3002',
          activeWhen: '/products',
          props: {
            // shared: ['react', 'react-dom']
          },
        },
      ],
    },
  },
  plugins: [
    appTools({
      bundler: 'rspack', // Set to 'webpack' to enable webpack
    }),
    garfishPlugin(),
    statePlugin(), // 3. Registrar el plugin manualmente
  ],
});
