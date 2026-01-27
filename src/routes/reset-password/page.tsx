import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from '@modern-js/runtime/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type * as z from 'zod';
import frameHeader from '../../assets/Frame1.svg';
import { EyeIcon, EyeOffIcon } from '../../components/icons/Icons';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { APP_ROUTES } from '../../constants/routes';
import { authService } from '../../services/auth.service';
import { AuthSchemas } from '../../utils/validation.schemas';
import styles from './reset-password.module.css';

type ResetPasswordFormValues = z.infer<typeof AuthSchemas.passwordConfirmBase>;

export default function ResetPasswordPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading: isFormLoading },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(AuthSchemas.passwordConfirmBase),
    mode: 'onBlur',
  });

  useEffect(() => {
    const params = new URLSearchParams(search);
    const urlToken = params.get('token') || '';
    const urlEmail = params.get('email') || '';
    if (!urlToken || !urlEmail) {
      toast.error('Enlace de restablecimiento inválido o incompleto.');
    }
    setToken(urlToken);
    setEmail(urlEmail);
  }, [search]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      const res = await authService.resetPassword(
        email,
        token,
        values.newPassword,
      );
      if (res.success) {
        setSuccess(true);
        toast.success('Contraseña actualizada correctamente.');
        setTimeout(() => navigate(APP_ROUTES.LOGIN), 4000);
      }
    } catch (error) {
      console.error('Fallo en flujo de restablecimiento:', error);
    }
  };

  return (
    <AuthLayout>
      <div className="nexus-auth-card">
        <img src={frameHeader} alt="Nueva Clave" className={styles.imgHeader} />
        <h1 className={styles.brandTitle}>
          Nueva Clave<span>.</span>
        </h1>
        {!success ? (
          <>
            <p className={styles.infoText}>
              Establece tu nueva contraseña para la cuenta: <br />
              <strong>{email}</strong>
            </p>
            <form onSubmit={handleSubmit(onSubmit)} key="reset-form">
              <div className={styles.formGroup}>
                <label htmlFor="new-reset" className={styles.formLabel}>
                  Nueva Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    {...register('newPassword')}
                    id="new-reset"
                    className={`${styles.formInput} ${errors.newPassword ? styles.inputError : ''}`}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 caracteres, A-Z, 0-9"
                    disabled={isFormLoading}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                    }
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.newPassword && (
                  <span className={styles.errorMessage}>
                    {errors.newPassword.message}
                  </span>
                )}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="confirm-reset" className={styles.formLabel}>
                  Confirmar Contraseña
                </label>
                <input
                  {...register('confirmPassword')}
                  id="confirm-reset"
                  className={`${styles.formInput} ${errors.confirmPassword ? styles.inputError : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repita su contraseña"
                  disabled={isFormLoading}
                />
                {errors.confirmPassword && (
                  <span className={styles.errorMessage}>
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className={styles.btnLogin}
                disabled={isFormLoading || !token}
              >
                {isFormLoading ? (
                  <span className={styles.spinner} />
                ) : (
                  'Cambiar Contraseña'
                )}
              </button>
            </form>
          </>
        ) : (
          <div style={{ padding: '20px 0' }}>
            <p
              style={{
                color: '#059669',
                fontWeight: 'bold',
                marginBottom: '10px',
              }}
            >
              ✅ Contraseña actualizada.
            </p>
            <p className={styles.infoText}>
              Serás redirigido al inicio de sesión en unos segundos...
            </p>
            <div className={styles.loginFooter}>
              <Link to={APP_ROUTES.LOGIN} className={styles.footerLink}>
                Ir al <strong>Login ahora</strong>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
