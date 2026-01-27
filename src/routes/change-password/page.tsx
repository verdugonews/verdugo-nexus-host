import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type * as z from 'zod';
import { EyeIcon, EyeOffIcon } from '../../components/icons/Icons';
import { authService } from '../../services/auth.service';
import { AuthSchemas } from '../../utils/validation.schemas';
import styles from './change-password.module.css';

type ChangePasswordForm = z.infer<typeof AuthSchemas.changePassword>;

export default function ChangePasswordPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(AuthSchemas.changePassword),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      const res = await authService.changePassword(
        data.currentPassword,
        data.newPassword,
      );
      if (res.success) {
        toast.success(
          'Contraseña actualizada. Se cerrará tu sesión por seguridad...',
        );
        reset();
        setTimeout(() => authService.logout(), 3500);
      }
    } catch (error) {
      console.error('Error en flujo de cambio de clave:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className="nexus-auth-card" style={{ maxWidth: '500px' }}>
        <h2 className={styles.title}>Seguridad de la Cuenta</h2>
        <p className={styles.subtitle}>
          Actualiza tu contraseña periódicamente para mantener tu cuenta segura.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="current-pass" className={styles.formLabel}>
              Contraseña Actual
            </label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('currentPassword')}
                id="current-pass"
                className={`${styles.formInput} ${errors.currentPassword ? styles.inputError : ''}`}
                type={showCurrent ? 'text' : 'password'}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label={
                  showCurrent ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
              >
                {showCurrent ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.currentPassword && (
              <span className={styles.errorMessage}>
                {errors.currentPassword.message}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="new-pass" className={styles.formLabel}>
              Nueva Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('newPassword')}
                id="new-pass"
                className={`${styles.formInput} ${errors.newPassword ? styles.inputError : ''}`}
                type={showNext ? 'text' : 'password'}
                placeholder="Min. 8 caracteres, letras y números"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowNext(!showNext)}
                aria-label={
                  showNext ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
              >
                {showNext ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.newPassword && (
              <span className={styles.errorMessage}>
                {errors.newPassword.message}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirm-pass" className={styles.formLabel}>
              Confirmar Nueva Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('confirmPassword')}
                id="confirm-pass"
                className={`${styles.formInput} ${errors.confirmPassword ? styles.inputError : ''}`}
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repite tu nueva contraseña"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={
                  showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={styles.errorMessage}>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="nexus-btn-primary"
            style={{ width: '100%' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="nexus-spinner-base" />
            ) : (
              'Cambiar Contraseña'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
