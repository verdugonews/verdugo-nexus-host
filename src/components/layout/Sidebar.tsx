import { Link, useLocation } from '@modern-js/runtime/router';
import {
  type CSSProperties,
  type ComponentType,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  type MfeModuleConfig,
  configService,
} from '../../services/config.service';
import * as Icons from '../icons/Icons';
import styles from './Sidebar.module.css';

export const Sidebar = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const [modules, setModules] = useState<MfeModuleConfig[]>([]);
  const location = useLocation();

  useEffect(() => {
    configService.getAvailableModules().then(setModules);
  }, []);

  const groupedModules = useMemo(() => {
    const groups: Record<string, { color: string; items: MfeModuleConfig[] }> =
      {};
    for (const m of modules) {
      if (!groups[m.category]) {
        groups[m.category] = { color: m.categoryColor, items: [] };
      }
      groups[m.category].items.push(m);
    }
    return groups;
  }, [modules]);

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.isCollapsed : ''}`}
    >
      <div className={styles.brandContainer}>
        <Icons.NexusLogoIcon />
        {!isCollapsed && (
          <span className={styles.brandName}>
            Nexus<span>.</span>
          </span>
        )}
      </div>

      <nav className={styles.navLinks}>
        <Link
          to="/"
          className={`${styles.navItem} ${styles.dashboardItem} ${location.pathname === '/' ? styles.active : ''}`}
        >
          <div className={styles.navIcon}>
            <Icons.DashboardIcon />
          </div>
          {!isCollapsed && <span>Dashboard</span>}
        </Link>

        {Object.entries(groupedModules).map(([category, data]) => (
          <div
            key={category}
            className={styles.categorySection}
            style={{ '--category-accent': data.color } as CSSProperties}
          >
            {!isCollapsed && (
              <div className={styles.categoryTitle}>{category}</div>
            )}
            {data.items.map(mfe => {
              const IconComp =
                (Icons as Record<string, ComponentType>)[mfe.icon] ||
                Icons.IconFolder;
              return (
                <Link
                  key={mfe.id}
                  to={mfe.path}
                  className={`${styles.navItem} ${location.pathname.startsWith(mfe.path) ? styles.active : ''}`}
                >
                  <div className={styles.navIcon}>
                    <IconComp />
                  </div>
                  {!isCollapsed && <span>{mfe.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        {!isCollapsed && <span className={styles.roleTag}>Nexus Shell</span>}
      </div>
    </aside>
  );
};
