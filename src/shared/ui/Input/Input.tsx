import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: ReactNode;
}

export function Input({ label, ...rest }: Props) {
    return (
        <label className={styles.field}>
            {label && <span className={styles.label}>{label}</span>}
            <input className={styles.input} {...rest} />
        </label>
    );
}
