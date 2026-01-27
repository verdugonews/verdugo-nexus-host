export enum UserRole {
  ADMIN = 'ADMIN',
  PROSPECTO = 'PROSPECTO',
  USER = 'USER',
}

export enum AccountStatus {
  ACTIVE = 'Active',
  PENDING = 'PendingValidation',
  REJECTED = 'Rejected',
}

export interface UserInfo {
  id: string;
  email: string;
  role: UserRole; // Cambiado de 'string' a 'UserRole'
  status: AccountStatus | string;
  name?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  accountStatus: string;
  requiresTwoFactor?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  errors: string[];
}

export interface RegisterData {
  userId: string;
  message: string;
}

export interface GenericSuccessResponse {
  message: string;
}
