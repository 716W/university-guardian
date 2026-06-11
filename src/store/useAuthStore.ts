import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { extractRolesFromToken } from '../lib/authUtils';
import { jwtDecode } from 'jwt-decode';

export type Role = 'Admin' | 'Super Admin' | string;

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    role: Role | null;
    isInitialized: boolean;
    isAuthenticated: boolean;
    setTokens: (token: string, refreshToken?: string) => void;
    logout: () => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            refreshToken: null,
            role: null,
            isInitialized: false,
            isAuthenticated: false,
            setTokens: (token: string, refreshToken?: string) => {
                try {
                    const roles = extractRolesFromToken(token);

                    // Prioritize getting the most privileged role for the main state mapping
                    let userRole = null;
                    if (roles.includes("Super Admin") || roles.includes("SuperAdmin")) {
                        userRole = "Super Admin";
                    } else if (roles.includes("Admin")) {
                        userRole = "Admin";
                    } else if (roles.length > 0) {
                        userRole = roles[0];
                    }

                    set({ token, refreshToken: refreshToken || null, role: userRole, isAuthenticated: true });
                } catch (e) {
                    console.error("Invalid token", e);
                    set({ token: null, refreshToken: null, role: null, isAuthenticated: false });
                }
            },
            logout: () => set({ token: null, refreshToken: null, role: null, isAuthenticated: false }),
            initialize: () => {
                const { token } = get();
                if (token) {
                    try {
                        const decoded = jwtDecode(token);
                        const currentTime = Date.now() / 1000;
                        if (decoded.exp && decoded.exp > currentTime) {
                            set({ isAuthenticated: true, isInitialized: true });
                            return;
                        }
                    } catch (e) {
                        console.error("Token validation failed during initialization:", e);
                    }
                }
                set({ token: null, refreshToken: null, role: null, isAuthenticated: false, isInitialized: true });
            }
        }),
        {
            name: 'auth-storage', // saves to localStorage
            partialize: (state) => ({ 
                token: state.token, 
                refreshToken: state.refreshToken, 
                role: state.role 
            }),
            onRehydrateStorage: () => (state) => {
                state?.initialize();
            }
        }
    )
);
