import { useAuth } from '@/app/providers/AuthProvider';
import { logoutRequest } from '@/shared/api/auth';
import { Button } from '@/shared/ui/Button/Button';
import { useMutation } from '@tanstack/react-query';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './Layout.module.scss';

export function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: logoutRequest,
        onSettled: () => {
            // даже если запрос упал, локально просто чистим сессию
            logout();
            navigate('/login');
        },
    });

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <span>THE LAST OF GUSS</span>

                <span>
                    {user && (
                        <>
                            Player name: <b>{user.username}</b>{' '}
                            <Button
                                style={{ marginLeft: 8 }}
                                onClick={() => mutation.mutate()}
                            >
                                Logout
                            </Button>
                        </>
                    )}
                </span>
            </div>

            <Outlet />
        </div>
    );
}
