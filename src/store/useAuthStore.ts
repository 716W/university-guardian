import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { extractRolesFromToken } from '../lib/authUtils';

export type Role = 'Admin' | 'Super Admin' | string;

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    role: Role | null;
    setTokens: (token: string, refreshToken?: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            refreshToken: null,
            role: null,
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

                    set({ token, refreshToken: refreshToken || null, role: userRole });
                } catch (e) {
                    console.error("Invalid token", e);
                    set({ token: null, refreshToken: null, role: null });
                }
            },
            logout: () => set({ token: null, refreshToken: null, role: null }),
        }),
        {
            name: 'auth-storage', // saves to localStorage
        }
    )
);
