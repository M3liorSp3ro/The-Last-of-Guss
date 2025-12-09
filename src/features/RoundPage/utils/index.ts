import goose1 from '@/shared/assets/first-step.webp';
import goose2 from '@/shared/assets/second-step.webp';
import goose3 from '@/shared/assets/third-step.webp';
import { RoundDetails } from "@/shared/types/rounds";
import { ClientStatus } from "../types";

function formatDiff(ms: number) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}

export function getClientStatus(round: RoundDetails, nowMs: number): ClientStatus {
    const start = new Date(round.startTime).getTime();
    const end = new Date(round.endTime).getTime();

    if (nowMs < start) return 'cooldown';
    if (nowMs < end) return 'active';
    return 'finished';
}

export function getTimer(round: RoundDetails, nowMs: number) {
    const start = new Date(round.startTime).getTime();
    const end = new Date(round.endTime).getTime();

    const status = getClientStatus(round, nowMs);

    if (status === 'active') {
        const diff = end - nowMs;
        return { label: 'Its still until the end', value: formatDiff(diff) };
    }

    if (status === 'cooldown') {
        const diff = start - nowMs;
        return { label: 'before the start of the round', value: formatDiff(diff) };
    }

    return { label: '', value: '' };
}

export function getStatusTitle(status?: ClientStatus) {
    switch (status) {
        case 'active':
            return 'Раунды';
        case 'cooldown':
            return 'Cooldown';
        case 'finished':
            return 'Раунд завершен';
        default:
            return 'Раунд';
    }
}

export function getGooseImage(taps: number): string {
    if (taps < 20) return goose1;
    if (taps < 50) return goose2;
    return goose3; // 50+
}