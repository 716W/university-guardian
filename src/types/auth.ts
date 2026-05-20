export interface LoginRequest {
    email: string;
    password: string;
    fcmToken?: string;
}

export interface LoginResponse {
    token: string;
    refreshToken: string;
}
