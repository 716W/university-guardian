import { apiClient } from '../apiClient';
import { HandoverResponse } from '../../../types/handover';

export interface BaseResponse<T> {
  succeeded: boolean;
  data: T;
  message: string;
  errors: string[] | null;
}

export const createHandover = async (formData: FormData): Promise<BaseResponse<HandoverResponse>> => {
  const response = await apiClient.post<BaseResponse<HandoverResponse>>('/api/v1/admin/handovers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getHandoverDetails = async (id: number | string): Promise<BaseResponse<HandoverResponse>> => {
  const response = await apiClient.get<BaseResponse<HandoverResponse>>(`/api/v1/admin/handovers/${id}`);
  return response.data;
};

export const getHandoverByClaim = async (claimId: number | string): Promise<BaseResponse<HandoverResponse>> => {
  const response = await apiClient.get<BaseResponse<HandoverResponse>>(`/api/v1/admin/handovers/claim/${claimId}`);
  return response.data;
};
