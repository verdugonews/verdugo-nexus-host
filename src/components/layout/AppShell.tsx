import { useState } from 'react';
import styles from './AppShell.module.css';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Estado único de colapso

  return (
    <div
      className={`${styles.appShell} ${isCollapsed ? styles.isCollapsed : ''}`}
    >
      <Sidebar isCollapsed={isCollapsed} />
      <div className={styles.mainWrapper}>
        <Header
          onToggle={() => setIsCollapsed(!isCollapsed)}
          isCollapsed={isCollapsed}
        />
        <main className={styles.pageContent}>
          <div className={styles.contentFadeIn}>{children}</div>
        </main>
      </div>
    </div>
  );
};
