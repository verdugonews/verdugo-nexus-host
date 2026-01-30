import { Link, useNavigate } from '@modern-js/runtime/router';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth.service';
import { CloseIcon, LockIcon, LogoutIcon, MenuIcon } from '../icons/Icons';
import styles from './Header.module.css';

interface HeaderProps {
  onToggle: () => void;
  isCollapsed: boolean;
}

export const Header = ({ onToggle, isCollapsed }: HeaderProps) => {
  const { user, logout: localLogout } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

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
      <div className={styles.leftHeader}>
        <button
          type="button"
          className={styles.menuBtn}
          onClick={onToggle}
          title={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
        >
          {isCollapsed ? <MenuIcon /> : <CloseIcon />}
        </button>
        <h3 className={styles.sectionTitle}>
          Verdugo Nexus <span className={styles.subtitle}>| Shell</span>
        </h3>
      </div>

      <div className={styles.profileContainer} ref={dropdownRef}>
        <button
          type="button"
          className={`${styles.profileTrigger} ${isDropdownOpen ? styles.activeTrigger : ''}`}
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          <div className={styles.avatarCircle}>
            {getInitials(user?.name || 'U')}
          </div>
          <div className={styles.triggerInfo}>
            <span className={styles.triggerName}>
              {user?.name?.split(' ')[0]}
            </span>
            <span className={styles.triggerChevron}>
              {isDropdownOpen ? '▲' : '▼'}
            </span>
          </div>
        </button>

        <div
          className={`${styles.profileDropdown} ${isDropdownOpen ? styles.showDropdown : ''}`}
        >
          <div className={styles.dropdownUserHeader}>
            <div className={styles.headerAvatar}>
              {getInitials(user?.name || 'U')}
            </div>
            <div className={styles.headerText}>
              <span className={styles.fullName}>{user?.name}</span>
              <span className={styles.userEmail}>
                {user?.email || 'usuario@coppel.com'}
              </span>
              <span className={styles.badgeRole}>{user?.role}</span>
            </div>
          </div>

          <div className={styles.dropdownBody}>
            <Link
              to="/change-password"
              className={styles.menuItem}
              onClick={() => setDropdownOpen(false)}
            >
              <div className={styles.iconBox}>
                <LockIcon />
              </div>
              <span>Seguridad y Contraseña</span>
            </Link>

            <div className={styles.menuDivider} />

            <button
              type="button"
              className={`${styles.menuItem} ${styles.logoutItem}`}
              onClick={handleLogout}
            >
              <div className={styles.iconBox}>
                <LogoutIcon />
              </div>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
