export type UserRole = 'User' | 'Admin';

export const USER_ROLES: UserRole[] = ['User', 'Admin'];

export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  created: string;
  roles: string[];
  reportsCount: number;
  claimsCount: number;
}

// ─── Request shapes ───────────────────────────────────────────────────────────

export interface AddUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
}

export interface ChangeRoleRequest {
  role: string;
}

// ─── My-Profile ───────────────────────────────────────────────────────────────

export interface UpdateMyProfileRequest {
  name: string;
  email: string;
  profileImage?: File | null;
}

export interface MyProfileResponse {
  name: string;
  email: string;
  avatarUrl: string;
}
