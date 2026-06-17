import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUsers,
  addUser,
  updateUserProfile,
  changeUserRole,
  toggleBanUser,
  resetUserPassword,
} from '@/lib/api/endpoints/users';
import type { AddUserRequest, UpdateProfileRequest, ChangeRoleRequest, User } from '@/types/user';
import type { PaginatedApiResponse, ApiResponse } from '@/types/api';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const userKeys = {
  all: ['users'] as const,
  list: (page: number, pageSize: number, search?: string, role?: string) =>
    [...userKeys.all, 'list', page, pageSize, search, role] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useGetUsers = (
  page: number,
  pageSize: number,
  search?: string,
  role?: string,
) => {
  return useQuery({
    queryKey: userKeys.list(page, pageSize, search, role),
    queryFn: () => getUsers(page, pageSize, search, role),
    placeholderData: (prev) => prev,
  });
};

// ─── Helper — build the paginated cache key used inside mutations ──────────────

type CacheUpdateFn = (old: PaginatedApiResponse<User[]> | undefined) => PaginatedApiResponse<User[]> | undefined;

const applyPaginatedUpdate = (
  queryClient: ReturnType<typeof useQueryClient>,
  queryKey: readonly unknown[],
  updater: CacheUpdateFn,
) => {
  queryClient.setQueryData<PaginatedApiResponse<User[]>>(queryKey, updater);
};

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * useAddUser — appends the new user to page 1 of the current cache slice.
 * Keeps total record count in sync.
 */
export const useAddUser = (
  page: number,
  pageSize: number,
  search?: string,
  role?: string,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addUser,
    onSuccess: (response: ApiResponse<User>) => {
      const queryKey = userKeys.list(page, pageSize, search, role);
      applyPaginatedUpdate(queryClient, queryKey, (old) => {
        if (!old) return old;
        const newData = [response.data, ...(old.data ?? [])].slice(0, pageSize);
        return {
          ...old,
          data: newData,
          totalRecords: old.totalRecords + 1,
        };
      });
    },
  });
};

/**
 * useUpdateUser — replaces the matching user record in-place.
 */
export const useUpdateUser = (
  page: number,
  pageSize: number,
  search?: string,
  role?: string,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProfileRequest }) =>
      updateUserProfile(id, payload),
    onSuccess: (response: ApiResponse<User>) => {
      const queryKey = userKeys.list(page, pageSize, search, role);
      applyPaginatedUpdate(queryClient, queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: (old.data ?? []).map((u) =>
            u.id === response.data.id ? response.data : u,
          ),
        };
      });
    },
  });
};

/**
 * useChangeRole — patches only the `role` field of the matching user in cache.
 */
export const useChangeRole = (
  page: number,
  pageSize: number,
  search?: string,
  role?: string,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ChangeRoleRequest }) =>
      changeUserRole(id, payload),
    onSuccess: (response: ApiResponse<User>) => {
      const queryKey = userKeys.list(page, pageSize, search, role);
      applyPaginatedUpdate(queryClient, queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: (old.data ?? []).map((u) =>
            u.id === response.data.id ? response.data : u,
          ),
        };
      });
    },
  });
};

/**
 * useToggleBanUser — toggles the ban status of the matching user in cache.
 */
export const useToggleBanUser = (
  page: number,
  pageSize: number,
  search?: string,
  role?: string,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleBanUser(id),
    onSuccess: (response: ApiResponse<User>) => {
      const queryKey = userKeys.list(page, pageSize, search, role);
      applyPaginatedUpdate(queryClient, queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: (old.data ?? []).map((u) =>
            u.id === response.data.id ? response.data : u,
          ),
        };
      });
    },
  });
};

/**
 * useResetPasswordUser — triggers a password reset for the matching user.
 */
export const useResetPasswordUser = () => {
  return useMutation({
    mutationFn: (id: string) => resetUserPassword(id),
  });
};
