export function mapStatus(status?: string) {
    switch (status) {
        case 'active':
            return 'Активен';
        case 'cooldown':
        case 'scheduled':
            return 'Cooldown';
        case 'finished':
            return 'Завершен';
        default:
            return status ?? '—';
    }
}