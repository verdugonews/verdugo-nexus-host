import { Link, useNavigate } from '@modern-js/runtime/router';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth.service';
import { LockIcon, LogoutIcon } from '../icons/Icons';
import styles from './Header.module.css';

export const Header = () => {
  const { user, logout: localLogout } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      localLogout();
      navigate('/login', { replace: true });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.topHeader}>
      <h3 className={styles.sectionTitle}>
        Verdugo Nexus{' '}
        <span
          style={{ fontWeight: 'normal', color: '#666', fontSize: '0.9rem' }}
        >
          | Abastecimiento
        </span>
      </h3>

      <div className={styles.profileMenu} ref={dropdownRef}>
        <div className={styles.profileMenu} ref={dropdownRef}>
          <button
            type="button" // Cambiado div por button semántico
            className={styles.profileTrigger}
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || 'Usuario'}</span>
              <span className={styles.userRole}>{user?.role}</span>
            </div>
            <span className={styles.chevron}>{isDropdownOpen ? '▲' : '▼'}</span>
          </button>
        </div>

        <div
          className={`${styles.dropdownCard} ${isDropdownOpen ? styles.show : ''}`}
        >
          <div className={styles.dropdownHeader}>Mi Cuenta</div>

          <Link
            to="/change-password"
            className={styles.dropdownItem}
            onClick={() => setDropdownOpen(false)}
          >
            <span className={styles.itemIcon}>
              <LockIcon />
            </span>
            Cambiar Contraseña
          </Link>

          <div className={styles.dropdownDivider} />

          <button
            type="button"
            className={`${styles.dropdownItem} ${styles.logoutBtn}`}
            onClick={handleLogout}
          >
            <span className={styles.itemIcon}>
              <LogoutIcon />
            </span>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};
