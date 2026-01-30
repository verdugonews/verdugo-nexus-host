/* verdugo-nexus-host/modern.config.ts */
import { appTools, defineConfig } from '@modern-js/app-tools';
import { garfishPlugin } from '@modern-js/plugin-garfish';
import statePlugin from '@modern-js/plugin-state';

export default defineConfig({
  runtime: {
    router: true,
    state: true,
  },
  plugins: [
    appTools({
      bundler: 'rspack',
    }),
    garfishPlugin(),
    statePlugin(),
  ],
  server: {
    port: 8080,
  },
});
