import * as z from 'zod';

/** * Centralización de reglas de negocio para validaciones de identidad.
 * Aplicación estricta del principio DRY.
 */
export const AuthSchemas = {
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Formato de correo electrónico no válido'),

  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),

  mfaCode: z
    .string()
    .length(6, 'El código debe tener exactamente 6 dígitos')
    .regex(/^\d+$/, 'El código solo debe contener números'),

  /** Esquema para validación de MFA (Centralizado) */
  mfa: z.object({
    code: z
      .string()
      .length(6, 'El código debe tener 6 dígitos')
      .regex(/^\d+$/, 'Solo se permiten números'),
  }),

  /** Esquema para inicio de sesión estándar */
  login: z.object({
    email: z
      .string()
      .min(1, 'El correo es requerido')
      .email('Formato no válido'),
    password: z.string().min(1, 'La contraseña es requerida'),
  }),

  /** Esquema para registro de nuevos proveedores */
  register: z.object({
    fullName: z.string().min(3, 'Mínimo 3 caracteres'),
    email: z
      .string()
      .min(1, 'El correo es requerido')
      .email('Formato no válido'),
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Falta mayúscula')
      .regex(/[0-9]/, 'Falta número'),
  }),

  /** Esquema base para validación de contraseñas con confirmación */
  passwordConfirmBase: z
    .object({
      newPassword: z
        .string()
        .min(8, 'Mínimo 8 caracteres')
        .regex(/[A-Z]/, 'Falta mayúscula')
        .regex(/[0-9]/, 'Falta número'),
      confirmPassword: z.string().min(1, 'Debe confirmar su contraseña'),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
    }),

  /** Esquema específico para cambio de contraseña (incluye clave actual) */
  changePassword: z
    .object({
      currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
      newPassword: z
        .string()
        .min(8, 'Mínimo 8 caracteres')
        .regex(/[A-Z]/, 'Falta mayúscula')
        .regex(/[0-9]/, 'Falta número'),
      confirmPassword: z.string().min(1, 'Debe confirmar la contraseña'),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
    }),
};
