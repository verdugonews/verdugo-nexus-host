import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@modern-js/runtime/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type * as z from 'zod';
import { AuthSchemas } from '../../utils/validation.schemas'; // Esquemas centrales

import frameHeader from '../../assets/Frame1.svg';
import { EyeIcon, EyeOffIcon } from '../../components/icons/Icons';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { APP_ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import {
  type AccountStatus,
  type UserInfo,
  UserRole,
} from '../../models/api.model';
import type { AuthResponse } from '../../models/api.model';
import { authService } from '../../services/auth.service';
import { storageService } from '../../services/storage.service';
import styles from './login.module.css';

type LoginFormValues = z.infer<typeof AuthSchemas.login>;
type TwoFactorFormValues = z.infer<typeof AuthSchemas.mfa>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [requires2Fa, setRequires2Fa] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [savedEmail, setSavedEmail] = useState('');

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(AuthSchemas.login), // Consumo directo del esquema centralizado
    mode: 'onBlur',
  });

  const twoFactorForm = useForm<TwoFactorFormValues>({
    resolver: zodResolver(AuthSchemas.mfa), // Consumo directo
    mode: 'onChange',
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await authService.login(values.email, values.password);

      if (res.success && res.data.requiresTwoFactor) {
        setSavedEmail(values.email);
        setRequires2Fa(true);
        toast.success('Código de seguridad enviado a su correo.');
      } else if (res.success && res.data.accessToken) {
        finalizeLogin(res.data, values.email, UserRole.USER);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onVerify2FaSubmit = async (values: TwoFactorFormValues) => {
    setIsLoading(true);
    try {
      const res = await authService.verify2Fa(savedEmail, values.code);
      if (res.success && res.data.accessToken) {
        finalizeLogin(res.data, savedEmail, UserRole.PROSPECTO);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const finalizeLogin = (data: AuthResponse, email: string, role: UserRole) => {
    storageService.setToken(data.accessToken);
    storageService.setRefreshToken(data.refreshToken);

    const userInfo: UserInfo = {
      id: data.userId,
      email,
      role,
      status: data.accountStatus as AccountStatus,
      name: 'Usuario',
    };

    storageService.setUserInfo(userInfo);
    setAuth({ user: userInfo, isAuthenticated: true });

    toast.success('¡Bienvenido de nuevo!');
    navigate(APP_ROUTES.HOME, { replace: true });
  };

  return (
    <AuthLayout>
      <div className="nexus-auth-card">
        <img src={frameHeader} alt="Header" className={styles.imgHeader} />
        <h1 className={styles.brandTitle}>
          Portal de Proveedores<span>.</span>
        </h1>

        {!requires2Fa ? (
          <form
            key="login-form"
            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
          >
            <div className={styles.formGroup}>
              {/* Vinculación semántica */}
              <label htmlFor="login-email" className={styles.formLabel}>
                Correo Electrónico
              </label>
              <input
                {...loginForm.register('email')}
                id="login-email"
                type="email"
                autoComplete="email"
                className={`${styles.formInput} ${loginForm.formState.errors.email ? styles.inputError : ''}`}
                placeholder="usuario@coppel.com"
                disabled={isLoading}
              />
              {loginForm.formState.errors.email && (
                <span className={styles.errorMessage}>
                  {loginForm.formState.errors.email.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="login-password" className={styles.formLabel}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  {...loginForm.register('password')}
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`${styles.formInput} ${loginForm.formState.errors.password ? styles.inputError : ''}`}
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
              {loginForm.formState.errors.password && (
                <span className={styles.errorMessage}>
                  {loginForm.formState.errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={styles.btnLogin}
              disabled={isLoading}
            >
              {isLoading ? <span className={styles.spinner} /> : 'Ingresar'}
            </button>

            <div className={styles.loginFooter}>
              <Link
                to={APP_ROUTES.FORGOT_PASSWORD}
                className={styles.footerLink}
              >
                ¿Olvidaste tu contraseña?
              </Link>
              <Link to={APP_ROUTES.REGISTER} className={styles.footerLink}>
                ¿No tienes cuenta? <strong>Regístrate</strong>
              </Link>
            </div>
          </form>
        ) : (
          /* PASO 2: VERIFICACIÓN 2FA - Se agrega key distinta para resetear el DOM */
          <form
            key="2fa-form"
            onSubmit={twoFactorForm.handleSubmit(onVerify2FaSubmit)}
          >
            <p className={styles.infoText}>
              Código enviado a <strong>{savedEmail}</strong>
            </p>
            <div className={styles.formGroup}>
              <label htmlFor="mfa-code" className={styles.formLabel}>
                Código de Seguridad
              </label>
              <input
                {...twoFactorForm.register('code')}
                id="mfa-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                className={`${styles.formInput} ${twoFactorForm.formState.errors.code ? styles.inputError : ''}`}
                placeholder="000000"
                maxLength={6}
                disabled={isLoading}
              />
              {twoFactorForm.formState.errors.code && (
                <span className={styles.errorMessage}>
                  {twoFactorForm.formState.errors.code.message}
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
                'Verificar e Ingresar'
              )}
            </button>

            <button
              type="button"
              className={styles.btnBack}
              onClick={() => {
                setRequires2Fa(false);
                setSavedEmail(''); // Limpieza del estado de email para evitar inconsistencias
                twoFactorForm.reset();
              }}
              disabled={isLoading}
            >
              Volver al inicio de sesión
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
