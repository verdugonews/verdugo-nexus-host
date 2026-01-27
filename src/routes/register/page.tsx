import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@modern-js/runtime/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';
import frameHeader from '../../assets/Frame1.svg';
import { EyeIcon, EyeOffIcon } from '../../components/icons/Icons';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { APP_ROUTES } from '../../constants/routes';
import { authService } from '../../services/auth.service';
import { AuthSchemas } from '../../utils/validation.schemas';
import styles from './register.module.css';

type RegisterFormValues = z.infer<typeof AuthSchemas.register>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(AuthSchemas.register),
    mode: 'onBlur',
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const res = await authService.register(
        data.email,
        data.password,
        data.fullName,
      );
      if (res.success) {
        navigate(
          `${APP_ROUTES.VERIFY_REGISTRATION}?email=${encodeURIComponent(data.email)}`,
        ); //
      }
    } catch {
      // Manejado por interceptor global
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="nexus-auth-card">
        <img src={frameHeader} alt="Registro" className={styles.imgHeader} />
        <h1 className={styles.brandTitle}>
          Registro<span>.</span>
        </h1>
        <p className={styles.loginSubtitle}>Crea tu cuenta de Proveedor</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="reg-name" className={styles.formLabel}>
              Nombre Completo
            </label>
            <input
              {...register('fullName')}
              id="reg-name"
              className={`${styles.formInput} ${errors.fullName ? styles.inputError : ''}`}
              placeholder="Nombre y Apellidos"
              disabled={isLoading}
            />
            {errors.fullName && (
              <span className={styles.errorMessage}>
                {errors.fullName.message}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reg-email" className={styles.formLabel}>
              Correo Electrónico
            </label>
            <input
              {...register('email')}
              id="reg-email"
              className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
              placeholder="ejemplo@proveedor.com"
              disabled={isLoading}
            />
            {errors.email && (
              <span className={styles.errorMessage}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reg-password" className={styles.formLabel}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('password')}
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className={`${styles.formInput} ${errors.password ? styles.inputError : ''}`}
                placeholder="••••••••"
                disabled={isLoading}
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
            {errors.password && (
              <span className={styles.errorMessage}>
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="nexus-btn-primary"
            style={{ width: '100%' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="nexus-spinner-base" />
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <Link to={APP_ROUTES.LOGIN} className={styles.footerLink}>
            ¿Ya tienes cuenta? <strong>Inicia sesión</strong>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
