export type RoundStatus = 'active' | 'cooldown' | 'finished';

export interface RoundListItem {
    id: string;
    startTime: string;
    endTime: string;
    totalScore: number;
    createdAt: string;
    status?: RoundStatus;
}

export interface Pagination {
    limit: number;
    nextCursor: string | null;
    hasMore: boolean;
}

export interface RoundsListResponse {
    data: RoundListItem[];
    pagination: Pagination;
}

export interface GetRoundsParams {
    cursor?: string;
    limit?: number;
    status?: RoundStatus;
}

export type Round = RoundListItem

export type CreateRoundResponse = Round;

export interface BackendRoundCore {
    id: string;
    startTime: string;
    endTime: string;
    totalScore: number;
    createdAt: string;
}

interface BackendTopStat {
    taps: number;
    score: number;
    user: {
        username: string;
    };
}

interface BackendMyStats {
    taps: number;
    score: number;
}

export interface BackendRoundDetailsResponse {
    round: BackendRoundCore;
    topStats: BackendTopStat[];
    myStats: BackendMyStats;
}

export interface RoundDetails {
    id: string;
    startTime: string;
    endTime: string;
    createdAt: string;
    totalScore: number;

    status: RoundStatus;

    myScore: number;
    myTaps: number;

    topStats: BackendTopStat[];

    winnerName?: string;
    winnerScore?: number;
}

export interface TapResponse {
    taps: number;
    score: number;
}