import { RoundListItem, RoundStatus } from "@/shared/types/rounds";

export type StatusFilter = RoundStatus | 'all';

export interface UseRoundsListResult {
    rounds: RoundListItem[];
    isPending: boolean;
    isError: boolean;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
}

export interface UseCreateRoundResult {
    create: () => void;
    isPending: boolean;
}