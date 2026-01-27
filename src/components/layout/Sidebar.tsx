import { Link, useLocation } from '@modern-js/runtime/router';
import { APP_ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../models/api.model';
import {
  DashboardIcon,
  ProductsIcon,
  SuppliersIcon,
  UsersIcon,
} from '../icons/Icons';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  {
    label: 'Dashboard Principal',
    path: APP_ROUTES.HOME,
    roles: [UserRole.ADMIN, UserRole.USER, UserRole.PROSPECTO],
    icon: <DashboardIcon />,
  },
  {
    label: 'Gestión de Proveedores',
    path: '/suppliers',
    roles: [UserRole.ADMIN, UserRole.USER],
    icon: <SuppliersIcon />,
  },
  {
    label: 'Catálogo de Productos',
    path: '/products',
    roles: [UserRole.ADMIN, UserRole.USER],
    icon: <ProductsIcon />,
  },
  {
    label: 'Control de Usuarios',
    path: '/users',
    roles: [UserRole.ADMIN],
    icon: <UsersIcon />,
  },
];

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const authorizedItems = NAV_ITEMS.filter(
    item => user?.role && item.roles.includes(user.role as UserRole),
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        Coppel<span style={{ color: 'var(--coppel-yellow)' }}>.</span>
      </div>

      <nav className={styles.navLinks} aria-label="Navegación Principal">
        {authorizedItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.navItem} ${
              location.pathname === item.path ? styles.active : ''
            }`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <span className={styles.roleTag}>{user?.role}</span>
      </div>
    </aside>
  );
};
