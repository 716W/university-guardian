import { apiClient } from '../apiClient';
import type { ApiResponse, PaginatedApiResponse } from '@/types/api';
import type {
  User,
  AddUserRequest,
  UpdateProfileRequest,
  ChangeRoleRequest,
} from '@/types/user';

// GET /api/v1/admin/users?pageNumber=&pageSize=&searchTerm=&role=
export const getUsers = async (
  pageNumber: number,
  pageSize: number,
  searchTerm?: string,
  role?: string,
): Promise<PaginatedApiResponse<User[]>> => {
  const params: Record<string, unknown> = { pageNumber, pageSize };
  if (searchTerm) params.searchTerm = searchTerm;
  // Only forward a real role value — not the sentinel "all"
  if (role && role !== 'all') params.role = role;

  const { data } = await apiClient.get<PaginatedApiResponse<User[]>>(
    '/api/v1/admin/users',
    { params },
  );
  return data;
};

// POST /api/v1/admin/users
export const addUser = async (
  payload: AddUserRequest,
): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.post<ApiResponse<User>>(
    '/api/v1/admin/users',
    payload,
  );
  return data;
};

// PUT /api/v1/admin/users/{id}
export const updateUserProfile = async (
  id: string,
  payload: UpdateProfileRequest,
): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.put<ApiResponse<User>>(
    `/api/v1/admin/users/${id}`,
    payload,
  );
  return data;
};

// PATCH /api/v1/admin/users/{id}/role
export const changeUserRole = async (
  id: string,
  payload: ChangeRoleRequest,
): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.patch<ApiResponse<User>>(
    `/api/v1/admin/users/${id}/role`,
    payload,
  );
  return data;
};

// PATCH /api/v1/admin/users/{id}/block
export const toggleBanUser = async (id: string): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.patch<ApiResponse<User>>(
    `/api/v1/admin/users/${id}/block`,
  );
  return data;
};

// POST /api/v1/admin/users/{id}/reset-password
export const resetUserPassword = async (
  id: string,
): Promise<ApiResponse<{ newPassword: string }>> => {
  const { data } = await apiClient.post<ApiResponse<{ newPassword: string }>>(
    `/api/v1/admin/users/${id}/reset-password`,
  );
  return data;
};
