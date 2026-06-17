import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { loginUser, getProfile, logoutUser } from '../../lib/api/endpoints/auth';
import { LoginRequest, LoginResponse, UserProfile, LogoutResponse } from '../../types/auth';

export const useLogin = () => {
    return useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: loginUser,
    });
};

export const useGetProfile = () => {
    return useQuery<UserProfile, Error>({
        queryKey: ['profile', 'me'],
        queryFn: getProfile,
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    return useMutation<LogoutResponse, Error, void>({
        mutationFn: logoutUser,
        onSuccess: () => {
            logout();
            queryClient.clear();
            navigate('/login', { replace: true });
        },
    });
};
