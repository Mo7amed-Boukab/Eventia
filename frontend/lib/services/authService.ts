import apiClient from '../api-client';
import { AuthResponse, LoginData, RegisterData, User, RefreshTokenResponse } from '../types';

// Token management utilities
export const setTokens = (accessToken: string, refreshToken: string): void => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
};

export const getAccessToken = (): string | null => {
    return localStorage.getItem('access_token');
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refresh_token');
};

export const clearTokens = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

// Authentication API calls
export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
};

export const logout = async (): Promise<void> => {
    try {
        await apiClient.post('/auth/logout');
    } finally {
        clearTokens();
    }
};

export const refreshTokens = async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
        refresh_token: refreshToken,
    });
    return response.data;
};

export const getProfile = async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
};

const authService = {
    register,
    login,
    logout,
    refreshTokens,
    getProfile,
    setTokens,
    getAccessToken,
    getRefreshToken,
    clearTokens,
};

export default authService;
