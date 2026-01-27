import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from '@modern-js/runtime/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { APP_ROUTES } from '../../constants/routes';
import { authService } from '../../services/auth.service';
import styles from './verify.module.css';

// ACTIVOS VISUALES
import frameHeader from '../../assets/Frame1.svg';
import { AuthSchemas } from '../../utils/validation.schemas';

// 1. Esquema de validación para el código de verificación
const verifySchema = z.object({
  code: AuthSchemas.mfaCode,
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export default function VerifyRegistrationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  // 2. Inicialización de React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    mode: 'onChange', // Validación en tiempo real para el código
  });

  // Verificación de seguridad para asegurar que existe un email al cual verificar
  useEffect(() => {
    if (!email) {
      toast.error('Falta el correo electrónico para verificar.');
      navigate(APP_ROUTES.REGISTER);
    }
  }, [email, navigate]);

  /**
   * Proceso de verificación del código
   */
  const onSubmit = async (data: VerifyFormValues) => {
    try {
      const res = await authService.verifyRegistration(email, data.code);
      if (res.success) {
        toast.success('Cuenta verificada con éxito. Ya puedes iniciar sesión.');
        navigate(APP_ROUTES.LOGIN);
      }
    } catch (error) {
      // Manejado por el interceptor global
    }
  };

  return (
    <AuthLayout>
      <div className="nexus-auth-card">
        <img
          src={frameHeader}
          alt="Verificación"
          className={styles.imgHeader}
        />
        <h1 className={styles.brandTitle}>
          Verificación<span>.</span>
        </h1>

        <p className={styles.infoText}>
          Hemos enviado un código de verificación a: <br />
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} key="verify-form">
          <div className={styles.formGroup}>
            <label htmlFor="verify-code" className={styles.formLabel}>
              Código de 6 dígitos
            </label>
            <input
              {...register('code')}
              id="verify-code" // Vinculado semánticamente
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              className={`${styles.formInput} ${errors.code ? styles.inputError : ''}`}
              placeholder="000000"
              maxLength={6}
              disabled={isSubmitting}
            />
            {errors.code && (
              <span className={styles.errorMessage}>{errors.code.message}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.btnLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className={styles.spinner} />
            ) : (
              'Confirmar Registro'
            )}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <Link to={APP_ROUTES.LOGIN} className={styles.footerLink}>
            ¿Ya confirmaste tu cuenta? <strong>Inicia Sesión</strong>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
