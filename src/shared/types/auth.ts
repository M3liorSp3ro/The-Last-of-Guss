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