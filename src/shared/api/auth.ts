import { api } from './client';

export type UserRole = 'SURVIVOR' | 'ADMIN';

export interface AuthResponse {
    username: string;
    role: UserRole;
    token: string;
}

// Наша модель пользователя внутри приложения
export interface User {
    username: string;
    role: UserRole;
    isAdmin: boolean;
}

export interface LoginResult {
    user: User;
    token: string;
}

export interface MeResponse {
    username: string;
    role: UserRole;
}

export interface LogoutResponse {
    success: boolean;
}

export async function login(username: string, password: string): Promise<LoginResult> {
    const { data } = await api.post<AuthResponse>('/auth/login', {
        username,
        password,
    });

    const user: User = {
        username: data.username,
        role: data.role,
        isAdmin: data.role === 'ADMIN',
    };

    return {
        user,
        token: data.token,
    };
}

export async function getMe(): Promise<User> {
    const { data } = await api.get<MeResponse>('/auth/me');

    return {
        username: data.username,
        role: data.role,
        isAdmin: data.role === 'ADMIN',
    };
}

export async function logoutRequest(): Promise<boolean> {
    const { data } = await api.post<LogoutResponse>('/auth/logout');
    return data.success;
}
