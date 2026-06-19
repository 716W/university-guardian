import { useMutation } from '@tanstack/react-query';
import { updateMyProfile } from '@/lib/api/endpoints/profile';
import type { UpdateMyProfileRequest } from '@/types/user';

/**
 * useUpdateMyProfile
 *
 * Mutation hook for PUT /api/v1/profile/me.
 * The mutationFn delegates to the profile endpoint which internally
 * builds FormData and sets Content-Type: multipart/form-data.
 */
export const useUpdateMyProfile = () => {
  return useMutation({
    mutationFn: (payload: UpdateMyProfileRequest) => updateMyProfile(payload),
  });
};
