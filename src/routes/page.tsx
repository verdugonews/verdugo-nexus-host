import { useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import {
  IconBell,
  IconClock,
  IconFile,
  IconFolder,
} from '../components/icons/Icons';
import { AccountStatus, type UserInfo } from '../models/api.model';
import { storageService } from '../services/storage.service';
import styles from './dashboard.module.css';

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; desc: string }
> = {
  [AccountStatus.PENDING]: {
    label: 'Validación Pendiente',
    color: 'var(--coppel-yellow)',
    desc: 'Tu cuenta está siendo revisada por el equipo comercial de Coppel.',
  },
  [AccountStatus.ACTIVE]: {
    label: 'Cuenta Activa',
    color: 'var(--color-success)',
    desc: 'Ya puedes gestionar tus servicios en la plataforma.',
  },
  Default: {
    label: 'Estado Desconocido',
    color: 'var(--neutral-medium)',
    desc: 'Contacta a soporte si tienes dudas sobre el estatus de tu acceso.',
  },
};

export default function DashboardPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const userInfo = storageService.getUserInfo();
    if (userInfo) {
      setUser(userInfo);
    }
    setIsDataLoading(false);
  }, []);

  const currentStatus =
    STATUS_CONFIG[user?.status as string] || STATUS_CONFIG.Default;

  const kpis = useMemo(
    () => [
      {
        id: 'kpi-files',
        label: 'Mis Solicitudes',
        value: '1',
        icon: <IconFile />,
        color: 'var(--coppel-blue)',
      },
      {
        id: 'kpi-docs',
        label: 'Documentos Pendientes',
        value: user?.status === AccountStatus.PENDING ? '4' : '0',
        icon: <IconFolder />,
        color: 'var(--coppel-yellow)',
      },
      {
        id: 'kpi-bell',
        label: 'Notificaciones',
        value: '2',
        icon: <IconBell />,
        color: 'var(--coppel-blue)',
      },
      {
        id: 'kpi-clock',
        label: 'Días en Proceso',
        value: '3',
        icon: <IconClock />,
        color: 'var(--neutral-medium)',
      },
    ],
    [user?.status],
  );

  if (isDataLoading) {
    return (
      <div className={styles.container}>
        <div className={`${styles.skeleton} ${styles.skeletonBanner}`} />
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <div className={styles.kpiGrid}>
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`${styles.skeleton} ${styles.skeletonKpi}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ErrorBoundary
        fallback={
          <div className={styles.banner}>
            Error al cargar el resumen del perfil.
          </div>
        }
      >
        <div
          className={styles.banner}
          style={{ borderLeftColor: currentStatus.color }}
        >
          {/* Contenido */}
        </div>
      </ErrorBoundary>

      <h2 className={styles.sectionTitle}>Resumen de Actividad</h2>

      <ErrorBoundary
        fallback={
          <div className={styles.kpiGrid}>
            Error al cargar los indicadores de actividad.
          </div>
        }
      >
        <div className={styles.kpiGrid}>
          {kpis.map(kpi => (
            <div
              key={kpi.id}
              className={styles.kpiCard}
              style={{ borderLeftColor: kpi.color }}
            >
              <span className={styles.kpiLabel}>{kpi.label}</span>
              <div className={styles.kpiContent}>
                <span className={styles.kpiValue}>{kpi.value}</span>
                <span className={styles.kpiIcon} style={{ color: kpi.color }}>
                  {kpi.icon}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ErrorBoundary>
    </div>
  );
}
