import { getRound, tapGoose, type RoundDetails } from '@/shared/api/rounds';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './RoundPage.module.scss';

function formatDiff(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}

function useTimer(round?: RoundDetails) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    if (!round) return { label: '', value: '' };

    const start = new Date(round.startTime).getTime();
    const end = new Date(round.endTime).getTime();

    if (round.status === 'active') {
        const diff = Math.max(0, end - now);
        return { label: 'До конца осталось', value: formatDiff(diff) };
    }

    if (round.status === 'cooldown' || round.status === 'scheduled') {
        const diff = Math.max(0, start - now);
        return { label: 'до начала раунда', value: formatDiff(diff) };
    }

    return { label: '', value: '' };
}

export function RoundPage() {
    const { id } = useParams<{ id: string }>();
    const qc = useQueryClient();

    const { data: round } = useQuery({
        queryKey: ['round', id],
        queryFn: () => getRound(id!),
        refetchInterval: 1000,
        enabled: Boolean(id),
    });

    const tapMutation = useMutation({
        mutationFn: () => tapGoose(id!),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['round', id] });
        },
    });

    const timer = useTimer(round);
    const canTap = round?.status === 'active' && !tapMutation.isPending;

    const handleTap = () => {
        if (!canTap) return;
        tapMutation.mutate();
    };

    if (!round) {
        return <div className={styles.container}>Загрузка…</div>;
    }

    const isFinished = round.status === 'finished';

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {/* Левая карточка с гусём */}
                <div className={styles.gooseCard}>
                    <div
                        className={clsx(
                            styles.gooseBox,
                            canTap && styles.gooseBox_active,
                        )}
                        onClick={handleTap}
                    >
                        {canTap ? 'Тапни по гусю!' : 'Гусь недоступен'}
                    </div>

                    {!isFinished && (
                        <>
                            <div className={styles.statsRow}>
                                {round.status === 'active' ? 'Раунд активен!' : 'Cooldown'}
                            </div>
                            {timer.label && (
                                <div className={styles.statsRow}>
                                    {timer.label}: {timer.value}
                                </div>
                            )}
                            <div className={styles.statsRow}>Мои очки - {round.myPoints}</div>
                        </>
                    )}

                    {isFinished && (
                        <>
                            <hr style={{ margin: '12px 0' }} />
                            <div className={styles.statsRow}>Всего {round.totalPoints}</div>
                            <div className={styles.statsRow}>
                                Победитель - {round.winnerName} {round.winnerPoints}
                            </div>
                            <div className={styles.statsRow}>Мои очки {round.myPoints}</div>
                        </>
                    )}
                </div>

                {/* Правая колонка с подсказками, как на мокапе */}
                <div className={styles.rightText}>
                    <p>← состояние раунда меняется, когда приходит время</p>
                    <p>← счетчик времени, обновляется раз в секунду</p>
                    <p>← мои очки обновляются при каждом тапе</p>
                </div>
            </div>
        </div>
    );
}
