import { useState } from 'react';

import { useAuth } from '@/app/providers/AuthProvider';
import { RoundCard } from '@/entities/RoundCard';
import { Button } from '@/shared/ui/Button/Button';

import { STATUS_OPTIONS } from '../consts';
import type { StatusFilter } from '../types';

import { useCreateRound, useRoundsList } from '../hooks';
import styles from './RoundsListPage.module.scss';

export function RoundsListPage() {
    const { user } = useAuth();
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    const {
        rounds,
        isPending: roundsPending,
        isError: roundsError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useRoundsList(statusFilter);

    const { create, isPending: createPending } = useCreateRound();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span>List of ROUNDS</span>
                <span className={styles.headerRight}>
                    {user && (
                        <span>
                            Player name: <b>{user.username}</b>
                        </span>
                    )}
                    {user?.isAdmin && (
                        <Button
                            variant="primary"
                            onClick={create}
                            disabled={createPending}
                        >
                            Create a round
                        </Button>
                    )}
                </span>
            </div>

            <div className={styles.filters}>
                {STATUS_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        className={
                            opt.value === statusFilter
                                ? styles.filterButton_active
                                : styles.filterButton
                        }
                        onClick={() => setStatusFilter(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {roundsPending && <div>Loading...</div>}
            {roundsError && (
                <div className={styles.error}>Couldn't load rounds</div>
            )}

            {!roundsPending && !rounds.length && (
                <div className={styles.empty}>There are no rounds yet</div>
            )}

            <div className={styles.list}>
                {rounds.map((round) => (
                    <RoundCard key={round.id} round={round} />
                ))}
            </div>

            {hasNextPage && (
                <div className={styles.loadMoreWrapper}>
                    <Button
                        variant="default"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        {isFetchingNextPage ? 'Loading...' : 'Load more'}
                    </Button>
                </div>
            )}
        </div>
    );
}
