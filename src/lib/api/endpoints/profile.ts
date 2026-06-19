import { apiClient } from '../apiClient';
import type { ApiResponse } from '@/types/api';
import type { UpdateMyProfileRequest, MyProfileResponse } from '@/types/user';

/**
 * PUT /api/v1/profile/me
 *
 * The endpoint accepts multipart/form-data because it can receive a binary
 * ProfileImage file. We therefore build FormData manually and let Axios detect
 * the boundary automatically — do NOT hard-code "multipart/form-data" with a
 * boundary string, just set the header key so Axios replaces the default JSON
 * header. Axios will set the correct boundary automatically when the body is
 * a FormData instance.
 */
export const updateMyProfile = async (
  payload: UpdateMyProfileRequest,
): Promise<ApiResponse<MyProfileResponse>> => {
  const formData = new FormData();
  formData.append('Name', payload.name);
  formData.append('Email', payload.email);
  if (payload.profileImage) {
    formData.append('ProfileImage', payload.profileImage);
  }

  const { data } = await apiClient.put<ApiResponse<MyProfileResponse>>(
    '/api/v1/profile/me',
    formData,
    {
      headers: {
        // Telling Axios to use multipart/form-data; Axios will automatically
        // add the correct multipart boundary when the body is a FormData instance.
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data;
};
