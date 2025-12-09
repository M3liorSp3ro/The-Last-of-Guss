import type { RoundListItem } from '@/shared/api/rounds';
import { Link } from 'react-router-dom';
import styles from './RoundCard.module.scss';

function mapStatus(status: string) {
    switch (status) {
        case 'active':
            return 'Активен';
        case 'cooldown':
        case 'scheduled':
            return 'Cooldown';
        case 'finished':
            return 'Завершен';
        default:
            return status;
    }
}

export function RoundCard({ round }: { round: RoundListItem }) {
    return (
        <div className={styles.card}>
            <div className={styles.row}>
                • Round ID:{' '}
                <Link to={`/rounds/${round.id}`} style={{ textDecoration: 'underline' }}>
                    {round.id}
                </Link>
            </div>
            <div className={styles.row}>
                Start: {new Date(round.startTime).toLocaleString()}
            </div>
            <div className={styles.row}>
                End:&nbsp;&nbsp;{new Date(round.endTime).toLocaleString()}
            </div>
            <hr className={styles.divider} />
            <div className={styles.status}>Статус: {mapStatus(round.status)}</div>
        </div>
    );
}
