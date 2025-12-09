import { RoundListItem } from '@/shared/types/rounds';
import { Link } from 'react-router-dom';
import { mapStatus } from '../utils';
import styles from './RoundCard.module.scss';

export function RoundCard({ round }: { round: RoundListItem }) {
    return (
        <Link to={`/rounds/${round.id}`}>
            <div className={styles.card}>
                <div className={styles.row}>
                    Round ID:{' '}

                    {round.id}

                </div>
                <div className={styles.row}>
                    Start: {new Date(round.startTime).toLocaleString()}
                </div>
                <div className={styles.row}>
                    End:&nbsp;&nbsp;{new Date(round.endTime).toLocaleString()}
                </div>
                <hr className={styles.divider} />
                <div className={styles.status}>Status: {mapStatus(round.status)}</div>
            </div>
        </Link>
    );
}
