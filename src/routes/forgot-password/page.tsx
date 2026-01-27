import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@modern-js/runtime/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { APP_ROUTES } from '../../constants/routes';
import { authService } from '../../services/auth.service';
import styles from './forgot-password.module.css';

// ACTIVOS VISUALES
import frameHeader from '../../assets/Frame1.svg';
import { AuthSchemas } from '../../utils/validation.schemas';

// Esquema de validación con Zod
const forgotPasswordSchema = z.object({
  email: AuthSchemas.email,
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(values.email);
      if (res.success) {
        setIsSent(true);
        toast.success('Instrucciones enviadas con éxito.');
      }
    } catch (error) {
      // Registro interno de la falla para monitoreo técnico
      console.error('Fallo en flujo de recuperación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="nexus-auth-card">
        <img
          src={frameHeader}
          alt="Recuperar Contraseña"
          className={styles.imgHeader}
        />
        <h1 className={styles.brandTitle}>
          Recuperar<span>.</span>
        </h1>

        {!isSent ? (
          <>
            <p className={styles.infoText}>
              Ingrese su correo electrónico y le enviaremos un enlace para
              restablecer su contraseña.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.formGroup}>
                <label htmlFor="forgot-email" className={styles.formLabel}>
                  Correo Electrónico
                </label>
                <input
                  {...register('email')}
                  id="forgot-email" // Vinculado semánticamente
                  type="email"
                  className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
                  placeholder="usuario@empresa.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <span className={styles.errorMessage}>
                    {errors.email.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className={styles.btnLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className={styles.spinner} />
                ) : (
                  'Enviar Instrucciones'
                )}
              </button>
            </form>
          </>
        ) : (
          <div style={{ marginBottom: '20px' }}>
            <p className={styles.infoText}>
              Hemos enviado un enlace de recuperación a su correo.
            </p>
            <p className={styles.infoText} style={{ fontSize: '0.85rem' }}>
              Si no recibe el correo en unos minutos, revise su carpeta de spam.
            </p>
          </div>
        )}

        <div className={styles.loginFooter}>
          <Link to={APP_ROUTES.LOGIN} className={styles.footerLink}>
            Volver al <strong>Inicio de Sesión</strong>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
