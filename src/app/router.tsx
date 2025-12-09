import { LoginPage } from '@/features/LoginPage';
import { RoundPage } from '@/features/RoundPage';
import { RoundsListPage } from '@/features/RoundsListPage';
import { Layout } from '@/shared/ui/Layout/Layout';
import type { JSX } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from './providers/AuthProvider';

function PrivateRoute({ children }: { children: JSX.Element }) {
    const { user, isReady } = useAuth();

    // пока не знаем, авторизован ли — ничего не делаем / можно показать лоадер
    if (!isReady) {
        return null; // или <div>Загрузка...</div>
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: '/login', element: <LoginPage /> },
            {
                path: '/rounds',
                element: (
                    <PrivateRoute>
                        <RoundsListPage />
                    </PrivateRoute>
                ),
            },
            {
                path: '/rounds/:id',
                element: (
                    <PrivateRoute>
                        <RoundPage />
                    </PrivateRoute>
                ),
            },
            { path: '/', element: <Navigate to="/rounds" replace /> },
            { path: '*', element: <Navigate to="/rounds" replace /> },
        ],
    },
]);
