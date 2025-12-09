// src/shared/api/rounds.ts
import { api } from '@/shared/api/client';
import { BackendRoundCore, BackendRoundDetailsResponse, CreateRoundResponse, GetRoundsParams, RoundDetails, RoundsListResponse, RoundStatus, TapResponse } from '../types/rounds';

export async function getRounds(params?: GetRoundsParams): Promise<RoundsListResponse> {
    const { data } = await api.get<RoundsListResponse>('/rounds', { params });
    return data;
}

export async function createRound(): Promise<CreateRoundResponse> {
    const { data } = await api.post<CreateRoundResponse>('/rounds');
    return data;
}

// вычисляем статус по времени
function calculateStatus(round: BackendRoundCore, now: number = Date.now()): RoundStatus {
    const start = new Date(round.startTime).getTime();
    const end = new Date(round.endTime).getTime();

    if (now < start) return 'cooldown';
    if (now >= start && now <= end) return 'active';
    return 'finished';
}

function mapBackendToRoundDetails(payload: BackendRoundDetailsResponse): RoundDetails {
    const { round, topStats, myStats } = payload;

    const status = calculateStatus(round);
    const winner = topStats[0];

    return {
        id: round.id,
        startTime: round.startTime,
        endTime: round.endTime,
        createdAt: round.createdAt,
        totalScore: round.totalScore,

        status,

        myScore: myStats.score,
        myTaps: myStats.taps,

        topStats,
        winnerName: winner?.user.username,
        winnerScore: winner?.score,
    };
}

export async function getRound(id: string): Promise<RoundDetails> {
    const { data } = await api.get<BackendRoundDetailsResponse>(`/rounds/${id}`);
    return mapBackendToRoundDetails(data);
}

export async function tapGoose(id: string): Promise<TapResponse> {
    const { data } = await api.post<TapResponse>(`/rounds/${id}/tap`);
    return data;
}

