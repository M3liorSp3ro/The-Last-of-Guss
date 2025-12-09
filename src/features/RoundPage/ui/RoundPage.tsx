import {
    tapGoose,
} from '@/shared/api/rounds';
import { TapResponse } from '@/shared/types/rounds';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useRound } from '../hooks';
import { getGooseImage, getStatusTitle } from '../utils';

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

    // выбираем подходящее изображение
    const gooseImage = getGooseImage(localScore);

    const { mutate: tapMutation, isError: tapError } = useMutation<TapResponse>({
        mutationFn: () => tapGoose(id),
        onSuccess: (data) => {
            setLocalScore(data.score);
        },
    });

    const canTap = Boolean(isActive);

    const handleTap = () => {
        if (!canTap) return;

        setLocalScore((prev) => prev + 1);

        tapMutation();
    };

    useEffect(() => {
        if (round) {
            setLocalScore(round.myScore);
        }
    }, [round]);

    useEffect(() => {
        if (!round) return;

        if (!isFinished) {
            setFinishRefetched(false);
            return;
        }

        if (finishRefetched) return;

        setFinishRefetched(true);
        refetch(); // подгружаем totalScore, winner и т.д.
    }, [isFinished, finishRefetched, refetch, round]);

    if (roundPending || !round) {
        return <div className={styles.container}>Loading...</div>;
    }

    if (roundError) {
        return <div className={styles.container}>Couldn't load round</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span>{getStatusTitle(clientStatus)}</span>
            </div>

            <div className={styles.content}>
                <div className={styles.gooseCard}>

                    {/* Картинка гуся */}
                    <div
                        className={clsx(
                            styles.gooseBox,
                            canTap && styles.gooseBox_active,
                        )}
                        onClick={handleTap}
                    >
                        <img
                            src={gooseImage}
                            alt="Goose"
                            className={styles.gooseImage}
                        />
                    </div>
                    <p className={styles.gooseTapTitle}>TAP THE GUSSSSSSSSSSSSS</p>


                    {/* === ACTIVE === */}
                    {isActive && (
                        <>
                            <div className={styles.statsRow}>The round is active!</div>
                            <div className={styles.statsRow}>
                                {timer.label}: {timer.value}
                            </div>
                            <div className={styles.statsRow}>
                                My points – {localScore}
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
                                Total – {round.totalScore}
                            </div>

                            {round.winnerName && (
                                <div className={styles.statsRow}>
                                    Winner – {round.winnerName} {round.winnerScore}
                                </div>
                            )}

                            <div className={styles.statsRow}>
                                My points – {localScore}
                            </div>
                        </>
                    )}

                    {tapError && (
                        <div className={styles.error}>Couldn't send a tap</div>
                    )}
                </div>
            </div>
        </div>
    );
}
