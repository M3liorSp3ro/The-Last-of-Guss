import { useAuth } from '@/app/providers/AuthProvider';
import { RoundCard } from '@/entities/RoundCard';
import { createRound, getRounds } from '@/shared/api/rounds';
import { Button } from '@/shared/ui/Button/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import styles from './RoundsListPage.module.scss';

export function RoundsListPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['rounds'],
        queryFn: getRounds,
        refetchInterval: 5000,
    });

    const { user } = useAuth();
    const qc = useQueryClient();
    const navigate = useNavigate();

    const createMutation = useMutation({
        mutationFn: createRound,
        onSuccess: (round) => {
            qc.invalidateQueries({ queryKey: ['rounds'] });
            navigate(`/rounds/${round.id}`);
        },
    });

    return (
        <div className={styles.container}>
            {user?.isAdmin && (
                <div className={styles.createWrapper}>
                    <Button
                        variant="primary"
                        onClick={() => createMutation.mutate()}
                        disabled={createMutation.isPending}
                    >
                        Создать раунд
                    </Button>
                </div>
            )}

            {isLoading && <div>Загрузка…</div>}
            {error && <div className={styles.error}>Ошибка загрузки раундов</div>}

            <div className={styles.list}>
                {data?.map((round) => (
                    <RoundCard key={round.id} round={round} />
                ))}
            </div>
        </div>
    );
}
