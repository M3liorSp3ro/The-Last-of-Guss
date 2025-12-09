import {
    tapGoose,
} from '@/shared/api/rounds';
import { TapResponse } from '@/shared/types/rounds';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRound } from '../hooks';
import { getStatusTitle } from '../utils';
import styles from './RoundPage.module.scss';

export function RoundPage() {
    const { id } = useParams<{ id: string }>();

    const [localScore, setLocalScore] = useState(0);
    const [finishRefetched, setFinishRefetched] = useState(false);

    if (!id) {
        return <div className={styles.container}>Не передан id раунда</div>;
    }

    const {
        round,
        isPending: roundPending,
        isError: roundError,
        clientStatus,
        timer,
        refetch,
    } = useRound(id);


    const isFinished = clientStatus === 'finished';
    const isActive = clientStatus === 'active';
    const isCooldown = clientStatus === 'cooldown';



    const { mutate: tapMutation, isError: tapError } = useMutation<TapResponse>({
        mutationFn: () => tapGoose(id),
        onSuccess: (data) => {
            // серверный результат подравниваем локальные значения
            setLocalScore(data.score);
        },
    });

    // клики разрещены, пока раунд активен
    const canTap = Boolean(isActive);

    const handleTap = () => {
        if (!canTap) return;

        setLocalScore((prev) => prev + 1);

        tapMutation();
    };

    // при первом получении раунда синхронизируем локальные очки
    useEffect(() => {
        if (round) {
            setLocalScore(round.myScore);
        }
    }, [round]);

    // когда раунд впервые стал finished один раз подтягиваем финальную статистику
    useEffect(() => {
        if (!round) return;
        if (!isFinished) {
            setFinishRefetched(false);
            return;
        }
        if (finishRefetched) return;

        setFinishRefetched(true);
        refetch(); // подтягиваем totalScore, winner и тд
    }, [isFinished, finishRefetched, refetch, round]);

    if (roundPending || !round) {
        return <div className={styles.container}>Загрузка…</div>;
    }

    if (roundError) {
        return <div className={styles.container}>Не удалось загрузить раунд</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span>{getStatusTitle(clientStatus)}</span>
            </div>

            <div className={styles.content}>
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

                    {/* === ACTIVE === */}
                    {isActive && (
                        <>
                            <div className={styles.statsRow}>Раунд активен!</div>
                            <div className={styles.statsRow}>
                                {timer.label}: {timer.value}
                            </div>
                            <div className={styles.statsRow}>
                                Мои очки - {localScore}
                            </div>
                        </>
                    )}

                    {/* === COOLDOWN === */}
                    {isCooldown && (
                        <>
                            <div className={styles.statsRow}>Cooldown</div>
                            <div className={styles.statsRow}>
                                {timer.label} {timer.value}
                            </div>
                        </>
                    )}

                    {/* === FINISHED === */}
                    {isFinished && (
                        <>
                            <hr style={{ margin: '12px 0' }} />
                            <div className={styles.statsRow}>
                                Всего&nbsp; {round.totalScore}
                            </div>
                            {round.winnerName && (
                                <div className={styles.statsRow}>
                                    Победитель - {round.winnerName}&nbsp; {round.winnerScore}
                                </div>
                            )}
                            <div className={styles.statsRow}>
                                Мои очки&nbsp; {localScore}
                            </div>
                        </>
                    )}

                    {tapError && (
                        <div className={styles.error}>Не удалось отправить тап</div>
                    )}
                </div>
            </div>
        </div>
    );
}
