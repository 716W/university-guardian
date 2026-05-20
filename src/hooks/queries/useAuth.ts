import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../lib/api/endpoints/auth';
import { LoginRequest, LoginResponse } from '../../types/auth';

export const useLogin = () => {
    return useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: loginUser,
    });
};
