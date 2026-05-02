export type AdminRole = 'superadmin' | 'editor';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: AdminRole;
  active: boolean;
  last_login: Date | null;
  created_at: Date;
}

/** AdminUser without the password hash — safe to expose in responses */
export type AdminUserPublic = Omit<AdminUser, 'password_hash'>;

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateAdminUserDto {
  name: string;
  email: string;
  password: string;
  role?: AdminRole;
}

export interface JwtPayload {
  id: number;
  email: string;
  role: AdminRole;
}
