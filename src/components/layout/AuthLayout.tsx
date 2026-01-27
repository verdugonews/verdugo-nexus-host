// src/components/layout/AuthLayout.tsx
import type React from 'react';
import logoCoppel from '../../assets/LogoCoppel.svg';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className={styles.contenedor}>
    {/* Etiquetas self-closing corregidas */}
    <div className={styles.elipse1} />
    <div className={styles.elipseAC} />
    <div className={styles.elipseAG} />
    <div className={styles.elipseCA} />

    <div className={styles.logoLogin}>
      <img src={logoCoppel} alt="Logo Coppel" />
    </div>

    {children}
  </div>
);
