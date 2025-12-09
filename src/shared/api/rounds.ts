import { api } from './client';

export type RoundStatus = 'active' | 'cooldown' | 'finished' | 'scheduled';

export interface Round {
    id: string;
    status: RoundStatus;
    startTime: string;
    endTime: string;
}

export interface RoundListItem extends Round { }

export interface RoundDetails extends Round {
    totalPoints: number;
    myPoints: number;
    winnerName: string | null;
    winnerPoints: number | null;
}

// GET список раундов
export async function getRounds(): Promise<RoundListItem[]> {
    const { data } = await api.get<RoundListItem[]>('/api/rounds');
    return data;
}

// POST создать раунд (админ)
export async function createRound(): Promise<RoundDetails> {
    const { data } = await api.post<RoundDetails>('/api/rounds');
    return data;
}

// GET детали раунда
export async function getRound(id: string): Promise<RoundDetails> {
    const { data } = await api.get<RoundDetails>(`/api/rounds/${id}`);
    return data;
}

// POST тап по гусю
export async function tapGoose(id: string): Promise<RoundDetails> {
    const { data } = await api.post<RoundDetails>(`/api/rounds/${id}/tap`);
    return data;
}
