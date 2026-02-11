import apiClient from '../api-client';
import { User } from '../types';

export const userService = {
    getAll: async (): Promise<User[]> => {
        const response = await apiClient.get('/users');
        return response.data;
    },

    getMe: async (): Promise<User> => {
        const response = await apiClient.get('/users/me');
        return response.data;
    },

    updateMe: async (data: Partial<User>): Promise<User> => {
        const response = await apiClient.patch('/users/me', data);
        return response.data;
    },

    changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
        await apiClient.patch('/users/me/password', { oldPassword, newPassword });
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/users/${id}`);
    },
};
