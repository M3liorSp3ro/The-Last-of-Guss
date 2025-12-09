import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { createRound, getRounds } from '@/shared/api/rounds';
import { RoundListItem } from '@/shared/types/rounds';
import { useNavigate } from 'react-router-dom';
import type { StatusFilter, UseCreateRoundResult, UseRoundsListResult } from '../types';



export function useRoundsList(statusFilter: StatusFilter): UseRoundsListResult {
    const {
        data,
        isPending,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['rounds', statusFilter],
        queryFn: ({ pageParam }: { pageParam?: string }) =>
            getRounds({
                cursor: pageParam,
                limit: 10,
                status: statusFilter === 'all' ? undefined : statusFilter,
            }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) =>
            lastPage.pagination.hasMore
                ? lastPage.pagination.nextCursor ?? undefined
                : undefined,
        refetchInterval: 10000, // оставил как у тебя; если что — потом уберём
    });

    const rounds: RoundListItem[] =
        data?.pages.flatMap((page) => page.data) ?? [];

    const sortedRounds = [...rounds].sort(
        (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );

    return {
        rounds: sortedRounds,
        isPending,
        isError,
        fetchNextPage,
        hasNextPage: Boolean(hasNextPage),
        isFetchingNextPage,
    };
}



export function useCreateRound(): UseCreateRoundResult {
    const qc = useQueryClient();
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: createRound,
        onSuccess: (round) => {
            qc.invalidateQueries({ queryKey: ['rounds'] });
            navigate(`/rounds/${round.id}`);
        },
    });

    return {
        create: () => mutate(),
        isPending,
    };
}
