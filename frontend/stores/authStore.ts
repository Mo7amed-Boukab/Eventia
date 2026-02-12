import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types';
import authService from '@/lib/services/authService';

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
                    // Tokens are set as httpOnly cookies by the server
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
                    // Tokens are set as httpOnly cookies by the server
                    set({ user: response.user, isAuthenticated: true, error: null });
                } catch (err: any) {
                    const message = err.response?.data?.message || 'Échec de l\'inscription.';
                    set({ error: message });
                    throw err;
                }
            },

            logout: async () => {
                try {
                    // Server clears the httpOnly cookies
                    await authService.logout();
                } catch (err) {
                    console.error('Logout API call failed:', err);
                } finally {
                    // Clear persisted state from localStorage
                    localStorage.removeItem('auth-storage');
                    set({ user: null, isAuthenticated: false, error: null });
                }
            },

            checkAuth: async () => {
                // Utiliser le state persisté comme hint
                const persisted = localStorage.getItem('auth-storage');
                if (!persisted) {
                    // Pas de session persistée → visiteur, pas d'appel API
                    set({ user: null, isAuthenticated: false, isLoading: false });
                    return;
                }

                try {
                    // Cookie is sent automatically — server validates
                    const userData = await authService.getProfile();
                    set({ user: userData, isAuthenticated: true, isLoading: false });
                } catch {
                    // Cookie expiré → nettoyer le persist
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
