import { apiClient } from '../apiClient';
import { ApiResponse } from '../../../types/api';
import { LoginRequest, LoginResponse } from '../../../types/auth';

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/api/v1/auth/login', credentials);

    if (!data.succeeded) {
        throw new Error(data.message || 'Login failed');
    }

    return data.data;
};
