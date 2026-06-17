import { apiClient } from '../apiClient';
import { ApiResponse } from '../../../types/api';
import { LoginRequest, LoginResponse, UserProfile, LogoutResponse } from '../../../types/auth';

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/api/v1/auth/login', credentials);

    if (!data.succeeded) {
        throw new Error(data.message || 'Login failed');
    }

    return data.data;
};

export const getProfile = async (): Promise<UserProfile> => {
    const { data } = await apiClient.get<ApiResponse<UserProfile>>('/api/v1/profile/me');

    if (!data.succeeded) {
        throw new Error(data.message || 'Failed to fetch profile');
    }

    return data.data;
};

export const logoutUser = async (): Promise<LogoutResponse> => {
    // The response is already { succeeded: true, message: ... } based on the request
    const { data } = await apiClient.post<LogoutResponse>('/api/v1/auth/logout');
    return data;
};
