export interface LoginRequest {
    email: string;
    password: string;
    fcmToken?: string;
}

export interface LoginResponse {
    token: string;
    refreshToken: string;
}

export interface UserProfile {
    name: string;
    email: string;
    avatarUrl: string | null;
}

export interface LogoutResponse {
    succeeded: boolean;
    message: string;
}
