/* host-app/src/components/common/NotFound.tsx */
import { useNavigate } from '@modern-js/runtime/router';
import styles from '../../routes/NotFound.module.css';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.contenedor}>
      <div className={styles.elipse1} />
      <div className={styles.elipseAG} />
      <h1 className={styles.errorNumber}>404</h1>
      <div className={styles.divider} />
      <h2 className={styles.title}>Sección no encontrada</h2>
      <p className={styles.description}>
        Lo sentimos, la sección de <strong>Verdugo Nexus</strong> que buscas no
        existe o ha sido movida.
      </p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className={styles.btnBack}
      >
        Volver al Panel Principal
      </button>
    </div>
  );
};
