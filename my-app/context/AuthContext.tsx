'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { authApi, userApi, getToken, setToken, removeToken } from '@/lib/api';

// ─── Context Shape ────────────────────────────────────────

interface AuthContextValue {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    updateUser: (data: UpdateData) => Promise<void>;
    deleteAccount: () => Promise<void>;
}

interface RegisterData {
    firstName: string;
    email: string;
    password: string;
    comfortLevel?: 'beginner' | 'medium' | 'advanced';
}

interface UpdateData {
    firstName?: string;
    comfortLevel?: string;
}

// ─── Context ──────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // On mount: restore session from localStorage
    useEffect(() => {
        const savedToken = getToken();
        if (savedToken) {
            setTokenState(savedToken);
            // Fetch user profile to validate token still works
            userApi
                .getMe()
                .then((res: any) => setUser(res.user))
                .catch(() => {
                    removeToken();
                    setTokenState(null);
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const res: any = await authApi.login({ email, password });
        setToken(res.token);
        setTokenState(res.token);
        setUser(res.user);
        router.push('/dashboard');
    };

    const register = async (data: RegisterData) => {
        const res: any = await authApi.register(data);
        setToken(res.token);
        setTokenState(res.token);
        setUser(res.user);
        router.push('/dashboard');
    };

    const logout = () => {
        removeToken();
        setTokenState(null);
        setUser(null);
        router.push('/');
    };

    const updateUser = async (data: UpdateData) => {
        const res: any = await userApi.updateMe(data);
        setUser(res.user);
    };

    const deleteAccount = async () => {
        await userApi.deleteMe();
        removeToken();
        setTokenState(null);
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider
            value={{ user, token, isLoading, login, register, logout, updateUser, deleteAccount }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
