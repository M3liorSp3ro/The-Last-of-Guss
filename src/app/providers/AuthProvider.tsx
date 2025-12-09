import { getMe } from '@/shared/api/auth';
import { User } from '@/shared/types/auth';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextValue {
    user: User | null;
    isReady: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);

    const loginFn = (token: string, user: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsReady(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsReady(true);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsReady(true);
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                const me = await getMe();
                if (!cancelled) {
                    setUser(me);
                    localStorage.setItem('user', JSON.stringify(me));
                    setIsReady(true);
                }
            } catch (e) {
                if (!cancelled) {
                    // токен невалиден
                    logout();
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, isReady, login: loginFn, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
