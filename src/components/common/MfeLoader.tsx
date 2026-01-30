import { loadRemote, registerRemotes } from '@module-federation/runtime';
import { type ComponentType, Suspense, useEffect, useState } from 'react';
import {
  type MfeModuleConfig,
  configService,
} from '../../services/config.service';
import { MfeTableSkeleton } from './MfeTableSkeleton';
import { NotFound } from './NotFound';

export const MfeLoader = ({ scope }: { scope: string }) => {
  const [config, setConfig] = useState<MfeModuleConfig | null>(null);
  const [RemoteComponent, setRemoteComponent] = useState<ComponentType | null>(
    null,
  );
  const [status, setStatus] = useState<
    'loading' | 'ready' | 'not_found' | 'error'
  >('loading');

  useEffect(() => {
    setStatus('loading');
    configService.getAvailableModules().then(modules => {
      const found = modules.find(m => m.scope === scope);
      if (found) {
        setConfig(found);
      } else {
        setStatus('not_found');
      }
    });
  }, [scope]);

  useEffect(() => {
    if (!config || config.type === 'iframe') {
      if (config?.type === 'iframe') setStatus('ready');
      return;
    }

    const loadMfe = async () => {
      try {
        registerRemotes([{ name: config.scope, entry: config.url }]);
        const remoteApp = (await loadRemote(
          `${config.scope}${config.module || './App'}`,
        )) as { default: ComponentType };

        if (remoteApp?.default) {
          setRemoteComponent(() => remoteApp.default);
          setStatus('ready');
        }
      } catch (err) {
        console.error('Error técnico cargando MFE:', err);
        setStatus('error');
      }
    };
    loadMfe();
  }, [config]);

  if (status === 'loading') return <MfeTableSkeleton />;
  if (status === 'not_found' || status === 'error') return <NotFound />;

  if (config?.type === 'iframe') {
    return (
      <div
        style={{
          width: '100%',
          height: 'calc(100vh - 80px)',
          background: '#fff',
        }}
      >
        <iframe
          src={config.url}
          title={config.label}
          style={{ width: '100%', height: '100%', border: 'none' }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-storage-access-by-user-activation allow-forms"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <Suspense fallback={<MfeTableSkeleton />}>
      {RemoteComponent ? <RemoteComponent /> : <NotFound />}
    </Suspense>
  );
};
