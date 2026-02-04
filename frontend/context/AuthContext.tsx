"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../lib/types';
import authService from '../lib/services/authService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        const accessToken = authService.getAccessToken();

        if (!accessToken) {
            setIsLoading(false);
            return;
        }

        try {
            const userData = await authService.getProfile();
            setUser(userData);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            authService.clearTokens();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login({ email, password });
            authService.setTokens(response.access_token, response.refresh_token);
            setUser(response.user);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) => {
        try {
            const response = await authService.register({
                first_name: firstName,
                last_name: lastName,
                email,
                password,
            });
            authService.setTokens(response.access_token, response.refresh_token);
            setUser(response.user);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};
