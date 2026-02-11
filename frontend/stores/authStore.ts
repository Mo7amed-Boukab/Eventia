import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types';
import authService from '@/lib/services/authService';
import { userService } from '@/lib/services/userService';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    setUser: (user: User | null) => void;
    clearError: () => void;
    resetStore: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: true,
            isAuthenticated: false,
            error: null,

            login: async (email: string, password: string) => {
                try {
                    set({ error: null });
                    const response = await authService.login({ email, password });
                    authService.setTokens(response.access_token, response.refresh_token);
                    set({ user: response.user, isAuthenticated: true, error: null });
                } catch (err: any) {
                    const message = err.response?.data?.message || 'Échec de la connexion.';
                    set({ error: message });
                    throw err;
                }
            },

            register: async (firstName: string, lastName: string, email: string, password: string) => {
                try {
                    set({ error: null });
                    const response = await authService.register({
                        first_name: firstName,
                        last_name: lastName,
                        email,
                        password,
                    });
                    authService.setTokens(response.access_token, response.refresh_token);
                    set({ user: response.user, isAuthenticated: true, error: null });
                } catch (err: any) {
                    const message = err.response?.data?.message || 'Échec de l\'inscription.';
                    set({ error: message });
                    throw err;
                }
            },

            logout: async () => {
                try {
                    await authService.logout();
                } catch (err) {
                    // authService.logout() already clears tokens in its own finally block
                    console.error('Logout API call failed:', err);
                } finally {
                    // Always clear everything regardless of API success
                    authService.clearTokens();
                    localStorage.removeItem('auth-storage');
                    set({ user: null, isAuthenticated: false, error: null });
                }
            },

            checkAuth: async () => {
                const accessToken = authService.getAccessToken();

                if (!accessToken) {
                    set({ isLoading: false, isAuthenticated: false, user: null });
                    return;
                }

                try {
                    const userData = await userService.getMe();
                    set({ user: userData, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    authService.clearTokens();
                    localStorage.removeItem('auth-storage');
                    set({ user: null, isAuthenticated: false, isLoading: false });
                }
            },

            setUser: (user: User | null) => {
                set({ user, isAuthenticated: !!user });
            },

            clearError: () => {
                set({ error: null });
            },

            resetStore: () => {
                authService.clearTokens();
                localStorage.removeItem('auth-storage');
                set({ user: null, isAuthenticated: false, isLoading: false, error: null });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
