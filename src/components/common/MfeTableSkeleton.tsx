import React from 'react';
import styles from '../../routes/mfe-loading.module.css';

export const MfeTableSkeleton = () => (
  <div className={styles.loadingContainer}>
    <div className={styles.headerSkeleton}>
      <div className={`${styles.skeleton} ${styles.title}`} />
      <div className={`${styles.skeleton} ${styles.button}`} />
    </div>
    <div className={`${styles.skeleton} ${styles.tableHeader}`} />
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className={`${styles.skeleton} ${styles.tableRow}`} />
    ))}
  </div>
);
