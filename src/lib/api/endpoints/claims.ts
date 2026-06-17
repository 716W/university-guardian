import { apiClient } from '../apiClient';
import { PaginatedApiResponse, ApiResponse } from '../../../types/api';
import { ClaimListItem, ClaimDetails } from '../../../types/claim';

export interface GetAdminClaimsParams {
  pageNumber?: number;
  pageSize?: number;
}

export const fetchAdminClaims = async (params: GetAdminClaimsParams): Promise<PaginatedApiResponse<ClaimListItem[]>> => {
  const { data } = await apiClient.get<PaginatedApiResponse<ClaimListItem[]>>('/api/v1/admin/claims', { params });
  return data;
};

export const fetchClaimById = async (id: number | string): Promise<ApiResponse<ClaimDetails>> => {
  const { data } = await apiClient.get<ApiResponse<ClaimDetails>>(`/api/v1/admin/claims/${id}`);
  return data;
};

export const approveClaim = async (id: number | string): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.put<ApiResponse<null>>(`/api/v1/admin/claims/${id}/approve`, {});
  return data;
};

export const rejectClaim = async (id: number | string): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.put<ApiResponse<null>>(`/api/v1/admin/claims/${id}/reject`, {});
  return data;
};
