import apiClient from '../api-client';
import { AuthResponse, LoginData, RegisterData, User } from '../types';

// Authentication API calls — tokens are managed via httpOnly cookies

export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
};

export const logout = async (): Promise<void> => {
    await apiClient.post('/auth/logout');
};

export const refreshTokens = async (): Promise<void> => {
    await apiClient.post('/auth/refresh');
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
};

export default authService;
