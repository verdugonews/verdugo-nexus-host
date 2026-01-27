import type React from 'react';
import styles from './AppShell.module.css';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainWrapper}>
        <Header />
        <main className={styles.pageContent}>
          <div className={styles.contentFadeIn}>{children}</div>
        </main>
      </div>
    </div>
  );
};
